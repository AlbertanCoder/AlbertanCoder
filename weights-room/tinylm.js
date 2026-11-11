// =====================================================================
//  tinylm.js: a tiny language model, written from scratch.
//
//  It does the same job as ChatGPT or Claude: look at the text so far,
//  predict what comes next. The differences are scale and design:
//
//                     this file              a big LLM
//    reads            letters               tokens (word pieces)
//    looks back       4 letters             hundreds of thousands of tokens
//    parameters       about 4,600           billions to trillions
//    training text    about 1,600 letters   trillions of tokens
//    design           one hidden layer      a deep Transformer with attention
//
//  The learning method is the same one in nn.js: forward pass, loss,
//  backpropagation, gradient descent.
//
//  Pieces:
//    EMBEDDINGS : every character gets its own list of numbers that
//                 the model learns (its "meaning" to the model)
//    HIDDEN     : a layer of tanh neurons reads the last few embeddings
//    SOFTMAX    : turns one score per character into probabilities
//                 that add up to 100%
// =====================================================================

const TRAINING_TEXT = [
  "the arm moves the hand. the hand grips the pad. the strong arm wins the match.",
  "a neuron adds up its inputs and makes one number. the network learns the weights.",
  "the coach says pull hard and keep the wrist in. the arm gets strong when it trains.",
  "the network makes a guess. the loss says how wrong the guess was.",
  "the weights move a little bit after every guess. that is how the network learns.",
  "in the gym we lift weights. in the network we train weights. the word is the same.",
  "the model reads the words and guesses the next letter. then it reads one more letter.",
  "a big model learns from more text than a person could read in many lives.",
  "we start the match on ready go. the hand that hits the pad first wins the round.",
  "the hook pulls the hand in. the top roll pulls the hand back. both moves take strength.",
  "a guess that is very wrong gets a big loss. a guess that is right gets a small loss.",
  "the learning rate says how big a step to take. a big step can miss. a small step is slow.",
  "in the winter the river freezes and the town is cold. in the summer the days are long.",
  "the prairie is flat and the sky is wide. the wheat grows tall in the long summer days.",
  "the model does not look things up. it learned patterns from the text it read.",
  "more data and more weights make a better model. that is why big models cost so much.",
  "the strong man trains his arm every day. he rests on sunday and eats a big meal.",
  "a good puller keeps the elbow down and the shoulder in line with the arm.",
  "the network has layers. each layer turns its inputs into new numbers for the next layer.",
  "when the loss goes down the network is learning. when it stops going down it is done.",
].join(" ");

// More text for the Transformer in transformer.js. It needs more to read
// than the tiny model above, because it has more weights to fill.
const MORE_TEXT = [
  "a transformer reads all the words at once. each word looks back at the words before it and picks the ones that matter.",
  "the word it looks back at the trophy. the word big looks back at the trophy too. that is what attention does.",
  "each word makes a query and a key and a value. the query asks a question. the key says what the word has. the value is what it gives.",
  "the model adds up the values with the weights from attention. then a small network thinks about each word on its own.",
  "the blocks are stacked one on top of the other. each block adds a little more to what the word means.",
  "the loss goes down when the model gets better at guessing the next word. the loss goes up when it gets worse.",
  "in edmonton the winter is long and the snow is deep. people go to the gym to stay strong when it is cold outside.",
  "the river runs through the city. in the summer people walk by the river and the trees are green and tall.",
  "a good coach watches the arm and the wrist and the shoulder. the coach says keep the hand close and pull with the back.",
  "the match starts when the ref says ready go. the two hands lock and the strong side pulls the other hand down.",
  "the table has two pads and two pegs. the free hand holds the peg. the elbow stays on the pad the whole time.",
  "a puller who trains the wrist and the hand can win against a bigger arm. strength in the hand matters a lot.",
  "the network starts with random weights. at first it writes nonsense. then it learns letters. then it learns words.",
  "after a while it learns that a space comes after a word and a period comes at the end of a sentence.",
  "a small model can only learn a little. a big model with many layers can learn a lot more from a lot more text.",
  "the model reads the text in small windows. each window is a few dozen letters long. it guesses every next letter.",
  "the gradient says which way to move each weight. adam keeps track of the past gradients and takes smart steps.",
  "the norm keeps the numbers from growing too big. the residual lets the signal skip past a block when it needs to.",
  "the model does not know what is true. it only knows what words tend to come next. that is why it can be wrong.",
  "when the training loss goes down but the test loss goes up the model is memorizing. that is called overfitting.",
  "the farmer drives the truck down the gravel road. the wheat is gold and the sky is blue and the wind is strong.",
  "the hockey game is on saturday night. the whole town comes to the rink and the kids sit up front.",
  "the cook makes eggs and toast in the morning. the coffee is hot and the kitchen is warm when the snow falls.",
  "we learn by doing the same thing many times. the network learns the same way. one step at a time.",
].join(" ");
const TRANSFORMER_TEXT = TRAINING_TEXT + " " + MORE_TEXT;

class TinyLanguageModel {
  constructor(text, options = {}) {
    this.text = text;
    this.context = options.context || 4;     // how many characters it looks back
    this.embedSize = options.embedSize || 10; // numbers per character
    this.hiddenSize = options.hidden || 64;   // hidden neurons
    const rand = (this.rand = makeRandom(options.seed || 42));

    // Vocabulary: every distinct character in the training text.
    this.chars = Array.from(new Set(text)).sort();
    this.index = {};
    this.chars.forEach((c, i) => (this.index[c] = i));
    const V = this.chars.length;
    const inSize = this.context * this.embedSize;

    const gaussian = (scale) => rand.gaussian() * scale;
    // Embedding table: one row of learnable numbers per character.
    this.E = this.chars.map(() => Array.from({ length: this.embedSize }, () => gaussian(0.5)));
    // Hidden layer weights and biases.
    this.W1 = Array.from({ length: this.hiddenSize }, () => Array.from({ length: inSize }, () => gaussian(1 / Math.sqrt(inSize))));
    this.b1 = new Array(this.hiddenSize).fill(0);
    // Output layer: one score per character in the vocabulary.
    this.W2 = Array.from({ length: V }, () => Array.from({ length: this.hiddenSize }, () => gaussian(0.1 / Math.sqrt(this.hiddenSize))));
    this.b2 = new Array(V).fill(0);

    // Training examples: (the 4 characters before position t) -> (character at t)
    this.examples = [];
    const ids = Array.from(text).map((c) => this.index[c]);
    const space = this.index[" "];
    for (let t = 0; t < ids.length; t++) {
      const ctx = [];
      for (let k = this.context; k >= 1; k--) ctx.push(t - k >= 0 ? ids[t - k] : space);
      this.examples.push({ ctx, target: ids[t] });
    }
    this.steps = 0;
  }

  parameterCount() {
    const V = this.chars.length;
    return V * this.embedSize + this.hiddenSize * (this.context * this.embedSize + 1) + V * (this.hiddenSize + 1);
  }

  // Turn a string into the last `context` character ids (padding with spaces).
  encodeContext(str) {
    const space = this.index[" "];
    const ids = Array.from(str.toLowerCase()).map((c) => (c in this.index ? this.index[c] : space));
    const ctx = [];
    for (let k = this.context; k >= 1; k--) ctx.push(ids.length - k >= 0 ? ids[ids.length - k] : space);
    return ctx;
  }

  // FORWARD PASS: context ids -> probability for every possible next character.
  forward(ctx, temperature = 1) {
    // 1. Look up each character's embedding and lay them side by side.
    const x = [];
    for (const id of ctx) x.push(...this.E[id]);
    // 2. Hidden layer: z = W1·x + b1, h = tanh(z)
    const h = this.W1.map((row, j) => {
      let s = this.b1[j];
      for (let i = 0; i < x.length; i++) s += row[i] * x[i];
      return Math.tanh(s);
    });
    // 3. Output scores ("logits"), one per character.
    const logits = this.W2.map((row, v) => {
      let s = this.b2[v];
      for (let j = 0; j < h.length; j++) s += row[j] * h[j];
      return s;
    });
    // 4. Softmax: exponentiate and divide by the total so they sum to 1.
    //    Temperature divides the scores first: low = play it safe,
    //    high = take more chances.
    const scaled = logits.map((s) => s / temperature);
    const max = Math.max(...scaled);
    const exps = scaled.map((s) => Math.exp(s - max));
    const total = exps.reduce((a, b) => a + b, 0);
    const probs = exps.map((e) => e / total);
    return { x, h, probs };
  }

  // TRAIN on `count` random examples, one at a time (stochastic gradient descent).
  train(count, learningRate) {
    let totalLoss = 0;
    const V = this.chars.length;
    for (let n = 0; n < count; n++) {
      const ex = this.examples[Math.floor(this.rand() * this.examples.length)];
      const { x, h, probs } = this.forward(ex.ctx);
      totalLoss += -Math.log(probs[ex.target] + 1e-9);

      // Backpropagation. Softmax + cross-entropy gives the same tidy
      // starting point as in nn.js: prediction minus truth.
      const dLogits = probs.slice();
      dLogits[ex.target] -= 1;

      const dh = new Array(this.hiddenSize).fill(0);
      for (let v = 0; v < V; v++) {
        const g = dLogits[v];
        if (g === 0) continue;
        const row = this.W2[v];
        for (let j = 0; j < this.hiddenSize; j++) {
          dh[j] += row[j] * g;
          row[j] -= learningRate * g * h[j];
        }
        this.b2[v] -= learningRate * g;
      }
      const dx = new Array(x.length).fill(0);
      for (let j = 0; j < this.hiddenSize; j++) {
        const dz = dh[j] * (1 - h[j] * h[j]); // slope of tanh
        const row = this.W1[j];
        for (let i = 0; i < x.length; i++) {
          dx[i] += row[i] * dz;
          row[i] -= learningRate * dz * x[i];
        }
        this.b1[j] -= learningRate * dz;
      }
      // Even the embeddings learn: each character's numbers get nudged.
      for (let k = 0; k < ex.ctx.length; k++) {
        const emb = this.E[ex.ctx[k]];
        for (let d = 0; d < this.embedSize; d++) emb[d] -= learningRate * dx[k * this.embedSize + d];
      }
    }
    this.steps += count;
    return totalLoss / count;
  }

  // Average loss over the whole training text.
  evaluate() {
    let total = 0;
    for (const ex of this.examples) total += -Math.log(this.forward(ex.ctx).probs[ex.target] + 1e-9);
    return total / this.examples.length;
  }

  // The top few guesses for the next character.
  nextGuesses(str, temperature = 1, top = 8) {
    const { probs } = this.forward(this.encodeContext(str), temperature);
    return probs
      .map((p, i) => ({ char: this.chars[i], p }))
      .sort((a, b) => b.p - a.p)
      .slice(0, top);
  }

  // GENERATE: predict, pick a character using the probabilities, append it, repeat.
  // This loop is exactly how chatbots write, one token at a time.
  generate(prompt, length, temperature, rand) {
    let out = prompt.toLowerCase();
    for (let n = 0; n < length; n++) {
      const { probs } = this.forward(this.encodeContext(out), temperature);
      let r = rand(), pick = probs.length - 1;
      for (let i = 0; i < probs.length; i++) {
        r -= probs[i];
        if (r <= 0) { pick = i; break; }
      }
      out += this.chars[pick];
    }
    return out;
  }
}

if (typeof module !== "undefined") {
  module.exports = { TinyLanguageModel, TRAINING_TEXT, TRANSFORMER_TEXT };
}
