// =====================================================================
//  nn.js: a real neural network, written from scratch.
//
//  No AI libraries. Just multiplication, addition, and a few small
//  formulas. Every neural network you've heard of, up to the ones
//  behind ChatGPT and Claude, is built from these same pieces, only
//  with billions of numbers instead of a few dozen.
//
//  How to read this file:
//    1. makeRandom   : a dice roller we can replay (same seed, same rolls)
//    2. ACTIVATIONS  : the "squish" functions neurons apply
//    3. Matrix helpers: tiny versions of what GPUs are built for
//    4. NeuralNetwork: holds the weights and biases
//         forward()             : push an input through, layer by layer
//         gradientsOneAtATime() : backpropagation, one neuron at a time
//         gradientsMatrix()     : the same math as matrix multiplies
//         applyGradients()      : gradient descent or Adam
//         trainBatch()          : one full training step
// =====================================================================

// ---------------------------------------------------------------------
// 1. A seeded random number generator.
//    Math.random() gives different numbers every time. For learning it
//    helps to replay the exact same "random" start, so we use a tiny
//    generator called mulberry32. Same seed in, same numbers out.
// ---------------------------------------------------------------------
function makeRandom(seed) {
  let a = seed >>> 0;
  const next = function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // a number from 0 to 1
  };
  // A bell-curve random number (most values near 0, a few far away).
  next.gaussian = function () {
    const u = Math.max(next(), 1e-12);
    const v = next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  return next;
}

// ---------------------------------------------------------------------
// 2. Activation functions.
//    After a neuron adds up (input x weight) + bias, it passes the total
//    through one of these. Without this bend, stacking layers would be
//    pointless: a stack of straight lines is still a straight line.
//
//    f  = the function itself
//    df = its slope (derivative). Backpropagation needs the slope to
//         know how much a small change here changes the output.
//         z is the input to the function, a is the output f(z).
// ---------------------------------------------------------------------
const ACTIVATIONS = {
  sigmoid: {
    f: (z) => 1 / (1 + Math.exp(-z)),            // squashes anything into 0..1
    df: (z, a) => a * (1 - a),
  },
  tanh: {
    f: (z) => Math.tanh(z),                       // squashes anything into -1..1
    df: (z, a) => 1 - a * a,
  },
  relu: {
    f: (z) => (z > 0 ? z : 0),                    // negatives become 0, positives pass through
    df: (z) => (z > 0 ? 1 : 0),
  },
};

const sigmoid = ACTIVATIONS.sigmoid.f;

// ---------------------------------------------------------------------
// 3. Matrix helpers. A matrix here is an array of rows.
//    matMul(A, B)   : A (n x k) times B (k x m) -> n x m
//    matMulT(A, B)  : A times B-transposed (B stored as m x k)
// ---------------------------------------------------------------------
function matMul(A, B) {
  const n = A.length, k = B.length, m = B[0].length;
  const out = [];
  for (let r = 0; r < n; r++) {
    const row = new Array(m).fill(0);
    for (let t = 0; t < k; t++) {
      const a = A[r][t];
      if (a === 0) continue;
      for (let c = 0; c < m; c++) row[c] += a * B[t][c];
    }
    out.push(row);
  }
  return out;
}
function matMulT(A, B) {
  return A.map((row) => B.map((bRow) => {
    let s = 0;
    for (let t = 0; t < row.length; t++) s += row[t] * bRow[t];
    return s;
  }));
}
const transpose = (A) => A[0].map((_, c) => A.map((row) => row[c]));
const matAddRow = (A, b) => A.map((row) => row.map((v, c) => v + b[c]));
const matMap = (A, f) => A.map((row) => row.map(f));
const columnSums = (A) => A[0].map((_, c) => A.reduce((s, row) => s + row[c], 0));

// ---------------------------------------------------------------------
// 4. The network.
//
//    layerSizes [2, 4, 1] means: 2 inputs, one hidden layer of 4
//    neurons, 1 output neuron.
//
//    weights[l][j][i] = the weight on the wire from neuron i in layer l
//                       to neuron j in layer l+1
//    biases[l][j]     = the bias of neuron j in layer l+1
//
//    The output neuron always uses sigmoid, so its answer is a number
//    from 0 to 1 that we read as "probability this point is class 1".
// ---------------------------------------------------------------------
class NeuralNetwork {
  constructor(layerSizes, options = {}) {
    this.sizes = layerSizes.slice();
    this.activationName = options.activation || "tanh";
    this.act = ACTIVATIONS[this.activationName];
    this.optimizer = options.optimizer || "sgd"; // "sgd" or "adam"
    this.adam = null;
    const rand = makeRandom(options.seed || 1);

    this.weights = [];
    this.biases = [];
    for (let l = 0; l < this.sizes.length - 1; l++) {
      const fanIn = this.sizes[l];
      const fanOut = this.sizes[l + 1];
      // Start with small random weights. If every weight started equal,
      // every neuron would learn the same thing, so randomness matters.
      const scale = Math.sqrt(2 / (fanIn + fanOut));
      const layerW = [];
      for (let j = 0; j < fanOut; j++) {
        const row = [];
        for (let i = 0; i < fanIn; i++) row.push(rand.gaussian() * scale);
        layerW.push(row);
      }
      this.weights.push(layerW);
      this.biases.push(Array.from({ length: fanOut }, () => 0.1 * rand.gaussian()));
    }
  }

  // How many adjustable numbers (weights + biases) the network has.
  // GPT-3 has 175,000,000,000 of these. Ours usually has under 100.
  parameterCount() {
    let n = 0;
    for (let l = 0; l < this.weights.length; l++) {
      n += this.weights[l].length * this.weights[l][0].length + this.biases[l].length;
    }
    return n;
  }

  // -------------------------------------------------------------------
  // FORWARD PASS: numbers flow left to right.
  // For every neuron:  z = (sum of input x weight) + bias
  //                    a = activation(z)
  // We keep every z and a, because backpropagation needs them.
  // -------------------------------------------------------------------
  forward(input) {
    const activations = [input.slice()]; // layer 0 is just the input
    const zs = [];
    const last = this.weights.length - 1;
    for (let l = 0; l <= last; l++) {
      const prev = activations[l];
      const W = this.weights[l];
      const b = this.biases[l];
      const z = new Array(W.length);
      const a = new Array(W.length);
      for (let j = 0; j < W.length; j++) {
        let sum = b[j];
        for (let i = 0; i < prev.length; i++) sum += W[j][i] * prev[i];
        z[j] = sum;
        a[j] = l === last ? sigmoid(sum) : this.act.f(sum);
      }
      zs.push(z);
      activations.push(a);
    }
    return { activations, zs };
  }

  // Just the final answer: probability of class 1.
  predict(input) {
    const { activations } = this.forward(input);
    return activations[activations.length - 1][0];
  }

  // -------------------------------------------------------------------
  // LOSS: how wrong were we?
  // Cross-entropy loss: -log(probability we gave to the right answer).
  //   said 0.99 for the right answer  -> loss 0.01 (tiny)
  //   said 0.50                       -> loss 0.69 (meh)
  //   said 0.01 for the right answer  -> loss 4.6  (very wrong, punished hard)
  // -------------------------------------------------------------------
  static crossEntropy(p, y) {
    const eps = 1e-9;
    return -(y * Math.log(p + eps) + (1 - y) * Math.log(1 - p + eps));
  }

  averageLoss(xs, ys) {
    if (xs.length === 0) return 0;
    let total = 0;
    for (let k = 0; k < xs.length; k++) total += NeuralNetwork.crossEntropy(this.predict(xs[k]), ys[k]);
    return total / xs.length;
  }

  accuracy(xs, ys) {
    if (xs.length === 0) return 0;
    let right = 0;
    for (let k = 0; k < xs.length; k++) {
      const guess = this.predict(xs[k]) >= 0.5 ? 1 : 0;
      if (guess === ys[k]) right++;
    }
    return right / xs.length;
  }

  // -------------------------------------------------------------------
  // TRAINING, part 1: work out the gradients for a small batch.
  //
  //  1. Forward pass for each example.
  //  2. BACKPROPAGATION: start at the output with the error, then walk
  //     backwards through the layers using the chain rule, working out
  //     for every single weight: "if I nudge you up a little, does the
  //     loss go up or down, and by how much?" That number is the
  //     gradient.
  //
  // This version goes one example and one neuron at a time, so you can
  // follow every multiplication. gradientsMatrix() below does exactly
  // the same math the way professional code does it.
  // -------------------------------------------------------------------
  gradientsOneAtATime(xs, ys) {
    const L = this.weights.length;
    // Gradient accumulators, same shape as the weights and biases.
    const gradW = this.weights.map((layer) => layer.map((row) => row.map(() => 0)));
    const gradB = this.biases.map((layer) => layer.map(() => 0));
    let totalLoss = 0;

    for (let k = 0; k < xs.length; k++) {
      const { activations, zs } = this.forward(xs[k]);
      const p = activations[L][0];
      totalLoss += NeuralNetwork.crossEntropy(p, ys[k]);

      // delta = "how much does the loss change if this neuron's z changes"
      // At the output, sigmoid + cross-entropy work out to a famously
      // simple answer: prediction minus truth.
      let delta = [p - ys[k]];

      for (let l = L - 1; l >= 0; l--) {
        const prev = activations[l];
        // Blame for each weight = (blame of the neuron it feeds) x (the input on that wire)
        for (let j = 0; j < delta.length; j++) {
          gradB[l][j] += delta[j];
          for (let i = 0; i < prev.length; i++) gradW[l][j][i] += delta[j] * prev[i];
        }
        if (l === 0) break;
        // Pass the blame one layer further back (the chain rule):
        // each earlier neuron gets blame from every neuron it fed,
        // weighted by how strong that connection was, times the slope
        // of its own activation function.
        const newDelta = new Array(prev.length).fill(0);
        for (let i = 0; i < prev.length; i++) {
          let sum = 0;
          for (let j = 0; j < delta.length; j++) sum += this.weights[l][j][i] * delta[j];
          newDelta[i] = sum * this.act.df(zs[l - 1][i], prev[i]);
        }
        delta = newDelta;
      }
    }
    // Average over the batch.
    const n = xs.length;
    gradW.forEach((layer) => layer.forEach((row) => row.forEach((_, i) => (row[i] /= n))));
    gradB.forEach((layer) => layer.forEach((_, j) => (layer[j] /= n)));
    return { gradW, gradB, loss: totalLoss / n };
  }

  // -------------------------------------------------------------------
  // The SAME gradients, computed with MATRIX MATH.
  //
  // Stack the whole batch into one table X (one row per example). Then
  // a whole layer, for every example at once, is one matrix multiply:
  //
  //     Z = X · Wᵀ + b          (forward)
  //     A = activation(Z)
  //
  // and backpropagation is three more matrix multiplies per layer:
  //
  //     dW     = Δᵀ · A_prev              blame for every weight
  //     db     = column sums of Δ         blame for every bias
  //     Δ_prev = (Δ · W) ⊙ slope(Z_prev)  pass blame back (⊙ = multiply
  //                                        matching entries)
  //
  // Nothing new is happening. It's the loops above, regrouped. GPUs are
  // built to do matrix multiplies extremely fast, which is why every
  // real framework (PyTorch, JAX, TensorFlow) is written this way.
  // -------------------------------------------------------------------
  gradientsMatrix(xs, ys) {
    const L = this.weights.length;
    const n = xs.length;
    const A = [xs]; // A[l] is an n x size[l] matrix
    const Z = [];
    for (let l = 0; l < L; l++) {
      const z = matAddRow(matMulT(A[l], this.weights[l]), this.biases[l]);
      Z.push(z);
      A.push(matMap(z, l === L - 1 ? sigmoid : this.act.f));
    }
    const P = A[L].map((row) => row[0]);
    let loss = 0;
    for (let k = 0; k < n; k++) loss += NeuralNetwork.crossEntropy(P[k], ys[k]);

    let delta = P.map((p, k) => [(p - ys[k]) / n]); // n x 1, already averaged
    const gradW = new Array(L), gradB = new Array(L);
    for (let l = L - 1; l >= 0; l--) {
      gradW[l] = matMul(transpose(delta), A[l]);
      gradB[l] = columnSums(delta);
      if (l === 0) break;
      const back = matMul(delta, this.weights[l]);
      delta = back.map((row, k) => row.map((v, i) => v * this.act.df(Z[l - 1][k][i], A[l][k][i])));
    }
    return { gradW, gradB, loss: loss / n };
  }

  // -------------------------------------------------------------------
  // TRAINING, part 2: use the gradients to update every weight.
  //
  // Plain gradient descent ("sgd"):
  //     weight = weight - learningRate * gradient
  //
  // ADAM (2014, Kingma and Ba), what almost everyone uses today. For
  // each weight it keeps two running averages:
  //     m = the recent average gradient       (momentum: keep rolling
  //                                            the way you've been going)
  //     v = the recent average gradient²      (how big and jumpy the
  //                                            gradients usually are)
  // Then:
  //     weight = weight - learningRate * m / (√v + tiny)
  // Dividing by √v gives every weight its own step size: weights with
  // big, noisy gradients take careful steps, weights with small, steady
  // gradients get a boost. In practice it trains faster and is much
  // less fussy about the learning rate.
  // -------------------------------------------------------------------
  applyGradients({ gradW, gradB }, learningRate) {
    if (this.optimizer === "adam") {
      if (!this.adam) {
        const zerosLike = (arr) => JSON.parse(JSON.stringify(arr)).map(function z(x) { return Array.isArray(x) ? x.map(z) : 0; });
        this.adam = { t: 0, mW: zerosLike(this.weights), vW: zerosLike(this.weights), mB: zerosLike(this.biases), vB: zerosLike(this.biases) };
      }
      const s = this.adam, b1 = 0.9, b2 = 0.999, eps = 1e-8;
      s.t++;
      const c1 = 1 - Math.pow(b1, s.t), c2 = 1 - Math.pow(b2, s.t); // bias correction for the first few steps
      const step = (params, grads, m, v) => {
        for (let i = 0; i < params.length; i++) {
          m[i] = b1 * m[i] + (1 - b1) * grads[i];
          v[i] = b2 * v[i] + (1 - b2) * grads[i] * grads[i];
          params[i] -= (learningRate * (m[i] / c1)) / (Math.sqrt(v[i] / c2) + eps);
        }
      };
      for (let l = 0; l < this.weights.length; l++) {
        for (let j = 0; j < this.weights[l].length; j++) step(this.weights[l][j], gradW[l][j], s.mW[l][j], s.vW[l][j]);
        step(this.biases[l], gradB[l], s.mB[l], s.vB[l]);
      }
      return;
    }
    // Plain gradient descent: step every parameter downhill.
    for (let l = 0; l < this.weights.length; l++) {
      for (let j = 0; j < this.weights[l].length; j++) {
        this.biases[l][j] -= learningRate * gradB[l][j];
        for (let i = 0; i < this.weights[l][j].length; i++) this.weights[l][j][i] -= learningRate * gradW[l][j][i];
      }
    }
  }

  // One training step on a mini-batch: gradients, then update.
  trainBatch(xs, ys, learningRate) {
    const grads = this.gradientsMatrix(xs, ys);
    this.applyGradients(grads, learningRate);
    return grads.loss;
  }

  setOptimizer(name) {
    this.optimizer = name;
    this.adam = null; // Adam starts its running averages fresh
  }

  // One EPOCH = one full pass over the training data, in shuffled
  // mini-batches. Returns the average loss seen during the pass.
  trainEpoch(xs, ys, learningRate, batchSize, rand) {
    const order = xs.map((_, k) => k);
    for (let k = order.length - 1; k > 0; k--) {
      const r = Math.floor(rand() * (k + 1));
      [order[k], order[r]] = [order[r], order[k]];
    }
    let total = 0;
    let batches = 0;
    for (let start = 0; start < order.length; start += batchSize) {
      const idx = order.slice(start, start + batchSize);
      total += this.trainBatch(idx.map((k) => xs[k]), idx.map((k) => ys[k]), learningRate);
      batches++;
    }
    return total / Math.max(batches, 1);
  }
}

// ---------------------------------------------------------------------
// Toy datasets: points on a flat 2D board, each labelled 0 or 1.
// The network's job: learn where the 1s are and where the 0s are.
// Coordinates run from -1 to 1 on both axes.
// ---------------------------------------------------------------------
const DATASETS = {
  blobs: {
    name: "Two groups",
    hint: "A single straight line can split these. One neuron is enough.",
    make(n, noise, rand) {
      const pts = [];
      for (let k = 0; k < n; k++) {
        const y = k % 2;
        const cx = y ? 0.45 : -0.45, cy = y ? 0.4 : -0.4;
        const spread = 0.12 + noise * 0.35;
        pts.push({ x: [cx + rand.gaussian() * spread, cy + rand.gaussian() * spread], y });
      }
      return pts;
    },
  },
  xor: {
    name: "Four corners (XOR)",
    hint: "No single straight line works. You need a hidden layer.",
    make(n, noise, rand) {
      const pts = [];
      for (let k = 0; k < n; k++) {
        let a = rand() * 2 - 1, b = rand() * 2 - 1;
        const pad = 0.06;
        a += a > 0 ? pad : -pad;
        b += b > 0 ? pad : -pad;
        let y = a * b > 0 ? 1 : 0;
        if (rand() < noise * 0.3) y = 1 - y; // noise flips some labels
        pts.push({ x: [a * 0.9, b * 0.9], y });
      }
      return pts;
    },
  },
  circle: {
    name: "Circle",
    hint: "A ring of 0s around a cluster of 1s. Needs a few hidden neurons.",
    make(n, noise, rand) {
      const pts = [];
      for (let k = 0; k < n; k++) {
        const y = k % 2;
        const r = y ? rand() * 0.38 : 0.6 + rand() * 0.32;
        const t = rand() * Math.PI * 2;
        const j = noise * 0.25;
        pts.push({ x: [r * Math.cos(t) + rand.gaussian() * j, r * Math.sin(t) + rand.gaussian() * j], y });
      }
      return pts;
    },
  },
  spiral: {
    name: "Spiral",
    hint: "Two arms wound together. The hardest one. Try 2 hidden layers.",
    make(n, noise, rand) {
      const pts = [];
      for (let k = 0; k < n; k++) {
        const y = k % 2;
        const frac = Math.floor(k / 2) / (n / 2);   // 0 at the centre, 1 at the outside
        const r = 0.08 + frac * 0.85;
        const angle = frac * 2.6 * Math.PI + (y ? Math.PI : 0);
        const j = 0.02 + noise * 0.12;
        pts.push({ x: [r * Math.cos(angle) + rand.gaussian() * j, r * Math.sin(angle) + rand.gaussian() * j], y });
      }
      return pts;
    },
  },
};

// Let this file work both in the browser and in Node (for testing).
if (typeof module !== "undefined") {
  module.exports = { makeRandom, ACTIVATIONS, NeuralNetwork, DATASETS, sigmoid };
}
