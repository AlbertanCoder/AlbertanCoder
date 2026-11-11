# The Weights Room

A hands-on course on how neural networks and large language models work, built around a real neural network written from scratch in plain JavaScript. No AI libraries.

- **15 short lessons**, from "what is a neuron" up to tokens, embeddings, attention, and how chatbots like ChatGPT and Claude are made. Each lesson ends with a quiz.
- **The lab**: build a network, train it live on four 2D datasets, watch every neuron, and tap any point to see the full forward pass with real numbers.
- **A tiny language model** you train in the browser. It goes from random letters to near-English.
- **A real BPE tokenizer**, the method GPT models use to split text into tokens.
- **A meetup cheat sheet**, a glossary, and a 15-question final test.

## The code

| File | What it is |
| --- | --- |
| `nn.js` | The neural network: forward pass, cross-entropy loss, backpropagation, gradient descent. Start here. |
| `tinylm.js` | A character-level language model with embeddings, a hidden layer, and softmax. |
| `tokenizer.js` | Byte Pair Encoding, trained on the fly. |
| `index.html` | The lessons, the widgets, and the lab. |

## Run it

Open `index.html` in a browser. Everything works offline except the fonts and the in-page code viewer. To read the code, open the `.js` files in any editor.
