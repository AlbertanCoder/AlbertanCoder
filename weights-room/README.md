# The Weights Room

A hands-on course on how neural networks and large language models work, built around real models written from scratch in plain JavaScript. No AI libraries.

- **18 short lessons**, from "what is a neuron" up to a working Transformer. Each lesson ends with a quiz.
- **The lab**: build a network, train it live on four 2D datasets with plain gradient descent or Adam, watch every neuron, and tap any point to see the full forward pass with real numbers.
- **A real GPT-style Transformer** you train in the browser, in two designs: GPT-2 style (LayerNorm, learned positions, GELU) and Llama style (RMSNorm, RoPE, SwiGLU). It includes a viewer for the attention weights it actually learns.
- **A tiny character-level language model** and **a real BPE tokenizer**.
- **A meetup cheat sheet**, a glossary, and a 20-question final test.

## The code

| File | What it is |
| --- | --- |
| `nn.js` | The neural network: forward pass, cross-entropy loss, backpropagation (one-at-a-time and matrix versions), gradient descent and Adam. Start here. |
| `transformer.js` | A GPT-style Transformer with hand-written backprop: embeddings, multi-head causal attention, residual connections, LayerNorm/RMSNorm, GELU/SwiGLU, RoPE, AdamW with gradient clipping, and a built-in gradient check. |
| `tinylm.js` | A character-level language model with embeddings, a hidden layer and softmax, plus the training text. |
| `tokenizer.js` | Byte Pair Encoding, trained on the fly. |
| `index.html` | The lessons, the widgets, and the lab. |

## Proof the math is right

```
node tests/nn.test.js
node tests/transformer.test.js
```

The tests compare every hand-written gradient with a numerical estimate (nudge a weight up and down and measure the loss). They also check that the loop and matrix versions of backprop agree, that the Transformer never looks at future tokens, that RoPE rotates and un-rotates correctly, and that training actually lowers the loss.

## Run it

Open `index.html` in a browser. Everything works offline except the fonts and the in-page code viewer. To read the code, open the `.js` files in any editor.
