// =====================================================================
//  transformer.js: a real GPT-style Transformer, written from scratch.
//
//  This is the architecture behind ChatGPT, Claude, Llama and almost
//  every other large language model, at toy size. Every piece is here
//  and every gradient is worked out by hand (no autograd library).
//  tests/transformer.test.js checks each gradient against a numerical
//  estimate to prove the math is right.
//
//  Two styles, one switch:
//
//    "gpt2"   the 2019 GPT-2 design
//               LayerNorm, learned position embeddings, GELU, biases
//    "llama"  the modern open-model design (Llama, 2023 onward)
//               RMSNorm, rotary position embeddings (RoPE), SwiGLU,
//               no biases
//
//  The shape of the model (both styles):
//
//    tokens ──► token embeddings (+ position embeddings in gpt2)
//           ──► Block × nLayers, each:
//                   x = x + Attention(Norm(x))     tokens share information
//                   x = x + MLP(Norm(x))           each token thinks alone
//           ──► final Norm ──► output layer: one score per vocabulary token
//           ──► softmax ──► probabilities for the next token
//
//  "x = x + ..." is a RESIDUAL CONNECTION: each block adds to the
//  running total instead of replacing it, so information (and
//  gradients) can flow straight through a deep stack.
//
//  Reading order: Param → Linear → Norm → Attention → MLP → Block →
//  TinyGPT → Adam. Every layer has forward() (compute and remember)
//  and backward() (take the blame for the output, return the blame for
//  the input, and add each weight's blame to its .grad).
//
//  Shapes: a batch of B sequences, each T tokens long, gives N = B*T
//  rows. Each row is one token's vector of C numbers. Everything is
//  stored flat in Float64Arrays, row after row.
// =====================================================================

// A learnable tensor: its numbers, their gradients, and Adam's memory.
class Param {
  constructor(name, size, init) {
    this.name = name;
    this.data = new Float64Array(size);
    this.grad = new Float64Array(size);
    for (let i = 0; i < size; i++) this.data[i] = init(i);
  }
}

// ---------------------------------------------------------------------
// LINEAR LAYER: out = x · Wᵀ + b. The same multiply-and-add as one
// layer of neurons in nn.js, for every token at once.
//   W is nOut x nIn. Every output number is one "neuron".
// ---------------------------------------------------------------------
class Linear {
  constructor(name, nIn, nOut, { bias = true, std = 0.02, rand }) {
    this.nIn = nIn; this.nOut = nOut;
    this.W = new Param(name + ".W", nIn * nOut, () => rand.gaussian() * std);
    this.b = bias ? new Param(name + ".b", nOut, () => 0) : null;
  }
  params() { return this.b ? [this.W, this.b] : [this.W]; }
  forward(x, N) {
    const { nIn, nOut } = this, W = this.W.data, b = this.b && this.b.data;
    this.x = x; this.N = N;
    const out = new Float64Array(N * nOut);
    for (let n = 0; n < N; n++) {
      const xo = n * nIn, oo = n * nOut;
      let o = 0;
      // Four outputs at a time: each input number is read once and used
      // four times. Same math, about twice as fast in JavaScript.
      for (; o + 3 < nOut; o += 4) {
        const w0 = o * nIn, w1 = w0 + nIn, w2 = w1 + nIn, w3 = w2 + nIn;
        let s0 = 0, s1 = 0, s2 = 0, s3 = 0;
        for (let i = 0; i < nIn; i++) {
          const xv = x[xo + i];
          s0 += xv * W[w0 + i]; s1 += xv * W[w1 + i]; s2 += xv * W[w2 + i]; s3 += xv * W[w3 + i];
        }
        out[oo + o] = s0 + (b ? b[o] : 0); out[oo + o + 1] = s1 + (b ? b[o + 1] : 0);
        out[oo + o + 2] = s2 + (b ? b[o + 2] : 0); out[oo + o + 3] = s3 + (b ? b[o + 3] : 0);
      }
      for (; o < nOut; o++) {
        const wo = o * nIn;
        let s = b ? b[o] : 0;
        for (let i = 0; i < nIn; i++) s += x[xo + i] * W[wo + i];
        out[oo + o] = s;
      }
    }
    return out;
  }
  // Same three rules as nn.js:  dx = dout · W,  dW += doutᵀ · x,  db += sum(dout)
  backward(dout) {
    const { nIn, nOut, x, N } = this, W = this.W.data, dW = this.W.grad;
    const dx = new Float64Array(N * nIn);
    for (let n = 0; n < N; n++) {
      const xo = n * nIn;
      for (let o = 0; o < nOut; o++) {
        const g = dout[n * nOut + o];
        if (g === 0) continue;
        const wo = o * nIn;
        for (let i = 0; i < nIn; i++) {
          dx[xo + i] += g * W[wo + i];
          dW[wo + i] += g * x[xo + i];
        }
        if (this.b) this.b.grad[o] += g;
      }
    }
    return dx;
  }
}

// ---------------------------------------------------------------------
// NORMALIZATION: rescale each token's vector so its numbers stay in a
// steady range, then multiply by learned gains. Without this, numbers
// can grow or shrink layer after layer until training breaks.
//
//   "layer" (LayerNorm, 2016, used by GPT-2):
//        subtract the mean, divide by the standard deviation,
//        then × gain + bias
//   "rms"   (RMSNorm, 2019, used by Llama):
//        just divide by the root-mean-square, then × gain.
//        Simpler and cheaper, and works about as well.
// ---------------------------------------------------------------------
class Norm {
  constructor(name, C, kind) {
    this.C = C; this.kind = kind;
    this.g = new Param(name + ".gain", C, () => 1);
    this.b = kind === "layer" ? new Param(name + ".bias", C, () => 0) : null;
  }
  params() { return this.b ? [this.g, this.b] : [this.g]; }
  forward(x, N) {
    const C = this.C, eps = 1e-5, g = this.g.data;
    const out = new Float64Array(N * C);
    this.xhat = new Float64Array(N * C);
    this.rstd = new Float64Array(N);
    this.N = N;
    for (let n = 0; n < N; n++) {
      const o = n * C;
      let mean = 0;
      if (this.kind === "layer") { for (let c = 0; c < C; c++) mean += x[o + c]; mean /= C; }
      let sq = 0;
      for (let c = 0; c < C; c++) { const d = x[o + c] - mean; sq += d * d; }
      const r = 1 / Math.sqrt(sq / C + eps);
      this.rstd[n] = r;
      for (let c = 0; c < C; c++) {
        const xh = (x[o + c] - mean) * r;
        this.xhat[o + c] = xh;
        out[o + c] = xh * g[c] + (this.b ? this.b.data[c] : 0);
      }
    }
    return out;
  }
  backward(dout) {
    const { C, N, xhat, rstd } = this, g = this.g.data;
    const dx = new Float64Array(N * C);
    for (let n = 0; n < N; n++) {
      const o = n * C;
      let sumD = 0, sumDX = 0;
      for (let c = 0; c < C; c++) {
        const d = dout[o + c];
        this.g.grad[c] += d * xhat[o + c];
        if (this.b) this.b.grad[c] += d;
        const dxh = d * g[c];
        sumD += dxh; sumDX += dxh * xhat[o + c];
      }
      const meanD = this.kind === "layer" ? sumD / C : 0;
      const meanDX = sumDX / C;
      for (let c = 0; c < C; c++) {
        const dxh = dout[o + c] * g[c];
        dx[o + c] = rstd[n] * (dxh - meanD - xhat[o + c] * meanDX);
      }
    }
    return dx;
  }
}

// ---------------------------------------------------------------------
// ROTARY POSITION EMBEDDINGS (RoPE, 2021, used by Llama).
// GPT-2 tells the model where each token is by adding a learned
// "position vector". RoPE instead ROTATES each query and key by an
// angle that grows with position. When a query and a key are compared,
// only the difference between their angles matters, so attention
// naturally depends on how far apart two tokens are.
// Numbers are rotated in pairs; each pair spins at a different speed.
// ---------------------------------------------------------------------
function ropeApply(x, B, T, H, hs, inverse, pos0 = 0) {
  const C = H * hs;
  for (let b = 0; b < B; b++) for (let t = 0; t < T; t++) for (let h = 0; h < H; h++) {
    const o = (b * T + t) * C + h * hs;
    for (let i = 0; i < hs / 2; i++) {
      const angle = (t + pos0) * Math.pow(10000, (-2 * i) / hs);
      const cos = Math.cos(angle), sin = inverse ? -Math.sin(angle) : Math.sin(angle);
      const a = x[o + 2 * i], c = x[o + 2 * i + 1];
      x[o + 2 * i] = a * cos - c * sin;
      x[o + 2 * i + 1] = a * sin + c * cos;
    }
  }
}

// ---------------------------------------------------------------------
// CAUSAL SELF-ATTENTION: the heart of the Transformer.
//
// Each token makes three vectors with learned weights:
//   query  "what am I looking for?"
//   key    "what do I contain?"
//   value  "what will I pass along?"
// For each token t and each earlier token s (s <= t, never the future):
//   score[t][s] = (query_t · key_s) / √headSize
//   weights     = softmax(scores)          they add up to 1
//   output_t    = Σ weights[t][s] × value_s
// Several HEADS do this side by side on separate slices of the vector,
// so each head can learn to look for something different. Then one
// more linear layer mixes the heads back together.
// ---------------------------------------------------------------------
class Attention {
  constructor(name, C, H, { bias, rope, rand, residStd }) {
    this.C = C; this.H = H; this.hs = C / H; this.rope = rope;
    this.q = new Linear(name + ".query", C, C, { bias, rand });
    // Fun fact: the key's bias can never learn. Adding the same number
    // to every key shifts all of a query's scores equally, and softmax
    // ignores equal shifts, so its gradient is always exactly 0. GPT-2
    // has it anyway; Llama drops all biases.
    this.k = new Linear(name + ".key", C, C, { bias, rand });
    this.v = new Linear(name + ".value", C, C, { bias, rand });
    this.o = new Linear(name + ".out", C, C, { bias, rand, std: residStd });
  }
  params() { return [...this.q.params(), ...this.k.params(), ...this.v.params(), ...this.o.params()]; }
  forward(x, B, T) {
    const { C, H, hs } = this, N = B * T, scale = 1 / Math.sqrt(hs);
    const q = this.q.forward(x, N), k = this.k.forward(x, N), v = this.v.forward(x, N);
    if (this.rope) { ropeApply(q, B, T, H, hs, false); ropeApply(k, B, T, H, hs, false); }
    const att = new Float64Array(B * H * T * T); // att[b][h][t][s]
    const y = new Float64Array(N * C);
    for (let b = 0; b < B; b++) for (let h = 0; h < H; h++) for (let t = 0; t < T; t++) {
      const qo = (b * T + t) * C + h * hs, ao = ((b * H + h) * T + t) * T;
      let max = -Infinity;
      for (let s = 0; s <= t; s++) {
        const ko = (b * T + s) * C + h * hs;
        let dot = 0;
        for (let i = 0; i < hs; i++) dot += q[qo + i] * k[ko + i];
        att[ao + s] = dot * scale;
        if (att[ao + s] > max) max = att[ao + s];
      }
      let sum = 0;
      for (let s = 0; s <= t; s++) { att[ao + s] = Math.exp(att[ao + s] - max); sum += att[ao + s]; }
      for (let s = 0; s <= t; s++) {
        const w = (att[ao + s] /= sum);
        const vo = (b * T + s) * C + h * hs;
        for (let i = 0; i < hs; i++) y[qo + i] += w * v[vo + i];
      }
    }
    Object.assign(this, { q_: q, k_: k, v_: v, att, B, T });
    return this.o.forward(y, N);
  }
  backward(dout) {
    const { C, H, hs, q_: q, k_: k, v_: v, att, B, T } = this, scale = 1 / Math.sqrt(hs);
    const dy = this.o.backward(dout);
    const N = B * T;
    const dq = new Float64Array(N * C), dk = new Float64Array(N * C), dv = new Float64Array(N * C);
    const datt = new Float64Array(T);
    for (let b = 0; b < B; b++) for (let h = 0; h < H; h++) for (let t = 0; t < T; t++) {
      const qo = (b * T + t) * C + h * hs, ao = ((b * H + h) * T + t) * T;
      // output_t = Σ w_s v_s  →  blame for each weight and each value
      let dot = 0;
      for (let s = 0; s <= t; s++) {
        const vo = (b * T + s) * C + h * hs;
        let d = 0;
        for (let i = 0; i < hs; i++) { d += dy[qo + i] * v[vo + i]; dv[vo + i] += att[ao + s] * dy[qo + i]; }
        datt[s] = d;
        dot += att[ao + s] * d;
      }
      // back through softmax, then through the query·key dot products
      for (let s = 0; s <= t; s++) {
        const dscore = att[ao + s] * (datt[s] - dot) * scale;
        const ko = (b * T + s) * C + h * hs;
        for (let i = 0; i < hs; i++) { dq[qo + i] += dscore * k[ko + i]; dk[ko + i] += dscore * q[qo + i]; }
      }
    }
    if (this.rope) { ropeApply(dq, B, T, H, hs, true); ropeApply(dk, B, T, H, hs, true); } // rotate the blame back
    const dx = this.q.backward(dq), dxk = this.k.backward(dk), dxv = this.v.backward(dv);
    for (let i = 0; i < dx.length; i++) dx[i] += dxk[i] + dxv[i];
    return dx;
  }
}

// ---------------------------------------------------------------------
// MLP (the "feed-forward network"): a small two-layer neural network,
// like the ones in the lab, applied to each token separately.
//
//   "gpt2":  up (C → 4C) → GELU → down (4C → C)
//   "llama": SwiGLU (2020). Two parallel up-projections; one goes
//            through SiLU and acts as a gate that scales the other:
//              down( SiLU(gate(x)) × up(x) )
//            The hidden size is 8C/3 so the parameter count matches.
// ---------------------------------------------------------------------
const GELU_K = Math.sqrt(2 / Math.PI);
function gelu(x) { return 0.5 * x * (1 + Math.tanh(GELU_K * (x + 0.044715 * x * x * x))); }
function geluSlope(x) {
  const u = GELU_K * (x + 0.044715 * x * x * x), th = Math.tanh(u);
  return 0.5 * (1 + th) + 0.5 * x * (1 - th * th) * GELU_K * (1 + 3 * 0.044715 * x * x);
}
const sig = (x) => 1 / (1 + Math.exp(-x));

class MLP {
  constructor(name, C, { style, rand, residStd }) {
    this.style = style;
    const bias = style === "gpt2";
    if (style === "gpt2") {
      this.hidden = 4 * C;
      this.up = new Linear(name + ".up", C, this.hidden, { bias, rand });
    } else {
      this.hidden = Math.round((8 * C) / 3);
      this.gate = new Linear(name + ".gate", C, this.hidden, { bias, rand });
      this.up = new Linear(name + ".up", C, this.hidden, { bias, rand });
    }
    this.down = new Linear(name + ".down", this.hidden, C, { bias, rand, std: residStd });
  }
  params() { return [...(this.gate ? this.gate.params() : []), ...this.up.params(), ...this.down.params()]; }
  forward(x, N) {
    const Hd = this.hidden;
    this.N = N;
    const h = new Float64Array(N * Hd);
    if (this.style === "gpt2") {
      this.a = this.up.forward(x, N);
      for (let i = 0; i < h.length; i++) h[i] = gelu(this.a[i]);
    } else {
      this.g = this.gate.forward(x, N);
      this.u = this.up.forward(x, N);
      for (let i = 0; i < h.length; i++) h[i] = this.g[i] * sig(this.g[i]) * this.u[i];
    }
    return this.down.forward(h, N);
  }
  backward(dout) {
    const dh = this.down.backward(dout);
    if (this.style === "gpt2") {
      for (let i = 0; i < dh.length; i++) dh[i] *= geluSlope(this.a[i]);
      return this.up.backward(dh);
    }
    const dg = new Float64Array(dh.length), du = new Float64Array(dh.length);
    for (let i = 0; i < dh.length; i++) {
      const g = this.g[i], s = sig(g), silu = g * s;
      du[i] = dh[i] * silu;
      dg[i] = dh[i] * this.u[i] * (s * (1 + g * (1 - s)));
    }
    const dx = this.gate.backward(dg), dxu = this.up.backward(du);
    for (let i = 0; i < dx.length; i++) dx[i] += dxu[i];
    return dx;
  }
}

// ---------------------------------------------------------------------
// TRANSFORMER BLOCK:  x = x + Attention(Norm(x));  x = x + MLP(Norm(x))
// ---------------------------------------------------------------------
class Block {
  constructor(name, cfg, rand) {
    const normKind = cfg.style === "gpt2" ? "layer" : "rms";
    const residStd = 0.02 / Math.sqrt(2 * cfg.nLayers); // smaller start for layers that add into the residual
    this.norm1 = new Norm(name + ".norm1", cfg.dModel, normKind);
    this.attn = new Attention(name + ".attn", cfg.dModel, cfg.nHeads, { bias: cfg.style === "gpt2", rope: cfg.style === "llama", rand, residStd });
    this.norm2 = new Norm(name + ".norm2", cfg.dModel, normKind);
    this.mlp = new MLP(name + ".mlp", cfg.dModel, { style: cfg.style, rand, residStd });
  }
  params() { return [...this.norm1.params(), ...this.attn.params(), ...this.norm2.params(), ...this.mlp.params()]; }
  forward(x, B, T) {
    const N = B * T;
    const a = this.attn.forward(this.norm1.forward(x, N), B, T);
    const x1 = new Float64Array(x.length);
    for (let i = 0; i < x.length; i++) x1[i] = x[i] + a[i];
    const m = this.mlp.forward(this.norm2.forward(x1, N), N);
    const x2 = new Float64Array(x.length);
    for (let i = 0; i < x.length; i++) x2[i] = x1[i] + m[i];
    return x2;
  }
  // With a residual connection, the blame flows two ways at once:
  // straight through the "+", and back through the branch.
  backward(dx2) {
    const dm = this.norm2.backward(this.mlp.backward(dx2));
    const dx1 = new Float64Array(dx2.length);
    for (let i = 0; i < dx2.length; i++) dx1[i] = dx2[i] + dm[i];
    const da = this.norm1.backward(this.attn.backward(dx1));
    const dx = new Float64Array(dx1.length);
    for (let i = 0; i < dx1.length; i++) dx[i] = dx1[i] + da[i];
    return dx;
  }
}

// ---------------------------------------------------------------------
// THE WHOLE MODEL
// cfg: { vocabSize, context, dModel, nHeads, nLayers, style, seed }
// ---------------------------------------------------------------------
class TinyGPT {
  constructor(cfg) {
    this.cfg = Object.assign({ context: 32, dModel: 48, nHeads: 4, nLayers: 2, style: "gpt2", seed: 1 }, cfg);
    const c = this.cfg, rand = makeRandom(c.seed);
    this.tokEmb = new Param("token_embeddings", c.vocabSize * c.dModel, () => rand.gaussian() * 0.02);
    this.posEmb = c.style === "gpt2" ? new Param("position_embeddings", c.context * c.dModel, () => rand.gaussian() * 0.01) : null;
    this.blocks = Array.from({ length: c.nLayers }, (_, l) => new Block("layer" + (l + 1), c, rand));
    this.normF = new Norm("final_norm", c.dModel, c.style === "gpt2" ? "layer" : "rms");
    this.head = new Linear("output", c.dModel, c.vocabSize, { bias: false, rand });
    this.steps = 0;
  }
  params() {
    return [this.tokEmb, ...(this.posEmb ? [this.posEmb] : []), ...this.blocks.flatMap((b) => b.params()), ...this.normF.params(), ...this.head.params()];
  }
  parameterCount() { return this.params().reduce((s, p) => s + p.data.length, 0); }

  // inputs: B sequences of T token ids. targets: the same, shifted by one
  // (the token that actually came next). Returns the average loss.
  forward(inputs, targets) {
    const { dModel: C, vocabSize: V } = this.cfg;
    const B = inputs.length, T = inputs[0].length, N = B * T;
    this.B = B; this.T = T; this.inputs = inputs;
    let x = new Float64Array(N * C);
    for (let b = 0; b < B; b++) for (let t = 0; t < T; t++) {
      const o = (b * T + t) * C, e = inputs[b][t] * C;
      for (let c = 0; c < C; c++) x[o + c] = this.tokEmb.data[e + c] + (this.posEmb ? this.posEmb.data[t * C + c] : 0);
    }
    for (const block of this.blocks) x = block.forward(x, B, T);
    const logits = this.head.forward(this.normF.forward(x, N), N);
    // Softmax turns each row of scores into probabilities.
    const probs = new Float64Array(N * V);
    for (let n = 0; n < N; n++) {
      let max = -Infinity;
      for (let v = 0; v < V; v++) max = Math.max(max, logits[n * V + v]);
      let sum = 0;
      for (let v = 0; v < V; v++) { probs[n * V + v] = Math.exp(logits[n * V + v] - max); sum += probs[n * V + v]; }
      for (let v = 0; v < V; v++) probs[n * V + v] /= sum;
    }
    this.probs = probs;
    if (!targets) return null;
    this.targets = targets;
    // A target of -1 means "don't score this position" (fine-tuning
    // uses that so the model is only graded on the story, not the prompt).
    let loss = 0, count = 0;
    for (let b = 0; b < B; b++) for (let t = 0; t < T; t++) {
      if (targets[b][t] < 0) continue;
      loss -= Math.log(probs[(b * T + t) * V + targets[b][t]] + 1e-12);
      count++;
    }
    this.count = Math.max(count, 1);
    return loss / this.count;
  }

  // Backpropagation through the whole model. Fills every param.grad.
  backward() {
    const { dModel: C, vocabSize: V } = this.cfg, { B, T, inputs, targets } = this, N = B * T;
    for (const p of this.params()) p.grad.fill(0);
    // Softmax + cross-entropy: blame = (probability − 1 for the right token), averaged.
    const dlogits = new Float64Array(N * V), K = this.count;
    for (let b = 0; b < B; b++) for (let t = 0; t < T; t++) {
      const n = b * T + t, y = targets[b][t];
      if (y < 0) continue; // unscored positions get no blame
      for (let v = 0; v < V; v++) dlogits[n * V + v] = this.probs[n * V + v] / K;
      dlogits[n * V + y] -= 1 / K;
    }
    let dx = this.normF.backward(this.head.backward(dlogits));
    for (let l = this.blocks.length - 1; l >= 0; l--) dx = this.blocks[l].backward(dx);
    // Embeddings: each token's row collects the blame from wherever it was used.
    for (let b = 0; b < B; b++) for (let t = 0; t < T; t++) {
      const o = (b * T + t) * C, e = inputs[b][t] * C;
      for (let c = 0; c < C; c++) {
        this.tokEmb.grad[e + c] += dx[o + c];
        if (this.posEmb) this.posEmb.grad[t * C + c] += dx[o + c];
      }
    }
  }

  // -------------------------------------------------------------------
  // Put every parameter (or every gradient) into one long array. On the
  // server, that array lives in shared memory, so several CPU cores can
  // read the same weights and each write their own gradients.
  // -------------------------------------------------------------------
  totalSize() { return this.params().reduce((s, p) => s + p.data.length, 0); }
  packParams(buffer) {
    const flat = new Float64Array(buffer || this.totalSize());
    let o = 0;
    for (const p of this.params()) { flat.set(p.data, o); o += p.data.length; } // copy the current values in
    o = 0;
    for (const p of this.params()) { p.data = flat.subarray(o, o + p.data.length); o += p.data.length; }
    this.flatParams = flat;
    return flat;
  }
  usePackedParams(buffer) { // a worker attaching to weights the main thread already filled in
    const flat = new Float64Array(buffer);
    let o = 0;
    for (const p of this.params()) { p.data = flat.subarray(o, o + p.data.length); o += p.data.length; }
    this.flatParams = flat;
    return flat;
  }
  packGrads(buffer) {
    const flat = new Float64Array(buffer || this.totalSize());
    let o = 0;
    for (const p of this.params()) { p.grad = flat.subarray(o, o + p.grad.length); o += p.grad.length; }
    this.flatGrads = flat;
    return flat;
  }

  // -------------------------------------------------------------------
  // FAST WRITING WITH A KV CACHE.
  // forward() recomputes every token each time. But when writing, the
  // earlier tokens never change, so their keys and values never change
  // either. Real chatbots save them (the "KV cache") and only compute
  // the one new token each step. Same answers, far less work.
  // -------------------------------------------------------------------
  newCache() {
    const { context, dModel } = this.cfg;
    return { t: 0, ids: [], k: this.blocks.map(() => new Float64Array(context * dModel)), v: this.blocks.map(() => new Float64Array(context * dModel)) };
  }
  // Feed one token. Returns next-token probabilities and, for every
  // layer and head, where this token looked.
  step(cache, id, temperature = 1) {
    const { dModel: C, vocabSize: V, context } = this.cfg;
    if (cache.t >= context) throw new Error("cache full");
    const t = cache.t;
    let x = new Float64Array(C);
    for (let c = 0; c < C; c++) x[c] = this.tokEmb.data[id * C + c] + (this.posEmb ? this.posEmb.data[t * C + c] : 0);
    const attention = [];
    this.blocks.forEach((block, l) => {
      const a = block.attn, H = a.H, hs = a.hs, scale = 1 / Math.sqrt(hs);
      const h = block.norm1.forward(x, 1);
      const q = a.q.forward(h, 1), k = a.k.forward(h, 1), v = a.v.forward(h, 1);
      if (a.rope) { ropeApply(q, 1, 1, H, hs, false, t); ropeApply(k, 1, 1, H, hs, false, t); }
      cache.k[l].set(k, t * C); cache.v[l].set(v, t * C);
      const y = new Float64Array(C), heads = [];
      for (let hh = 0; hh < H; hh++) {
        const w = new Float64Array(t + 1);
        let max = -Infinity;
        for (let s = 0; s <= t; s++) {
          let dot = 0;
          for (let i = 0; i < hs; i++) dot += q[hh * hs + i] * cache.k[l][s * C + hh * hs + i];
          w[s] = dot * scale; if (w[s] > max) max = w[s];
        }
        let sum = 0;
        for (let s = 0; s <= t; s++) { w[s] = Math.exp(w[s] - max); sum += w[s]; }
        for (let s = 0; s <= t; s++) {
          w[s] /= sum;
          for (let i = 0; i < hs; i++) y[hh * hs + i] += w[s] * cache.v[l][s * C + hh * hs + i];
        }
        heads.push(w);
      }
      attention.push(heads);
      const o = a.o.forward(y, 1);
      const x1 = new Float64Array(C);
      for (let c = 0; c < C; c++) x1[c] = x[c] + o[c];
      const m = block.mlp.forward(block.norm2.forward(x1, 1), 1);
      x = new Float64Array(C);
      for (let c = 0; c < C; c++) x[c] = x1[c] + m[c];
    });
    const logits = this.head.forward(this.normF.forward(x, 1), 1);
    let max = -Infinity;
    for (let v = 0; v < V; v++) max = Math.max(max, logits[v] / temperature);
    const probs = new Float64Array(V);
    let sum = 0;
    for (let v = 0; v < V; v++) { probs[v] = Math.exp(logits[v] / temperature - max); sum += probs[v]; }
    for (let v = 0; v < V; v++) probs[v] /= sum;
    cache.t++; cache.ids.push(id);
    return { probs, attention };
  }
  // Start a cache from a list of ids. If they don't fit, keep the most recent half-window.
  prefill(ids, temperature = 1) {
    const { context } = this.cfg;
    const keep = ids.length > context ? ids.slice(-Math.floor(context / 2)) : ids;
    const cache = this.newCache();
    let last = null;
    for (const id of keep) last = this.step(cache, id, temperature);
    return { cache, last };
  }

  // Probabilities for the token after `ids` (uses the last `context` ids).
  nextProbs(ids, temperature = 1) {
    const ctx = ids.slice(-this.cfg.context);
    this.forward([ctx]);
    const V = this.cfg.vocabSize, row = (ctx.length - 1) * V;
    const p = Array.from(this.probs.subarray(row, row + V));
    if (temperature === 1) return p;
    const w = p.map((x) => Math.pow(x, 1 / temperature)); // same as dividing the scores by temperature
    const s = w.reduce((a, b) => a + b, 0);
    return w.map((x) => x / s);
  }

  // Generation: predict, sample, append, repeat. One token at a time.
  generate(ids, count, temperature, rand) {
    const out = ids.slice();
    for (let n = 0; n < count; n++) {
      const p = this.nextProbs(out, temperature);
      let r = rand(), pick = p.length - 1;
      for (let i = 0; i < p.length; i++) { r -= p[i]; if (r <= 0) { pick = i; break; } }
      out.push(pick);
    }
    return out;
  }

  // The attention weights from the most recent forward pass,
  // for one layer and one head: a T x T grid (row = query token).
  attentionMap(layer, head) {
    const a = this.blocks[layer].attn, T = a.T, H = a.H;
    const grid = [];
    for (let t = 0; t < T; t++) grid.push(Array.from(a.att.subarray((head * T + t) * T, (head * T + t) * T + T)));
    return grid;
  }
}

// ---------------------------------------------------------------------
// ADAM, with two standard extras used when training real LLMs:
//   weight decay (AdamW): gently pull weights toward 0 so they don't
//                         grow without reason
//   gradient clipping:    if the total gradient is huge, scale it down
//                         so one bad batch can't wreck the model
// ---------------------------------------------------------------------
class Adam {
  constructor(params, { lr = 3e-3, beta1 = 0.9, beta2 = 0.99, eps = 1e-8, weightDecay = 0.01, clip = 1 } = {}) {
    Object.assign(this, { params, lr, beta1, beta2, eps, weightDecay, clip, t: 0 });
    this.m = params.map((p) => new Float64Array(p.data.length));
    this.v = params.map((p) => new Float64Array(p.data.length));
  }
  step() {
    let norm = 0;
    for (const p of this.params) for (let i = 0; i < p.grad.length; i++) norm += p.grad[i] * p.grad[i];
    norm = Math.sqrt(norm);
    const scale = norm > this.clip ? this.clip / norm : 1;
    this.t++;
    const c1 = 1 - Math.pow(this.beta1, this.t), c2 = 1 - Math.pow(this.beta2, this.t);
    this.params.forEach((p, k) => {
      const m = this.m[k], v = this.v[k];
      const decay = /\.W$|embeddings/.test(p.name) ? this.weightDecay : 0; // decay weight matrices, not gains or biases
      for (let i = 0; i < p.data.length; i++) {
        const g = p.grad[i] * scale;
        m[i] = this.beta1 * m[i] + (1 - this.beta1) * g;
        v[i] = this.beta2 * v[i] + (1 - this.beta2) * g * g;
        p.data[i] -= this.lr * ((m[i] / c1) / (Math.sqrt(v[i] / c2) + this.eps) + decay * p.data[i]);
      }
    });
    return norm;
  }
}

// ---------------------------------------------------------------------
// Text → token ids, either one id per letter or with the BPE tokenizer
// from tokenizer.js.
// ---------------------------------------------------------------------
class TextData {
  constructor(text, { mode = "chars", merges = 120 } = {}) {
    this.mode = mode;
    text = text.toLowerCase();
    if (mode === "bpe") {
      this.bpe = trainBPE(text, merges);
      this.vocab = Array.from(this.bpe.vocab.keys());
      this.ids = tokenize(text, this.bpe).map((t) => t.id);
    } else {
      this.vocab = Array.from(new Set(text)).sort();
      const index = new Map(this.vocab.map((c, i) => [c, i]));
      this.ids = Array.from(text).map((c) => index.get(c));
    }
    // First 90% for training, last 10% held out to check for overfitting.
    const cut = Math.floor(this.ids.length * 0.9);
    this.train = this.ids.slice(0, cut);
    this.val = this.ids.slice(cut);
  }
  encode(str) {
    str = str.toLowerCase();
    if (this.mode === "bpe") return tokenize(str, this.bpe).map((t) => t.id).filter((id) => id !== null);
    const index = new Map(this.vocab.map((c, i) => [c, i]));
    return Array.from(str).filter((c) => index.has(c)).map((c) => index.get(c));
  }
  decode(ids) { return ids.map((i) => this.vocab[i]).join(""); }
  pieces(ids) { return ids.map((i) => this.vocab[i]); }
  // Random windows: inputs are T tokens, targets are the next T tokens.
  batch(split, B, T, rand) {
    const src = split === "val" ? this.val : this.train;
    const inputs = [], targets = [];
    for (let b = 0; b < B; b++) {
      const start = Math.floor(rand() * (src.length - T - 1));
      inputs.push(src.slice(start, start + T));
      targets.push(src.slice(start + 1, start + T + 1));
    }
    return { inputs, targets };
  }
}

// ---------------------------------------------------------------------
// GRADIENT CHECK: the proof that backward() is correct.
// For a sample of numbers in every parameter tensor, compare
//   analytic gradient  (what backpropagation computed)
//   numerical gradient (loss(w + h) − loss(w − h)) / 2h
// The numerical one needs no calculus at all, just two forward passes.
// If backprop had a mistake anywhere, they would disagree.
// ---------------------------------------------------------------------
function gradientCheck(style, perTensor = 12) {
  const model = new TinyGPT({ vocabSize: 7, context: 6, dModel: 12, nHeads: 3, nLayers: 2, style, seed: 5 });
  // Bigger random weights than normal, so every part is doing real work.
  const r = makeRandom(11);
  for (const p of model.params()) for (let i = 0; i < p.data.length; i++) p.data[i] += r.gaussian() * 0.3;
  const inputs = [[1, 2, 3, 4, 5, 6], [0, 6, 2, 2, 5, 1]];
  const targets = [[2, 3, 4, 5, 6, 0], [6, 2, 2, 5, 1, 3]];
  model.forward(inputs, targets);
  model.backward();
  const h = 1e-5;
  let worst = 0, worstName = "", checked = 0;
  for (const p of model.params()) {
    const pr = makeRandom(p.data.length), picks = new Set();
    while (picks.size < Math.min(perTensor, p.data.length)) picks.add(Math.floor(pr() * p.data.length));
    for (const i of picks) {
      const analytic = p.grad[i], old = p.data[i];
      p.data[i] = old + h; const up = model.forward(inputs, targets);
      p.data[i] = old - h; const down = model.forward(inputs, targets);
      p.data[i] = old;
      const numeric = (up - down) / (2 * h);
      // Relative error, with a floor: where the true gradient is 0 (the
      // key bias), both numbers are just rounding noise.
      const rel = Math.abs(analytic - numeric) / Math.max(1e-4, Math.abs(analytic) + Math.abs(numeric));
      if (rel > worst) { worst = rel; worstName = p.name; }
      checked++;
    }
  }
  return { checked, tensors: model.params().length, worst, worstName };
}

if (typeof module !== "undefined") {
  module.exports = { Param, Linear, Norm, Attention, MLP, Block, TinyGPT, Adam, TextData, ropeApply, gradientCheck };
}
