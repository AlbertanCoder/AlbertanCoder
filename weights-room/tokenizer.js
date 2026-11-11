// =====================================================================
//  tokenizer.js: a real Byte Pair Encoding (BPE) tokenizer, simplified.
//
//  Language models don't read letters or whole words. They read
//  TOKENS: chunks of text, each with an ID number. GPT models and
//  many others build their token lists with BPE:
//
//    1. Start with every single character as its own token.
//    2. Count which two tokens appear next to each other most often.
//    3. Glue that pair into one new token. Write the rule down.
//    4. Repeat thousands of times.
//
//  Common words end up as one token ("the"). Rare words get split into
//  pieces ("armwrestling" -> "arm" + "wrest" + "ling"). Real tokenizers
//  work on bytes and learn 50,000 to 200,000+ tokens from huge amounts
//  of text. This one learns a few hundred merges from a few paragraphs.
// =====================================================================

// Split text into words; a leading space stays attached to the word,
// the same convention GPT tokenizers use.
function splitWords(text) {
  return text.toLowerCase().match(/ ?[a-z']+| ?[0-9]+| ?[^a-z0-9' ]+|\s+(?!\S)|\s+/g) || [];
}

function trainBPE(text, numMerges) {
  // Count each distinct word once, with how often it appears.
  const wordCounts = new Map();
  for (const w of splitWords(text)) wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
  let words = Array.from(wordCounts, ([w, count]) => ({ pieces: Array.from(w), count }));

  const merges = [];
  for (let m = 0; m < numMerges; m++) {
    // Count every neighbouring pair.
    const pairs = new Map();
    for (const { pieces, count } of words) {
      for (let i = 0; i < pieces.length - 1; i++) {
        const key = pieces[i] + "\u0000" + pieces[i + 1];
        pairs.set(key, (pairs.get(key) || 0) + count);
      }
    }
    let best = null, bestCount = 1;
    for (const [key, c] of pairs) if (c > bestCount) { best = key; bestCount = c; }
    if (!best) break; // nothing appears twice any more
    const [a, b] = best.split("\u0000");
    merges.push({ a, b, count: bestCount });
    // Apply the new merge everywhere.
    words = words.map(({ pieces, count }) => ({ pieces: mergePair(pieces, a, b), count }));
  }

  // Assign IDs: single characters first, then each merged token in order.
  const vocab = new Map();
  const chars = Array.from(new Set(Array.from(text.toLowerCase()))).sort();
  for (const c of chars) vocab.set(c, vocab.size);
  for (const { a, b } of merges) if (!vocab.has(a + b)) vocab.set(a + b, vocab.size);
  return { merges, vocab };
}

function mergePair(pieces, a, b) {
  const out = [];
  for (let i = 0; i < pieces.length; i++) {
    if (i < pieces.length - 1 && pieces[i] === a && pieces[i + 1] === b) {
      out.push(a + b);
      i++;
    } else out.push(pieces[i]);
  }
  return out;
}

// Tokenize new text by replaying the learned merges in the order they were learned.
function tokenize(text, model) {
  const tokens = [];
  for (const w of splitWords(text)) {
    let pieces = Array.from(w);
    for (const { a, b } of model.merges) {
      if (pieces.length < 2) break;
      pieces = mergePair(pieces, a, b);
    }
    for (const p of pieces) tokens.push({ text: p, id: model.vocab.has(p) ? model.vocab.get(p) : null });
  }
  return tokens;
}

if (typeof module !== "undefined") {
  module.exports = { trainBPE, tokenize, splitWords };
}
