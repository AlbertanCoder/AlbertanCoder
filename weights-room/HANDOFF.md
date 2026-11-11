# The Weights Room: handoff for the VPS

Written for whoever picks this up on Shad's VPS (Windows Server 2022, 4 GB RAM, no GPU, Python 3.12.4, git).

## Read this first: it's JavaScript, not Python

Everything here is **plain JavaScript with zero dependencies**: no npm packages, no pip packages, and no AI libraries. The neural networks, backpropagation, Transformer, tokenizer and optimizers are all written from scratch on purpose, because the project exists to teach how they work.

- **In a browser:** open `index.html`. Nothing to install.
- **On a server (tests, and the training service still to be built):** needs **Node.js 20 or newer**. The VPS has Python but not Node. Install Node with the Windows installer from nodejs.org (LTS), or `winget install OpenJS.NodeJS.LTS`, then check with `node --version`.
- `requirements.txt` exists only to state that there are no Python packages to install.

Nothing assumes a GPU. Everything runs on the CPU.

## What it is

A course that teaches neural networks and LLMs from zero, built around real models written from scratch. It's published as a private Claude artifact (`https://claude.ai/artifact/W2iuEpLMpmpxRWVaHnyvyx`) and lives in this folder of the `AlbertanCoder/AlbertanCoder` repo.

- 18 lessons with quizzes, a 20-question final test, and a meetup cheat sheet.
- **The lab:** a feed-forward network trained live on 2D datasets, with gradient descent or Adam.
- **A GPT-style Transformer** trained live in the browser, GPT-2 style or Llama style (RMSNorm, RoPE, SwiGLU), with an attention viewer and a live gradient check.
- A tiny character-level language model and a real BPE tokenizer.

## Files

| File | What it does |
| --- | --- |
| `index.html` | The whole course UI: lessons, quizzes, widgets, lab, cheat sheet, code viewer. Loads the `.js` files below with plain `<script>` tags. |
| `nn.js` | Feed-forward network: forward pass, cross-entropy loss, backprop (one-at-a-time and matrix versions), SGD and Adam, toy 2D datasets. |
| `transformer.js` | The Transformer: `Linear`, `Norm` (LayerNorm/RMSNorm), `Attention` (multi-head causal, optional RoPE), `MLP` (GELU or SwiGLU), `Block`, `TinyGPT`, `Adam` (AdamW with gradient clipping), `TextData`, `gradientCheck`. Hand-written backprop. Also: masked targets (−1 = don't score), shared-memory packing for multi-core training (`packParams`, `usePackedParams`, `packGrads`), and KV-cache generation (`newCache`, `step`, `prefill`). |
| `tinylm.js` | Character-level language model, plus `TRAINING_TEXT` and `TRANSFORMER_TEXT` (small original training texts). |
| `tokenizer.js` | BPE tokenizer: `trainBPE(text, merges, {lowercase, extraTokens})` and `tokenize` (with a per-word cache). |
| `tests/nn.test.js` | Gradient checks for `nn.js` (loop vs matrix vs numerical) and SGD/Adam training checks. |
| `tests/transformer.test.js` | Gradient checks for both Transformer styles, causality, RoPE round trip, KV-cache equivalence, shared-memory packing, masked loss, and training sanity checks. |
| `README.md` | Short overview. |

The browser-style `.js` files rely on globals. In Node, set them before requiring `transformer.js`:

```js
const nn = require("./nn.js"); global.makeRandom = nn.makeRandom;
const tok = require("./tokenizer.js"); global.trainBPE = tok.trainBPE; global.tokenize = tok.tokenize;
const { TinyGPT, Adam, TextData } = require("./transformer.js");
```

## How to run

```
git clone https://github.com/AlbertanCoder/AlbertanCoder.git
cd AlbertanCoder
git checkout claude/practical-carson-l3id7o
cd weights-room
node tests/nn.test.js
node tests/transformer.test.js
```

The repo is public, so cloning needs no GitHub login. To view the course, open `weights-room/index.html` in a browser. The "Code" tab only loads files when the page is served over http(s), not from `file://`.

## Current state (real numbers)

**Done and tested**
- `node tests/nn.test.js`: all pass. Loop and matrix backprop agree to about 1e-17. Backprop matches numerical gradients to about 1e-7. SGD (lr 0.1) and Adam (lr 0.01) both solve the spiral in 1,000 epochs (final loss 0.020 and 0.000).
- `node tests/transformer.test.js`: all pass.
  - Backprop matches numerical gradients on 444 numbers (GPT-2 style) and 252 numbers (Llama style). Worst relative errors are 2.5e-7 and 3.6e-8.
  - KV-cache generation matches the full forward pass exactly.
  - 400 Adam steps on `TRANSFORMER_TEXT` take the loss from 3.30 (chance) to 1.71 (GPT-2 style, 60,768 params) and 1.21 (Llama style, 58,128 params), at about 65 ms per step on a 4-core cloud container.
- In-browser runs of about 1,200 steps, measured in Node: GPT-2 style reaches training loss 1.11–1.17 and test loss 2.12–2.25. Llama style reaches 0.67–0.79 training and 2.35–2.66 test. Llama style learns faster and also overfits faster, because the training text is only about 4,300 characters.
- Tokenizer on real TinyStories data: 2,000 merges trained on 5 MB in 10.9 s. 22.5 MB of text tokenized in 8.8 s at 3.85 characters per token.
- Node speed: a hand-unrolled Float64 matrix multiply runs at about 3.1 GFLOP/s per core. Float32Array is slower in V8 (1.7), so the engine stays Float64.

**Not started yet** (the server side of "Phase B")
- The training service, web server, Windows setup script, the reasoning experiment, and the new history/generations/future lessons ("Phase A").

## The agreed plan (Shad's answers to 24 setup questions)

1. Setup is copy-paste commands Shad runs himself. No passwords in chat.
2. The site is password protected.
3. The spending-ledger app: measure its RAM/CPU and report. **Don't stop it without asking Shad.**
4. Training data: TinyStories (V2, GPT-4 stories).
5. Reasoning experiment: multi-digit addition. One model answers directly, one writes step-by-step working first. Compare their accuracy.
6. Train until validation loss stops improving, keep the best checkpoint, then pause (with a time cap).
7. Model size: picked automatically from a speed benchmark on the VPS.
8. Chat shows everything step by step: top guesses with probabilities, the picked token, and attention.
9. Lessons: OpenAI and Anthropic generations in depth, other labs briefly.
10. History: an interactive timeline plus 2 lessons.
11. The future lesson separates current research from labelled predictions.
12. Add a spaced-repetition review deck of missed questions.
13. Save quiz progress on the VPS, with the browser as a fallback.
14. One site served by the VPS: the course plus a new "Live" section.
15. Use the IP address with a self-signed HTTPS certificate for now. A domain can come later.
16. Discord messages for milestones only. The webhook goes in a local settings file, never in chat or git.
17. Keep the from-scratch engine (no PyTorch). Speed it up with Float64 unrolling and multi-core.
18. VPS model: Llama style.
19. Tokenizer: BPE with 2,048 tokens, case-sensitive, with `<|endoftext|>` as a special token.
20. Train on all CPU cores but one, at low priority.
21. Update with one command that pulls from GitHub and keeps the models and progress.
22. Build order: server first, lessons while it trains.
23. Fine-tuning stage on TinyStories-Instruct after pretraining.
24. Serve on its own port, 8443.

## Changes needed because the VPS is Windows with 4 GB RAM

- **The setup plan assumed Linux** (bash, systemd, ufw, openssl CLI). On Windows, use a PowerShell setup script. Run the trainer and web server as a scheduled task or service (for example NSSM, or Task Scheduler "at startup"), use `New-NetFirewallRule` for port 8443, and use `New-SelfSignedCertificate` for the certificate. Use "Below normal" process priority for training.
- **No `worker_threads` problem:** Node's worker threads and SharedArrayBuffer work the same on Windows.
- **Memory (4 GB, shared with the ledger app and Windows itself):**
  - Keep the model at or below about 5 million parameters. With params, Adam's two moment arrays and one gradient array per worker, all Float64, 5M params is about 5M × 8 bytes × (3 + workers), roughly 200–250 MB.
  - Don't load the whole 2.2 GB training file. Download only the first ~300–400 MB with an HTTP Range request (Hugging Face supports it), tokenize it once, and store the tokens as a Uint16 binary file (about 2 bytes per token, under 250 MB). Read it in chunks or memory-map it.
  - Training the 2,048-token BPE on a 5 MB sample uses well under 1 GB.
- **CPU count is unknown.** The auto-size step should measure it.

## Data sources (verified from the cloud session)

| File | URL | Size |
| --- | --- | --- |
| Stories, train | `https://huggingface.co/datasets/roneneldan/TinyStories/resolve/main/TinyStoriesV2-GPT4-train.txt` | 2,227,753,162 bytes |
| Stories, validation | `https://huggingface.co/datasets/roneneldan/TinyStories/resolve/main/TinyStoriesV2-GPT4-valid.txt` | 22,502,601 bytes (27,630 stories) |
| Instruct, train | `https://huggingface.co/datasets/roneneldan/TinyStoriesInstruct/resolve/main/TinyStories-Instruct-train.txt` | 2,663,428,109 bytes |
| Instruct, validation | `https://huggingface.co/datasets/roneneldan/TinyStoriesInstruct/resolve/main/TinyStories-Instruct-valid.txt` | 26,900,027 bytes |

- Stories are separated by a line containing `<|endoftext|>`. Range requests work (they return 206).
- Instruct examples have labelled fields **in varying order**: `Features:`, `Summary:`, `Words:`, `Random sentence:`, then `Story:` followed by the story on the next line. The `Summary:` sometimes comes *after* the story.
- Downloads redirect to `us.aws.cdn.hf.co`, so a firewall needs to allow that host as well as `huggingface.co`.
- Strip non-ASCII characters before tokenizing. 7 unknown tokens remained in 5.8M tokens.
- The license wasn't checked from the cloud session (Hugging Face pages weren't reachable there). Check the dataset cards before any redistribution.

## Next steps (in the order I was about to do them)

1. **Reasoning experiment check (local):** train two small character-level Llama-style models on 4-digit addition, one with format `4827+3956=8783` and one with digit-by-digit working and carries (e.g. `4827+3956: 7+6=13 c1, 2+5+1=8 c0, ... => 8783`). Confirm the step-by-step model is clearly more accurate *before* telling Shad it will be.
2. **Multi-core trainer** (`server/trainer.js`):
   - The main thread holds `packParams(SharedArrayBuffer)` and runs Adam.
   - N−1 `worker_threads` each call `usePackedParams` and `packGrads` on their own shared gradient slot, then run forward/backward on part of the batch. The main thread sums the gradients, steps, and repeats.
   - Includes data download and tokenizing, auto-sizing, periodic validation with plateau detection, best and latest checkpoints (JSON header plus Float64 data), then automatic fine-tuning on Instruct data with prompt tokens masked as −1.
   - Writes `status.json` for the web server and sends milestone posts to a Discord webhook read from a local config file.
3. **Web server** (`server/web.js`, Node `https`, port 8443):
   - Password login (scrypt hash and a session cookie).
   - Serves the course statically.
   - API: `/api/status`, a server-sent-events stream, `/api/generate` (uses `prefill`/`step` and returns per-token top guesses and attention), `/api/progress` (GET/PUT quiz progress).
   - Adds a "Live" section to `index.html` that appears only when `/api/status` responds.
4. **Windows setup script** (PowerShell) and an `update` command, as described above.
5. **Phase A lessons:** research-verified history, the GPT and Claude generations (labelled confirmed / reported / unknown), reasoning models and benchmarks, comparison with frontier models, and the future. Also the review deck, and browser save/load of trained weights.
