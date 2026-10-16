# Vision AI pipeline ("AI brain") for a household fridge/pantry tracker

Compiled 2026-10-16. Prices are USD as published. CAD estimates use about 1.40 CAD per USD; early-October 2026 sources disagree, giving roughly 1.39 to 1.42 (see Q7). Source tags used below: **[OFFICIAL]** means the vendor's own docs. **[AGG]** means a third-party aggregator or blog that could not be checked against vendor pages. **[OLD]** means pre-2026 work or models that have been replaced. Anthropic figures were checked against live platform.claude.com pages on 2026-10-16. OpenAI and Google doc domains could not be fetched from this environment (DNS failures), so their figures come from search snippets and aggregators.

---

## Q1. Which current vision model APIs suit fridge/grocery identification (late 2026)? Per-image cost, size limits, structured JSON output, and which cheap tiers are good enough

### Takeaway
The current cheap tiers from Anthropic, OpenAI and Google all accept several photos per request and support JSON-schema-constrained output. Model choice therefore comes down to cost per image token and accuracy on your own photos. The cheapest option I could verify is **Claude Haiku 5.5** (`claude-haiku-5-5`), at $0.10 per million input tokens and $0.50 per million output tokens, with high-resolution vision. **Gemini 3.x Flash-Lite** and **OpenAI GPT-5.4 nano/mini** cost about the same, but their prices and image-token rules could only be confirmed through launch posts and aggregators. No public benchmark ranks these tiers on grocery photos, so choose the tier by testing on your own photos.

### Cited Findings

**Anthropic Claude [OFFICIAL, verified 2026-10-16]**
- Standard prices per million tokens (input / output): Claude Opus 5.5 (`claude-opus-5-5`) $4 / $20. Claude Sonnet 5.5 (`claude-sonnet-5-5`) $2 / $10. Claude Haiku 5.5 (`claude-haiku-5-5`) $0.10 / $0.50 for prompts up to 100,000 tokens and $0.50 / $2.50 for longer prompts. Previous-generation Claude Haiku 4.5 is $1 / $5. — [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Haiku 5.5 long-prompt rule: if a request's prompt is over 100,000 tokens (all input tokens, cache reads and writes included), the whole request pays the higher rate. — [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Discounts and modifiers:
  - Cache pricing: 5-minute cache writes cost 1.25x input and 1-hour writes cost 2x. Cache hits cost 0.1x input, except on Opus 5.5 and Sonnet 5.5, where they cost 0.05x ($0.20/M and $0.10/M). A Haiku 5.5 cache hit is $0.01/M.
  - Batch API: 50% off input and output. Haiku 5.5 batch is $0.05 / $0.25, Sonnet 5.5 $1 / $5, Opus 5.5 $2 / $10.
  - US-only inference (`inference_geo: "us"`) multiplies all prices by 1.1. The default global routing uses standard prices.
  - Source: [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- **Image token formula:** Claude reads images in 28x28-pixel patches, so an image costs `ceil(width/28) x ceil(height/28)` visual tokens. There are two resolution tiers:
  - **High-resolution tier** ("Claude 4.7 and later models"): up to 2576 px on the long edge and 4,784 visual tokens.
  - **Standard tier** (all other models): up to 1568 px and 1,568 tokens.
  - Larger images are scaled down with the aspect ratio kept.
  - Documented examples: 1000x1000 costs 1,296 tokens on either tier. 1920x1080 costs 2,691 tokens on high-res and 1,560 on standard. 3840x2160 costs 4,784 on high-res (scaled to 2576x1449).
  - Documented cost examples: at Opus 5.5's $4/M, a 1000x1000 image costs about $5.18 per thousand images and a 4K image about $19.14 per thousand. At Haiku 4.5's $1/M on the standard tier, the 1000x1000 image costs about $1.30 per thousand.
  - Source: [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- **Request limits:**
  - Up to 600 images per API request (100 for models with a 200k context window). Maximum 8000x8000 px.
  - With **more than 20 images in a request, a stricter per-image size limit applies**. Either resize so neither side exceeds 2000 px, or keep the request to 20 or fewer image and document blocks. Images re-sent from earlier turns count toward the 20.
  - 10 MB per image (base64) on the Claude API; 5 MB on Bedrock and Google Cloud. 32 MB request size limit on standard endpoints.
  - Formats: JPEG, PNG, GIF and WebP.
  - The Files API lets you upload an image once and reference it by `file_id`.
  - Source: [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- **Vision guidance and limitations:**
  - Images work best placed before the text. Label each image ("Image 1:", "Image 2:"). Claude analyzes multiple images together.
  - Claude "might hallucinate or make mistakes when interpreting low-quality, rotated, or very small images under 200 pixels."
  - Counting is approximate, "especially with large numbers of small objects." Coordinates and bounding boxes are approximate.
  - Claude "does not parse or receive any metadata from images", so it does not read EXIF orientation or GPS.
  - Heavy JPEG compression can make text hard to read.
  - Source: [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- **Privacy (vision FAQ):** images sent for vision are "ephemeral and not stored beyond the duration of the API request", and "Anthropic does not use uploaded images to train models." — [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- **Structured outputs:**
  - Set `output_config.format` with `type: "json_schema"` and Claude "returns valid JSON that matches your schema."
  - Supported models include `claude-haiku-5-5`, `claude-sonnet-5-5` and `claude-opus-5-5`. For Python, `client.messages.parse()` with a Pydantic model is recommended.
  - Schema limits: no numeric `minimum`/`maximum`, no `minLength`/`maxLength`, no recursive schemas. `additionalProperties` must be `false`. Arrays allow `minItems` of only 0 or 1. A schema can have at most 24 optional parameters and 16 union-type (`anyOf` or type-array) parameters. Unsupported features return a 400.
  - Latency: the first use of a schema adds grammar-compilation time. Compiled grammars are cached for 24 hours after last use.
  - Enum values may come back with different capitalization, so compare them case-insensitively.
  - A refusal (`stop_reason: "refusal"`) or a `max_tokens` cutoff can return JSON that doesn't match the schema.
  - Asking for "reasoning" inside a property can trigger a `reasoning_extraction` refusal. The docs advise asking for a short explanation instead.
  - Structured outputs adds a format system prompt, which costs extra input tokens.
  - Source: [Claude structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- **Model behavior notes:** these come from Anthropic's bundled `claude-api` skill reference, model table cached 2026-10-06, not from a fetched web page.
  - Opus 5.5 cannot turn thinking off. Its effort defaults to `medium`.
  - Sonnet 5.5's effort defaults to `high`. Its thinking can only be turned off with `thinking: {type: "between_tools"}`.
  - Haiku 5.5's effort defaults to `medium` and thinking is on by default. It counts the same text as about 30% more tokens than Haiku 4.5. Its safety-classifier refusals have no server-side fallback.
  - Thinking tokens count toward `max_tokens`.
  - Assistant prefill returns a 400 on these models; use structured outputs instead.
  - Live equivalent: [Claude models overview](https://platform.claude.com/docs/en/about-claude/models/overview)

**OpenAI**
- GPT-5.4 mini costs $0.75/M input and $4.50/M output, has a 400k context window and accepts images. GPT-5.4 nano costs $0.20 / $1.25 and is API-only. — [OpenAI: Introducing GPT-5.4 mini and nano](https://openai.com/index/introducing-gpt-5-4-mini-and-nano/)
- GPT-5 mini costs $0.25 in / $2 out. OpenAI's model page marks it **deprecated** and recommends a newer model for new high-volume work. — [OpenAI GPT-5 mini model page](https://developers.openai.com/api/docs/models/gpt-5-mini) (search snippet)
- **[AGG, conflicting]** Aggregators describe a newer GPT-5.6 family released around July 2026, with GPT-5.4 now called legacy:
  - Sol: $4 / $20, or $5 / $30 in one source.
  - Terra: $2 / $12.
  - Luna: $0.20 / $1.20.
  - Another aggregator instead lists "GPT-6 Luna" at $0.10 / $0.50.
  - None of these could be checked against OpenAI's own pages.
  - Sources: [CloudZero](https://www.cloudzero.com/blog/openai-pricing/), [UsagePricing](https://www.usagepricing.com/ai-token-pricing/openai), [BenchLM](https://benchlm.ai/openai/api-pricing)
- **Image token math**, from OpenAI's guide as summarized by search:
  - gpt-5.4, gpt-5.4-mini and gpt-5.4-nano support detail levels `low`, `high`, `original` and `auto`.
  - `high` resizes to a 2048 px maximum with a budget of up to 2,500 32-pixel patches. `original` allows up to 10,000 patches at a 6000 px maximum. `auto` uses `high`'s sizing.
  - Token count = patches x a per-model multiplier, rounded up. Each image is capped at 30,000 patches.
  - The summary also says `low` uses a 6,144-patch budget and "can cost more tokens than high". That seems backwards; check it with the calculator.
  - Sources: [OpenAI Images and vision guide](https://developers.openai.com/api/docs/guides/images-vision), [OpenAI image cost calculator](https://developers.openai.com/api/docs/guides/image-cost-calculator)
- **Billing anomalies reported by developers:**
  - One forum thread found gpt-5-mini's billed usage fit a 1.20 multiplier, not the documented 1.62. — [OpenAI forum: gpt-5-mini discrepancy](https://community.openai.com/t/gpt-5-mini-image-input-token-calculation-discrepancy-with-official-faq-formula/1344040)
  - Another thread reported about 66K prompt tokens for one 1920x1080 PNG on gpt-5.4-mini. The poster suspected the base64 string was being counted as text. — [OpenAI forum: 66K tokens](https://community.openai.com/t/gpt-5-4-mini-66k-prompt-tokens-for-a-1920x1080-png/1380539)
- **Structured outputs:**
  - OpenAI uses `json_schema` with `"strict": true` and `"additionalProperties": false`.
  - Strict mode is enforced during decoding, but a refusal or a length-truncated response still returns successfully without valid schema JSON.
  - Sources: [OpenReplay](https://blog.openreplay.com/json-schema-llm-structured-outputs/), [Merge gateway docs](https://docs.merge.dev/merge-gateway/capabilities/structured-outputs), [FutureAGI](https://futureagi.com/blog/evaluating-llm-structured-output-modes-2026/)

**Google Gemini**
- **Gemini 3.1 Flash-Lite:** $0.25/M input (text, image or video) and $1.50/M output. Batch is half price. This is from Google's pricing page via a search snippet. — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **[AGG] Gemini 3.5 Flash-Lite:** $0.30 / $2.50. Generally available since 2026-07-21 and described as the replacement for 3.1 Flash-Lite. Batch $0.15 / $1.25, cached input $0.03/M, about 1M context. — [Artificial Analysis](https://artificialanalysis.ai/models/gemini-3-5-flash-lite), [OpenRouter](https://openrouter.ai/google/gemini-3.5-flash-lite)
- **[AGG, conflicting]** Other Flash models:
  - Gemini 3 Flash: $0.50 / $3.00.
  - Gemini 3.5 Flash: $1.50 / $9.00 according to one source.
  - Another source says the newest Flash is "Gemini 3.8 Flash" at $0.75 / $3.75, an introductory price through 2026-12-31.
  - Sources: [MorphLLM](https://www.morphllm.com/gemini-api-pricing), [MetaCTO](https://www.metacto.com/blogs/the-true-cost-of-google-gemini-a-guide-to-api-pricing-and-integration), [BenchLM Gemini](https://benchlm.ai/google/api-pricing)
- **Image tokens:**
  - Gemini 3 models charge a fixed number of tokens per image, set by `media_resolution`. The default (unset) equals HIGH at 1,120 tokens. ULTRA_HIGH is 2,240, MEDIUM 560 and LOW 280.
  - Models before Gemini 3 charge 258 tokens per image.
  - Media token counts are estimates. Billing uses `usage_metadata`.
  - Google warns that Gemini 3 defaults can raise image token use compared with older models.
  - Sources: [Google Cloud: Get started with Gemini 3](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start/get-started-with-gemini-3), [Gemini API media resolution](https://ai.google.dev/gemini-api/docs/media-resolution), [Google Cloud image understanding](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/capabilities/image-understanding)
- **Structured output:** set `responseMimeType: "application/json"` plus `responseSchema`. Some SDKs name the field `responseJsonSchema`. — [OpenReplay](https://blog.openreplay.com/json-schema-llm-structured-outputs/), [LLMR vignette](https://ftp.fau.de/cran/web/packages/LLMR/vignettes/about-schema.html)

**Integration layer (Home Assistant)**
- The "LLM Vision" integration supports OpenAI, Anthropic, Google Gemini, AWS Bedrock, Azure, Groq, Ollama, LocalAI, OpenRouter and any OpenAI-compatible endpoint. It can save analyzed images and their AI summaries as timeline events, and it can "remember" objects. — [LLM Vision providers docs](https://llm-vision.gitbook.io/getting-started/setup/providers), [SourcePulse summary](https://www.sourcepulse.org/projects/1827780)
- **Conflict:** LLM Vision's v1.7.1-beta.3 pre-release notes say "the Anthropic API rejects requests that enable both structured output and thinking", and that the integration now works around it. — [release notes](https://newreleases.io/project/github/valentinfrlch/ha-llmvision/release/v1.7.1-beta.3). Anthropic's current structured-outputs page lists Opus 5.5 as supported, and Opus 5.5 cannot turn thinking off, so the restriction likely applied to older models or an older API state. — [Claude structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)

### Inferences
- **Phone-photo math (Claude).** These are calculated with the documented `ceil(w/28) x ceil(h/28)` rule:
  - A 12 MP phone photo (4032x3024) sent unchanged is scaled down on the high-res tier to about 2205x1653, which is about **4,740 tokens**. This is my approximation of the resize rule; it lands near the documented 4,784-token cap.
  - Resized to **1568x1176: 2,352 tokens.**
  - 1280x960: 1,610 tokens.
  - 1024x768: 1,036 tokens.
  - For comparison, the same photo is a flat 1,120 tokens on Gemini 3 at the default setting, and 1568x1176 is 1,813 32-pixel patches on OpenAI before the model multiplier.
- **Cost per photo at 1568 px** is under a cent everywhere. Output tokens (the JSON plus thinking) usually cost more than the images on cheap tiers.

  | Model | Cost per photo |
  |---|---|
  | Haiku 5.5 | about $0.00024 |
  | Sonnet 5.5 | about $0.0047 |
  | Opus 5.5 | about $0.0094 |
  | Gemini 3.1 Flash-Lite (1,120 tokens) | about $0.00028 |

- **"Good enough" tier.** No grocery benchmark exists for these exact models (see Q2), so test empirically:
  1. Label 30 to 50 of your own fridge, freezer and pantry photos with what's actually there.
  2. Set a quality ceiling with Opus 5.5 or Sonnet 5.5 at `effort: low`.
  3. Run Haiku 5.5, Gemini Flash-Lite and GPT-5.4 nano on the same set and keep the cheapest one that meets your bar.
- **Default candidate: Haiku 5.5.** It has the cheapest verified price, supports structured outputs, and by the docs' wording ("Claude 4.7 and later models") it is in the high-res tier. Anthropic's bundled guidance also suggests measuring the strongest model at lower effort before building a multi-model cascade, because caches and prompts don't carry across models.
- **Practical request settings:**
  - Resize to about 1568 px on the long edge as JPEG at about quality 85.
  - **Apply the EXIF rotation to the pixels** before upload. Claude ignores metadata and gets worse on rotated images. Strip GPS EXIF too.
  - Keep each request to 20 photos or fewer.
  - Use `effort: low` for extraction.
  - Set `max_tokens` generously, since thinking counts toward it.
  - Always check `stop_reason` before parsing.
- **Expect model churn.** Names and prices changed several times in 2026: the GPT-5.4, 5.6 and "GPT-6" naming conflicts, and Gemini 3 to 3.5 to "3.8". Put the model call behind one function with a provider-neutral prompt and schema, so swapping models is a config change. LLM Vision already gives Home Assistant users this abstraction.
- **No data-residency upcharge needed.** A Canadian hobbyist can leave `inference_geo` at its default (global, standard price) and avoid the 1.1x US-only multiplier.
- **Files API persistence (inference).** The "ephemeral" FAQ wording covers images sent inline in requests. The Files API exists for reuse across requests, so treat uploaded files as stored until you delete them.

### Gaps
- OpenAI and Google docs could not be fetched (DNS blocked). Still unverified:
  - OpenAI's image multipliers for the GPT-5.4 and GPT-5.6 tiers, and the odd `low`-detail behavior.
  - The GPT-5.6 versus "GPT-6" naming and prices.
  - Gemini 3.5 Flash versus "3.8 Flash" status and price.
- Haiku 5.5's high-res tier is inferred from the docs' "Claude 4.7 and later models" wording; the docs don't name it explicitly. Check with `count_tokens` on a real photo.
- I couldn't confirm whether current Gemini models still return native bounding boxes, or in what format.
- I found no head-to-head comparison of Haiku 5.5, Gemini Flash-Lite and GPT-5.4 nano/mini on grocery or fridge photos.
- I found no measured latency per request for any provider.

---

## Q2. What do benchmarks, papers and hands-on reports say about accuracy on food/grocery/fridge recognition, counting and fill level, and what failure modes are known?

### Takeaway
No public benchmark tests current VLMs on real household fridge or pantry photos, so the evidence is indirect. It points the same way throughout:
- VLMs are good at naming clearly visible items.
- They are unreliable at:
  - exact counts, especially with occlusion or many small items
  - listing every item in a cluttered scene
  - matching the same physical object across two photos
  - estimating fill level or volume
- Commercial fridge cameras restrict themselves to about 30 fresh-produce items and fall back on the user editing the list.

So design for partial, approximate observations, and send uncertain items to the user.

### Cited Findings
- **Claude's documented limits.** Counting is approximate, especially with many small objects. The model can hallucinate on low-quality, rotated or tiny (under 200 px) images. Spatial and coordinate outputs are approximate. — [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- **Occluded counting (CAPTURe, ICCV 2025) [OLD models].**
  - The real-image subset has 924 images. Humans had a near-perfect error rate, while the best model (GPT-4o) had a 14.75% error rate.
  - **Every model got worse when an occluding box was added.**
  - Sources: [CAPTURe paper (ICCV 2025)](https://openaccess.thecvf.com/content/ICCV2025/papers/Pothiraj_CAPTURE_Evaluating_Spatial_Reasoning_in_Vision_Language_Models_via_Occluded_ICCV_2025_paper.pdf), [alphaXiv](https://www.alphaxiv.org/abs/2504.15485)
- **Compositional counting (VLMCountBench, "...Can't Even Count to 20") [OLD models].** Accuracy tops out around 0.60 for Qwen2.5-VL 72B, with Gemini 2.5 Flash at 0.58. — [arXiv 2510.04401](https://arxiv.org/html/2510.04401)
- **Detector grounding helps counting (GroundCount, 2026).** Pairing a VLM with an object detector raised counting accuracy from 74.7% to **81.3%** (+6.6 points) on the counting subset of the PhD benchmark. — [arXiv 2603.10978](https://arxiv.org/pdf/2603.10978)
- **Listing every item in a basket [OLD, early-2025 models].** None of the large or small multimodal models tested listed all items correctly in five basket cases. **Adding retail catalog images to the prompt improved performance** for the large models. — [arXiv 2501.04150](https://arxiv.org/pdf/2501.04150)
- **Same-object matching (MMVM, "Are They the Same?") [OLD].** No multimodal model exceeded 50% overall accuracy at telling whether two images show the same object. GPT-4o scored 42.65% and Qwen2-VL-72B 38.08%. — [arXiv 2501.04670](https://arxiv.org/pdf/2501.04670)
- **Fill level.** I found no benchmark that tests VLMs on fill level. Related work:
  - A transparent-container benchmark scores liquid content in only five coarse levels (empty, little, half, much, full). Detecting the liquid content scored lower average precision than detecting the containers. — [Sensors 2023](https://doi.org/10.3390/s23156656)
  - Estimating container volume from a single image: the best model reached under 18% average per-class accuracy, against 10% for chance. — [Liner review of "See the Glass Half Full"](https://liner.com/review/see-glass-half-full-reasoning-about-liquid-containers-their-volume)
  - CORSMAL fill-level estimation reached about 77%, using audio plus color images. — [arXiv 2203.01192](https://arxiv.org/html/2203.01192)
  - YOLOv11 variants outperformed traditional methods at liquid-level estimation in transparent containers, scored by mean absolute error against hand-measured fill percentages. — [ACM 2025](https://dl.acm.org/doi/10.1145/3775030.3775041)
- **Trained detectors on fridge food.**
  - A Frontiers in AI 2024 study covered 80 food items, with more than 100 images per item under varied conditions. At 60 to 100 cm, a modified YOLACT reached 95.0% mAP versus 90.0% for YOLOv8n. These are controlled conditions with per-item training data. — [Frontiers in AI](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2024.1442948/full), [ResearchGate copy](https://www.researchgate.net/publication/387219996_Robust_deep-learning_based_refrigerator_food_recognition)
  - The Roboflow "Fridge Objects" dataset has 963 annotated images under a CC BY 4.0 license. — [Roboflow Universe](https://universe.roboflow.com/fooddetection-essdj/fridge-objects/dataset/11)
- **On-device TinyML (ESP32-CAM + Edge Impulse freezer study).**
  - 395 images and 5 classes: onion, tomato, watermelon, leaves, and a non-food fan.
  - 98.1% training accuracy, but **test accuracy ranged from 71% to 99% depending on how objects were positioned**.
  - Sources: [ResearchGate](https://www.researchgate.net/publication/389362447_Application_of_Edge_Impulse_and_ESP32-CAM_in_Smart_Freezer_Systems_for_Object_Recognition), [Zenodo](https://zenodo.org/records/14934593)
- **Commercial benchmark of scope: Samsung Family Hub "AI Vision Inside" [2024].**
  - It recognizes 33 fresh food items such as fruit and vegetables.
  - It **cannot identify items in the door bins or freezer**.
  - Unrecognized food is listed as an "unknown item". Samsung says the model "may generate incomplete or incorrect information" and that users may need to edit the list manually.
  - Sources: [Tom's Guide](https://www.tomsguide.com/news/samsung-unveils-2024-bespoke-family-hub-refrigerator-with-vision-ai-heres-what-it-can-do), [Samsung Newsroom](https://news.samsung.com/us/samsungs-most-intelligent-fridge-is-getting-smarter-with-family-hub-for-2024-update), [Samsung AU product page](https://www.samsung.com/au/business/refrigerators/french-door/rf9000-t-style-french-door-32inch-family-hub-809l-stainless-steel-rf71db9956qdsa/), [Samsung Levant product page](https://www.samsung.com/levant/business/refrigerators/french-door/rf9000d-rf9000dc-t-style-french-door-21-5inch-family-hub-636l-black-rf65dg9h0eb1eu/)
- **DIY reports.**
  - A cheap ESP32-CAM, a door sensor, Home Assistant and a vision model are enough to photograph the fridge when the door opens and keep an editable inventory.
  - But "inventory accuracy remains the main limitation". A single camera cannot reliably see through packages, drawers, side-door shelves, stacked food or opaque containers.
  - Source: [PopularAI DIY fridge camera guide](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)
- **Hands-on app builders.**
  - Pantrio, an open-source Next.js app, uses Claude vision to identify every item in a fridge photo and tag it with a category and condition. — [Pantrio](https://github.com/knovu/pantrio)
  - The letmcook author reports that "item parsing worked fine". The hard part was what happens when you correct the list once and then scan again later. — [Medium: Every Vibe Coder Eventually Builds the "Scan Your Fridge" App](https://medium.com/@andytlim/every-vibe-coder-eventually-builds-the-scan-your-fridge-app-8827dde02d94)
- **Prompt effect on completeness (PhotoPrism, August 2026; 16 mixed images including food).** Local qwen3-vl 4b/8b covered 75% of expected labels with the default prompt, and **97% when the prompt asked for a specific number of labels**. gemma3:4b covered 81% with its default prompt. — [PhotoPrism model comparison](https://docs.photoprism.app/developer-guide/vision/model-comparison/)

### Inferences
- **Likely behavior on a real household fridge.** This is extrapolated from the evidence above, not measured.
  - Strong on front-facing labeled packages, common whole produce, and items with readable text, including handwritten labels.
  - Weaker on:
    - back-row or stacked items
    - crisper-drawer contents seen through frosted plastic
    - door bins shot at an angle
    - frosty freezer bags
    - leftovers in identical opaque containers
    - exact counts above roughly 5 to 10 small items (eggs, yogurt cups, cans behind cans)
  - Treat counts as approximate unless they are small.
- **Fill level.** Limit it to coarse buckets (full, about 3/4, about 1/2, about 1/4, nearly empty, unknown). Only ask for it on translucent containers such as milk jugs, juice and oil. For opaque cartons, return "unknown" and let the user update it. Don't ask for a precise percentage.
- **Glare and low light.** Fridge interiors are lit only while the door is open, glass shelves and clamshells cause glare, and an ESP32-CAM needs its LED. Have the model report a per-photo `usable` flag and a list of issues, and re-prompt the user ("retake the door shelf") instead of trusting an empty result.
- **Mitigations, cheapest first:**
  1. **Photo protocol:** one straight-on photo per shelf or zone, door bins shot separately, drawers pulled out, pantry shot one shelf at a time.
  2. **Label leftovers** with masking tape and a marker (contents plus date). The model reads text far more reliably than it tells look-alike containers apart.
  3. **One-tap confirmations** for anything uncertain.
  4. **Receipt-derived expected items** (Q6), analogous to the catalog-image boost above.
  5. Optionally, **detector grounding for counts** later (as in GroundCount).
- **Own eval set.** The literature can't predict your fridge, so build a 30 to 50 photo labeled set and track three numbers per model: item recall, precision, and count accuracy for items with 5 or fewer units.

### Gaps
- I found no benchmark of 2026 frontier or budget VLMs (Claude 5.x, GPT-5.4/5.6, Gemini 3.x) on household fridge or pantry photos, and no per-category error rates.
- I found no measured data on how glare, low light or condensation affect VLM accuracy inside fridges.
- I found no source on how well VLMs' self-reported confidence matches their actual accuracy on this task.
- I couldn't retrieve the detection and counting results of arXiv 2509.07400 (an ESP32-CAM plus YOLO smart fridge).
- "FridgeGPT" returned no results; I couldn't confirm such an app exists or how it works.

---

## Q3. How do you "diff" scans: matching items across photos, moved items, partial views, multi-photo scans, and when to ask the user?

### Takeaway
Compare scans at the inventory level (structured text), not the pixel level:
1. Send the previous inventory (stable IDs, zones, first-seen dates) together with all of this scan's zone-labeled photos in **one** request.
2. Have the model return per-item observations with suggested matches.
3. Apply deterministic rules in your own code: which zones were photographed, how many times an item has been missed, and hints from receipts.
4. Ask the user one-tap questions only for ambiguous or important changes.

The evidence supports this split. VLMs and embeddings are weak at recognizing the same physical object across two photos, while VLM change detection improves markedly with a self-check pass.

### Cited Findings
- **Multi-image handling (Claude).**
  - Claude analyzes multiple images together. Label each one ("Image 1:").
  - Images from earlier turns stay accessible in a multi-turn conversation.
  - The Files API (`file_id`) avoids re-sending base64.
  - More than 20 images in a request triggers the stricter per-image size limit, and re-sent images from earlier turns count toward it.
  - Source: [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- **Change detection (Visual Chronicles).**
  - On flagging changes between consecutive images, Gemini reached **76.56% AP**, against **26.52%** for a CLIP embedding-distance baseline.
  - Open-ended change answers scored 81.34% precision and 89.87% recall.
  - **A self-critic prompt raised precision from 57.83% to 81.74%.**
  - Source: [arXiv 2504.08727](https://arxiv.org/html/2504.08727v3)
- **Same-object matching (MMVM) [OLD].** Multimodal models stayed under 50% at deciding whether two images show the same object. — [arXiv 2501.04670](https://arxiv.org/pdf/2501.04670)
- **Counting (GroundCount).** Grounding the VLM with a detector reduces count hallucinations. — [arXiv 2603.10978](https://arxiv.org/pdf/2603.10978)
- **What existing products do.** None of these describe how they reconcile a re-scan with the existing list.
  - FridgeSmart lets users review detected items before they are saved. — [FridgeSmart](https://www.fridgesmartapp.com/ai-fridge-scanner)
  - Forky says users "correct it as you go" and that "most people do a full re-scan after a grocery run". — [Forky AI](https://forkyai.com/fridge-scanner/)
  - The letmcook author names correction-versus-re-scan as the open problem. — [Medium](https://medium.com/@andytlim/every-vibe-coder-eventually-builds-the-scan-your-fridge-app-8827dde02d94)
- **fridge-core (Jan Dubovsky).** Detected items are written to a Home Assistant To-Do list. The companion fridge-card lets each field be edited directly on the card. — [Home Assistant community post](https://community.home-assistant.io/t/fridge-cam-ai-content-recognition-esp32-cam-ha-blueprint-a-custom-lovelace-card/1023750), [fridge-card repo](https://github.com/jan-tdy/fridge-card)
- **Samsung** expects users to edit the list by hand for accuracy. — [Samsung AU product page](https://www.samsung.com/au/business/refrigerators/french-door/rf9000-t-style-french-door-32inch-family-hub-809l-stainless-steel-rf71db9956qdsa/)
- **A GPT-4o + YOLOv8 smart fridge build** keeps inventory in a CSV file for tracking over time. It doesn't describe comparing scans. — [GoPenAI blog](https://blog.gopenai.com/smart-fridge-ai-powered-object-detection-6d263a9d6f2d?gi=6c30b44e8766)
- **Bounding boxes.** Claude returns pixel coordinates relative to the resized image it saw. They are approximate, but good enough to crop a thumbnail for a confirm card. — [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)

### Inferences

#### Recommended reconciliation design (hobbyist v1)
1. **A scan is a set of zone-tagged photos.** The app asks for a zone per photo (e.g., `fridge.shelf_1`, `fridge.door`, `fridge.crisper_l`, `freezer.drawer_1`, `pantry.shelf_2`), defaulting to a fixed shooting order. Record which zones each scan covered. Items in zones that weren't photographed must never be marked gone.
2. **One model call per scan, with 20 photos or fewer.** Include, in this order:
   1. the photos, each labeled "Image n: zone"
   2. the previous inventory, limited to items in the covered zones plus recently ambiguous or moved items, with trimmed fields
   3. receipt lines since the last scan, if any
   4. the household's catalog of canonical names

   Ask for per-observation `match_prev_id` and `match_type` (`same_item`, `additional_unit`, `new` or `uncertain`). Also ask for a status for each previous item: seen, not seen in a covered zone, zone not photographed, possibly moved, or uncertain.
3. **Merge deterministically in code:**
   - **Seen:** set `last_seen` to now and update count and fill. **Never overwrite `first_seen`.**
   - **New:** set `first_seen` to the scan time, or to the purchase date if a matching receipt line exists within about 3 days.
   - **Not seen in a covered zone:** increment `miss_count`. Mark the item "probably gone" after 2 consecutive misses in covered zones, or after 1 miss on a full post-shopping scan. Mark it gone only after the user confirms, or after N more misses.
   - **Moved:** an item missing from zone A while an observation with the same canonical name and container appears in zone B in the same scan counts as moved. Keep its `first_seen`.
   - **Duplicates across overlapping photos:** tell the model to count each physical item once. In code, also merge observations with the same name in the same zone.
4. **Matching fallback in code** for anything the model left as `uncertain`:
   1. exact match on canonical name
   2. otherwise a fuzzy name match (e.g., a token-set ratio of 85 or more with a library such as rapidfuzz), plus the same category, plus the same container type
   3. if candidates tie, ask the user
5. **One-tap confirm queue, capped at about 3 to 5 cards per scan** to avoid fatigue. Show a cropped thumbnail and two or three buttons. Triggers:
   - a perishable item disappeared from a covered zone ("Finished the spinach? Yes / Still there")
   - a new item with low or medium identity confidence, or an unreadable label
   - leftovers in look-alike containers ("Which one is the chili from Oct 3?")
   - a count change on a multi-unit item
   - an item seen only once in its whole history
6. **Optional verification pass.** Run a second, cheap call with the same photos: "For each claimed removal or new item, re-check the images and confirm or retract." This is modeled on the Visual Chronicles self-critic gain (precision 57.8% to 81.7%), and it costs about as much as the first call on Haiku-class pricing.
7. **Don't build embedding or re-identification matching in v1.** The CLIP-distance and MMVM results suggest it pays off poorly. Revisit only when a fixed camera (Phase 2) gives a stable viewpoint.

#### Phase 2 (fixed in-fridge camera)
- With a fixed viewpoint, "did anything change?" is cheap to answer locally: compare consecutive frames, for example with a perceptual hash or by thresholding pixel differences. Only call the VLM when something changed.
- A camera scan covers only the zones it can see. Feed it through the same reconciliation, but keep periodic manual full scans for door bins, drawers and the freezer, which the PopularAI guide says one camera can't see.

### Gaps
- I found no published implementation or evaluation of LLM-based reconciliation across repeated fridge scans; the design above is synthesis.
- I found no data on good miss-count thresholds or on how many confirmations users tolerate.
- The correspondence and change-detection evidence uses 2024–25 models (GPT-4o, Gemini, Qwen2-VL); current models may do better.

---

## Q4. What prompt and output-schema design patterns work (canonical names, categories, confidence, location, quantity/fill, opened vs sealed)? Real examples

### Takeaway
Use a provider-enforced JSON schema built from enums and required fields:
- Enums for category, container, fill bucket, opened state and confidence.
- Required fields with "unknown" or empty-string sentinels instead of nullable unions, to stay inside Claude's 24-optional and 16-union limits.
- A short `evidence` string instead of "reasoning".

Give the model the household's canonical-name catalog and the previous inventory so it reuses names. Calculate shelf-life flags in code from first-seen dates and USDA FoodKeeper ranges. Don't ask the model for expiry dates.

### Cited Findings
- **Claude structured-output constraints:**
  - Every object needs `additionalProperties: false`.
  - Numeric and length constraints are not allowed.
  - At most 24 optional parameters and 16 union-type parameters.
  - Required properties are emitted first.
  - Enum capitalization may vary.
  - "Reasoning" fields risk a `reasoning_extraction` refusal; ask for a short explanation instead.
  - The format instructions cost extra input tokens.
  - Grammars stay cached for 24 hours.
  - Source: [Claude structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- **Vision prompt layout.** Put images before text, label each image, use clear and unrotated photos, and avoid heavy compression. — [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- **Asking for a count improves completeness.** Asking for a specific number of labels raised Qwen3-VL label coverage from 75% to 97% in PhotoPrism's test. — [PhotoPrism model comparison](https://docs.photoprism.app/developer-guide/vision/model-comparison/)
- **Real examples:**
  - **fridge-core (Jan Dubovsky).**
    - MIT-licensed ESPHome configuration and Home Assistant automation for an AI-Thinker ESP32-CAM: video stream, flash LED on GPIO4, reed-switch door sensor on GPIO13.
    - It photographs on door-open and sends the photo through Home Assistant's `ai_task.generate_data` action, run from a Home Assistant blueprint.
    - Parsed items are written to a To-Do list and edited with the companion fridge-card.
    - Sources: [PopularAI guide](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant), [Home Assistant community post](https://community.home-assistant.io/t/fridge-cam-ai-content-recognition-esp32-cam-ha-blueprint-a-custom-lovelace-card/1023750), [fridge-card](https://github.com/jan-tdy/fridge-card)
  - **Pantrio** tags each detected item with a category and a condition. — [Pantrio](https://github.com/knovu/pantrio)
  - **Fridge Assistant** (Home Assistant custom integration) adds AI expiry estimates, barcode scanning and printed DYMO stickers for fridge, freezer and pantry inventory. — [Home Assistant community: Fridge Assistant](https://community.home-assistant.io/t/introducing-fridge-assistant-how-i-order-my-freezer-with-ai-and-labels-inside-home-assistant-with-a-custom-integration/1018193)
  - **Grocery Tracker** (Home Assistant) does barcode scanning, tracks expiry dates and sends a daily alert at 16:00 listing items about to expire. — [homeassistant-grocery-tracker](https://github.com/wizz666/homeassistant-grocery-tracker)
  - **PantryRaider** (Home Assistant, built on Grocy) offers AI photo import and also runs with no AI provider configured. — [PantryRaider](https://github.com/Yskaa91/PantryRaider)
  - **DecayDock** (ESP32-CAM, TFT screen and an on-device Edge Impulse model):
    - Recognizes items such as tomatoes, onions, bananas, spinach, milk cartons and leftovers.
    - Shows freshness as color-coded bars: green for fresh, yellow for eat soon, red for nearly expired.
    - It is a prototype.
    - Sources: [Hackster.io](https://www.hackster.io/news/decaydock-the-tiny-ai-device-that-combats-food-waste-3a34ddad9cbf), [Hackaday](https://hackaday.com/2026/05/20/decaydock-keeps-track-of-spoilage/), [Instructables](https://www.instructables.com/DecayDock-AI-Smart-Fridge-Companion/)
  - **Canonical-name mapping from receipt text.** A layered abbreviation dictionary maps strings like "PUB GRK YOG 0%" to a canonical food. — [tempo PR #66](https://github.com/nicoladebbia/tempo/pull/66)
- **Shelf-life data: USDA FoodKeeper.**
  - Covers more than 500 products, with storage timelines for refrigerator, freezer and pantry.
  - Published as a public machine-readable data feed on FSIS.gov and Data.gov.
  - FSIS calls the times "useful guidelines", not hard-and-fast rules.
  - Sources: [FoodKeeper data listing](https://data.amerigeoss.org/dataset/fsis-foodkeeper-data1), [USDA blog](https://www.usda.gov/about-usda/news/blog/usda-integrates-recalls-information-foodkeeper-application)
- **Reference context helps.** Adding catalog reference images to the prompt improved how completely large multimodal models listed basket items. — [arXiv 2501.04150](https://arxiv.org/pdf/2501.04150)

### Inferences

#### Proposed output schema
This schema works with Claude structured outputs as-is. For OpenAI, use it with `strict: true`; for Gemini, pass it as `responseSchema` or `responseJsonSchema`.
```json
{
  "type": "object", "additionalProperties": false,
  "required": ["images", "observations", "previous_items", "questions"],
  "properties": {
    "images": {"type": "array", "items": {"type": "object", "additionalProperties": false,
      "required": ["image", "zone", "usable", "issues"],
      "properties": {
        "image": {"type": "integer"}, "zone": {"type": "string"}, "usable": {"type": "boolean"},
        "issues": {"type": "array", "items": {"type": "string",
          "enum": ["none","dark","glare","blurry","partial_view","items_hidden_behind","steep_angle","frost"]}}}}},
    "observations": {"type": "array", "items": {"type": "object", "additionalProperties": false,
      "required": ["obs_id","image","zone","canonical_name","label_text","category","container",
                   "count","count_is_exact","fill","opened","identity_confidence",
                   "match_prev_id","match_type","evidence"],
      "properties": {
        "obs_id": {"type": "string"}, "image": {"type": "integer"}, "zone": {"type": "string"},
        "canonical_name": {"type": "string", "description": "generic lowercase name, reuse catalog names, e.g. 'baby spinach', 'milk 2%'"},
        "label_text": {"type": "string", "description": "brand/variant/date text actually readable, else ''"},
        "category": {"type": "string", "enum": ["produce","dairy","eggs","meat_fish","deli","leftovers",
          "condiment_sauce","beverage","bakery","frozen_meal","frozen_other","dry_goods","canned","snack","baking","other"]},
        "container": {"type": "string", "enum": ["bag","clamshell","box","carton","jug","bottle","jar",
          "can","tub","deli_container","wrapped","loose","other"]},
        "count": {"type": "integer"}, "count_is_exact": {"type": "boolean"},
        "fill": {"type": "string", "enum": ["full","three_quarters","half","quarter","nearly_empty","not_applicable","unknown"]},
        "opened": {"type": "string", "enum": ["sealed","opened","unknown"]},
        "identity_confidence": {"type": "string", "enum": ["high","medium","low"]},
        "match_prev_id": {"type": "string", "description": "id from PREVIOUS_INVENTORY or ''"},
        "match_type": {"type": "string", "enum": ["same_item","additional_unit","new","uncertain"]},
        "evidence": {"type": "string", "description": "max ~15 words: what you saw"}}}},
    "previous_items": {"type": "array", "items": {"type": "object", "additionalProperties": false,
      "required": ["prev_id","status"],
      "properties": {"prev_id": {"type": "string"},
        "status": {"type": "string", "enum": ["seen","not_seen_zone_covered","zone_not_photographed","possibly_moved","uncertain"]}}}},
    "questions": {"type": "array", "items": {"type": "object", "additionalProperties": false,
      "required": ["ref_id","question","options"],
      "properties": {"ref_id": {"type": "string"}, "question": {"type": "string"},
        "options": {"type": "array", "items": {"type": "string"}}}}}
  }
}
```
- Everything is required, with "unknown" or empty-string sentinels, so the schema avoids both of Claude's limits (24 optional and 16 union parameters).
- Confidence is an enum (high, medium, low) rather than a float. Claude schemas can't bound numbers, and an ordinal scale is easier to threshold.
- The `evidence` field is a short description, not "reasoning", which avoids `reasoning_extraction` refusals.
- Fields the app owns stay **out** of the model output: `first_seen`, `last_seen`, `miss_count` and shelf-life days. Code computes them, which keeps the model from rewriting history.

#### Prompt skeleton (system prompt, stable)
Keep it fixed so it can be cached.
- "You update a household food inventory from photos. Report only what is visible."
- "Go zone by zone, shelf by shelf, left to right, front to back. Before answering, count the distinct products per photo." This uses the count effect PhotoPrism found.
- "Reuse names from CATALOG when the item matches. Otherwise use a short generic name. Never invent a brand. Put readable label text in label_text, and leave it empty if it isn't readable."
- "If the same physical item appears in two overlapping photos, report it once."
- "Leftovers: name them from any visible label or date, otherwise 'leftovers (container description)', with identity_confidence low."
- "Fill level only for translucent containers. Use not_applicable for countable packages and unknown for opaque containers."
- "For each PREVIOUS_INVENTORY item whose zone was photographed, set its status. Zones not photographed get zone_not_photographed."
- "Prefer 'uncertain' to guessing. Ask at most 3 questions, each answerable with one tap."
- Per-scan inputs go **after** the stable prompt: the photos (labeled with zones), the PREVIOUS_INVENTORY JSON, the RECEIPT_ITEMS_SINCE_LAST_SCAN, and today's date.

#### Data model and shelf-life flags (in code)
- **Catalog table:** `canonical_name`, `category`, `aliases[]`, `foodkeeper_id`, `fridge_days_min`/`max`, `freezer_days`, `pantry_days`, `opened_days`. Seed it from FoodKeeper, and add a row when the user confirms a new name.
- **Inventory table:** `id`, `canonical_name`, `zone`, `container`, `count`, `fill`, `opened`, `first_seen`, `last_seen`, `miss_count`, `status`, and `source` (photo, receipt or manual).
- **Flag rule:**
  - "check it": days since `first_seen` (or since `opened_at`) has reached the FoodKeeper minimum
  - "use or toss": it has passed the maximum
  - Example: "spinach, day 9, check it".
  - Leftovers default to a short household rule, for example 3 to 4 days. Confirm that number against FoodKeeper.
  - Show "probably have" (seen recently) separately from "might be gone" (missed 1 or more times) in the store view.

### Gaps
- I didn't see fridge-core's actual prompt text or output fields (the repo wasn't opened, per the constraints), and its default AI provider isn't documented in the sources I found.
- I found no documentation of LLM Vision's structured-output schema format.
- I found no examples of "FridgeGPT"-style apps.
- I couldn't confirm the FoodKeeper feed's file format or field names (JSON or otherwise), nor exact per-item day ranges such as spinach.
- I found no evidence on whether numeric or verbal confidence from VLMs is calibrated for grocery items.

---

## Q5. How do local options (Edge Impulse/TinyML on the ESP32, YOLO, small open VLMs) compare with cloud APIs on accuracy, cost, latency, privacy and effort?

### Takeaway
For one household, cloud VLM APIs give the best accuracy for the least effort, and at under about C$1 per month on the cheapest tiers they cost almost nothing. Local VLMs on Ollama (Qwen3-VL 4B/8B, Gemma 3/4) are a workable fallback for privacy or offline use, but smaller variants are less predictable and weaker at reading documents. Trained YOLO detectors need labeled photos for every product. ESP32 TinyML handles only a few fixed classes and is sensitive to where things sit, so use the ESP32 for capture and triggering, not for recognition.

### Cited Findings
- **Local VLMs (PhotoPrism, using Ollama).**
  - qwen3-vl:4b-instruct and :8b-instruct were the main self-hosted models tested. Both reached 75% label coverage with the default prompt and 97% when the prompt asked for a count.
  - Qwen3-VL needs Ollama 0.12.7 or later.
  - The 2b and 4b variants can be less predictable unless their options are tuned.
  - gemma3:4b had the highest default coverage at 81%. PhotoPrism describes Gemma 4 as "very consistent".
  - Sources: [PhotoPrism model comparison](https://docs.photoprism.app/developer-guide/vision/model-comparison/), [PhotoPrism Ollama models](https://docs.photoprism.app/user-guide/ai/ollama-models/), [Ollama qwen3-vl](https://ollama.com/library/qwen3-vl)
- **[AGG] Moondream 2.** About 2 GB of VRAM with basic quality for simple photos. In an invoice-extraction test it scored 2/5, against 5/5 for Qwen3-VL 8B. — [PromptQuorum](https://www.promptquorum.com/power-local-llm/local-vision-models-llava-ollama-2026), [LocalAIMaster](https://localaimaster.com/blog/best-local-vision-models)
- **Edge Impulse on ESP32.**
  - Guides default to 96x96 input. Larger inputs improve accuracy but take longer to train.
  - Without PSRAM, the sketch runs only on 96x96 frames.
  - A forum user found 96x96 limiting, and adding more data didn't help.
  - Sources: [DroneBot Workshop](https://dronebotworkshop.com/esp32-object-detect/), [EloquentArduino](https://eloquentarduino.com/esp32-camera-object-detection/), [Edge Impulse forum](https://forum.edgeimpulse.com/t/object-detection-in-esp32-cam/5681)
  - The freezer study reached 98.1% in training but 71% to 99% in testing across 5 classes, depending on positioning. — [ResearchGate](https://www.researchgate.net/publication/389362447_Application_of_Edge_Impulse_and_ESP32-CAM_in_Smart_Freezer_Systems_for_Object_Recognition)
- **DecayDock** runs its Edge Impulse model on the ESP32-CAM, not in the cloud. Both Hackaday and Hackster describe it as a prototype. — [Let's Data Science](https://letsdatascience.com/news/decaydock-uses-local-ai-to-track-fridge-freshness-a980b35c), [Hackster.io](https://www.hackster.io/news/decaydock-the-tiny-ai-device-that-combats-food-waste-3a34ddad9cbf), [Hackaday](https://hackaday.com/2026/05/20/decaydock-keeps-track-of-spoilage/)
- **Academic ESP32-CAM fridge (arXiv 2509.07400, September 2025).**
  - The ESP32-CAM subsystem monitors the fridge, and a YOLO model detects and counts fruit and vegetables.
  - Each class's error is calibrated with temperature scaling.
  - A third-party, AI-generated review calls the experimental reporting thin.
  - Sources: [arXiv 2509.07400](https://arxiv.org/abs/2509.07400), [Pith review](https://pith.science/paper/2509.07400)
- **m0nklabs fridge-cam-firmware.** ESP32-S3 with an OV5640 camera, WiFi upload and deep sleep. **All AI processing happens on the server.** — [fridge-cam-firmware](https://github.com/m0nklabs/fridge-cam-firmware)
- **Training-data burden for YOLO.** The 95% and 90% mAP fridge results used more than 100 images per food item for 80 items. — [Frontiers in AI](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2024.1442948/full)
- **Home Assistant flexibility.** LLM Vision supports local backends (Ollama, LocalAI) as well as cloud providers. — [LLM Vision providers](https://llm-vision.gitbook.io/getting-started/setup/providers)
- **Cloud privacy posture (Anthropic).** Vision images are not used for training and are not stored beyond the request. — [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)

### Inferences

| Option | Accuracy for open-ended grocery inventory | Cost (one household) | Latency | Privacy | Hobbyist effort |
|---|---|---|---|---|---|
| Cloud VLM (Haiku 5.5, Sonnet 5.5, Gemini Flash-Lite, GPT-5.4 nano/mini) | Best available; reads labels; handles thousands of products with no training | About C$0.2–1/month on the cheapest tiers, about C$4–20 on Sonnet 5.5 (Q7) | Seconds per scan (not measured) | Photos leave the house. Anthropic says no training and no retention for vision images | Lowest: one HTTPS call plus a schema |
| Local VLM on a home PC (Qwen3-VL 8B, Gemma 4) | Below frontier models; small variants less predictable; weaker document reading | Electricity plus a GPU you already own | Depends on GPU; not measured | Fully local | Medium: Ollama setup, model updates, a GPU box running |
| Local VLM on phone | Not researched | — | — | Local | High |
| YOLO-family detector, custom-trained | 90–95% mAP on a closed set of trained items in controlled tests; nothing outside the set | Free to run | Fast | Local | High: label 100+ images per item; retrain when products change |
| ESP32 TinyML (Edge Impulse) | A few classes; 71–99% depending on positioning; can't read labels | Free | Fast | Local | Medium; can't scale to an open inventory |

- **Recommendation.**
  - In Phase 1, use cloud vision behind a provider-neutral interface.
  - In Phase 2, the ESP32 should capture photos (with the LED on, triggered by the door sensor), check locally whether anything changed, and upload to the same pipeline. Don't run recognition on it.
  - Consider local Qwen3-VL or Gemma only if you already run a GPU machine around the clock and want photos to stay home. Benchmark it on the Q2 eval set before switching.
- **Cost of going local.** Because cloud cost per scan is a fraction of a cent on cheap tiers, local inference only saves money if the hardware is already paid for and powered on anyway.

### Gaps
- I found no head-to-head accuracy test of local and cloud models on fridge photos.
- I found no measured per-scan latency for cloud or local models.
- I didn't confirm VRAM requirements for Qwen3-VL 8B or Gemma 4.
- I didn't research open-vocabulary detectors (YOLO-World, Grounding DINO, OWL-ViT) or phone on-device VLMs.
- I didn't check ESP32-CAM sensor resolution or low-light behavior in this research.

---

## Q6. How well do VLMs parse grocery receipt photos, especially abbreviated Canadian receipts, and does receipt data help the photo pipeline?

### Takeaway
VLMs read clean receipt photos well:
- about 97% field-level accuracy, an anecdotal figure
- 87% for the best image-native model on a scanned-receipt benchmark, against 47% when the receipt is first converted to text with OCR

Abbreviated item names are the weak spot. A per-store alias dictionary that grows from user corrections works well in small tests. I found no evidence specific to Canadian grocers, and no study measuring whether receipts improve photo accuracy. Even so, receipts are the most reliable source of first-seen (purchase) dates and good canonical names.

### Cited Findings
- **Image-native beats OCR-then-LLM.** On scanned receipts, the best model working directly on the image reached **87.46%**, against **47.00%** for the best result from parsed text. The authors call the conversion step the bottleneck. — [arXiv 2509.04469](https://arxiv.org/pdf/2509.04469)
- **ReceiptBench.** 10k real-world receipts with 19 fine-grained fields. Its evaluation uses a semantic judge so that abbreviated names can count as correct. — [arXiv 2605.22413](https://arxiv.org/html/2605.22413v1), [ACL 2026 version](https://aclanthology.org/2026.acl-long.2135.pdf)
- **[Anecdotal] Photo quality matters.** Clean, flat, well-lit receipt photos parse correctly about 97% of the time at the field level. Crumpled or folded receipts drop to about 85–90%. — [DadOps blog](https://daddaops.com/blog/llm-receipt-parser/)
- **Abbreviation dictionary (tempo PR #66).**
  - A layered dictionary maps strings like "PUB GRK YOG 0%" to a canonical food.
  - Its test set was 161 labelled lines: real Publix lines plus synthetic Walmart, Target and Costco lines. It scored 100% on both readable name and canonical food, but the set is small and self-labelled.
  - On three real receipts, the number of false items varied, and in one photo a second receipt overlapped the first.
  - The PR also adds multi-photo receipts.
  - Source: [tempo PR #66](https://github.com/nicoladebbia/tempo/pull/66)
- **Reference context helps listing.** Adding catalog images helped multimodal models list basket items. This suggests that known purchases fed in as context could help with naming, but it is an analogy, not a test. — [arXiv 2501.04150](https://arxiv.org/pdf/2501.04150)
- **Costco Canada digital receipts.**
  - The Costco app and costco.ca show receipts for in-warehouse and online purchases, under Account > Orders & Purchases > "In-Warehouse" tab. Membership verification is required.
  - Sources disagree on how far back history goes: about 2 years, versus history starting in March 2021 at launch.
  - I couldn't confirm an itemized export. A third-party guide suggests Print > Save as PDF.
  - The 2021 launch articles are old.
  - Sources: [Costco.ca app](https://www.costco.ca/costco-app.html), [Cocowest](https://cocowest.ca/2021/10/new-costco-in-warehouse-receipt-history-on-costco-ca-and-mobile-app/), [iPhone in Canada](https://www.iphoneincanada.ca/2021/11/24/costco-mobile-app-now-lets-you-view-receipts-for-warehouse-online-purchases/), [Shoeboxed](https://www.shoeboxed.com/blog/costco-receipt)
- **PC Optimum (Loblaw banners, including Real Canadian Superstore) [OLD].** A Loblaws store post from about six years ago announced optional e-receipts for PC Optimum members. A 2020 forum thread notes receipt formats differ between banners. — [Loblaws post](https://www.facebook.com/loblawsburnhamthorpe/videos/be-e-receipt-ready/476247379863891/), [RedFlagDeals thread](https://forums.redflagdeals.com/pc-optimum-discussion-thread-2020-2348789/86/)

### Inferences
- **Receipt pipeline:**
  1. Send the receipt photo, or several photos for long receipts, to the same model with a small receipt schema: `store`, `date`, and `lines[]` containing `raw_text`, `qty`, `price`, `canonical_guess`, `category`, `is_food`, `confidence`.
  2. Look up each `raw_text` in a **per-store alias table** before trusting the model's guess.
  3. For an unknown abbreviation, ask once ("What is '<raw text>'?") and save the answer. After a few weeks the table covers your usual basket.
- **How receipts help the photo pipeline:**
  - a. Pass "expected arrivals" (canonical names and quantities) into the next fridge or pantry scan prompt as naming hints.
  - b. Set `first_seen` to the purchase date when a new photo observation matches a receipt line.
  - c. Get quantity hints, such as "2 x milk 4 L".
  - d. Pantry and freezer items bought but never photographed can be added from the receipt alone as "probably have".
- **Effort.** Try the Costco app and website receipt history before photographing paper receipts. Other banners' e-receipt options weren't confirmed.
- **Cost.** A receipt photo is about 2–5K image tokens, which is negligible on any cheap tier (Q7).
- **Keep receipts optional.** Treat them as a helper, never a requirement: not every shop gives a usable receipt, and household items like toiletries need filtering out (`is_food`).

### Gaps
- I found no source documenting abbreviation conventions or VLM accuracy for Real Canadian Superstore, Save-On-Foods, Sobeys/Safeway, Costco Canada or Co-op receipts.
- I found no information on Save-On-Foods More Rewards, Scene+ (Sobeys/Safeway) or Co-op e-receipts, or on any grocer offering an itemized export or API.
- I found no study measuring how much receipt data improves photo-based inventory accuracy.
- Current PC Optimum e-receipt availability is unverified; the sources are 2020-era.

---

## Q7. Rough monthly API cost for one household (2–4 scans/day, 3–6 photos/scan) at a couple of model tiers

### Takeaway
At household volume, cost isn't a real constraint. With photos resized to 1568 px, the monthly bill is roughly:

| Model | Light use, USD/month | Heavy use, USD/month |
|---|---|---|
| Claude Haiku 5.5 | $0.16 | $0.52 |
| Gemini 3.1 Flash-Lite | $0.39 | $1.24 |
| GPT-5.4 nano | $0.37 | $1.22 |
| Claude Sonnet 5.5 | $3.19 | $10.47 |
| Claude Opus 5.5 | $6.37 | $20.93 |

That is about C$0.2–0.7, C$4.5–15 and C$9–29 for Haiku, Sonnet and Opus. Accuracy and how easy the app is to use matter far more than the model's price.

### Cited Findings
- **Prices.**
  - Claude Haiku 5.5: $0.10 / $0.50 (prompts up to 100K tokens). Sonnet 5.5: $2 / $10. Opus 5.5: $4 / $20.
  - Batch: 50% off.
  - Cache hits: 0.1x, or 0.05x on Opus 5.5 and Sonnet 5.5.
  - Source: [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  - Gemini 3.1 Flash-Lite: $0.25 / $1.50 per Google's page via a search snippet. — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
  - [AGG] Gemini 3.5 Flash-Lite: $0.30 / $2.50. — [Artificial Analysis](https://artificialanalysis.ai/models/gemini-3-5-flash-lite)
  - [AGG] Gemini 3 Flash: $0.50 / $3.00. — [MorphLLM](https://www.morphllm.com/gemini-api-pricing)
  - GPT-5.4 nano: $0.20 / $1.25. GPT-5.4 mini: $0.75 / $4.50. — [OpenAI launch post](https://openai.com/index/introducing-gpt-5-4-mini-and-nano/)
- **Image tokens.**
  - Claude: `ceil(w/28) x ceil(h/28)`, capped at 4,784 on the high-res tier. — [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
  - Gemini 3 default: 1,120 tokens per image. — [Google Cloud: Get started with Gemini 3](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/start/get-started-with-gemini-3)
  - OpenAI: 32-px patches x a model multiplier. — [OpenAI Images and vision guide](https://developers.openai.com/api/docs/guides/images-vision)
- **Exchange rate.**
  - exchange-rates.org: 1 USD = 1.4247 CAD on 2026-10-02 (1.4226 on 2026-10-01). — [exchange-rates.org](https://www.exchange-rates.org/exchange-rate-history/cad-usd-2026-10-02)
  - YCharts (Fed H.10 series): about 0.7213 USD per CAD on 2026-09-11, roughly 1.39 CAD per USD. — [YCharts](https://ycharts.com/indicators/canadian_dollar_to_us_dollar_exchange_rate)
  - The sources disagree, so I used 1.40 below.

### Inferences

#### Assumptions (my estimates, not sourced)
- **Text input per scan: about 4,500 tokens.** That is a stable system prompt and schema of about 1.5K plus the previous inventory and catalog of about 3K, for roughly 100 items in compact JSON.
- **Output per scan: about 3,000 tokens (light) to 5,000 tokens (heavy).** This covers the JSON for 30–100 observations plus some thinking at `effort: low`.
- **Photos resized to 1568x1176:**
  - Claude: 2,352 tokens.
  - Gemini 3: 1,120 tokens at the default setting.
  - OpenAI: about 2,500 tokens, assuming 1,813 patches x a multiplier of about 1.4. This is uncertain.
- **Light use:** 2 scans/day x 3 photos, which is 60 scans and 180 photos per month.
- **Heavy use:** 4 scans/day x 6 photos, which is 120 scans and 720 photos per month.
- Calculated with a script using the published per-token prices; CAD at 1.40.

#### Results (USD per month, with approximate CAD)

| Model | Light (60 scans, 3 photos) | Heavy (120 scans, 6 photos) | Per scan (heavy) |
|---|---|---|---|
| Claude Haiku 5.5 | $0.16 (C$0.22) | $0.52 (C$0.73) | $0.0044 |
| Gemini 3.1 Flash-Lite | $0.39 (C$0.54) | $1.24 (C$1.73) | $0.010 |
| GPT-5.4 nano | $0.37 (C$0.52) | $1.22 (C$1.71) | $0.010 |
| Gemini 3.5 Flash-Lite [AGG price] | $0.59 (C$0.83) | $1.90 (C$2.67) | $0.016 |
| Gemini 3 Flash [AGG price] | $0.78 (C$1.09) | $2.47 (C$3.46) | $0.021 |
| GPT-5.4 mini | $1.35 (C$1.89) | $4.46 (C$6.24) | $0.037 |
| Claude Sonnet 5.5 | $3.19 (C$4.46) | $10.47 (C$14.65) | $0.087 |
| Claude Opus 5.5 | $6.37 (C$8.92) | $20.93 (C$29.31) | $0.174 |

- **Sending full-resolution phone photos** (about 4,740–4,784 Claude tokens each) instead of resizing:
  - Haiku 5.5: $0.20 to $0.70 per month.
  - Sonnet 5.5: $4.06 to $13.97.
  - Opus 5.5: $8.12 to $27.94 (about C$11–39).
- **Adding the optional verification pass** (Q3) about doubles each figure.
- **Adding receipts** costs about $0.001 (Haiku 5.5) to $0.03 (Opus 5.5) per receipt, assuming about 3K image tokens and 1K output tokens.
- **Phase 2 camera example (illustrative):** 15 door-open snapshots a day, 1 image each at about 1600x1200 (about 2,494 Claude tokens), 1.5K output tokens.
  - Haiku 5.5: about $0.65/month (C$0.91).
  - Sonnet 5.5: about $13/month (C$18).
  - Skipping unchanged frames locally (Q3) cuts this a lot.
- **Cost levers, in order:**
  1. Resize photos before upload.
  2. Use `effort: low` and keep the previous inventory in the prompt compact.
  3. Use the cheapest model that passes your own eval (Q2).
  4. Send only the inventory for zones covered by this scan.
  5. Use the Batch API (50% off) for non-urgent overnight reconciliation of Phase 2 snapshots. Batch results can take hours, so don't use it for "what do I have?" at the store.
  6. Prompt caching (Haiku 5.5 cache hits $0.01/M) only helps when calls sharing a prefix come within 5–60 minutes, such as a scan followed by a verification pass. Scans hours apart won't hit the cache.
- **Keep Haiku 5.5 prompts under 100K tokens.** The 100K threshold matters if someone sends 20+ full-resolution photos with a large inventory; the whole request then pays 5x. Resizing and limiting zones keep you well under it.

### Gaps
- I didn't verify whether GST (5% in Alberta) or other taxes apply to direct API billing from Anthropic, OpenAI or Google for a Canadian individual.
- Output and thinking token counts per scan are assumptions. Measure `usage` on real scans; thinking use varies by model and effort.
- OpenAI image tokens per photo are approximate because the model multipliers are unverified and conflicting.
- Several Gemini and OpenAI prices are aggregator-sourced and may already be outdated.
