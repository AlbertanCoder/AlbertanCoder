# Multi-camera perception for a retrofit AI fridge: approaches, view fusion, model choice, freshness, human-in-the-loop, cost at scale and trust

> Compiled 2026-10-16. WebFetch and curl were blocked in this environment (DNS failures and proxy 403s on arXiv, MDPI, PMC, DOI and Samsung's newsroom), so every figure below comes from WebSearch result summaries of the cited pages, not full-text reads. Older material is tagged with its year, e.g. [2019]. Model versions are tagged where the source names them. Background from the earlier build guide (`/home/user/AlbertanCoder/reports/AI fridge inventory build guide.md`) is reused, not re-researched: VLMs name groceries well, miscount occluded items and score under 50% at cross-photo object matching; Haiku 5.5 costs US$0.10/$0.50 per million tokens. Where these notes use a guide figure, they cite the guide's original source.

## Approaches: periodic shelf snapshots plus diffing vs doorway "transaction" recognition vs hybrids, and what smart coolers, unattended retail and academic benchmarks report

### Takeaway
Commercial smart coolers and the best academic system both say first-and-last-frame snapshot diffing is not enough. The newest peer-reviewed vending-cabinet study (Aug 2026) raised exact per-transaction accuracy from 64.5% (snapshot diff) to 90.0% by tracking items through the door zone with two cameras. Vendors that claim 98–99.98% work under conditions a household cannot match: a closed catalogue of packaged SKUs, known shelf layouts, controlled lighting, settlement one transaction at a time, and human review behind the scenes. A household retrofit should use a hybrid: door-closed snapshots as the record of what is present, doorway events for direction and timing, and optional weight sensing to confirm changes.

### Cited Findings
**The most directly comparable study: snapshot diff vs doorway tracking (2026)**
- Buriboev et al., *Sensors*, August 2026, "A Dual-Camera Edge Sensing Framework with Zone-Aware Multi-Object Tracking for Sensorless Smart Vending Cabinets." The authors argue that snapshot-difference methods, which compare only the first and last frames of a transaction, "cannot explicitly represent intermediate product motion, such as pickup, return, inspection, occlusion, and shelf resettling." — [Sensors 26(16):5213](https://doi.org/10.3390/s26165213); [PMC copy](https://pmc.ncbi.nlm.nih.gov/articles/PMC13517326/)
- The system, ZAB-Fusion, runs a YOLO11-seg plus RT-DETR detector ensemble with ByteTrack tracking. It projects product tracks into a three-zone vertical model of the cabinet, interprets the compressed zone sequences with a finite-state event classifier, and fuses evidence from both cameras. — [Sensors 2026](https://doi.org/10.3390/s26165213)
- Results against the snapshot-difference baseline: recall rose from 0.665 to 0.925 and F1 from 0.780 to 0.944, with precision of 0.963. **Exact transaction-level receipt accuracy rose from 0.645 to 0.900.** — [Sensors 2026](https://doi.org/10.3390/s26165213)
- The test set was 220 in-service vending transactions across **only seven product classes**, with 227 ground-truth TAKEN events and 87 RETURNED events. Two human annotators built the ground truth from side-by-side camera footage. — [Sensors 2026](https://doi.org/10.3390/s26165213)
- Runtime on an Intel N100, CPU only: 562 ms per transaction on average. The zone, event-interpretation and fusion stages took about 3 ms combined. Here "sensorless" means no RFID, weight sensors or load cells. — [Sensors 2026](https://doi.org/10.3390/s26165213)

**The commercial taxonomy and vendor claims (all self-reported; no independent audits found)**
- Smart vending fridges fall into four types: static vision (shelf images), dynamic vision (cameras that track hand and product motion while the door is open, to separate taking from returning), gravity/weight, and RFID. — [basic.ai explainer](https://www.basic.ai/blog-post/computer-vision-for-smart-vending-machines-how-it-works-models-data-and-annotations); [Neuroshop](https://neuroshop.tech/blog/how-ai-vending-machines-work)
- A Chinese cabinet maker says of weight sensing: "if different products have the same weight, they cannot be accurately identified." The same maker claims RFID accuracy is "almost 100%" (a marketing claim). — [Micron Vending](https://www.micronvending.com/Unmanned-vending-machine-have-their-own-advantages.html)
- A Chinese patent (CN111815852A) describes a dual-mode image-plus-gravity system for door-opening self-service cabinets. Its stated aim is "abnormal shopping situations," where image-only and gravity-only methods perform poorly. — [Patent CN111815852A](https://eureka.patsnap.com/patent-CN111815852A)
- Vendor accuracy claims:
  - VMFS AI cooler, weight plus vision: "up to 99%" — [VMFS](https://vmfsusa.com/products/ai-smart-cooler-vending-machine)
  - ReyVend, cameras only: ">99%" identification, attributed to "field data from mixed lighting scenarios and real-life targeted theft attempts" — [ReyVend](https://reyvend.com/products/smart-cooler)
  - SHEKEL Innovendi, weight only: 99.98% — [SHEKEL](https://www.shekel.ai/blog/inside-the-technology-turning-europes-smart-cooler-into-an-autonomous-retail-machine/)
  - An Alibaba buying guide claims "100% billing accuracy" for vision plus weight, but notes it "requires stable lighting and minimal shelf clutter" — [Alibaba guide](https://electronics.alibaba.com/buyingguides/smart-cooler-vending-machine-guide-what-to-choose-in-2026)
  - 365 Retail Markets' PicoCooler Vision publishes no accuracy figure — [eVending listing](https://evending.com/products/365-retail-markets-picocooler-vision-ai-smart-cooler)
- Neuroshop says about 98% of cases are decided by the device and low-confidence cases go to a human. — [Neuroshop AI micromarkets](https://neuroshop.tech/ai-micromarkets)

**Weight and vision fusion in cashier-less retail [2019–2020]**
- AIM3S [2019, ACM BuildSys] uses weight sensing on each shelf. The location and absolute weight change of an event identify candidate items, fused with visual identification once the item is in the customer's hand, plus prior knowledge of the item layout (planogram). It achieved **up to 93.2% item identification vs 86% reported for self-checkout stations**, on 85 items (33 unique products) in a mock-up replicating a 7-Eleven layout. — [ACM DL](https://dl.acm.org/doi/10.1145/3360322.3361018); [ResearchGate](https://www.researchgate.net/publication/337044740_AIM3S_Autonomous_Inventory_Monitoring_through_Multi-Modal_Sensing_for_Cashier-Less_Convenience_Stores)
- FAIM [2020], from the same group, reports up to 92.6% item identification, "a 2× reduction in error compared to reported self-checkout stations." — [ResearchGate](https://www.researchgate.net/publication/345656446_FAIM_Vision_and_Weight_Sensing_Fusion_Framework_for_Autonomous_Inventory_Monitoring_in_Convenience_Stores)
- A 2025 paper notes that AIM3S relies on specialised weight-sensing plates that are "costly to deploy" in place of conventional shelves. It proposes estimating weight change from audio-induced shelf vibrations instead. — [WeVibe, arXiv 2502.12093](https://arxiv.org/pdf/2502.12093)
- A smart-shelf study paired load cells with a camera and matched customers to product events using RANSAC and particle filtering. It reached about **76% recall** against shopping lists. — [Smart Shelf System, PMC10820466](https://pmc.ncbi.nlm.nih.gov/articles/PMC10820466/)
- Amazon Just Walk Out [2024] replaced its earlier sequential pipeline with a multi-modal foundation model. The model analyses overhead cameras, shelf weight sensors, floor plans or 3D planograms, and catalogue images together. Amazon claims better accuracy with obstructed cameras, poor lighting and crowded aisles, and says hard cases are fed back into training. **No accuracy figures were published.** — [AWS ML blog](https://aws.amazon.com/blogs/machine-learning/enhancing-just-walk-out-technology-with-multi-modal-ai/); [About Amazon](https://aboutamazon.com/news/retail/amazon-just-walk-out-improves-accuracy); [HKU summary](https://aihub.hkuspace.hku.hk/2024/09/24/enhancing-just-walk-out-technology-with-multi-modal-ai/)

**Academic benchmarks**
- RPC, the Retail Product Checkout dataset [2019, Megvii]: 200 SKUs and 83,739 images. Four metrics: checkout accuracy (cAcc, the share of checkouts that are exactly right), Average Counting Distance (ACD), mean Category Counting Distance (mCCD) and mean Category IoU (mCIoU). The authors call cAcc the most important because it reflects practicality. — [arXiv 1901.07249](https://arxiv.org/pdf/1901.07249); [EqualOcean](https://www.equalocean.com/analysis/201902021398-megvii-launches-largest-checkout-dataset)
- RPC progression in averaged cAcc:
  - Best original baseline (Syn+Render): 56.68%
  - DPNet [ACM MM 2019]: 80.51%
  - DPSNet [IEEE TMM 2020]: 88.14%
  - E2MF2Net [J. Imaging 2025, self-reported]: 98.52% easy, 97.95% medium, 96.52% hard, **97.62% average**

  These are static, top-down checkout-counter images, the best case for vision. — [DPNet repo](https://github.com/isrc-cas/ACM-MM-2019-ACO); [DPSNet / Iterative Knowledge Distillation PDF](https://isrc.iscas.ac.cn/zhanglibo/pdfs/2020/IEEE_Transactions_on_Multimedia.pdf); [E2MF2Net](https://doi.org/10.3390/jimaging11100337)
- "Towards New Retail" [IEEE TII 2019]: beverage purchases filmed in a refrigerator fitted with a wide-angle smart camera, an HD camera and a fisheye camera. It has 34,052 images across 10 beverage categories with 155,153 boxes. The task is split into static object detection and dynamic classification during the purchase (3,046 dynamic images), and 10 models were benchmarked. The per-model numbers were not retrieved. — [Preprint PDF](https://dl2link.com/Selected%20Journal%20Publications/Towards%20New%20Retail%20A%20Benchmark%20Dataset%20for%20Smart%20Unmanned%20Vending%20Machines.pdf); [OpenAlex record](https://api.openalex.org/works/doi:10.1109%2FTII.2019.2954956). The earlier guide cited this work for recognition accuracy dropping while items are in motion.
- "Smart Refrigerator Inventory Management Using CNNs" [IEEE 2021] used several wide-angle cameras, with side-mounted cameras checking items coming in and going out. Using multiple cameras improved recognition. It covered 25 object types, mostly fruit and drinks. A 2023 University of Passau thesis review reports **84.63% accuracy with YOLOv3** (secondary source). — [IEEE Xplore 9458527](https://ieeexplore.ieee.org/document/9458527); [Passau MA thesis](https://www.fim.uni-passau.de/fileadmin/dokumente/fakultaeten/fim/lehrstuhl/sauer/geyer/BA_MA_Arbeiten/MA-BokhariMohamed-202305.pdf); [Wikipedia: Smart refrigerator](https://en.wikipedia.org/wiki/Smart_refrigerator)
- A home grocery-tracking paper [IEEE WI-IAT 2023] used YOLO plus synthetic data from 360° product videos, which helped accuracy. It notes that "retail groceries data is very well organized compared to the home groceries dataset, which makes it difficult to predict accurately." — [arXiv 2312.12486](https://arxiv.org/abs/2312.12486)
- An ESP32-CAM smart-fridge paper [2025] reports that "overlapping items and occluded views hinder accurate identification and counting." — [arXiv 2509.07400](https://arxiv.org/abs/2509.07400)
- From the earlier guide, on counting partly hidden objects: GPT-4o had a 14.75% error rate where humans were near-perfect, and all models got worse with occlusion. — [CAPTURe, ICCV 2025](https://openaccess.thecvf.com/content/ICCV2025/papers/Pothiraj_CAPTURE_Evaluating_Spatial_Reasoning_in_Vision_Language_Models_via_Occluded_ICCV_2025_paper.pdf)

**Industry status, as context for "solved commercially"**
- Grabango shut down in late 2024 after failing to raise funding. Coverage describes weak retailer demand for expensive checkout-free systems. Amazon scaled Just Walk Out back in its own grocery stores (replacing it with Dash Carts) and now sells it mainly to venues such as stadiums and airports. — [Payments Dive](https://www.paymentsdive.com/news/grabango-ceases-operations/729589/); [The Spoon](https://thespoon.tech/cashierless-checkout-pioneer-grabango-shuts-down-after-failing-to-secure-additional-funding/); [Retail Dive](https://www.retaildive.com/news/checkout-free-payments-may-rise/750270); [The Sizzle summary](https://share.thesizzle.com.au/amazon-to-stop-using-just-walk-out-tech-in-supermarkets-70-of-transactions-were-human-reviewed.html)

### Inferences
- **The retail numbers rest on constraints a home lacks.** Seven product classes (the 2026 study), 33 products with a planogram prior (AIM3S) or 200 packaged SKUs (RPC) give a closed catalogue. A household fridge holds loose produce, leftovers in opaque tubs, half-used jars and items moved by several people. Vendor figures of 98–99.98% should not be read as achievable for a retrofit.
- **Retail settles each transaction separately; a fridge inventory carries errors forward.** If each add or remove event is right with probability p and a household makes about 15 changing events a day, the whole day's list stays exactly right with probability p^15:

  | Per-event accuracy p | Day stays exactly right (15 events) | Week stays exactly right (105 events) | Expected wrong events per week |
  |---|---|---|---|
  | 0.99 | 0.86 | 0.35 | 1.1 |
  | 0.98 | 0.74 | 0.12 | 2.1 |
  | 0.95 | 0.46 | ~0.005 | 5.3 |
  | 0.90 (the 2026 paper's exact-transaction accuracy) | 0.21 | ~0 | 10.5 |

  Calculated here. A doorway-only system therefore needs periodic reconciliation, for example a re-read of the door-closed shelf snapshots, to correct the drift.
- **Snapshots alone fail differently.** They cannot see items hidden behind others. They also confuse "taken, used and put back" (milk) with "untouched," and "moved" with "removed plus added." Returns were 87 of 314 events (28%) even in vending (calculated from the 2026 paper's counts). Take, use and return is plausibly more common at home.
- **Recommended hybrid for a retrofit, mirroring commercial static, dynamic and weight hybrids:**
  1. Door-closed, evenly lit per-zone snapshots as the record of what is present.
  2. On-device doorway event detection for direction, timing and an in-hand view of labels.
  3. Optional per-shelf weight change to confirm "something was added or removed on shelf X, and roughly how much."
  4. Receipts and one-tap user answers to settle identity.
- **Realistic accuracy for a home (an estimate, not measured):**
  - Category-level naming of clearly visible packaged goods and common produce should be high.
  - Single-item event direction could approach the 2026 paper's 0.94 F1 in good conditions.
  - An exactly correct full list on any given day will fall well below 90% without reconciliation and user confirmation.
- **Failure modes the sources name:** occlusion and overlapping items ([arXiv 2509.07400](https://arxiv.org/abs/2509.07400)), returns and inspections ([Sensors 2026](https://doi.org/10.3390/s26165213)), lighting and clutter ([Alibaba guide](https://electronics.alibaba.com/buyingguides/smart-cooler-vending-machine-guide-what-to-choose-in-2026)), same-weight products ([Micron](https://www.micronvending.com/Unmanned-vending-machine-have-their-own-advantages.html)) and motion ([TNR, via the guide](https://dl2link.com/Selected%20Journal%20Publications/Towards%20New%20Retail%20A%20Benchmark%20Dataset%20for%20Smart%20Unmanned%20Vending%20Machines.pdf)). No source quantified each failure mode's share of errors.

### Gaps
- No public head-to-head comparison of static vision, dynamic vision, weight and RFID on the same transactions was found.
- The per-model static vs dynamic results of Towards New Retail were not retrieved, so the size of the "motion penalty" is unquantified here.
- No independent audit of any smart-cooler accuracy claim (98–99.98%) was found. All vendor numbers come from undescribed tests.
- No public benchmark of household fridge transactions exists: open catalogue, several users, leftovers.
- A paper titled "Real-Time Small Retail Product Detection in Low-Light Intelligent Cabinets Under Complex Backgrounds" ([PMC13210943](https://pmc.ncbi.nlm.nih.gov/articles/PMC13210943)) shows low light is an active problem, but its numbers were not retrieved.
- The camera placement in the 2026 two-camera cabinet was not retrieved.

## Fusing views: deduplicating one item seen by several cameras, tracking identity over days, handling moved items, and confirming changes with weight, receipts or the user

### Takeaway
Matching the same object across camera views by appearance is an unsolved, hard problem. Identical-looking objects defeat popular methods, and VLMs score under 50% on it. So a fixed-camera fridge should deduplicate with geometry: calibrate each camera once, then map every detection to a shelf-zone position. The model should not be asked "are these the same item?" Identity over days should rest on position continuity, label text and code-side merge rules. Weight changes, receipts and one-tap confirmations then settle what is left.

### Cited Findings
- MessyTable [ECCV 2020]: 5,579 cluttered-table scenes and 50,211 images, each scene shot by nine cameras. The task is matching each object instance across views. With identical-looking objects, a method must "search for neighbouring cues in the vicinity of the objects," but those cues "can be occluded and highly non-rigid with changing relative position due to different camera views." The "seemingly simple task surprisingly fails many popular methods or heuristics that we assume good performance in object association." — [arXiv 2007.14878](https://arxiv.org/abs/2007.14878); [ECCV page](https://www.ecva.net/papers/eccv_2020/papers_ECCV/html/1276_ECCV_2020_paper.php)
- From the earlier guide: on judging whether two images show the same physical object, **no multimodal model exceeded 50% accuracy** (MMVM). — [arXiv 2501.04670](https://arxiv.org/pdf/2501.04670)
- From the earlier guide: on change detection across consecutive images, Gemini reached 76.56% average precision vs 26.52% for a CLIP-similarity baseline. **A self-check prompt raised precision from 57.83% to 81.74%** (mostly 2024–25 models). — [Visual Chronicles, arXiv 2504.08727](https://arxiv.org/html/2504.08727v3)
- The 2026 vending study resolves the two cameras' views through a shared three-zone cabinet model. Each camera's tracks are mapped into zones, the zone sequences are read by a finite-state machine, and the two cameras' events are fused. The authors credit "explicit motion semantics and auditable cross-camera fusion" for the gain. — [Sensors 2026](https://doi.org/10.3390/s26165213)
- A multi-camera unmanned-kiosk method uses a view-aware classifier and aggregates detections across views. Only a summary was available. — [IEEE Sensors Alert](https://ieee-sensorsalert.org/articles/a-retail-object-classification-method-using-multiple-cameras-for-vision-based-unmanned-kiosks/)
- A multi-camera inventory patent stitches images with depth and product-ID data into an inventory map. It does not say how duplicate detections are merged. — [WO2018005369A1](https://patents.google.com/patent/WO2018005369A1/en)
- The IEEE 2021 smart fridge found recognition improved when several cameras observed items entering and leaving. — [IEEE Xplore 9458527](https://ieeexplore.ieee.org/document/9458527)
- Weight as a confirming signal: AIM3S fuses shelf location and the absolute weight change of an event with vision and a layout prior. Weight alone cannot tell same-weight products apart. — [AIM3S](https://dl.acm.org/doi/10.1145/3360322.3361018); [Micron Vending](https://www.micronvending.com/Unmanned-vending-machine-have-their-own-advantages.html)
- Amazon's 2024 Just Walk Out model learns jointly from cameras, weight sensors, planograms and catalogue images, rather than fusing them by hand-written rules. — [AWS ML blog](https://aws.amazon.com/blogs/machine-learning/enhancing-just-walk-out-technology-with-multi-modal-ai/)
- Receipts, from the earlier guide: a model reading the receipt image directly scored **87.46% vs 47.00%** for an OCR-first pipeline. — [arXiv 2509.04469](https://arxiv.org/pdf/2509.04469)
- Code-side merge rules from the earlier guide, which assume single-scan snapshots:
  - `first_seen` never changes once set.
  - Missing items accumulate miss counts: "not sure", then "probably gone".
  - Within one session, an item vanishing from one zone while the same name appears in another counts as a move and keeps its date.
  - Only a person marks an item gone, used or tossed.
  - The confirmation queue is capped at 3–5 cards.

  — [Earlier build guide](/home/user/AlbertanCoder/reports/AI%20fridge%20inventory%20build%20guide.md)

### Inferences
- **Deduplicating across cameras:** fixed, rigidly mounted cameras allow a one-time calibration per installation, such as per-camera shelf-plane mappings or zone masks drawn in the app. Each detection is mapped into one fridge-wide coordinate frame (shelf, left-right position, depth band if visible).
  - Detections are merged when their mapped footprints overlap and their categories agree.
  - Identical items (three yogurt cups) are counted by distinct footprints, not names.
  - The VLM's job is naming a cropped item, not deciding whether two views show the same object. MessyTable and MMVM show that is the weakest skill.
- **Identity over days:** treat "same footprint, same name, unchanged between two consecutive door-closed snapshots" as the same lot. Visual re-identification after a move is unreliable, so:
  1. Moves within one door-open session are resolved by doorway tracking: the item left zone A and entered zone B in the same session.
  2. Otherwise, a disappearance in one zone matched by an appearance of the same name elsewhere within N minutes is treated as a move.
  3. When unsure, **keep the older `first_seen`**. A too-early "use soon" nudge costs less than a missed spoilage warning.
- **Weight sensing at home:** a retrofit shelf mat or load cell could confirm an add or remove event and its size, for example a 1 kg milk jug coming back 250 g lighter. That lets the system track fill level and tell "used some" from "removed." It cannot name items, and putting load cells under glass shelves is a practical hurdle. No household retrofit data was found.
- **Receipts and confirmations:** a receipt line fixes identity (brand, variety) and purchase date for items added within a few hours of a shopping trip. A user tap is the ground truth of last resort. Each question should take one tap: a thumbnail plus the top 2–3 guesses.
- **Coverage:** a "several cameras" design means roughly one camera per shelf zone plus a doorway view. Closed crisper drawers and door bins stay invisible unless cameras are placed there. Samsung's AI Vision has the same blind spots (see the next section).

### Gaps
- No published system tracks individual food items' identity over days in a household fridge.
- MessyTable's baseline association accuracies, especially for identical-looking instances, were not retrieved.
- No cost or accuracy data was found for retrofit shelf load cells in domestic fridges, or for fusing them with cameras outside retail.

## Model choice: general vision-language models vs trained detectors, mixing on-device detection with cloud identification, latency, and what is known about Samsung's Gemini-based AI Vision

### Takeaway
Fine-tuned detectors dominate finding and boxing objects, while general VLMs score near zero on unfamiliar zero-shot detection benchmarks. VLMs dominate open-vocabulary naming and label reading. The natural split is a small on-device detector or change trigger for "where and when," a cloud VLM for "what," and deterministic code for "what changed." Edge hardware such as a Pi 5 with a US$70 Hailo-8L or an Intel N100 runs the detection side at video rate or in under a second per transaction. Cloud latency of a few seconds to about 20 seconds is acceptable for a fridge. Samsung's Gemini version combines a fixed recognition set of about 40 foods with cloud Gemini and OCR for the long tail. It still cannot see door bins or the freezer, and Samsung publishes no accuracy figure.

### Cited Findings
- **RF100-VL** [NeurIPS 2025 Datasets & Benchmarks; published by Roboflow, which sells detection tooling] tests detection on 100 out-of-distribution datasets:
  - Zero-shot mAP: Qwen2.5-VL about 7.7 and Gemini 2.5 Pro about 5.6.
  - GroundingDINO's zero-shot mAP falls from 49.2 on OdinW-13 to 16.0 on RF100-VL.
  - Fully supervised: YOLOv8n 54.9, YOLOv11n 55.3, YOLOv11m 56.5.
  - Fine-tuned GroundingDINO is the best few-shot model, ahead of all YOLO variants by more than 10 points.

  These are 2025-era models. — [arXiv 2505.20612](https://arxiv.org/abs/2505.20612); [NeurIPS PDF](https://papers.neurips.cc/paper_files/paper/2025/file/1013f8ff40a194f3f12a6bcc5221bb34-Paper-Datasets_and_Benchmarks_Track.pdf); [Moonlight review](https://www.themoonlight.io/en/review/roboflow100-vl-a-multi-domain-object-detection-benchmark-for-vision-language-models)
- A bioRxiv 2026 food benchmark ran 10 approaches on 3,229 images. Per the earlier guide, Gemini 3.1 Flash-Lite was best for ingredient recognition at the lowest cost, and Gemini 3.0 Flash led on calorie estimation. A human review of 440 images found **systematic omissions in the original Nutrition5k labels**, meaning raw scores understated the models. — [bioRxiv 2026.07.26.740845](https://www.biorxiv.org/content/10.64898/2026.07.26.740845v1)
- Custom detectors, from the earlier guide: YOLOv8n and a modified YOLACT scored 90–95% mAP on 80 fridge foods, each photographed 100+ times [2024]. An ESP32-CAM model scored 71–99% depending on where objects sat. — [Frontiers in AI 2024](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2024.1442948/full); [ResearchGate ESP32 freezer](https://www.researchgate.net/publication/389362447_Application_of_Edge_Impulse_and_ESP32-CAM_in_Smart_Freezer_Systems_for_Object_Recognition)
- Edge throughput (single-blog benchmarks; test conditions not fully specified):
  - Pi 5 CPU alone: YOLOv8n at 5–8 FPS.
  - AI HAT+ with Hailo-8L (13 TOPS, US$70 list price, Oct 2024): YOLOv8s at 60–80 FPS.
  - Hailo-8 (26 TOPS, US$110): YOLOv8m at 50–60 FPS.
  - AI HAT+ 2 with Hailo-10H (40 TOPS, 8 GB, US$130, Jan 2026): YOLOv8m above 60 FPS.
  - About 6–7 TOPS per watt.

  — [raspberry.tips AI HAT+](https://raspberry.tips/en/raspberrypi-tutorials/raspberry-pi-ai-hat-plus-ai-acceleration); [raspberry.tips AI HAT+ 2](https://raspberry.tips/?p=9674). Third-party prices run higher, e.g. US$119 for the Hailo-8L kit at one retailer — [Yahboom](https://category.yahboom.net/products/ai-kit)
- The full two-camera doorway pipeline (YOLO11-seg + RT-DETR + ByteTrack + fusion) averaged **562 ms per transaction on an Intel N100, CPU only**. — [Sensors 2026](https://doi.org/10.3390/s26165213)
- Cloud time to first token on text prompts (Artificial Analysis; older Haiku 4.5, not 5.5; image inputs not measured):

  | Model and mode | Time to first token |
  |---|---|
  | Claude 4.5 Haiku, non-reasoning | ~0.52 s |
  | Gemini 3.1 Flash-Lite (preview), non-reasoning comparison | ~4.96 s |
  | Claude 4.5 Haiku, reasoning | 17.56–19.44 s |
  | Gemini 3.1 Flash-Lite, reasoning comparison | 6.22 s |
  | **Gemini 3.5 Flash-Lite**, a newer tier than the guide's price table, reasoning comparison | 8.13 s |

  — [AA: 3.1 Flash-Lite vs Haiku 4.5 non-reasoning](https://artificialanalysis.ai/models/comparisons/gemini-3-1-flash-lite-preview-vs-claude-4-5-haiku); [AA: reasoning](https://artificialanalysis.ai/models/comparisons/gemini-3-1-flash-lite-preview-vs-claude-4-5-haiku-reasoning); [AA: 3.5 Flash-Lite](https://artificialanalysis.ai/models/comparisons/gemini-3-5-flash-lite-vs-claude-4-5-haiku-reasoning). One independent blog put Haiku 4.5 near 0.6 s on a medium prompt — [kunalganglani.com](https://www.kunalganglani.com/blog/llm-api-latency-benchmarks-2026)
- From the earlier guide: Haiku 5.5 thinks before answering by default, and its thinking tokens count against `max_tokens`. — [Claude models overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- **Samsung AI Vision Inside, before Gemini [2024–25]:**
  - The in-fridge camera recognised and auto-labelled **37 unobscured fresh food items**. Other items had to be labelled manually; about 50 packaged items could be saved by the user.
  - It "may list unrecognizable food as an unknown item" and "cannot identify or list any food items in the fridge door bins or freezer."
  - Results "vary by manner of placement."
  - "Accuracy not guaranteed; check results."
  - Recognition runs on deep-learning models "updated periodically."

  — [Samsung US refrigerators page](https://www.samsung.com/us/refrigerators/); [Samsung AI products page](https://www.samsung.com/us/ai-products/); [Family Hub overview](https://www.samsung.com/us/explore/family-hub-refrigerator/overview/). "AI Vision Inside 2.0" won a CES 2025 Innovation Award — [CES](https://www.ces.tech/ces-innovation-awards/2025/4-door-refrigerator-with-ai-home-and-ai-vision-inside-20/)
- **Samsung AI Vision built with Google Gemini [2026]:**
  - Unveiled at CES 2026. — [Samsung US Newsroom](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/)
  - Over-the-air rollout began 11 May 2026 on select 32-inch Family Hub models in the US. It is phased to 9-inch displays and other markets through 2026, and a Korean release came a couple of months earlier. — [SamMobile](https://www.sammobile.com/news/samsung-bespoke-ai-refrigerator-family-hub-update-usa-gemini/); [Samsung US Newsroom update](https://news.samsung.com/us/samsung-expands-ai-capabilities-bespoke-ai-family-hub-refrigerators-major-update/)
  - The system "identifies more fresh produce and packaged goods other than its 40 pre-studied items" using cloud intelligence, and OCR "enables accurate identification of a broader range of branded products." — [Samsung Global Newsroom](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates)
  - The camera watches items going in and out to keep a running list. Items may be labelled manually or, if the user turns it on, recognised automatically by Gemini. — [Samsung US refrigerators page](https://www.samsung.com/us/refrigerators/); [Techlicious](https://www.techlicious.com/blog/samsung-bespoke-fridge-vision-ai-with-google-gemini/)
  - Support for personal containers and processed food without registration was reported as *planned*; it was not confirmed live. Headlines claim it reads handwritten labels. — [Analytics Insight](https://www.analyticsinsight.net/home-electronics/how-samsung-is-bringing-google-gemini-to-smart-refrigerators-acs); [Ground News](https://ground.news/article/samsung-electronics-unveils-ai-refrigerator-combining-gemini-and-ai-even-reading-handwritten-labels)
  - The "2,000+ foods" figure appears only in secondary reporting, not in Samsung's own release, and sources disagree on the baseline count (37, 40 or ~100). — [BigGo Finance](https://finance.biggo.com/news/VmHaA50Bh5an-7GhIirK); [VFuture Media](https://vfuturemedia.com/ai/samsung-bespoke-ai-refrigerator-google-gemini-food-recognition/)
  - Techlicious calls the US$3,000+ fridge "a pricey way to use Gemini AI for food tips." — [Techlicious](https://www.techlicious.com/blog/samsung-bespoke-fridge-vision-ai-with-google-gemini/)

### Inferences
- **Division of labour:**
  - **On-device:** door state and a change trigger. A pixel or perceptual-hash difference is enough for door-closed snapshots on an ESP32. Doorway capture needs a small class-agnostic "hand or object crossing" detector plus keyframe and crop selection, which means Pi 5 + Hailo or N100-class hardware.
  - **Cloud VLM:** open-vocabulary naming, reading packaging text, freshness cues and the top-3 guesses for questions.
  - **Code:** diffing, dates, miss counts and deduplication.
  - This appears to match Samsung's split: a fixed set of about 40 recognised items plus cloud Gemini and OCR for the long tail. Samsung does not document where each step runs.
- **Latency tolerance is high for a fridge.** Nobody waits at a till, so 5–20 s reasoning-mode latency is fine, and asynchronous processing within about a minute is enough. A nightly re-check pass could use Anthropic's Batch API at half price, per the guide's source ([Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)).
- **Fine-tune only after real data exists.** Fine-tuning a detector pays off only for recurring, closed sets: a household's staple items, or generic "container / produce bag / bottle" classes for cropping. Identity for an open home catalogue should stay with the VLM until the startup has enough labelled installs to fine-tune.
- **Model churn is real.** Gemini 3.5 Flash-Lite already appears on Artificial Analysis by October 2026, above the guide's Gemini 3.1 Flash-Lite. Keep the model call behind a provider-neutral interface and re-benchmark each quarter on the startup's own labelled fridge set.

### Gaps
- Samsung has not disclosed AI Vision's on-device vs cloud split, the camera's frame selection, or any accuracy figure. No independent hands-on test of the Gemini version's accuracy was found.
- Time to first token with image inputs for Haiku 5.5, Gemini 3.1/3.5 Flash-Lite or GPT-5.4 nano was not found. Artificial Analysis figures are text-only and partly for Haiku 4.5.
- No benchmark tests VLM detection or naming specifically on fridge-interior photos.

## Freshness: what visual spoilage detection achieves vs estimates from time in the fridge, especially for tomatoes, berries and leafy greens in real fridge lighting

### Takeaway
Published visual freshness classifiers report 95–98% accuracy, but on curated lab images of single items. No study measuring accuracy in real fridge lighting with real occlusion was found, and no VLM freshness benchmark was found. Image-based shelf-life tracking has decent evidence only for lettuce browning (an older study). Strawberry and lettuce storage-day prediction is precise with spectroscopy, which a consumer RGB camera is not. Time in the fridge, combined with per-category storage windows, should drive "use soon" flags. Visual cues should only bring an alert forward ("looks like mould — check"), never clear an item as fine.

### Cited Findings
- Lab-image results:
  - A purpose-built CNN, FreshDNN, reached 97.8% validation accuracy on a curated fresh/stale image set — [ResearchGate: Fresh or Stale](https://www.researchgate.net/publication/374137308_Fresh_or_Stale_Leveraging_Deep_Learning_to_Detect_Freshness_of_Fruits_and_Vegetables)
  - Pretrained deep features plus PCA reached 96.98% — [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2665927123002241)
  - A vision-transformer study classified produce as fresh or rotten and predicted shelf life with 96.82% accuracy — [Springer chapter](https://link.springer.com/chapter/10.1007/978-3-032-04222-4_9)
- A fruit-decay detector claims strong performance "under the challenging conditions, such as intense lighting variations and partial image obstructions." It reports no test on images from a different setting. — [PMC11106415](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11106415/)
- A 2025 systematic review of deep learning for freshness assessment exists; its conclusions on generalisation were not retrieved. — [J. Food Science 2025](https://ift.onlinelibrary.wiley.com/doi/full/10.1111/1750-3841.70535)
- **Leafy greens:** in an older study of ready-to-use lettuce [2004], the percentage of brown area measured by digital image analysis correlated with shelf life at r = 0.9194–0.9941 across four treatments, and tracked human visual scores. — [ScienceDirect, Food Research International](https://www.sciencedirect.com/science/article/abs/pii/S0963996904001164)
- Lettuce spectroscopy, not RGB: time in cold storage was predicted with R² 0.80 (RMSE 0.77 days) for inner leaves and R² 0.86 (RMSE 0.66 days) for outer leaves. — [Aquaphotomics, PMC9858011](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9858011/)
- **Strawberries:**
  - Visible/NIR spectroscopy classified storage times of 1, 3, 5 and 7 days with 93.3–97.4% correct classification. Strawberry shelf life is "estimated to be less than 5 days." — [OSTI](https://www.osti.gov/pages/biblio/1472154)
  - UV-VIS-NIR models predicted days in storage with R² of about 0.87 — [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S277250222200083X)
  - An image-analysis study of Marisol strawberries predicted storage day with "high accuracy"; the figure was not retrieved — [PMC10814819](https://pmc.ncbi.nlm.nih.gov/articles/PMC10814819/)
- **VLM zero-shot freshness:** no benchmark found. In an apple-leaf disease study (a related condition-assessment task), fine-tuned GPT-4o slightly beat ResNet-50, but **zero-shot GPT-4o was significantly lower**. — [Frontiers in Plant Science 2025](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2025.1735096/full) (matched to this URL from a search summary; verify)
- Samsung's AI Food Manager uses food lists and **use-by dates** for freshness nudges, a time-based approach. — [Samsung Global Newsroom](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates)
- From the earlier guide, on other sensors:
  - Bosch's BME688 gas sensor with Bosch's own classifier "was not very successful" at identifying spoiled meat — [ResearchGate](https://www.researchgate.net/publication/391822232_A_New_Approach_for_Machine_Learning-Based_Recognition_of_Meat_Species_Using_a_BME688_Gas_Sensors_Matrix)
  - MQ-series gas sensors are specified at 20 °C and 55% humidity — [Winsen MQ-137](https://www.winsen-sensor.com/d/files/semiconductor/mq137.pdf)
  - The guide recommends USDA FoodKeeper and Health Canada storage windows keyed to first-seen dates.

### Inferences
- **RGB sees spoilage late.** Visible browning, mould or collapse appears near the end of shelf life. A camera is better at confirming a problem ("possible mould on strawberries — check") than predicting one days ahead. A dwell-time clock plus category windows gives the earlier "use soon" nudge, and a visual cue can only bring it forward.
- **Fridge images are worse than lab images.**
  - The light is low and uneven unless the camera brings its own.
  - Views are oblique.
  - Berries sit in clamshells, greens in bags or closed crisper drawers (invisible), and tomatoes are often stacked.
  - Lab accuracies of 96–98% should be expected to fall sharply in these conditions. That expectation is unquantified, because no fridge-domain study was found.
- **Produce-specific approach:**
  - **Leafy greens:** the browning fraction is measurable with RGB when visible (lettuce evidence), but bagged greens in drawers will not be visible. Rely on time.
  - **Berries:** shelf life is under about 5 days, so a time-based flag at day 2–3 plus a "visible mould" check is sensible.
  - **Tomatoes:** no tomato-in-fridge evidence was found. Use time-based windows plus colour-change cues only as hints.
- **Safety framing:** a "no visible spoilage" result must never extend a time-based window. Wording should be "check" or "use soon," never "safe."

### Gaps
- No study measures freshness-detection accuracy under real household-fridge lighting, occlusion and packaging.
- No benchmark of zero-shot VLMs (Gemini, Claude, GPT) on produce freshness or spoilage was found.
- No tomato-specific RGB shelf-life evidence was found.
- No validated time-temperature shelf-life models for home fridges were retrieved; the earlier guide's FoodKeeper approach stands.

## Asking the user: active-learning and human-in-the-loop patterns that keep questions rare, and how retail computer-vision companies use human review behind the scenes and at what cost

### Takeaway
Commercial "AI" checkout depends on human review of low-confidence events. Amazon's Just Walk Out reportedly needed humans for about 70% of sales in 2022, against an internal target of 5%. Smart-cooler vendors claim about 1–2% go to review. At published labelling rates of about US$0.05–0.10 per review, human review costs more than a filtered Haiku-tier AI bill once more than roughly 1–5% of events need it. Against the dearest Gemini setup, the crossover is about 7–14%. For a home fridge the natural reviewer is the user. That works only with thresholds based on confidence, questions asked at the moment of the event, one-tap multiple choice and a strict daily budget. Smart-home research shows frequent prompts cause missed answers and label errors.

### Cited Findings
- **Amazon Just Walk Out [reports from April 2024]:**
  - Business Insider and The Information reported about 1,000 workers in India reviewing what shoppers took.
  - In 2022 about **700 of every 1,000 sales** got a manual check, against an internal target of **50 per 1,000**.
  - Reviewers also labelled footage to train the models.

  — [Business Insider (NL)](https://businessinsider.nl/amazons-just-walk-out-technology-relies-on-hundreds-of-workers-in-india-watching-you-shop/); [The Sizzle](https://share.thesizzle.com.au/amazon-to-stop-using-just-walk-out-tech-in-supermarkets-70-of-transactions-were-human-reviewed.html); [PressReader / Savannah Morning News](https://www.pressreader.com/usa/savannah-morning-news/20240414/281586655635466)
- Amazon disputed the characterisation. It said reviewers "validate a small portion of shopping visits by reviewing recorded video clips" and do not watch shoppers live. — [Mirror of news report on Amazon's response](https://rss.boorghani.com/?p=186784)
- Neuroshop:
  - About 98% of cases are decided by the device and low-confidence cases go to a human.
  - In those 98% of cases "the videos never leave the device and get erased automatically."
  - For unclear cases "only 1 video from top-camera is reviewed."

  — [Neuroshop](https://neuroshop.tech/ai-micromarkets)
- ReyVend describes about 99% automated accuracy, with a confidence threshold (e.g. 99%) below which transactions go to human review. — [ReyVend AI vision guide](https://reyvend.com/blogs/ai-vending-machines/ai-vision-guide)
- A competitor, SandStar via its reseller Vendtek, says some overseas machines "rely on rooms full of remote human reviewers who manually verify each transaction after the fact." This is a competitor claim. — [Vendtek](https://vendtek.com/ai-vending-machines/smart-coolers/)
- **Labelling and review cost benchmarks** (vendor pages and freelance listings; indicative only):
  - Simple bounding boxes run about US$0.015–0.10 per box, with a 2025 market table of US$0.03–0.08 per box.
  - Hourly rates of about US$5–7 per annotator hour are quoted.
  - Asian providers are often 30–50% cheaper.
  - Hidden costs (guidelines, QA, rework) can outweigh the headline rate, and a 200–500-item pilot is recommended.

  — [basic.ai cost guide](https://www.basic.ai/blog-post/image-annotation-services-cost); [basic.ai pricing guide](https://www.basic.ai/blog-post/pricing-of-data-labeling-services-complete-guide); [AnnotationBox pricing](https://annotationbox.com/pricing/); [Fiverr listing](https://de.fiverr.com/andrejooste/do-accurate-image-annotation-and-bounding-box-labeling-for-ai-datasets)
- **Smart-home active learning:**
  - Uncertainty sampling cut annotation effort by **a factor of 2–4** across homes and residents — [ResearchGate](https://www.researchgate.net/publication/315367438_Active_learning_with_uncertainty_sampling_for_large_scale_activity_recognition_in_smart_homes)
  - The AALO system prompted residents at intervals of 10–180 minutes, several times a day — [AALO, UVA](https://www.cs.virginia.edu/~stankovic/psfiles/AALO-final.pdf)
  - The MIT dataset's PDA prompted every 15 minutes, which produced missed short activities and label errors — [arXiv 2111.04418](https://arxiv.org/pdf/2111.04418)
  - Systems use a **query budget** traded against tolerable effort, and one bootstrapped system asks for minimal labels only "every few weeks" — [arXiv 2406.14446](https://arxiv.org/html/2406.14446v1)
  - Dialogue-based approaches start a conversation only when the query strategy deems it necessary — [ACM 10.1145/3616017](https://dl.acm.org/doi/full/10.1145/3616017)
  - People often cannot recall what happened at a past timestamp — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1574119216302073)
- **Imperfect-AI acceptance** (Kocielnik, Amershi & Bennett, CHI 2019): two versions of a 50%-accurate meeting-request detector got "vastly different subjective perceptions of accuracy and acceptance" depending on the error type. **The high-recall version (fewer misses) was perceived as more accurate and more acceptable than the high-precision version.** Designs that set users' expectations in advance significantly increased acceptance. — [Microsoft Research](https://microsoft.com/en-us/research/?p=559869); [VT course summary](https://wordpress.cs.vt.edu/cs6724s20/?p=606); [arXiv 2104.03820 review](https://arxiv.org/pdf/2104.03820)
- From the earlier guide: cap the confirmation queue at 3–5 cards per scan, each with a cropped thumbnail. No published data covers how many confirmation cards people tolerate. — [Earlier build guide](/home/user/AlbertanCoder/reports/AI%20fridge%20inventory%20build%20guide.md)

### Inferences
- **Patterns that keep questions rare** (assembled from the sources above; the thresholds are not measured):
  1. **Defer on confidence:** auto-accept high confidence, queue medium, and ask only when the answer changes something the user will see, such as a perishable's identity or its date.
  2. **Ask at the moment:** a phone notification seconds after the door closes, with the crop, beats asking later about "what was this on Tuesday?", given the recall problem.
  3. **One-tap multiple choice** from the VLM's top 2–3 guesses, plus "something else" and "don't track this."
  4. **A daily question budget** (e.g. ≤2–3 a day, batched), with low-value items such as condiments left silently as "unknown item."
  5. **Learn household vocabulary:** once a user names a container "Mom's soup," later matches reuse the name. This is active learning on the household's own data.
  6. **Set expectations at onboarding** (Kocielnik): tell users it will ask a few questions in week one and fewer later.
  7. **Favour recall for spoilage alerts**, because users judge missed items more harshly. Watch false-alarm fatigue too.
- **Hidden human review economics** for a startup (estimated here: US$6 per hour and 30–60 s per review, so about US$0.05–0.10 each, at 450 changing events per household per month):

  | Share of events reviewed | Per household per month | 100,000 households per month |
  |---|---|---|
  | 1% | US$0.23–0.45 (C$0.32–0.63) | US$22.5k–45k |
  | 2% | US$0.45–0.90 (C$0.63–1.26) | US$45k–90k |
  | 5% | US$1.12–2.25 (C$1.57–3.15) | US$112.5k–225k |
  | 10% | US$2.25–4.50 (C$3.15–6.30) | US$225k–450k |
  | 70% (Amazon's reported 2022 rate) | US$15.75–31.50 | US$1.6M–3.2M |

  Above about 1–5% review, human cost exceeds the filtered Haiku-tier AI cost in the next section (S3/S4: US$0.35–1.19 per household per month).
- **Privacy argues against crowd review.** Sending in-home fridge video to remote reviewers is far more sensitive than store footage. The user, who costs nothing per answer but has limited goodwill, should be the reviewer. Store reviewed crops, not video, and Neuroshop-style on-device deletion is a good default.

### Gaps
- Amazon's per-review cost and the reviewers' tooling are not public. Vendor review rates (1–2%) are self-reported.
- No study measures how many questions a day households tolerate from a fridge or inventory app before abandoning it.
- No source gives smart-cooler human-review cost per transaction.

## Cost at scale: AI cost per household per month for 20–40 door openings a day across several cameras, with and without on-device filtering, at 10,000–100,000 households

### Takeaway
On cheap model tiers, a design that filters on the device costs roughly US$0.35–1.20 per household per month on Claude Haiku 5.5, and about US$0.95–3.20 on Gemini 3.1 Flash-Lite (C$0.49–4.52). That is about US$3.5k–12k a month at 10,000 households and US$35k–120k at 100,000 on Haiku. Without filtering, sending a snapshot from every camera at every opening costs 2–4× more. Streaming doorway video frames to the cloud costs about 4–50× more than a filtered design, depending on frame resolution and output length: US$4.9–26 per household per month, or about US$0.5–2.6M a month at 100,000 households. Once frames are filtered, **output and text tokens rather than images dominate the bill**. So the biggest remaining savings come from compact outputs, low reasoning effort and sending only the inventory for the zones that changed.

### Cited Findings
- Published prices per million tokens (input/output), from the earlier guide's verified sources:
  - Claude Haiku 5.5: US$0.10 / $0.50 (prompts up to 100k tokens). The Batch API halves prices. — [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
  - GPT-5.4 nano: US$0.20 / $1.25 — [OpenAI](https://openai.com/index/introducing-gpt-5-4-mini-and-nano/)
  - Gemini 3.1 Flash-Lite: US$0.25 / $1.50 — [Google](https://ai.google.dev/gemini-api/docs/pricing)
- Claude image tokens are ⌈width/28⌉ × ⌈height/28⌉. A 1568×1176 frame is 2,352 tokens, a 512×512 crop is 361 and a 768×576 frame is 588 (calculated from the formula). — [Claude vision docs](https://platform.claude.com/docs/en/build-with-claude/vision)
- Gemini 3 image tokens are set by `media_resolution`: low 280, medium 560, high 1,120 (the default for Gemini 3), ultra-high 2,240. Levels can be mixed per image within one request. Gemini 2.5 used far fewer tokens per image (64 low, 256 medium/high). — [Gemini API: Media resolution](https://ai.google.dev/gemini-api/docs/media-resolution)
- From the earlier guide: prompt caching helps only when calls with the same prefix arrive within 5–60 minutes of each other. — [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Edge accelerators for on-device filtering list at US$70 (Hailo-8L AI HAT+), US$110 (Hailo-8) and US$130 (AI HAT+ 2). — [raspberry.tips](https://raspberry.tips/en/raspberrypi-tutorials/raspberry-pi-ai-hat-plus-ai-acceleration); [raspberry.tips AI HAT+ 2](https://raspberry.tips/?p=9674)
- Gemini 3.5 Flash-Lite exists by October 2026, but its price was not verified in this session. — [Artificial Analysis](https://artificialanalysis.ai/models/comparisons/gemini-3-5-flash-lite-vs-claude-4-5-haiku-reasoning)

### Inferences
- **Cost model** (calculated here, script at `/tmp/claude-0/-home-user/d2ec1871-4d20-59fd-a133-f2878711a6ac/scratchpad/cost_model.py`). Assumptions:
  - 30-day month.
  - 3,000 text input tokens per call (prompt, schema and the compact inventory for the photographed zones).
  - Output of 800 tokens (low effort) or 4,000 tokens (with thinking, close to the guide's 3,000–5,000).
  - Claude frames at 1568×1176 (2,352 tokens) and crops at 512 px (361 tokens).
  - Gemini at high (1,120 tokens) for frames and low (280 tokens) for crops.
  - C$ = US$ × 1.40.

  | Scenario | Haiku 5.5, per household per month | Gemini 3.1 Flash-Lite, per household per month | Haiku at 10k / 100k households per month |
  |---|---|---|---|
  | S1 naive snapshot: 30 openings/day × 4 cameras, every opening | US$1.48–2.92 (C$2.07–4.08) | US$2.76–7.08 (C$3.87–9.92) | US$14.8k–29.2k / US$148k–292k |
  | S2 heavy naive: 40 openings × 6 cameras | US$2.53–4.45 (C$3.55–6.23) | US$4.36–10.12 | US$25.3k–44.5k / US$253k–445k |
  | S3 on-device change filter: 15 changed openings/day × 1.5 changed views | US$0.47–1.19 (C$0.66–1.67) | US$1.07–3.23 (C$1.49–4.52) | US$4.7k–11.9k / US$47k–119k |
  | S4 filter + on-device crops: 15 calls/day × 2 crops | US$0.35–1.07 (C$0.49–1.49) | US$0.94–3.10 (C$1.32–4.34) | US$3.5k–10.7k / US$35k–107k |
  | S5 naive doorway video: 30 openings × 4 cameras × 20 frames (1 fps, 20 s) | US$17.56–19.00 (C$24.59–26.61) | US$21.91–26.23 | US$176k–190k / US$1.76M–1.90M |
  | S6 doorway video at low resolution | US$4.86–6.30 | US$6.79–11.12 | US$48.6k–63.0k / US$486k–630k |

- **Images stop mattering after filtering.** In S4, images are only 2–9% of the bill on either model. The rest is the 3,000-token text prompt and the output. Halving the prompt by sending only the changed zones' inventory and caching the fixed prefix, plus capping output, matters more than image resolution. In S5, images are 77–96% of the cost.
- **On-device filtering pays back fast only for video designs.** Against S5, a US$70–130 accelerator saves roughly US$16–23 per household per month (S5 minus S4), so it repays itself in about 3–8 months. For door-closed snapshot designs (S1 to S3), a free pixel or hash difference on the microcontroller already captures most of the saving.
- **Throughput at scale** (calculated): 100,000 households × 15 calls a day is 1.5M calls a day, about 17 calls per second on average, or about 70 per second at a 4× dinner-time peak. That calls for enterprise rate limits and a queue, but it is not exotic. 10,000 households is about 2 per second on average.
- **Unit economics:** at about C$0.5–4.5 per household per month for AI, a C$5–10 monthly subscription covers the model bill. Hidden human review above a few percent of events (previous section) or re-check passes (which roughly double the cost, per the guide) could erase that margin.
- **Prices are falling.** Cheap-tier prices and model names changed several times in 2026. Treat these figures as an upper bound for the next 12 months, while noting that newer tiers (Gemini 3.5 Flash-Lite) may be priced differently.

### Gaps
- GPT-5.4 nano's per-image token formula was not verified, so it is excluded from the table.
- Real output and thinking token counts for Haiku 5.5 and Gemini 3.x on this task are unmeasured, and they dominate the result. Log them in a pilot.
- Cache-read discounts, storage and egress for photos, and Canadian sales tax on API bills were not checked.
- The share of door openings that change contents (assumed 50%) and the views changed per opening (assumed 1.5) are guesses. No household measurement was found.

## Trust: what accuracy target is realistic for households to trust the list, and how to measure it (metrics and a test protocol with real fridges)

### Takeaway
No study sets a trust threshold for a fridge inventory. The adjacent evidence:
- **Automation research:** aids below about 70% reliability tend to hurt more than help, and the threshold shifts with error type.
- **Imperfect-AI acceptance:** acceptance depends as much on error type and expectation-setting as on raw accuracy.
- **Retail practice:** about 95–99% per transaction is reached only with human review.

A realistic target for a retrofit is to measure and publish per-event and per-item metrics, aim for perishables to be listed and dated correctly at 90–95% or better at weekly audits, keep questions to a few a day, and track it all with a retail-style exactness metric and real-household audits.

### Cited Findings
- Meta-analytic work, usually attributed to Wickens & Dixon [2007], places the line at **about 70% reliability**: below it, automated aids interfere with performance rather than help. Secondary sources say this is an aggregate estimate that shifts with error type (misses vs false alarms), task and outcome measure. — [GMU dissertation: Performance, trust, and workload in automation-aided visual search](https://mars.gmu.edu/items/f2c277ce-39bf-418d-a2dc-1f4b6cec02ee); [UCF paper on unreliable diagnostic aiding](https://stars.library.ucf.edu/scopus2015/6943)
- Kocielnik et al. [CHI 2019]: at equal 50% accuracy, a high-recall system was perceived as more accurate and more acceptable than a high-precision one, and techniques that set expectations raised acceptance significantly. — [Microsoft Research](https://microsoft.com/en-us/research/?p=559869); [VT summary](https://wordpress.cs.vt.edu/cs6724s20/?p=606)
- Retail operating points:
  - Amazon targeted 95% of sales without human review and reportedly ran at about 30% unassisted in 2022 — [Business Insider (NL)](https://businessinsider.nl/amazons-just-walk-out-technology-relies-on-hundreds-of-workers-in-india-watching-you-shop/)
  - Smart-cooler vendors claim about 98–99%+ with human review of low-confidence cases — [Neuroshop](https://neuroshop.tech/ai-micromarkets); [ReyVend](https://reyvend.com/blogs/ai-vending-machines/ai-vision-guide)
  - AIM3S compared its 93.2% against **86% reported for self-checkout stations** — [AIM3S](https://dl.acm.org/doi/10.1145/3360322.3361018)
- Established metrics:
  - **cAcc** (share of baskets exactly right), **ACD** (average counting distance), **mCCD** and **mCIoU** — [RPC](https://arxiv.org/pdf/1901.07249)
  - Event-level **precision, recall and F1** over TAKEN and RETURNED events, plus **exact transaction-level receipt accuracy**, with two-annotator ground truth from footage — [Sensors 2026](https://doi.org/10.3390/s26165213)
  - Item-identification accuracy — [AIM3S](https://dl.acm.org/doi/10.1145/3360322.3361018)
  - From the earlier guide's test plan: recall (how many real items are found), precision (how many found items are real) and exact-count accuracy for five or fewer units — [Earlier build guide](/home/user/AlbertanCoder/reports/AI%20fridge%20inventory%20build%20guide.md)
- Samsung itself states "accuracy not guaranteed; check results" for AI Vision Inside. — [Samsung US refrigerators page](https://www.samsung.com/us/refrigerators/)
- The only household acceptance study found is small: an Android smart-fridge app evaluated with the Technology Acceptance Model on **35 households over 30 days** (pre/post). Results were not retrieved, and it tested an app, not cameras. — [IJCR](http://jjrip.org/ijcr/en/article/download/4/9)
- **Do not cite:** Alibaba "product insights" pages make claims such as "68% abandon manual logs" and "14% of owners use the camera more than twice weekly," citing studies that could not be verified. — [Alibaba product insights](https://www.alibaba.com/product-insights/smart-fridge-cameras-vs-manual-inventory-logs-do-families-actually-reduce-food-waste-with-ai-detection.html)

### Inferences
- **A realistic target:**
  - Perishables correctly present and dated at 90–95% or better at each weekly audit.
  - Added items named correctly (at the agreed level of detail) at 90% or better.
  - Event recall of 95% or better for adds and removes of perishables, since misses hurt trust more than extra questions (Kocielnik).
  - At most 2–3 questions a day in week one, falling toward under one a day.

  These are design targets inferred from the 70% floor, the Kocielnik findings and retail operating points, not published thresholds. The compounding table in the first section shows why per-event accuracy must sit around 98–99% for a list to stay right for a day without reconciliation.
- **Metrics to adopt:**
  1. Event-level precision, recall and F1 for ADD, REMOVE, RETURN and MOVE (the 2026 study's protocol).
  2. Naming accuracy at a fixed level of detail ("tomatoes" vs "Roma tomatoes"), scored separately for produce, packaged goods and leftovers.
  3. Count error (an ACD analogue).
  4. **List exactness** (a cAcc analogue): the share of audits where the perishables list matches exactly.
  5. **Dwell-time error**: the share of items whose `first_seen` is within 24 h of the true add time, and the rate of "clock resets."
  6. Freshness-alert precision and recall against user-judged spoilage.
  7. Questions per household per day and the answer rate.
  8. Confidence calibration: how often "high confidence" is right, which drives the ask/accept threshold.
  9. Retention: whether households still open the app after 4 and 8 weeks.
- **Test protocol with real fridges:**
  - **Sample:** 10–20 volunteer households across household sizes and fridge layouts (top-freezer, French door), for 4–8 weeks, ideally spanning a humid summer month for lens fog.
  - **Ground truth:**
    - Record all camera footage locally.
    - Have two annotators label events from side-by-side footage, as in the 2026 study.
    - Run a weekly full manual audit: everything out on the counter, photographed and listed.
    - Keep a lightweight purchase log or receipt photos for true add dates.
  - **Results:** report per zone, so blind spots such as door bins and drawers are visible rather than averaged away. Hold the test set fixed so model upgrades can be compared.

### Gaps
- No published accuracy threshold at which households trust or abandon a food-inventory or fridge-camera system was found.
- No published test protocol for camera-based home food inventory exists. The protocol above adapts retail and vending practice.
- Retention and food-waste outcomes for camera fridges (Samsung, FridgeCam) have no credible public data. The figures circulating come from unverifiable aggregator pages.
