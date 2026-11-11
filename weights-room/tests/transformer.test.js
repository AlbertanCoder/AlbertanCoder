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
