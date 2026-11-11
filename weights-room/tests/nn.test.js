// Run with:  node tests/nn.test.js
// Proves the backpropagation in nn.js is correct, three ways:
//   1. the one-at-a-time version and the matrix version agree exactly
//   2. both agree with a numerical gradient (nudge each weight a tiny
//      bit and measure how the loss changes, no calculus involved)
//   3. training with plain gradient descent and with Adam lowers the loss
const { makeRandom, NeuralNetwork, DATASETS } = require("../nn.js");

let failures = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
  if (!ok) failures++;
};

for (const act of ["tanh", "relu", "sigmoid"]) {
  const rand = makeRandom(3);
  const pts = DATASETS.circle.make(16, 0.1, rand);
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const net = new NeuralNetwork([2, 5, 4, 1], { activation: act, seed: 9 });

  const a = net.gradientsOneAtATime(xs, ys);
  const b = net.gradientsMatrix(xs, ys);
  let maxDiff = Math.abs(a.loss - b.loss);
  a.gradW.forEach((L, l) => L.forEach((row, j) => row.forEach((g, i) => (maxDiff = Math.max(maxDiff, Math.abs(g - b.gradW[l][j][i]))))));
  a.gradB.forEach((L, l) => L.forEach((g, j) => (maxDiff = Math.max(maxDiff, Math.abs(g - b.gradB[l][j])))));
  check(`${act}: loop and matrix gradients match`, maxDiff < 1e-12, "max difference " + maxDiff.toExponential(1));

  // Numerical gradient: (loss(w + h) - loss(w - h)) / 2h
  const h = 1e-5;
  let worst = 0;
  const numeric = (holder, idx) => {
    const old = holder[idx];
    holder[idx] = old + h; const up = net.averageLoss(xs, ys);
    holder[idx] = old - h; const down = net.averageLoss(xs, ys);
    holder[idx] = old;
    return (up - down) / (2 * h);
  };
  const rel = (x, y) => Math.abs(x - y) / Math.max(1e-6, Math.abs(x) + Math.abs(y));
  net.weights.forEach((L, l) => L.forEach((row, j) => row.forEach((_, i) => (worst = Math.max(worst, rel(numeric(row, i), b.gradW[l][j][i]))))));
  net.biases.forEach((L, l) => L.forEach((_, j) => (worst = Math.max(worst, rel(numeric(L, j), b.gradB[l][j])))));
  // ReLU has a kink at 0, so allow a looser tolerance there.
  check(`${act}: backprop matches numerical gradient`, worst < (act === "relu" ? 1e-4 : 1e-6), "worst relative error " + worst.toExponential(1));
}

for (const opt of ["sgd", "adam"]) {
  const rand = makeRandom(7);
  const pts = DATASETS.spiral.make(200, 0.1, rand);
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const net = new NeuralNetwork([2, 8, 8, 1], { activation: "tanh", seed: 3, optimizer: opt });
  const before = net.averageLoss(xs, ys);
  for (let e = 0; e < 1000; e++) net.trainEpoch(xs, ys, opt === "adam" ? 0.01 : 0.1, 10, rand);
  const after = net.averageLoss(xs, ys);
  check(`${opt}: 1000 epochs solve the spiral`, after < 0.05, `${before.toFixed(3)} -> ${after.toFixed(3)}, accuracy ${(net.accuracy(xs, ys) * 100).toFixed(0)}%`);
}

if (failures) { console.log(`\n${failures} check(s) failed`); process.exit(1); }
console.log("\nAll checks passed.");
