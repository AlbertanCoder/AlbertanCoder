# Multi-camera retrofit hardware for an AI fridge-inventory device (state of evidence, October 2026)

Conventions: USD converted to CAD at 1.40. GBP converted to USD at an assumed ~1.27. "[background]" marks a source already verified in the earlier build-guide research (`/home/user/AlbertanCoder/reports/AI fridge inventory build guide.md`), reused here rather than re-searched. Dates are given where the evidence is old. WebFetch and curl were blocked for every source domain tried, so all findings come from search-result summaries. Exact numbers attributed to a page should be re-checked against that page before publication. 32 web searches were used.

## 1. Coverage: how many cameras, placed where, for each fridge type, and how existing multi-camera designs cover

### Takeaway
No single placement sees a whole fridge. Every shipped camera fridge leaves door bins, crisper drawers, the freezer and back rows partly or fully blind: Samsung's 2016 Family Hub (three cameras), Bosch (two), Samsung's AI Vision Inside (one doorway camera) and Smarter FridgeCam (one fisheye). For a retrofit, the workable pattern is static snapshots taken after the door closes:
- one very wide camera (about 140–160° horizontal field of view) per shelf level;
- one camera per crisper drawer;
- door bins covered by a camera that fires at set door angles, by a doorway camera, or by phone scans.

That works out to roughly 4–5 cameras for a top-freezer, 4–6 for a bottom-freezer, 5–8 for a French door and 5–7 for the fresh-food side of a side-by-side. Covering the freezer adds 1–4 heated cameras.

### Cited Findings
**Shipped camera fridges (older items flagged by year)**
- Samsung Family Hub (2016) had three small cameras inside the fridge that photograph the contents each time the door closes, viewable remotely in an app. This was announced at CES and in Samsung's May 2016 US launch ([Samsung Newsroom](https://news.samsung.com/us/?p=8090); [Entrepreneur ME](https://mena.entrepreneur.com/en-ae/technology/ces-2016-highlights-samsung-family-hub/270875); [ProBuilder](https://www.probuilder.com/new-refrigerator-keeps-track-groceries)). An IFA 2016 two-door fridge-freezer version also had three interior cameras ([ERT](https://ertonline.co.uk/news/samsung-to-unveil-family-hob-fridge-freezer-at-ifa/)).
- Consumer Reports' review of an early Family Hub (older) found the following ([Consumer Reports](https://www.consumerreports.org/french-door-refrigerators/samsung-family-hub-refrigerator-review/)):
  - three tiny cameras positioned inside the fridge capture an image each time the doors close;
  - items placed at the far sides of the fridge are likely to go unseen;
  - an item on the door close to the camera can block the view of the interior.
- Samsung support material says the inside camera shoots automatically after the doors close. The shot may take up to 1 minute depending on ambient temperature or humidity, and if the door reopens first no photo is taken ([Samsung support (LatAm)](https://www.samsung.com/latin_en/support/home-appliances/how-do-i-use-and-manage-my-family-hub-app/); [Samsung support (CO) View Inside](https://ushl.samsung.com/co/support/home-appliances/nevecon-family-hub-what-is-and-how-to-use-view-inside)). The search summary did not say which of these two pages carries the sentence.
- A newer Family Hub owner reported seeing only a single camera, mounted above the doors. They said the "door view" image refreshed only when a door was opened wide, and that View Inside became unreliable after a firmware update. This is anecdotal ([SmartThings Community](https://community.smartthings.com/t/samsung-family-hub-camera-door-view/295877)).
- Camera lens specifications vary by Samsung model, and some use one ultra-wide lens ([Appliances Direct](https://appliancesdirect.co.uk/p/a2/rs6ha8880s9/samsung-a2rs6ha8880s9-rs8000-american-fridge-freezer)). Trusted Reviews called a Family Hub's camera of limited use, with a "limited fridge view" ([Trusted Reviews](https://www.trustedreviews.com/reviews/samsung-family-hub-rs6ha8891sl-eu-american-style-fridge-freezer)).
- Samsung AI Vision Inside uses one camera at the top of the cabinet that logs food going in and out. It records nothing put in the FlexZone drawer, the freezer or either door ([Engadget review](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html)) [background]. Owners must hold each item up and wait for a beep, and an item put in a door pocket is read as removed ([Trusted Reviews](https://www.trustedreviews.com/reviews/samsung-bespoke-ai-4-door-french-door-rf90f29aecraa)) [background]. The May 2026 Gemini update recognises more than 2,000 foods and warns based on how long items have been stored ([Engadget 2026](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)) [background].
- Bosch Series 8 (2015, older): two cameras inside take a photo every time the door closes ([Reviewed](https://reviewed.com/refrigerators/news/this-app-shows-you-whats-in-your-fridge)). Which? describes a Bosch American-style model with two cameras, one of them on the fridge door ([Which?](https://www.which.co.uk/news/article/would-you-pay-2800-for-a-fridge-freezer-a8S784W0HehX)). Bosch's own page says "interior door cameras take pictures every time the door is closed" ([Bosch](https://www.bosch-home.com/qa/en/experience-bosch/homeconnect_1/homeconnect-fridges)). Availability varies: the 22" B09IB91NSP lists "Camera: No" ([Mountain High Appliance](https://www.mountainhighappliance.com/refrigeration/built-in/built-in-bottom-freezer-refrigerators/B09IB91NSP/)).
- LG (CES 2026): the LG SIGNATURE Smart InstaView runs ThinQ Food on an internal camera that recognises ingredients ([LG press release](https://www.lg.com/us/press-release/lg-signature-evolves-with-ai-redefining-premium-home-appliances-at-ces-2026)). Coverage describes real-time tracking of items placed in or removed ([The Spoon](https://thespoon.tech/lg-and-samsung-to-show-off-new-food-identifying-smart-fridges-at-ces-next-week/)). A 2025 Smart InstaView French-door model had a built-in AI camera tracking inventory and expiry ([OLED-info](https://oled-info.com/lg-electronics-launches-refrigerator-transparent-oled-display)). Camera placement and door-bin coverage were not found.
- Smarter FridgeCam (2018–19 reviews, older) used a fisheye lens plus LED flash, mounted on the door. Expert Reviews' cons included "can't see everywhere" ([Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review)), and the product is end-of-life ([Scan](https://www.scan.co.uk/products/smarter-sfc01-wifi-fridgecam-with-food-tracking-for-all-fridges-ios-android-alexa-rechargable-white)). Smarter also announced a USB-C-powered FridgeCam Pro aimed at appliance makers ([The Spoon](https://thespoon.tech/fridge-cam-maker-smarter-launches-new-models-at-ces-announces-acquisition-of-chefling/)).
- Hisense R&D, as reported by an RFID vendor, concluded cameras "can only be used as a supplement" because of blocked views and condensation from door openings ([Seiko RFID](https://www.seikorfid.com/news/RFID-ingredient-management-refrigerator.html)) [background].

**Patents that capture at set door angles (dates not checked)**
- In [US10228187B2](https://patents.google.com/patent/US10228187B2/en) the camera does not fire when the door switch first registers opening. It waits until a door sensor reports a specific angle, and the patent notes the door basket can appear in photos.
- A patent family captures several pictures as the door swings, timed to roughly 40°, 65° and 90° ([US10684069](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10684069); also US11009289, US9285162, US11614276, US10386116, US9503635). The assignee was not confirmed in the search results.
- In [US20140313328A1](https://patents.google.com/patent/US20140313328) the camera reads a pattern on the door to estimate the opening angle and compares it with a reference angle.
- [US9915471](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9915471) photographs drawer storage under the shelves while the door is open less than 80°. It keeps the last photo after that, because the door and its fixtures can block the view beyond 80°.

**Unattended-retail coolers (the closest commercial multi-camera analogue)**
- **Static vision** compares shelf images taken before and after a door session and often needs one camera per shelf. It produces false positives when lighting shifts or products are moved, and it misses an item taken and put back within one session. **Dynamic vision** tracks hands while the door is open and can tell a take from a return. Most commercial systems combine the two ([BasicAI](https://www.basic.ai/blog-post/computer-vision-for-smart-vending-machines-how-it-works-models-data-and-annotations)).
- Vendor placement claims (vendor marketing; the search summary did not tie each claim to one page): one vendor says a single camera "placed in the outer door, facing inwards" monitors the shelves. Another cabinet uses two wide-angle cameras mounted inside the top to track what is taken and returned ([Abto Software](https://www.abtosoftware.com/portfolio/product-recognition-for-smart-fridges-and-intelligent-vending-machines); [Neuroshop](https://neuroshop.tech/fridge-vending-machines); [Weimi](https://weimiaivending.com/blogs/news/how-ai-vending-machines-recognize-your-purchases)).
- A Chinese patent describes an image-plus-gravity (weight) dual-mode system for door-opening self-service cabinets ([CN111815852A](https://eureka.patsnap.com/patent-CN111815852A)).
- A 2026 Sensors paper on a "sensorless" dual-camera vending cabinet argues that billing depends on an item's trajectory, not a single frame ([MDPI Sensors 26(16):5213](https://doi.org/10.3390/s26165213)).
- Recognition accuracy drops while items are moving ([Towards New Retail benchmark](https://dl2link.com/Selected%20Journal%20Publications/Towards%20New%20Retail%20A%20Benchmark%20Dataset%20for%20Smart%20Unmanned%20Vending%20Machines.pdf)) [background].
- A 2026 buyer guide says vision-based dynamic systems dominate high-traffic sites. It gives roughly US$8,500–12,000 per vision cooler and says weight sensing stays viable where lighting is inconsistent or budgets are tight ([Alibaba guide](https://electronics.alibaba.com/buyingguides/smart-cooler-vending-machines-2026-buyer%E2%80%99s-guide)).
- Commercial coolers are already converted with retrofit kits: cameras or sensors, a controller, access control, payment and connectivity ([Weimi retrofit guide 2026](https://weimiaivending.com/blogs/news/how-to-transform-a-normal-fridge-into-an-ai-vending-fridge)).

**Academic prototypes**
- A 2023 University of Passau master's thesis used wide-angle cameras mounted on the side of the fridge to detect and track items coming in and going out. Adding cameras improved detection accuracy and helped with hands blocking the view ([Passau thesis PDF](https://www.fim.uni-passau.de/fileadmin/dokumente/fakultaeten/fim/lehrstuhl/sauer/geyer/BA_MA_Arbeiten/MA-BokhariMohamed-202305.pdf)).
- Koporec (Gorenje) and Perš (University of Ljubljana), ICCV Workshops 2019 (older): they surveyed fridge occupancy worldwide, built photo-realistic rendered fridge interiors, and measured detector accuracy (average precision) by occupancy level for two deep models. The household fridge serves as the model case for heavy occlusion ([CVF open access](https://openaccess.thecvf.com/content_ICCVW_2019/html/ACVR/Koporec_Deep_Learning_Performance_in_the_Presence_of_Significant_Occlusions_-_ICCVW_2019_paper.html)). Numerical results were not retrieved.
- Dai (Kyocera, 2024) used a single webcam and found that current approaches "struggle" with occlusions, variable distortions and complex backgrounds ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11652515/)).

**Fridge dimensions for geometry**
- Exterior ranges (the guides disagree; each range was not tied to one page): French door 29–36" wide, 68–72" tall, 28–37" deep, 19–31 cu ft; side-by-side 30–36" wide, 67–70" tall, 29–35" deep, 22.5–31 cu ft; top-freezer 23–36" wide (standard depth 28–33"), 65–69" tall, 24–33" deep ([Whirlpool](https://www.whirlpool.com/blog/kitchen/guide-to-refrigerator-sizes-dimensions.html); [Midea Canada](https://www.midea.com/ca/blog/standard-fridge-size); [Easybear](https://easybear-appliancerepair.com/blog/standard-refrigerator-dimensions)).
- Interior proxies: a crisper-cover glass about 31 × 16 in and a Frigidaire crisper glass about 26 × 15.5 in. The summary did not tie each size to a specific listing or fridge model ([PartSelect W11130203](https://partselect.ca/PS12347522-Whirlpool-W11130203-Glass-Shelf.htm); [PartSelect 297102705](https://partselect.ca/PS3490522-Frigidaire-297102705-Glass-Shelf-Insert.htm)).
- Side-by-side freezer shelves measure about 12.9" wide × 11–13" deep, or 11.75" × 14.75–16.25", on two models ([Whirlpool KRSC700HBS dimension guide](https://api.whirlpoolcentral.ca/_resources/documents/KRSC700HBS_dimension_guide_en.pdf)). A retailer guide's "16–18 in" freezer width conflicts with this.
- With the door closed, a door-mounted lens sits about 10–15 cm from the shelf fronts. The Raspberry Pi Camera Module 3 Wide (102° × 67°) covers about 124 × 66 cm of a back wall 50 cm away ([Raspberry Pi](https://datasheets.raspberrypi.com/camera/sensor-assembly-product-brief.pdf)) [background].

### Inferences
**Geometry (my arithmetic, using the assumed dimensions above)**

Width covered at a given distance = 2·d·tan(HFOV/2), where HFOV is the horizontal field of view.

| HFOV | Width seen at 12 cm (shelf front, door lens) | at 45 cm (back wall) |
|---|---|---|
| 102° (Pi Cam 3 Wide) | ~30 cm | ~111 cm |
| 120° | ~42 cm | ~156 cm |
| 140° | ~66 cm | ~247 cm |
| 160° (fisheye) | ~136 cm | ~510 cm |

- To see a whole shelf front edge from 10–15 cm needs 131–146° for a ~66 cm (26") interior and 138–152° for a ~79 cm (31") interior. A 120° lens sees only the middle ~42 cm, which matches Consumer Reports' "far sides unseen". So 140–160° lenses with dewarping are mandatory for one camera per shelf on wide fridges. Alternatively, use two cameras on shelves 30" or wider.
- Vertical geometry: a lens 15–20 cm above the shelf looks down at about 45–53° on the front row (15 cm away) but only 18–24° on the back row (45 cm). Any front item taller than about 8–13 cm (milk jug, bottles, takeout boxes) hides the base of items behind it.
- More cameras in the same front plane do not fix that depth occlusion. Only a higher, more top-down vantage, a view of each item as it goes in, or the user's phone does. This is the main reason "sees most contents" will be hard to reach in packed fridges.
- Pixel density after dewarping a 160° image: the OV2640 gives about 10 px/degree, roughly 0.9 mm per pixel at 50 cm. That is enough for "yogurt cup" but not date codes. The OV5640 gives about 16 px/degree, roughly 0.5 mm per pixel. Fisheye edges, where the corner items sit, are worse.

**Placement strategies compared**

| Strategy | Cameras | Sees well | Misses / failure modes | Precedent |
|---|---|---|---|---|
| Per-shelf static, cabinet-mounted (shoots after door closes) | 1 per shelf level (2 on ≥30" shelves if lens <150°) | Front and middle rows; stable framing for photo-to-photo diffs; no hands | Back rows behind tall items, door bins, closed drawers; needs own LEDs | Vending "static vision" (one per shelf); fridge-core and m0nklabs single cameras |
| Door-mounted static (lens on door liner, sees shelves when closed) | 1 per shelf level | Same as above; ~10–15 cm farther forward | Door-bin items can block the lens (CR); powering a moving door; cannot see the bins it sits on | Samsung 2016 (3 cameras), Bosch (camera on door), FridgeCam, HNGRYnsite |
| Door-swing capture (fires at set door angles) | 1–2 | Shelves from farther back; door bins when the door is wide open | Depends on users opening the door wide (SmartThings report); motion blur; frame varies by door angle | Patents (40/65/90°; <80° drawer view) |
| Doorway "transaction" camera (top of cabinet, watches items cross the door plane) | 1–2 | Every item at insertion, unoccluded, whatever its destination | Open-ended household items, bulk grocery unloading, hands; Samsung needed a hold-up ritual and confused door pockets with removals; accuracy drops for moving items; needs high frame rate, strong light, mains power; may capture people | Samsung AI Vision Inside; vending dynamic vision; Passau thesis |
| In-drawer (camera under the crisper cover, looking down) | 1 per drawer | Top layer of produce | Lower layers; high-humidity drawer fogs | No retail precedent found |
| Freezer camera | 1 (bottom-freezer drawer) to 3–4 (side-by-side column) | Baskets or shelves | Frost at every opening; −18 °C; battery chemistry | None found; Samsung excludes the freezer |
| Phone scan by user | 0 | Anything the user points at | Habit-dependent | Background report Phase 1 |

**Indicative camera counts (fresh-food compartment; freezer extra)**

| Type | Interior width (est.) | Shelf-level cameras | Crisper | Door bins | Fresh-food total | Freezer add-on |
|---|---|---|---|---|---|---|
| Top-freezer, 28–33" | ~26" (66 cm) | 3 | 1 | Doorway/door-swing camera or phone | 4–5 | +1 heated |
| Bottom-freezer, single door, 30–33" | ~26–29" (est.) | 3 | 1–2 | Same | 4–6 | +1 heated, looking down into the drawer |
| French door, 36" | ~31" (79 cm) | 3–5 (2 on the widest levels) | 2 | 1 doorway camera for both doors | 5–8 | +1–2 heated |
| Side-by-side, 33–36" | Fresh-food side ~18–20" (unsourced estimate; freezer shelves ~12–13") | 4 (tall, narrow) | 1–2 | Tall door bins; doorway camera | 5–7 | +3–4 (tall freezer column; costly) |

- Each step up in coverage costs a camera. Diminishing returns set in after shelves plus crispers, because door bins and back rows need a different viewpoint, not more of the same one.
- A household doorway camera faces a harder problem than vending: an unlimited range of items, 20+ items per grocery unload, items moved between shelves without leaving, and no locked-door or payment session to bound each event. Treat it as a supplement that supplies hints, not the system of record.

### Gaps
- No manufacturer interior dimensions for fresh-food compartments by fridge class. The widths above come from replacement-glass listings and exterior widths.
- The 2016 Family Hub's camera mount position (door liner or cabinet) is not stated in the sources found, and LG's camera position and door-bin coverage are unknown.
- No source measures what percentage of items any commercial or academic multi-camera fridge actually sees. Koporec and Perš's numbers were not retrieved.
- No evidence was found that door-angle capture is used in current products beyond one owner's "door view" report.

## 2. Architecture: one powered hub with cabled nodes vs battery nodes vs an ESP-NOW mesh; modules, lenses, lighting, triggers and sync

### Takeaway
Image sensors cannot be cabled far from their processor. Parallel (DVP) sensors sit on the microcontroller (MCU) board, and MIPI CSI links are limited to about 30–50 cm of flex cable. So "thin cabled camera nodes" in practice means one small MCU per camera, with a cable carrying power and optionally a data bus or trigger line.

The strongest design is a mains-powered hub outside the fridge feeding ESP32-S3 camera nodes over one flat ribbon cable passed under the gasket. Images move to the hub over ESP-NOW/Wi-Fi or RS-485, and the hub triggers every capture centrally once the door has been shut for a fog-clearing delay. Battery nodes buy easy installation at the cost of fogging without heaters, recharge chores and cold-battery limits. ESP-NOW lets battery nodes skip Wi-Fi association, but at its default 1 Mbps rate it is slow for 5 MP images.

### Cited Findings
- **MIPI cable length:** most camera and processor makers recommend about 30 cm of flex cable; well-designed controlled-impedance cable reaches about 50 cm ([The Imaging Source](https://www.theimagingsource.com/en-us/support/knowledge-base/mipi-csi-2-cameras-fpc-cable-length/)). Arducam also cites about 30 cm ([Arducam](https://www.arducam.com/blog/mipi-csi-2-converters-bridges-other-interfaces/)). A CSI-to-HDMI converter kit is rated for about 3–5 m ([Arducam docs](https://docs.arducam.com/Camera-Extension-Solution/HDMI-Extension-Kit/)), and a retimer is suggested for 2 m in noisy setups ([TI E2E](https://e2e.ti.com/support/interface-group/interface/f/interface-forum/1017506/sn65dsi83-q1-mipi-camera-extention-to-2m)).
- **ESP32-P4 (MIPI) camera path:**
  - SC2336 sensor at 1920×1080 and 30 fps over MIPI; OV5645 at 2592×1944 and 15 fps.
  - The P4's MIPI input carries RGB, YUV or RAW data.
  - JPEG encoding and decoding on ESP32 chips "puts pressure on the CPU and memory" ([Espressif techpedia](https://docs.espressif.com/projects/esp-techpedia/en/latest/esp-friends/solution-introduction/camera/dvp-mipi-csi-camera-solution.html)).
  - The P4's image signal processor (ISP) accepts input up to 1920×1080, and the CSI link runs 1.5 Gbps per lane. The OV5647 has its own ISP; the SC2336 has none ([esp_cam_sensor readme](https://components.espressif.com/components/espressif/esp_cam_sensor)).
- **ESP-NOW:**
  - Under heavy traffic, send 250 bytes or less per call and wait for each callback ([Espressif ESP-NOW docs](https://docs.espressif.com/projects/esp-idf/en/v5.0/esp32/api-reference/network/esp_now.html)). ESP-NOW v2.0 allows packets up to 1,470 bytes ([Espressif docs, latest](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s31/api-reference/network/esp_now.html)).
  - The default bit rate is 1 Mbps. Espressif measured about 214 kbps in the open and about 555 kbps in a shielding box ([Espressif FAQ](https://docs.espressif.com/projects/esp-faq/en/latest/application-solution/esp-now.html)).
  - Between two ESP32s about 1 m apart, 250-byte unicast reached about 778,500 B/s at 54 Mbps (broadcast about 963,000 B/s, with no delivery guarantee). It reached only about 89,250 B/s at 1 Mbps ([NTU blog](https://blogs.ntu.edu.sg/ps9888-2020-g16/?p=93)).
  - A 2022 conference paper describes a JPEG packetization scheme over ESP-NOW that rebuilds images despite lost packets ([PUCP / IEEE ANDESCON](https://cris.pucp.edu.pe/en/publications/implementation-of-a-jpeg-packetization-code-for-wireless-sensor-n/)).
- **Radio out of a closed fridge** [background]: the gasket lets 2.4 GHz out ([Hackaday](https://hackaday.com/2023/07/27/esp32-freezer-alarm-keeps-tabs-on-tricky-door/)). ESP32s become unstable below about −80 dBm ([espboards.dev](https://www.espboards.dev/troubleshooting/issues/wifi/esp32-wifi-signal-weak/)). On a XIAO S3, lowering transmit power to 8.5 dBm cured drop-outs ([DigiKey](https://www.digikey.ca/en/maker/projects/diy-ip-camera-with-the-seeed-xiao-esp32-sense-esphome-home-assistant/a015ed69dda64f0eafbdf12b664eea6d)).
- **Hobby nodes** [background]:
  - fridge-core: ESP32-CAM, magnetic door switch, flash LED, 640×480 frames ([PopularAI](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)).
  - m0nklabs: ESP32-S3 N16R8 with OV5640, triggered by a light sensor ([m0nklabs](https://github.com/m0nklabs/fridge-cam-firmware)).
  - M5Stack Unit CamS3-5MP: 5 MP sensor with an 88° lens fixed-focused at 0.6 m ([M5Stack](https://docs.m5stack.com/en/unit/Unit_CamS3-5MP)).
- **Lens options:** OV2640 modules ship with 66/68/120/160° lenses for ESP32-CAM-style boards ([Fruugo listing](https://www.fruugo.kr/ov2640-camera-module-fisheye-wide-angle-lens-6668120160-degree-24pin-for-esp32-cam-and-tt-series-development-board/p-432717632-908591309); [Probots 160°](https://probots.co.in/ov2640-160-degree-wide-angle-lens-2mp-camera-module-24pin-21mm.html); [Little Bird fisheye](https://littlebirdelectronics.com.au/products/fish-eye-camera-module-ov2640.md)).
- **Raspberry Pi option** [background]: Pi Camera Module 3 Wide, 12 MP, 120° diagonal, rated 0–50 °C ([Raspberry Pi](https://datasheets.raspberrypi.com/camera/sensor-assembly-product-brief.pdf)). A Pi Zero 2 W idles at about 280 mA ([Tom's Hardware](https://www.tomshardware.com/reviews/raspberry-pi-zero-2-w-review)).
- **Triggers:** a reed switch works in a dark freezer; a light sensor needs no wiring. Shoot 30–120 s after the door closes, with a delay that resets on reopen, under your own LEDs, keeping the sharpest of three frames ([HA Community](https://community.home-assistant.io/t/fridge-cam-ai-content-recognition-esp32-cam-ha-blueprint-a-custom-lovelace-card/1023750); [m0nklabs](https://github.com/m0nklabs/fridge-cam-firmware)) [background]. Patents trigger on door-angle sensors or timers (§1), and Samsung delays capture up to 1 minute (§1).
- **Hub-and-cabled-cameras precedent:** [CN109425166A](https://patents.google.com/patent/CN109425166A/en) claims several fridge cameras linked to an outside tablet through a USB hub, with a constant-temperature lens heater.

### Inferences
**Architecture options**

| | A. Hub outside + wired-power nodes (recommended) | B. Independent battery nodes on home Wi-Fi | C. Battery nodes → ESP-NOW → hub just outside | D. Linux hub + USB (UVC) cameras | E. Hub inside the fridge, sensors on short flex |
|---|---|---|---|---|---|
| Install | One ribbon through the gasket, then clip on nodes | Easiest (stick on, pair) | Easy + hub | One ribbon; USB conductors through the gasket | Short cables; hub in the cold zone |
| Heaters / fog | Yes (0.1–0.5 W per window) | No; delay and retry only | No | Yes | Yes |
| Battery chores | None | N batteries per kit | N batteries | None | None |
| Sync | Hub-commanded, millisecond level | Each node self-triggers; ~0.1–1 s tolerance acceptable | Hub broadcast wake possible only if nodes listen (costs power) | Hub-controlled | Hub-controlled |
| RF risk | Low (hub at gasket; or wired RS-485) | Each node must reach the router through steel (RSSI test per node) | Short hop to the hub | None (wired) | Hub must get out of the box |
| Main failure modes | Ribbon damage, seal leak at crossing | Dead batteries, fog, Wi-Fi drops | Slow transfer at 1 Mbps; sleep leakage | USB 2.0 signal quality over flat ribbon (unverified); Linux upkeep | Flex length 30–50 cm limits reach |

- Option A specifics: each node carries its own ESP32-S3 because DVP sensors must sit next to the MCU. As far as I know the S3 has one camera interface (not re-verified this session).
- The ribbon can be power-only, with images sent over ESP-NOW/Wi-Fi to the hub sitting at the gasket. Or it can carry a 4-wire 5 V + GND + RS-485 bus. RS-485 at 2 Mbps moves a 400 KB JPEG in about 2 s, which is fine for after-close stills. The wired option removes all through-steel radio uncertainty.
- Battery node energy is dominated by sleep leakage and Wi-Fi association (§3). ESP-NOW (option C) removes association time, but transfer time depends on the configured bit rate:

  | Image | 214 kbps (Espressif open air) | 1 Mbps unicast (≈89 KB/s) | 54 Mbps unicast at 1 m (≈778 KB/s) | RS-485 at 2 Mbps |
  |---|---|---|---|---|
  | 50 KB (VGA JPEG, assumed size) | ~1.9 s | ~0.6 s | ~0.06 s | ~0.25 s |
  | 150 KB (2 MP, assumed) | ~5.6 s | ~1.7 s | ~0.2 s | ~0.75 s |
  | 400 KB (5 MP, assumed) | ~15 s | ~4.5 s | ~0.5 s | ~2 s |

  JPEG sizes are my assumptions, not measurements. Higher bit rates through a fridge wall are unproven.

**Camera module choice**

| Sensor | Resolution / interface | For | Against |
|---|---|---|---|
| OV2640 | 2 MP 1600×1200, DVP | Cheapest (§6); 160° variants common; huge ESP32 support base | ~0.9 mm per pixel at the back wall through a 160° lens; no labels or dates |
| OV3660 | 3 MP, DVP | Middle ground | ESPHome 2026.5.3 broke OV2640/OV3660 boards ([ESPHome #16926](https://github.com/esphome/esphome/issues/16926)) [background], so pin firmware |
| OV5640 | 5 MP 2592×1944, DVP (autofocus variants) | Best ESP32-S3 option for detail; used by m0nklabs | One board idled near 100 mA unless power-gated (§3); pricier; autofocus adds parts that can fail in the cold (unverified) |
| SC2336 / OV5645 on ESP32-P4 | 1080p30 / 5 MP at 15 fps, MIPI | Only practical ESP option for a video-rate doorway camera | MIPI flex ≤30–50 cm; I understand the P4 has no radio and needs a companion chip (not re-verified); ISP input capped at 1080p |
| Pi Camera Module 3 Wide | 12 MP, 102° × 67°, MIPI | Best images | Linux hub, ~1.4 W idle, short flex: lives inside the fridge or on its own ribbon |

- OV2640, OV3660 and OV5640 can output JPEG directly. That is the standard reason they pair well with ESP32s, given Espressif's warning about software JPEG, but it was not re-verified this session.
- Dewarp the fisheye images on the hub or in the cloud, using lens settings calibrated once per lens model at the factory. Then crop each shelf zone before the vision model call. Rigid mounts matter more than resolution for photo-to-photo comparison.
- **Lighting:** the fridge lamp goes off when the door closes, so each node needs diffuse, high-CRI (colour-accurate) white LEDs behind a frosted cover. Lock exposure and white balance so successive photos are comparable. Glass shelves and plastic packaging create specular glare, so offset the LEDs from the lens axis (inference).
- **Triggers:**
  - A hub reed switch on the door, or a light sensor in one node, starts a delay of 30–90 s that resets if the door reopens.
  - The hub's room temperature/humidity reading can set the delay (the patented approach in §4).
  - A door accelerometer/gyroscope (~US$1, unsourced) enables door-angle frames for door bins.
  - The freezer needs a reed switch, because there is no light to sense.
- **Sync:** the scene is static after the door closes, so a hub broadcast giving roughly 100 ms alignment is ample. Only a doorway camera needs frame-level timestamps, which argues for wiring it.
- **Data volume:** 5 cameras × 25 door events gives about 125 images a day. The background report estimated about US$0.65/month for 15 captures a day on Haiku 5.5 ([Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing)) [background]. Linear scaling gives about US$5.4/month (about C$7.6) with no de-duplication. Skipping unchanged views by perceptual hash, down to 30–40 changed crops a day, gives about US$1.3–1.7/month (about C$1.8–2.4).

### Gaps
- No measured JPEG sizes or ESP-NOW throughput through a closed fridge.
- No volume prices or cold ratings for USB UVC camera modules.
- No confirmation of ESP32-S3 multi-camera limits or ESP32-P4 radio specifics this session.
- No data on whether USB 2.0 survives a ~1.3 mm flat ribbon under a gasket.

## 3. Power: battery life at 2–4 °C, cables through door gaskets, wireless power, safety

### Takeaway
On 2× lithium AA cells (about 2,550 mAh usable after an assumed 15% cold derating), a node that hard-switches off its camera and regulator (about 30 µA asleep) lasts roughly 7–22 months at 25 captures a day. A design built on a hobby dev board that leaks about 2.5 mA lasts about 5–6 weeks however rarely it shoots. Lens heaters cannot run on batteries, Li-ion cannot be charged inside a fridge, and family fridges may be opened about 50 times a day. So wired 5 V through a ≤1.3 mm flat cable under the gasket is the robust default. Battery nodes fit only supplementary positions.

### Cited Findings
- **ESP32 currents (blog figures, rough):**
  - Wi-Fi transmit about 160–260 mA; connected idle 60–80 mA; deep sleep 10–150 µA.
  - Worked example: 4 s at 200 mA per wake is about 0.22 mAh per cycle ([Zbotic](https://zbotic.in/esp32-deep-sleep-mode-extend-battery-life-in-iot-projects/); [esp32.co.uk 2026 guide](https://esp32.co.uk/esp32-battery-powered-sensors-deep-sleep-low-power-design-guide/)).
- **Camera-board leakage** [background]:
  - ESP32-CAM: 180 mA at 5 V, 310 mA with flash, nominal 6 mA asleep ([Joy-it datasheet](https://www.lextronic.fr/lextronic_doc/joy-it/SBC-ESP32-CAM.pdf)). About 0.5 mA was reached only with a redesigned supply ([Elektor](https://www.elektormagazine.de/labs/esp32-low-consumption-power-supply-for-lithium-battery-solar-recharge)).
  - XIAO ESP32S3 Sense: 2–2.8 mA asleep with the camera attached, about 90 mA after a capture ([Seeed forum](https://forum.seeedstudio.com/t/xiao-esp32s3-sense-camera-sleep-current/271258)).
  - One OV5640 board: about 100 mA asleep ([esp32.com](https://esp32.com/viewtopic.php?p=126832)).
- **Blink comparable:**
  - "Up to two years" on two AA lithium cells, credited to a proprietary chip ([Amazon press, XT2 2019](https://press.aboutamazon.com/uk/2019/7/introducing-all-new-blink-xt2-the-next-gen-outdoor-indoor-smart-security-camera-with-extended-battery-life-two-way-audio-and-enhanced-motion-detection)).
  - One spec sheet bases the figure on 4,000 five-second events a year including Live View, noting that life "will vary based on device settings, usage, and environmental factors" ([Adorama](https://www.adorama.com/bli6dkmssm.html); [BJ's](https://www.bjs.com/product/amazon-blink-outdoor-camera-system-2-ct/3000000000003349257)). The summary did not tie the figure to one page.
  - The XT2 records up to 80,000 s of video per set of cells.
- **Cold batteries:**
  - A Sandia study (1999, older) found 18650 Li-ion performance "poor" below 0 °C but respectable near room temperature. No figure for 0–4 °C was retrieved ([Sandia](https://www.sandia.gov/research/publications/details/electrical-characteristics-of-18650-li-ion-cells-at-low-temperatures-1999-08-05/)).
  - Energizer L91 lithium AA: 3,000 mAh rated at 21 °C, operating range −40 to 60 °C. The datasheet's capacity-versus-temperature chart values were not extracted ([L91 datasheet](https://batteryguy.com/media/files/technical-docs/tech-spec-sheets/l91-spec.pdf)).
  - Li-ion should be charged at reduced current below 5 °C and never at or below freezing ([charging guide](https://www.elfa.nl/wp-content/uploads/2023/08/Charging-at-high-and-low-temperatures.pdf)) [background].
- **Door openings:**
  - A Lawrence Berkeley Lab report (older) gives a rule of thumb that families open the fridge about 50 times a day ([LBL-31795](https://eta-publications.lbl.gov/sites/default/files/lbl-31795.pdf)).
  - Seven monitored humanitarian-setting fridges averaged 8 to 26 openings a day ([J. Intl Humanitarian Action, table](https://jhumanitarianaction.springeropen.com/articles/10.1186/s41018-018-0038-3/tables/2)).
  - NIST field studies (1979, 1983) logged openings, but their averages were not retrieved ([NBSIR 83-2653](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir83-2653.pdf); [NBSIR 79-1781](https://nvlpubs.nist.gov/nistpubs/Legacy/IR/nbsir79-1781.pdf)).
  - Fridge energy use correlates with kitchen temperature and door openings ([OSTI](https://www.osti.gov/biblio/211872)).
- **Cable through the gasket** [background]: a 1.3 mm probe cable is sold to fit the roughly 1.5 mm gasket gap ([MOCREO](https://mocreo.com/product/connection-cables/)). Don't drill the cabinet, because refrigerant lines run in the walls ([HA Community](https://community.home-assistant.io/t/fridge-freezer-temp-sensors/744045)).
- **Wireless power (appliance-maker patents, none for a retrofit camera):**
  - Haier: "Wireless power transfer to a door of a refrigerator appliance" ([US12401223B2](https://patents.google.com/patent/US12401223)).
  - A WiTricity-style lighting patent places resonators in refrigerator doors, sides or top, integrated into shelves, to power sensors ([US8552592](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/8552592)).
  - A Panasonic-family filing puts a primary coil in the insulating partition facing a receiving coil on the vegetable-compartment door ([EP3379184](https://data.epo.org/publication-server/rest/v1.2/patents/EP3379184NWA1/document.html)).
  - A further patent covers communication over inductive power to a door ([US10943415](https://patents.google.com/patent/US10943415)).
- **FridgeCam (older):** needed a six-hour charge before first use ([Which?](https://www.which.co.uk/news/article/is-it-worth-buying-a-fridge-camera-aNLE02N0tb1Z)) and "doesn't need recharging very frequently" because it is only on while capturing and syncing ([Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review)).

### Inferences
**Battery-life model (my arithmetic)**

Assumptions: 2× L91 (3,000 mAh) derated 15% for 3 °C, which is an assumption because the chart values were not retrieved. Per capture: lean 3 s at 150 mA (0.125 mAh), typical 4 s at 200 mA (0.22 mAh), heavy 6 s at 250 mA (0.42 mAh, 5 MP plus retries).

| Captures/day | Sleep 30 µA (power-gated), lean capture | Gated, typical capture | Gated, heavy capture | Sleep 2.5 mA (dev board), typical capture |
|---|---|---|---|---|
| 10 | ~1,290 days (~3.5 yr) | ~870 days (~2.4 yr) | ~520 days | ~41 days |
| 25 | ~660 days (~22 mo) | ~410 days (~13 mo) | ~230 days (~7.5 mo) | ~39 days |
| 50 | ~370 days (~12 mo) | ~215 days (~7 mo) | ~120 days (~4 mo) | ~36 days |

- **Sleep current dominates.** A product must cut the camera, regulator and LEDs with a load switch and wake only on the door event. Off-the-shelf ESP32 camera boards cannot do this.
- Blink's two-year claim at about 11 five-second clips a day comes from custom silicon and a hub-based design. My understanding is that Blink cameras talk to a Sync Module, but that was not re-verified. An ESP32 node starts with a worse energy floor.
- **Heaters break battery budgets.**
  - A 0.25 W window heater running for 90 s per event uses about 0.16–0.31 Wh a day at 25–50 events. That is about 42–84 mAh a day at 3.7 V, 4–20× the capture energy.
  - A continuously heated window (0.25 W) uses 6 Wh a day, against about 9 Wh in 2× L91.
  - So any node that must defog actively, including every freezer node, needs wired power.
- **Wireless power for a retrofit:**
  - Inductive or resonant coupling can bridge the door gap, from a cabinet-flange coil to a door-liner node. But the cabinet-side coil still needs power brought in, which means a cable under the gasket anyway.
  - It therefore only helps door-mounted nodes avoid a flexing cable at the hinge, at the cost of efficiency, heat and certification.
  - Laser or infrared power (not researched) would require line of sight through a closed steel door, which a closed fridge does not offer.
- **Gasket crossing:** cross at the top hinge-side corner, where the cable bends least as the door opens; this is an inference. Use one ≤1.3 mm flat ribbon carrying all nodes, so there is a single seal disturbance. Verify with the paper-pull test and watch for frost at the crossing [background].
- **Safety:**
  - Keep the mains adapter outside, with only safety extra-low voltage (SELV) 5 V inside.
  - Current-limit the heaters and add a thermal cutoff.
  - No Li-ion charging inside the fridge.
  - Lithium primary cells (L91 class) for any battery node, especially in the freezer.
  - Lithium cells add shipping rules for the kit (not researched).

### Gaps
- No measured per-capture energy for an ESP32-S3 + OV5640 node at 3 °C.
- No numeric L91 or Li-ion capacity at 0–4 °C.
- No study of energy loss, frost or gasket wear from a permanent flat cable.
- No Canadian household door-opening data.
- No safety-certification requirements (CSA/UL product standards) were researched.

## 4. Environment and installation: condensation and fogging, cleaning, materials, durability, mounting, calibration, fit

### Takeaway
Fogging is predictable from the room's dew point and solvable on wired power. The fix layers a small heater on the lens window with a capture delay set from room conditions, a sharpness check and a retry. On batteries, only the delay/retry and passive coatings are available, and coatings vary in durability. Alberta's dry winters help and humid summers are the real test; freezers frost at every opening.

Adhesive mounting inside a running fridge is fragile: 3M VHB tape wants 10–15 °C or warmer and dry surfaces. Shelf-edge clips plus app-guided placement and coverage checks are the scalable install path.

### Cited Findings
**Fog: what appliance makers and patents do**
- [CN109425166A](https://patents.google.com/patent/CN109425166A/en): a constant-temperature heater on the lens assembly defogs the lens and an anti-fog glass sheet, so the camera works with the door open or closed.
- [US20160033194A1](https://patents.google.com/patent/US20160033194) / [US10018402](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10018402) ("Refrigerator and camera device"):
  - a lens heater clears condensation from the wide-angle lens and capture happens only afterwards;
  - the delay can be set from outside humidity and temperature, saving power;
  - heat conducted from the control unit can serve as the heater.
- [CN106123475B](https://patents.google.com/patent/CN106123475B/en) / [CN106091557B](https://patents.google.com/patent/CN106091557B/en): a heating wire keeps the camera warm at low power, raises power when someone approaches to open the door, and lowers it after the door closes.
- [US10281202](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10281202): the camera is enclosed behind a rotating mullion while the doors are open, because condensation "can take a long time to clear" in cold storage.
- [CN105190206A](https://patents.google.com/patent/CN105190206A/en): a fan blowing cold air across the lens is an alternative.
- Haier has an anti-fog fridge camera module patent ([US11122203](https://patents.google.com/patent/US11122203)) [background].
- Samsung delays its View Inside shot by up to 1 minute depending on ambient temperature or humidity (§1).
- Dew-point arithmetic [background]: room air at 21 °C and 40% relative humidity has a dew point of about 6.9 °C, so it fogs a 3 °C lens. At an assumed 20% (dry Alberta winter) the dew point is about −2.8 °C, so mostly no fog.

**Anti-fog coatings versus heated windows**
- A bar-code-reader patent says heated windows prevent condensation but are costly, take space and need substantial power ([US20070152065](https://patents.justia.com/patent/20070152065)). Heating "needs a power source" ([ceramics.org on ETH Zurich work](https://ceramics.org/ceramic-tech-today/video-search-for-an-ideal-anti-fog-coating-heats-up-the-competition/)).
- Topical hydrophilic sprays don't last ([Safety+Health](https://www.safetyandhealthmagazine.com/?p=12121)). A water-absorbing coating fogs once its absorption capacity is exceeded ([US6306932B1](https://patents.google.com/patent/US6306932)). Durability depends on chemistry, factory versus spray application, and whether the coating is combined with a hard coat ([Lens.com](https://www.lens.com/questions-answered/do-anti-fog-coatings-scratch-easily/)).

**Materials, durability, mounting**
- PLA and PETG turn brittle around −20 °C ([All3DP](https://all3dp.com/2/petg-vs-pla-3d-printing/)) [background].
- 3M VHB tape:
  - most VHB tapes have a minimum application temperature of 10–15 °C, ideally 21–38 °C;
  - surfaces must be dry and "free of condensed moisture";
  - holding power in the cold is "generally satisfactory" once applied ([3M technical bulletin](https://www.ellsworth.com/globalassets/literature-library/manufacturer/3m/3m-technical-bulletin-vhb-tape-cold-temperature-performance.pdf); [Strouse](https://www.strouse.com/blog/these-are-your-application-temperatures-for-3m-vhb-tape));
  - the LSE-110WF variant is listed for application down to 0 °C only if surfaces are frost-free ([RS](https://sg.rs-online.com/web/p/foam-tapes/2365222)).
- FridgeCam (older) used a small sticky-back mount with one spare pad. The mount was "fairly poseable", but the charging port and reset slot didn't line up with the case holes on one review unit ([Tech Advisor](https://www.techadvisor.com/article/719327/smarter-fridgecam-review.html)). In-app positioning guidance was "frustratingly sparse" ([Which?](https://www.which.co.uk/news/article/is-it-worth-buying-a-fridge-camera-aNLE02N0tb1Z)).
- Fridge temperatures vary widely: a 361-fridge Scottish study found an average of 5.17 °C, with 55.4% averaging above 5 °C ([Food Standards Scotland](https://www.foodstandards.gov.scot/sites/default/files/migration/downloads/FROST_Final_Report_June_2025.pdf)) [background].

### Inferences
**Dew points for a 3 °C lens (Magnus formula, my arithmetic)**

| Room air | Dew point | Fog on a 3 °C lens? |
|---|---|---|
| 21 °C, 20% RH | −2.8 °C | No |
| 21 °C, 30% RH | 2.7 °C | Borderline |
| 21 °C, 40% RH | 6.9 °C | Yes |
| 22 °C, 55% RH | 12.5 °C | Yes, heavy |
| 24 °C, 60% RH | 15.8 °C | Yes, heavy |

Freezer lenses at −18 °C frost at essentially every opening, all year.

**Layered fog strategy for a product**

| Layer | How | Power | Basis |
|---|---|---|---|
| Delay and retry | Shoot 30–90 s after close, sharpness/contrast check, retry, abort if the door reopens | ~0 | Samsung, patents, background |
| Predictive delay | Hub measures room temperature/humidity, computes the dew point, picks delay and heater time | ~0 | Delay-from-outside-humidity patent |
| Passive window | Recess the lens behind a factory hydrophilic window with a hard coat; seal electronics with desiccant; route regulator heat to the window | 0 | Coatings vary; heat-conducting-member patent |
| Active heater | Polyimide or ITO heater film on the window, on while the door is open plus ~60 s, cut-off on a sensed temperature | 0.1–0.5 W, wired only | CN106123475B pattern |
| Freezer | Heater mandatory; shoot only once the window sits above the room dew point | Wired | US10281202 (slow to clear in the cold) |

**Cleaning, durability and materials (inference)**
- Food-zone parts should be smooth, crevice-free, wipeable and sealed (an ingress rating around IP54 assumed), so spills, acidic or oily residue and wipe-downs don't reach the electronics.
- Use moulded polypropylene or polycarbonate rather than PLA/PETG. Prefer odour-resistant plastics and avoid foams that absorb food odours.
- Dishwasher-safe clips are a plus.

**Mounting without drilling (inference)**
- VHB on a 3 °C, wet liner is out of spec. Use either:
  - mechanical clips that grip glass-shelf trim or wire-shelf bars, so nodes move with the shelves and survive shelf re-arrangement; or
  - an install procedure that warms and dries a patch with a hair dryer before applying LSE-class tape.
- Magnets will not hold through the plastic liner and foam (unsourced inference). They are useful only for the hub on the steel exterior, and some stainless door fronts are non-magnetic (unsourced).

**Install and calibration flow (inference)**
1. App shows a live preview per node.
2. App overlays a coverage map and flags blind corners.
3. Received-signal-strength check with the door closed (wireless options).
4. Paper-pull seal test at the cable crossing.
5. Fog test: open for 30 s, close, confirm a sharp frame.
6. Empty-shelf or current-contents reference capture.

Lens calibration happens per model at the factory, not per unit.

**Fit across models (inference)**
- Interior widths run about 26–31" in the common types (§1).
- Shelf counts and spacing vary, so nodes need adjustable aim of about ±20° and ideally attach to the shelf rather than the wall.

### Gaps
- No field data on anti-fog coating life in a fridge, or on Samsung/LG heater designs.
- No research done on food-contact or food-zone material rules (US FDA 21 CFR, Health Canada) or on cleaning-chemical resistance.
- Alberta indoor humidity by season is assumed, not sourced.
- No data on how often fridge owners move shelves.

## 5. Extra sensors: which are worth bundling, at what cost and benefit

### Takeaway
Bundle a temperature/humidity sensor in every node and door-open sensing at the hub. They cost little (unsourced estimate), drive capture timing, and make shelf-life estimates honest, given that more than half of fridges run warmer than 5 °C. Leave shelf load cells out of v1 for these reasons:
- they change how shelves fit;
- they drift with temperature;
- they cost several dollars per shelf;
- in a household where items move between shelves, a weight change rarely identifies what moved.

A single small "milk/eggs" weighing pad is a possible later accessory. Spoilage gas sensing is not supported by the evidence found.

### Cited Findings
- **Vending practice:** weight sensing remains viable where lighting is inconsistent or budgets tight, while vision dominates high-traffic sites ([Alibaba guide](https://electronics.alibaba.com/buyingguides/smart-cooler-vending-machines-2026-buyer%E2%80%99s-guide)). Image-plus-gravity dual-mode cabinets are patented ([CN111815852A](https://eureka.patsnap.com/patent-CN111815852A)). Accuracy claims are vendor marketing: up to 99% for a weight-plus-vision hybrid ([VMFS](https://vmfsusa.com/products/ai-smart-cooler-vending-machine)) and "100% accurate" weight tracking ([Shekel](https://www.shekel.ai/blog/vending-operators-weight-sensing-vending/)).
- **Load-cell hardware:**
  - HX711 amplifier boards cost about US$1–4 street ([atomic14](https://www.atomic14.com/esp32/sensors/hx711/)). Clone boards strap the sample rate to 10 Hz and use noisy regulators that cause drifting readings (same source).
  - One load-cell kit claims ±0.02% of full scale accuracy ([Electrokit datasheet](https://www.electrokit.com/upload/quick/44/bf/beb6_41032780-tds.pdf)).
  - A 20 kg kit listing notes it needs temperature-stable conditions and calibration with a known weight ([Besomi listing](https://besomi.com/jo_en/stsx0430-hx711-20kg-load-cell-amplifier-with-20kg-weighing-sensor-module-set.html); the summary's attribution is approximate).
- **Temperature matters to freshness:** average 5.17 °C, with 55.4% of fridges averaging above 5 °C ([Food Standards Scotland](https://www.foodstandards.gov.scot/sites/default/files/migration/downloads/FROST_Final_Report_June_2025.pdf)) [background].
- **Door openings:** about 50 a day by rule of thumb ([LBL](https://eta-publications.lbl.gov/sites/default/files/lbl-31795.pdf)), and 8–26 a day measured in non-household units ([JIHA](https://jhumanitarianaction.springeropen.com/articles/10.1186/s41018-018-0038-3/tables/2)). Energy use correlates with openings and kitchen temperature ([OSTI](https://www.osti.gov/biblio/211872)).
- **"Freshness" gadgets are timers:** DecayDock "cannot actually detect spoilage" ([Hackaday 2026](https://hackaday.com/2026/05/20/decaydock-keeps-track-of-spoilage/)) [background].

### Inferences

| Sensor | Est. cost/unit at volume (unsourced) | Benefit | Verdict |
|---|---|---|---|
| Temperature/humidity per node (digital, SHT4x class) | ~US$0.5–1.5 | Real storage temperature per zone for shelf-life models; drawer humidity; room dew point at the hub drives fog control | Bundle |
| Door sensing (reed switch + magnet, or light sensor, plus optional accelerometer) | ~US$0.2–1 | Capture trigger; door-ajar alerts; opening counts; door-angle frames | Bundle (needed anyway) |
| Shelf load cells (4 per shelf + HX711 + platform) | ~US$6–15 per shelf incl. mechanics | Confirms removals and partial use (milk, juice); vending uses it to cross-check vision | Defer: retrofit fit (raises shelf, changes clearance), temperature drift, calibration, ambiguity when items move |
| Gas/VOC "spoilage" sensors | Unknown | Unproven; commercial "freshness" gadgets are timers | Skip |
| Barcode/receipt import (software) | ~0 | Removes the hardest recognition cases (packaged goods) | Pair with cameras |

### Gaps
- No volume prices were found for temperature/humidity sensors, reed switches or accelerometers; the figures above are estimates.
- No data on consumer shelf-scale accuracy at 3 °C.
- No evidence on gas sensors for household spoilage detection.

## 6. Cost at volume: bill of materials per camera node and per kit at 1,000 and 10,000 units

### Takeaway
A wired 4-camera kit (hub plus four ESP32-S3/OV5640 nodes) comes to roughly US$73–134 in parts at 1,000 units and US$58–105 at 10,000 (C$102–188 and C$81–147). A 6-camera kit is about US$100–186 or US$80–145 (C$140–260 or C$112–203). One-time costs for moulds and certification add about US$17–80 per kit at 1,000 units but only about US$2–18 at 10,000.

At common consumer-hardware markups (an unsourced rule of thumb), that implies a retail price of roughly C$300–550. That is several times the single-camera retrofits that failed: Liebherr's €149.90 HNGRYnsite and FridgeCam at about US$100 (the brief's figure).

### Cited Findings
- **ESP32-S3-WROOM-1-N16R8:** TME volume tiers of about US$4.13 at 500, $4.03 at 650 and $3.80 at 1,300 units ([TME Canada](https://www.tme.com/ca/en/details/esp32s3-wrm1-16r8/iot-wifi-bluetooth-modules/espressif/esp32-s3-wroom-1-n16r8/)). Single-unit prices: DigiKey $4.29, LCSC $5.21, Mouser $6.71 ([Flux.ai](https://www.flux.ai/adrian95/esp32-s3-wroom-1-n16r8~fs1.md)).
- **OV2640:** 1,000 modules for £2,450, about £2.45 each (~US$3.1), with a 68° lens ([Kunkune](https://kunkune.co.uk/shop/uncategorized/1000pcs-ov2640-camera-module)). 160° OV2640 modules at small-quantity retail cost about ₹1,077 at 5+ units ([Probots](https://probots.co.in/ov2640-160-degree-wide-angle-lens-2mp-camera-module-24pin-21mm.html)).
- **OV5640 (no true volume price found):**
  - autofocus 24-pin DVP module at £7.49 (~US$9.5), single unit from a Shenzhen seller ([eBay](https://www.ebay.de/itm/187207860087));
  - 10-pack at CA$280.47 (~CA$28 each), quote required for 5,000+ ([RobotShop](https://ca.robotshop.com/products/camemake-10-pack-ov5640-dvp-camera-module-5mp-mcus));
  - Waveshare autofocus board $26.99 ([Waveshare](https://www.waveshare.com/product/modules/cameras-audio-video/cameras/ov5640-camera-board-c.htm));
  - Adafruit breakout A$15.95, or A$15.15 at 50+ ([Core Electronics](https://core-electronics.com.au/adafruit-ov5640-camera-breakout-72-degree-lens-with-autofocus.html.plain.md)).
- **Hobby-scale Canadian prices** [background]:
  - ESP32-CAM C$14–17 ([Universal Solder](https://www.universal-solder.ca/product/esp32-cam-espressif-esp32-wifi-bluetooth-ble-module-and-2mp-camera/));
  - Pi Zero 2 W C$21.95 ([PiShop](https://www.pishop.ca/product/raspberry-pi-zero-2-w/));
  - Pi Camera Module 3 Wide C$50.95 ([PiShop](https://www.pishop.ca/product/raspberry-pi-camera-module-3-wide/)).
- **Comparable camera products (no teardown BOM found):**
  - Wyze Cam v3 launched at US$19.99 and rose to $32.99 in May 2021. Wyze blamed silicon, memory, plastics, metals and packaging ([Android Police](https://www.androidpolice.com/2021/05/06/wyze-is-going-to-raise-the-price-of-the-cam-v3-again/); [9to5Google](https://9to5google.com/2021/05/07/wyze-cam-doorbell-chip-shortage-price/)).
  - An EDN Asia teardown covers the v2, which may be a relabelled Xiaomi Xiaofang ([EDN Asia](https://www.ednasia.com/?p=11736)).
  - Blink's chip is proprietary, and no cost breakdown was found.
- **Mould tooling:**
  - a hard aluminium mould for a basic electronic enclosure costs about $3,000; machined steel $20,000+ ([Cad Crowd](https://www.cadcrowd.com/blog/complete-costs-of-injection-molding-design-dfm-engineering-rates-manufacturing-pricing-for-cad-services/));
  - aluminium about $1,500–10,000 ([Xcentric](https://xcentricmold.com/aluminum-molds-vs-steel-molds/); [Prototek](https://prototek.com/article/a-guide-to-aluminum-vs-steel-tooling-for-injection-molding/));
  - production steel $10,000–100,000+ ([Spectrum Plastics](https://spectrumplastics.com/about/technical-resources/injection-mold-tooling));
  - aluminium tools often last fewer than 10,000 shots before refurbishment, though another source says 20,000–100,000; steel lasts about 500,000 shots (same sources).
- **Certification:**
  - FCC Part 15 Subpart B (the unintentional-radiator test, which is what remains when a pre-certified radio module is used) is commonly quoted at $3,000–5,000.
  - Subpart C (intentional radiator) testing costs $40,000+.
  - One lab quotes $6,500–10,000 for full certification of a module-based device ([ComplianceTesting](https://compliancetesting.com/fcc-certification-faqs/fcc-certification-cost/)).
  - A China lab quotes about $800 per non-RF model, taking 1–2 weeks ([JJR Lab](https://jjrlab.com/news/how-much-does-fcc-part-15-b-certification-testing-cost.html)).
  - Pre-certified modules avoid radio-transmitter testing ([Particle](https://www.particle.io/iot-guides-and-resources/iot-fcc-certifications/); [Hubble](https://hubble.com/community/guides/how-using-a-pre-certified-wireless-module-simplifies-your-fcc-path/)).
  - No Canadian radio-certification (ISED) pricing was found.
- **Price anchors:**
  - HNGRYnsite €149.90 ([Liebherr](https://www.liebherr.com/en-us/n/always-know-what%E2%80%99s-inside-with-the-fridge-camera-hngrynsite-powered-by-liebherr-27846-3782185)) [background];
  - Samsung Gemini fridge US$3,399 ([Techlicious](https://www.techlicious.com/blog/samsung-bespoke-fridge-vision-ai-with-google-gemini/)) [background];
  - vision vending coolers US$8,500–12,000 ([Alibaba guide](https://electronics.alibaba.com/buyingguides/smart-cooler-vending-machines-2026-buyer%E2%80%99s-guide)).

### Inferences
**Per-node BOM, USD. Sourced lines are marked S; everything else is my estimate (E).**

| Line | Wired node (OV5640, heater) at 1k | At 10k | Battery node (OV2640) at 1k | Basis |
|---|---|---|---|---|
| ESP32-S3-WROOM-1 module | 3.9 | 3.0–3.6 | 3.9 | S at 1k; E at 10k |
| Camera module | 5–9 (OV5640) | 4–7 | 3.1 (OV2640, 68°) | S for OV2640; E for OV5640 (single-unit £7.49) |
| Wide/fisheye lens premium | 0–2 | 0–1.5 | 0–2 | E |
| PCB + assembly | 2–4 | 1.5–3 | 2–4 | E |
| LEDs, regulator, load switch, connectors | 1–2 | 0.8–1.5 | 1–2 | E |
| Temperature/humidity sensor | 0.5–1.5 | 0.4–1.2 | 0.5–1.5 | E |
| Window + anti-fog coat (+ heater film if wired) | 0.5–1.5 | 0.4–1.2 | 0.3–0.8 | E |
| Moulded housing (excluding tooling) | 0.5–1.5 | 0.3–1 | 0.5–1.5 | E |
| Mount/clip | 0.3–1 | 0.2–0.7 | 0.3–1 | E |
| Batteries (2× lithium AA) + holder | — | — | 3–5 | E |
| **Node total** | **~14–26** | **~11–20** | **~15–25** | |

**Hub and kits, USD (CAD in brackets)**

| Item | At 1k | At 10k |
|---|---|---|
| ESP32-S3 hub: module, PCB, certified 5 V USB-C adapter (~3–6 E), enclosure, door sensor, room temperature/humidity | ~12–20 | ~10–17 |
| Linux hub alternative (Pi-class, local processing) | ~30–45 (Pi Zero 2 W retail C$21.95 S) | Unknown volume pricing |
| Flat gasket ribbon + connectors, per run | ~1.5–4 | ~1–3 |
| Packaging, manual, accessories | ~3–6 | ~2.5–5 |
| **Kit: hub + 4 wired nodes (one ribbon)** | **~73–134 (C$102–188)** | **~58–105 (C$81–147)** |
| **Kit: hub + 6 wired nodes (one ribbon)** | **~100–186 (C$140–260)** | **~80–145 (C$112–203)** |

**One-time costs (my arithmetic on the sourced ranges)**
- Roughly five moulds: node housing ×2 parts, hub ×2, clip ×1.
- Aluminium at $1.5–10k each is about $7.5–50k, or $7.5–50 per kit at 1,000 kits. About 4,000–6,000 shots at that volume is within aluminium tool life.
- Volume production needs steel or multiple aluminium tools, about $50–150k: $5–15 per kit at 10,000 kits.
- Compliance: FCC Part 15B plus ISED plus product safety plus reports, assumed $10–30k total, is $10–30 per kit at 1,000 and $1–3 per kit at 10,000. The ISED and safety portions are unsourced.

**Other cost notes**
- Freight, duties and US tariffs on Chinese electronics, retailer margins, warranty returns and app/cloud operations are excluded. Cloud vision is about C$2–8 per household per month at 5 cameras (§2).
- **Read-through:** at 1,000 units the per-kit one-time costs can match the parts cost. A solo founder would need a wired 4-camera kit at about C$300–400 retail, plus or including a subscription for cloud costs, to break even. That faces anchors of about US$100–150 for single retrofit cameras, which failed, and "free" phone-scan apps.

### Gaps
- No real volume quotes for the OV5640, wide lenses, heater films, enclosures or assembly.
- No Wyze/Blink teardown BOM.
- Canada/US tariff and duty status for Chinese-made electronics in October 2026 not researched.
- No CSA/UL safety-certification costs; bilingual (English/French) Canadian labelling not researched.

## 7. Known engineering pitfalls from existing products and projects

### Takeaway
Failures cluster in six places:
- blind spots (doors, drawers, freezer, back rows);
- rituals imposed on users (hold each item up);
- weak recognition from low-resolution images and early models;
- power (sleep leakage, cold charging);
- fog and frost;
- cloud dependence (HNGRYnsite bricked when its app shut down).

Small hardware-QA and install-guidance misses compound them.

### Cited Findings
- **Blind spots:**
  - Samsung AI Vision Inside records nothing in the FlexZone drawer, freezer or doors ([Engadget](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html)) [background].
  - Family Hub cameras miss items at the far sides, and door items near the camera block the view ([Consumer Reports](https://www.consumerreports.org/french-door-refrigerators/samsung-family-hub-refrigerator-review/)).
  - FridgeCam "can't see everywhere" ([Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review)).
  - Hisense judged cameras "only a supplement" ([Seiko RFID](https://www.seikorfid.com/news/RFID-ingredient-management-refrigerator.html)) [background].
- **User rituals and misreads:** hold each item up and wait for a beep; an item put in a door pocket is treated as removed ([Trusted Reviews](https://www.trustedreviews.com/reviews/samsung-bespoke-ai-4-door-french-door-rf90f29aecraa)) [background]. Samsung's documentation says expiry dates must be entered manually ([Samsung](https://www.samsung.com/global/sustainability/popup/popup_doc/AYUr58faFhIAIx_C/)) [background].
- **Stale or unreliable images:** the door view refreshed only when the door was opened wide, and View Inside degraded after a firmware update (anecdotal; [SmartThings Community](https://community.smartthings.com/t/samsung-family-hub-camera-door-view/295877)).
- **Recognition:**
  - FridgeCam recognised no items over a couple of weeks, and manual tagging was tedious ([Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review)) [background].
  - Detectors struggle with occlusion, distortion and clutter ([Dai 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC11652515/); [Koporec & Perš 2019](https://openaccess.thecvf.com/content_ICCVW_2019/html/ACVR/Koporec_Deep_Learning_Performance_in_the_Presence_of_Significant_Occlusions_-_ICCVW_2019_paper.html)).
  - Moving items are recognised less accurately ([Towards New Retail](https://dl2link.com/Selected%20Journal%20Publications/Towards%20New%20Retail%20A%20Benchmark%20Dataset%20for%20Smart%20Unmanned%20Vending%20Machines.pdf)) [background].
  - Static before/after comparison gives false positives when lighting shifts or products are moved ([BasicAI](https://www.basic.ai/blog-post/computer-vision-for-smart-vending-machines-how-it-works-models-data-and-annotations)).
- **Service shutdown:** HNGRYnsite cameras lost all function when the app closed on 31 March 2025, with no local access to images and no firmware to repurpose them ([Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste)) [background]. FridgeCam was discontinued ([Mobile Fun](https://www.mobilefun.com/smarter-fridgecam-wifi-enabled-food-tracking-camera-85610)) [background].
- **Power:** camera-board sleep currents of 2–100 mA ([Seeed forum](https://forum.seeedstudio.com/t/xiao-esp32s3-sense-camera-sleep-current/271258); [esp32.com](https://esp32.com/viewtopic.php?p=126832)) [background]; no Li-ion charging at or below freezing ([charging guide](https://www.elfa.nl/wp-content/uploads/2023/08/Charging-at-high-and-low-temperatures.pdf)) [background].
- **Fog:** Samsung delays capture up to a minute (§1); multiple patents add heaters, shutters or fans (§4).
- **Firmware and software supply chain:** ESPHome 2026.5.3 broke OV2640/OV3660 boards ([ESPHome #16926](https://github.com/esphome/esphome/issues/16926)) [background]. A DIY fridge-camera project has an open bug where failed inventory lookups create duplicate entries ([PopularAI, Oct 2026](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)).
- **Hardware QA and install UX:** FridgeCam's charging port was misaligned with its case ([Tech Advisor](https://www.techadvisor.com/article/719327/smarter-fridgecam-review.html)) and in-app placement guidance was sparse ([Which?](https://www.which.co.uk/news/article/is-it-worth-buying-a-fridge-camera-aNLE02N0tb1Z)).
- **Interfaces:** MIPI cables are limited to about 30–50 cm ([The Imaging Source](https://www.theimagingsource.com/en-us/support/knowledge-base/mipi-csi-2-cameras-fpc-cable-length/)). MQTT buffers overflow with images ([HA Community](https://community.home-assistant.io/t/handling-large-mqtt-payloads/708996)) [background].
- **Mounting:** VHB tape is out of spec below 10–15 °C or on damp surfaces ([3M bulletin](https://www.ellsworth.com/globalassets/literature-library/manufacturer/3m/3m-technical-bulletin-vhb-tape-cold-temperature-performance.pdf)).
- **Market signal (weak):** an October 2026 "best fridge camera" roundup lists mostly generic indoor security cameras, some with magnetic mounts, rather than fridge-specific products ([OfZenAndComputing](https://www.ofzenandcomputing.com/best-smart-refrigerator-camera-for-grocery-tracking/)). This suggests no dedicated retrofit multi-camera product leads the market as of October 2026. It is not proof that none exists.

### Inferences

| Pitfall | Design rule |
|---|---|
| One camera, one viewpoint | Cover each shelf level, add drawer views, and keep phone scans for door bins and freezer until covered |
| Doorway recognition forces rituals | Static after-close snapshots are the system of record; doorway frames are hints only |
| Low resolution / weak models | 5 MP sensors behind ≤160° lenses; dewarp and crop; modern cloud vision models; ask the user when unsure |
| Sleep leakage, cold charging | Wired 5 V; if on battery, hard power gating plus lithium primary cells |
| Fog and frost | Heater window plus predictive delay plus sharpness retry; freezer only when wired |
| Cloud shutdown risk | Local-first storage, open export and a documented local API, so the hardware outlives the company |
| Install friction | Clip mounts, app coverage map, one cable crossing, a fog test during setup |
| Firmware regressions | Own the firmware (ESP-IDF), pin versions, update over the air with rollback |

### Gaps
- No public failure-rate or return-rate data for any fridge camera.
- No data on how Samsung or LG handle fog in production units beyond the 1-minute delay.
- No review found that measures Family Hub or Bosch coverage quantitatively.

## 8. Recommended reference design and main open risks

### Takeaway
Recommended v1 is a wired kit that photographs each shelf after the door closes (not a doorway/transaction camera). It has:
- a mains-powered hub on the fridge's exterior;
- one ≤1.3 mm flat ribbon crossing the gasket at the top hinge corner;
- 3 shelf nodes plus 1–2 crisper nodes, each an ESP32-S3 + OV5640 behind a ~150–160° lens with LEDs, a heated anti-fog window and a temperature/humidity sensor;
- capture 30–90 s after the door closes, timed from the room's dew point;
- optional doorway/door-swing and heated freezer nodes later;
- phone scans covering whatever the cameras cannot see.

The main open risks are, in order:
1. real-world coverage under occlusion;
2. install friction and gasket-crossing side effects;
3. fog reliability through a humid summer;
4. a C$300–550 retail price against failed C$140–240 precedents and built-in OEM cameras;
5. certification and food-zone compliance;
6. cloud cost and longevity.

### Cited Findings
Each choice traces to evidence above:
- **Static after-close capture:** Samsung View Inside and Bosch both shoot when the door closes ([Consumer Reports](https://www.consumerreports.org/french-door-refrigerators/samsung-family-hub-refrigerator-review/); [Reviewed](https://reviewed.com/refrigerators/news/this-app-shows-you-whats-in-your-fridge)). Doorway recognition forced Samsung's hold-up ritual ([Trusted Reviews](https://www.trustedreviews.com/reviews/samsung-bespoke-ai-4-door-french-door-rf90f29aecraa)) [background].
- **Per-shelf cameras:** static vision "often requires one camera per shelf" ([BasicAI](https://www.basic.ai/blog-post/computer-vision-for-smart-vending-machines-how-it-works-models-data-and-annotations)).
- **Capture delay and heater:** Samsung's delay of up to 1 minute (Samsung support, §1); the lens-heater and delay-from-outside-humidity patent ([US20160033194A1](https://patents.google.com/patent/US20160033194)); the approach-triggered heater ([CN106123475B](https://patents.google.com/patent/CN106123475B/en)).
- **Wired power:** sleep leakage and cold charging (§3); FridgeCam's own move to a USB-C Pro model ([The Spoon](https://thespoon.tech/fridge-cam-maker-smarter-launches-new-models-at-ces-announces-acquisition-of-chefling/)); gasket-gap cable ([MOCREO](https://mocreo.com/product/connection-cables/)) [background].
- **More cameras help hand occlusion; occlusion remains the core limit:** [Passau thesis](https://www.fim.uni-passau.de/fileadmin/dokumente/fakultaeten/fim/lehrstuhl/sauer/geyer/BA_MA_Arbeiten/MA-BokhariMohamed-202305.pdf); [Koporec & Perš](https://openaccess.thecvf.com/content_ICCVW_2019/html/ACVR/Koporec_Deep_Learning_Performance_in_the_Presence_of_Significant_Occlusions_-_ICCVW_2019_paper.html).
- **Local-first storage:** the HNGRYnsite bricking ([Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste)) [background].
- **OEM competition:** Samsung's Gemini update covering 2,000+ foods ([Engadget 2026](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)) [background]; LG ThinQ Food's internal camera ([LG](https://www.lg.com/us/press-release/lg-signature-evolves-with-ai-redefining-premium-home-appliances-at-ces-2026)).

### Inferences
**Reference design "RD-1" (my synthesis)**

| Block | Spec |
|---|---|
| Hub (outside: fridge top or side, magnet or adhesive on steel) | ESP32-S3 (Wi-Fi and BLE setup), certified USB-C 5 V/2 A adapter, room temperature/humidity sensor (dew point drives the fog logic), door reed switch with magnet, ESP-NOW coordinator or RS-485 master, local buffer for images. Upgrade path: a Linux hub for local vision |
| Gasket crossing | One flat 4-conductor ribbon, ≤1.3 mm, at the top hinge-side corner. A spine runs down the inner side wall with tap connectors. A second ribbon only if a freezer node is added |
| Shelf nodes (×3; ×2 per level on ≥30" interiors if the coverage check fails) | ESP32-S3 + OV5640 5 MP behind a ~150–160° lens; 4–6 diffuse high-CRI LEDs; 0.1–0.3 W polyimide heater on a hydrophilic hard-coated PC window; temperature/humidity sensor; sealed moulded PP/PC housing; clip onto the front edge of the shelf above, aimed 20–30° down and back |
| Crisper nodes (×1–2) | Same node under the crisper cover glass, looking down into the drawer; captures after any door event plus delay |
| Optional doorway node (v1.5) | Top-front of the cabinet. Takes door-angle stills of the door bins (door wide open) and short insertion bursts as hints. ESP32-P4 + 1080p30 MIPI sensor if video is needed. Wired power only; privacy masking of people |
| Optional freezer node (v2) | Same node with a 0.5 W heater; captures only after the window is above the room dew point; wired only |
| Capture logic | Door closed → wait 30–90 s (delay set by dew point, resets on reopen) → heater pre-warm → LEDs → 3-frame burst per node → keep sharpest (Laplacian score) → retry if foggy → perceptual-hash de-duplication → upload only changed views |
| Software | Dewarp per lens model → crop each shelf zone → cloud vision on changed crops → compare inventories (not pixels) → one-tap confirmations; ask when unsure; first-seen dates for freshness; phone scans fill blind zones |
| Longevity | Local storage plus export plus a documented local API; cameras still usable if the cloud ends |

**Per-type v1 kits:**
- top-freezer: 4 nodes (3 shelf + 1 crisper);
- bottom-freezer: 4–5;
- French door: 5–7 (3–5 shelf + 2 crisper);
- side-by-side fresh-food side: 5–6.

The parts cost lands at roughly C$80–260 depending on node count and volume (§6).

**Build sequence for a solo founder (inference):**
1. 3–5 hand-built wired nodes in 3–5 real fridges, including different types.
2. Measure coverage (share of items visible), fog failure rate in summer, install time and cloud cost per household.
3. Only then commit to moulds and certification.

**Main open risks (ranked)**
1. **Coverage under occlusion.** Back rows behind tall items, stacked produce and opaque leftover containers may keep visible-item rates well below "most contents" in a full family fridge. There is no published measurement. This is the make-or-break unknown.
2. **Install friction and gasket crossing.** Running a ribbon, clipping 4–7 nodes and re-aiming after shelf changes is far more work than the one-camera products that already failed. Seal leaks, frost and appliance-warranty worries are unquantified.
3. **Fog and frost at scale.** Heater, delay and coating designs are patented and plausible, but humid-summer reliability over months is untested. Freezer coverage is hard.
4. **Price versus willingness to pay.** A C$300–550 kit, plus possibly a subscription, competes with failed single cameras (FridgeCam ~US$100 ≈ C$140; HNGRYnsite €149.90 ≈ C$240 at an assumed ~1.6 CAD/EUR), built-in cameras from Samsung (Gemini, 2,000+ foods) and LG (ThinQ Food), and free phone-scan apps.
5. **Compliance.** FCC and ISED (eased by a pre-certified module), product safety for a mains-powered kit with heaters in a food zone, food-zone material rules and bilingual Canadian labelling are not researched. One-time costs dominate at 1,000 units.
6. **Recognition and identity tracking.** Time-in-fridge needs the same item recognised across photos, through occlusion and shelf moves. Models miscount and struggle with cross-photo identity [background]. Doorway hints help but bring privacy concerns.
7. **Cloud dependence and running cost.** About C$2–8 per household per month at 5 cameras before de-duplication. Longevity obligations follow the HNGRYnsite precedent.
8. **Founder capacity.** Firmware, hardware, manufacturing, certification and support are each larger than the software side. This is an inference from scope, not from a cited source.

### Gaps
- No pilot or field data exist for any multi-camera retrofit, so every coverage and count figure here is geometric reasoning that needs measurement in real fridges.
- No data on consumer willingness to pay for a 4–7 camera kit.
- No researched information on CSA/UL product-safety requirements or food-zone material compliance for in-fridge electronics.
