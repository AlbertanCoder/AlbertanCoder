// Run with:  node tests/transformer.test.js
// Proves the hand-written backpropagation in transformer.js is correct.
// For many individual numbers in every parameter tensor, it compares:
//   analytic gradient  (what backward() computed)
//   numerical gradient (loss(w + h) − loss(w − h)) / 2h, which needs no
//                      calculus, only two extra forward passes
// If backprop had any mistake, these would disagree.
const nn = require("../nn.js");
global.makeRandom = nn.makeRandom;
const tok = require("../tokenizer.js");
global.trainBPE = tok.trainBPE;
global.tokenize = tok.tokenize;
const { TinyGPT, Adam, TextData, ropeApply, gradientCheck } = require("../transformer.js");

let failures = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) failures++;
};

for (const style of ["gpt2", "llama"]) {
  const r = gradientCheck(style);
  check(`${style}: backprop matches numerical gradient on ${r.checked} numbers in ${r.tensors} tensors`, r.worst < 1e-5,
    `worst relative error ${r.worst.toExponential(1)} in ${r.worstName}`);
}

// RoPE: rotating and then rotating back gives the original numbers.
{
  const x = Float64Array.from({ length: 2 * 5 * 8 }, (_, i) => Math.sin(i));
  const y = Float64Array.from(x);
  ropeApply(y, 1, 5, 2, 8, false);
  ropeApply(y, 1, 5, 2, 8, true);
  check("RoPE rotate then un-rotate is the identity", x.every((v, i) => Math.abs(v - y[i]) < 1e-12));
}

// Causality: changing a later token must not change earlier predictions.
for (const style of ["gpt2", "llama"]) {
  const model = new TinyGPT({ vocabSize: 7, context: 6, dModel: 12, nHeads: 3, nLayers: 2, style, seed: 2 });
  model.forward([[1, 2, 3, 4, 5, 6]]);
  const a = Array.from(model.probs.subarray(0, 3 * 7));
  model.forward([[1, 2, 3, 0, 0, 0]]);
  const b = Array.from(model.probs.subarray(0, 3 * 7));
  check(`${style}: no peeking at future tokens`, a.every((v, i) => Math.abs(v - b[i]) < 1e-12));
}

// KV cache: writing one token at a time must give exactly the same
// probabilities as running the whole sequence through forward().
for (const style of ["gpt2", "llama"]) {
  const model = new TinyGPT({ vocabSize: 9, context: 8, dModel: 12, nHeads: 3, nLayers: 2, style, seed: 4 });
  const ids = [3, 1, 4, 1, 5, 2, 6, 5];
  model.forward([ids]);
  const full = Array.from(model.probs);
  const cache = model.newCache();
  let worst = 0;
  ids.forEach((id, t) => {
    const { probs } = model.step(cache, id);
    for (let v = 0; v < 9; v++) worst = Math.max(worst, Math.abs(probs[v] - full[t * 9 + v]));
  });
  check(`${style}: KV-cache writing matches the full forward pass`, worst < 1e-12, "max difference " + worst.toExponential(1));
}

// Shared memory: packing parameters and gradients into one array changes nothing.
{
  const model = new TinyGPT({ vocabSize: 9, context: 8, dModel: 12, nHeads: 3, nLayers: 1, style: "llama", seed: 4 });
  const ids = [[3, 1, 4, 1, 5, 2]], tg = [[1, 4, 1, 5, 2, 6]];
  const before = model.forward(ids, tg);
  model.packParams(new SharedArrayBuffer(model.totalSize() * 8));
  model.packGrads(new SharedArrayBuffer(model.totalSize() * 8));
  const after = model.forward(ids, tg);
  model.backward();
  const nonzero = model.flatGrads.some((g) => g !== 0);
  check("packed shared-memory weights give the same loss and fill the shared gradients", before === after && nonzero);
}

// Masked targets: positions marked -1 are not scored.
{
  const model = new TinyGPT({ vocabSize: 9, context: 6, dModel: 12, nHeads: 3, nLayers: 1, style: "llama", seed: 4 });
  const full = model.forward([[1, 2, 3, 4]], [[2, 3, 4, 5]]);
  const lastOnly = model.forward([[1, 2, 3, 4]], [[-1, -1, -1, 5]]);
  const p = model.probs;
  check("masked targets: only unmasked positions count", Math.abs(lastOnly + Math.log(p[3 * 9 + 5])) < 1e-9 && full !== lastOnly);
}

// Training actually works: loss falls well below random guessing.
const { TRANSFORMER_TEXT } = require("../tinylm.js");
for (const style of ["gpt2", "llama"]) {
  const data = new TextData(TRANSFORMER_TEXT, { mode: "chars" });
  const model = new TinyGPT({ vocabSize: data.vocab.length, context: 32, dModel: 48, nHeads: 4, nLayers: 2, style, seed: 1 });
  const opt = new Adam(model.params(), { lr: 3e-3 });
  const rand = makeRandom(3);
  const start = Date.now();
  const chance = Math.log(data.vocab.length);
  let ema = null;
  for (let s = 0; s < 400; s++) {
    const { inputs, targets } = data.batch("train", 8, 32, rand);
    const loss = model.forward(inputs, targets);
    model.backward();
    opt.step();
    ema = ema === null ? loss : 0.95 * ema + 0.05 * loss;
  }
  const ms = Date.now() - start;
  check(`${style}: 400 Adam steps drop the loss well below chance`, ema < chance * 0.75,
    `chance ${chance.toFixed(2)} -> ${ema.toFixed(2)}, ${model.parameterCount().toLocaleString()} params, ${(ms / 400).toFixed(0)} ms/step`);
}

if (failures) { console.log(`\n${failures} check(s) failed`); process.exit(1); }
console.log("\nAll checks passed.");
