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
//  of text. The browser version learns a few hundred merges from a few
//  paragraphs; the server version learns about 2,000 from TinyStories.
// =====================================================================

// Split text into words; a leading space stays attached to the word,
// the same convention GPT tokenizers use.
function splitWords(text, lowercase = true) {
  if (lowercase) return text.toLowerCase().match(/ ?[a-z']+| ?[0-9]+| ?[^a-z0-9' ]+|\s+(?!\S)|\s+/g) || [];
  return text.match(/ ?[A-Za-z']+| ?[0-9]+| ?[^A-Za-z0-9' ]+|\s+(?!\S)|\s+/g) || [];
}

// options.lowercase: fold capitals into lowercase first (default true).
// options.extraTokens: special tokens that get their own IDs, e.g. "<|endoftext|>".
function trainBPE(text, numMerges, options = {}) {
  const lowercase = options.lowercase !== false;
  // Count each distinct word once, with how often it appears.
  const wordCounts = new Map();
  for (const w of splitWords(text, lowercase)) wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
  // Single-character words can never be merged, so leave them out.
  let words = Array.from(wordCounts, ([w, count]) => ({ pieces: Array.from(w), count })).filter((w) => w.pieces.length > 1);

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
    // Apply the new merge everywhere it can happen.
    const joined = a + b;
    for (const w of words) if (w.pieces.length > 1 && w.pieces.join("").includes(joined)) w.pieces = mergePair(w.pieces, a, b);
    words = words.filter((w) => w.pieces.length > 1);
  }

  // Assign IDs: special tokens first, then single characters, then each merged token in order.
  const vocab = new Map();
  for (const t of options.extraTokens || []) vocab.set(t, vocab.size);
  const chars = Array.from(new Set(Array.from(lowercase ? text.toLowerCase() : text))).sort();
  for (const c of chars) if (!vocab.has(c)) vocab.set(c, vocab.size);
  for (const { a, b } of merges) if (!vocab.has(a + b)) vocab.set(a + b, vocab.size);
  return { merges, vocab, lowercase };
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
// Each distinct word is worked out once and remembered, which makes
// tokenizing millions of words fast.
function tokenize(text, model) {
  if (!model.cache) model.cache = new Map();
  const tokens = [];
  for (const w of splitWords(text, model.lowercase !== false)) {
    let pieces = model.cache.get(w);
    if (!pieces) {
      pieces = Array.from(w);
      for (const { a, b } of model.merges) {
        if (pieces.length < 2) break;
        pieces = mergePair(pieces, a, b);
      }
      if (model.cache.size < 200000) model.cache.set(w, pieces);
    }
    for (const p of pieces) tokens.push({ text: p, id: model.vocab.has(p) ? model.vocab.get(p) : null });
  }
  return tokens;
}

if (typeof module !== "undefined") {
  module.exports = { trainBPE, tokenize, splitWords };
}
