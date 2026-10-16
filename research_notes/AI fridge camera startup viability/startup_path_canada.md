# From prototype to a sellable retrofit AI fridge-camera kit and a funded company: the practical path for a solo, part-time Alberta founder (state of things as of 16 October 2026)

Method note (applies to every section). The notes rest on 31 WebSearch calls made on 16 October 2026. WebFetch failed with a DNS error (tested on nrc.canada.ca), so **every finding comes from search-result summaries, not full-page reads**. Where a summary did not tie a figure to one specific page, the attribution below is best-effort and marked "(attribution best-effort)". Many sources are aggregators or vendor and consultant blogs; they are flagged inline. Items marked "(via earlier build guide)" come from `/home/user/AlbertanCoder/reports/AI fridge inventory build guide.md` and were **not** re-verified here. CAD conversions in the Inferences use an assumed planning rate of **US$1 ≈ C$1.40**. That rate is a round, deliberately conservative assumption, not a sourced figure. None of this is legal, tax or patent advice; the points where a lawyer, patent agent or accountant is needed are flagged.

---

## 1. Development and manufacturing: stages, timelines, costs, contract manufacturing, MOQs, tooling, DFM/QC, and who helps first-time hardware founders

### Takeaway
Consumer hardware runs from works-like prototype through EVT, DVT and PVT to mass production. The EVT-to-PVT stretch typically takes **16–30 weeks** for a moderately complex product, and crowdfunded hardware takes **12–18 months from funding to the first unboxing**. Moulds cost roughly **US$3k–12k for soft (aluminium) tooling** and **US$15k–80k for hard (steel) tooling**. Shenzhen contract manufacturers (CMs) usually want orders of **1k units or more**, though agents and small shops quote **100–1,000-unit pilot runs**. For a solo founder, the cheapest path is to stay below tooling and MOQ thresholds, using dev boards, printed enclosures and hand assembly, until about 100–500 units. Alberta offers makerspaces and an airport-based prototyping lab, but no hardware-specific accelerator was found.

### Cited Findings

**Stages, quantities and timelines (EVT → DVT → PVT → MP)**
- The full EVT–DVT–PVT sequence takes about **16–30 weeks** for a moderately complex product. Idea to first shipment takes about **6–12 months**, and each validation stage should carry a **20–30% schedule buffer**. — [OPD Design](https://www.opd-design.com/evt-dvt-pvt-product-development-stages-guide/) (consultant content; attribution best-effort)
- For crowdfunded hardware, the realistic path from funding to first unboxing is **12–18 months**. — [Adam Webb, Kickstarter hardware timeline](https://adamwebb.pro/blog/kickstarter-hardware-timeline-delivery/)
- An EMS view of the stages: roughly **4–6 weeks per EVT loop** including redesign, about **8 weeks for DVT**, and **4+ weeks for PVT**. Formal certification testing usually runs in parallel with PVT, and a simple sensor node might do EVT on about **15 boards**. — [Beli Technologies](https://belitechnologies.com/blog/evt-dvt-pvt-hardware-build-stages) (EMS vendor; attribution best-effort)
- Typical build quantities:
  - EVT: about **50–100 units** "from your real tooling and CM" (one source).
  - DVT: typically **50–200 pieces**, possibly needing **1–2 tooling revisions (T1, T2)**.
  - PVT: usually **200–1,000 units**, often **5–10% of the first production run**.
  - Some teams skip DVT by committing to hard tooling at the end of EVT.
  - Sources: [Formlabs](https://formlabs.com/global/blog/validation-testing-product-development-poc-evt-dvt-pvt-mp/); [Venture Mfg](https://www.venture-mfg.com/evt-vs-dvt-vs-pvt/) (vendor content; attribution best-effort among one search's results).
- Instrumental's EVT/DVT/PVT build-schedule whitepaper is a commonly cited reference, but it dates from **October 2020**. — [Instrumental](https://instrumental.com/wp-content/uploads/2020/10/EVT-DVT-PVT-Whitepaper.pdf)

**Injection-mould tooling**
- Soft aluminium tooling costs **US$3,000–12,000** with a **3–5 week** lead time. Hard steel tooling costs **US$15,000–80,000**, with **8–16 weeks** from order to first parts. — [Hotean](https://hotean.com/blogs/hotean-blog/prototype-to-production-cost) (vendor blog; attribution best-effort)
- A UK consumer-electronics guide gives **£8,000–40,000** depending on complexity, and **6–12 weeks** from sign-off to first shot. — [OPD Design](https://www.opd-design.com/evt-dvt-pvt-product-development-stages-guide/) (attribution best-effort)
- Tooling changes made during production can cost **up to US$50,000** and add weeks or months of delay. — [Venture Mfg](https://www.venture-mfg.com/evt-vs-dvt-vs-pvt/) (attribution best-effort)
- Tooling ranges differ by roughly 2–5× between sources, which is why the summary advised getting quotes from an actual moulder. — same search cluster as above

**A reference seed budget for a first run**
- One hardware pitch guide gives this example seed budget:
  - **US$400k** to "Finalize Design & Tooling (NRE)".
  - **US$600k** for the "First Production Run (DVT/PVT)" of **1,000–2,000 units**.
  - The budget should give **18–24 months of runway**.
  - Source: [StartupFundraising.com](https://startupfundraising.com/library/articles/pitching-perfection-funding-insights-hardware-entrepreneurs-can-use)

**Contract manufacturing and minimum order quantities (MOQs)**
- ESP32 modules and dev boards are sold by many Shenzhen sellers with MOQs of **1–10 pieces**, with ranges running from 1 to 500+. These sellers are component resellers, not contract manufacturers. — [Accio](https://www.accio.com/plp/esp32-price-in-china); [Alibaba](https://electronics.alibaba.com/supplier/esp32-mini)
- A Shenzhen sourcing agent says it connects small businesses with factories for prototypes, pilot runs and small batches of **100–1,000 units** — [ESP32s.com](https://www.esp32s.com/your-local-partner-in-chinas-electronics-hub/). An ESP32 design and PCB-assembly firm claims both small-batch and mass production — [LST IoT](https://www.lst-iot.com/). Neither gives verifiable pricing or MOQ terms, so treat both as leads only.
- An older (c. 2015) "Manufacturing 101" deck for hardware startups explains MOQs:
  - CMs impose MOQs to spread fixed setup costs.
  - The MOQ "varies from 1k~10k somewhat based on unit price (BOM cost)".
  - Larger inland EMS firms take bigger orders, with longer lead times, than smaller Pearl River Delta shops.
  - Source: [SlideShare "Manufacturing 101"](https://www.slideshare.net/slideshow/school-manufacturing101/47721210) (**dated**)
- A US regulatory change pending as of this writing affects Shenzhen-centred plans: the FCC may stop recognising mainland-China test labs. See Q2.

**Programs and places that help first-time hardware founders**
- **HAX (SOSV):**
  - SOSV's own FAQ says the first investment is **US$250,000**, which "converts to a pre-negotiated equity stake at a later date" — [HAX FAQ](https://hax.co/faq/).
  - One review says the cheque is a post-money SAFE with no valuation cap, split into **US$150k cash and US$100k in-kind engineering and lab support**, with total initial pre-seed funding of up to **US$550k** — [elev-x](https://elev-x.com/news-insights/article-sosv-accelerator-review/).
  - Third-party estimates of the equity taken are about **9–12%** — [GrowthMentor](https://www.growthmentor.com/startup-accelerators/hax/).
  - It is described as a **six-month residency** in a 35,000 sq ft facility in **Newark, NJ**, with in-house engineers and machine shops — [StartupIntros](https://startupintros.com/resources/hax-sosv-hardware-accelerator) (third-party profile).
  - It is now listed as the "**HAX Deep Tech Accelerator**" — [Superscout](https://superscout.co/program/hax-deep-tech-accelerator).
- **Calgary:**
  - The **Aerospace Innovation Hub (AIH) prototyping lab** is a machine shop with rapid-prototyping tools: metal cutting and 3D printing. Startups can use it through a **Tier 1 membership**, which also covers AIH's co-working space at the airport. — [Innovate Calgary](https://innovatecalgary.com/news/where-ideas-take-shape-inside-the-aihs-prototyping-lab/)
  - **Protospace** is a non-profit, volunteer-run makerspace with 3D printers, laser cutters, electronics repair tools and Arduino/electronics projects. — [SAIT journalism, The Press](https://saitjournalism.ca/thepress/?p=64715)
  - **Fuse33** is described as Calgary's largest makerspace, with monthly memberships covering a wood shop, metal shop, 3D printers and a computer lab. — [Calgary Arts Development](https://calgaryartsdevelopment.com/news-information/directory/fuse33-makerspace/)
- **Edmonton:**
  - **TBD Edmonton** was founded by a NAIT alumnus to "break down the barriers between product design and then actual production", on a subscription model. — [The Nugget](https://thenuggetonline.com/nait-alumnus-creates-affordable-makerspace/)
  - A **2014** federal release described NAIT as supporting prototype development, product refinement, testing and validation (**dated**). — [Government of Canada, 2014 (French)](https://www.canada.ca/fr/nouvelles/archive/2014/01/gouvernement-harper-renforce-possibilitecommercialisation-innovation-northern-alberta-institute-technology.html)
  - The University of Alberta publishes spin-off resources, but these are relevant only to university-affiliated founders. — [UAlberta](https://www.ualberta.ca/research/services/commercialization/spinoff/resources.html)
- **Alberta Innovates:**
  - Its Voucher Program guide says applicants should engage a **Technology Development Advisor** — [Voucher guide, May 2026](https://albertainnovates.ca/wp-content/uploads/2026/05/Voucher-Standardized-Program-Guide-May-2026.pdf).
  - Its **Product Demonstration Program** offers up to **C$150,000** — [Alberta Innovates PDP](https://albertainnovates.ca/funding/product-demonstration-program/).
  - See Q5 for intake status.

**Category precedents that shape the engineering risk (via earlier build guide)**
- Smarter FridgeCam recognised **no items** over a couple of weeks of testing, and retailers now list it as discontinued. — [Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review) (via earlier build guide)
- Liebherr's HNGRYnsite cameras (€149.90) lost all function when the HNGRY app shut down on **31 March 2025**. — [Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste) (via earlier build guide)
- In **May 2026**, Samsung began rolling out Gemini-based cloud recognition of **2,000+ foods** with shelf-life warnings to some of its fridges. — [Engadget](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/) (via earlier build guide)
- Lithium-ion cells should never be charged at or below freezing, and should charge at reduced current below 5 °C. — [charging-temperature guide](https://www.elfa.nl/wp-content/uploads/2023/08/Charging-at-high-and-low-temperatures.pdf) (via earlier build guide)

### Inferences
- **Mapping the stages to this kit:**
  - *Works-like / looks-like (Stage A in Q6)*: dev boards (XIAO ESP32-S3 Sense + OV5640), 3D-printed PETG shells and USB power under the gasket, as in the earlier build guide.
  - *EVT*: a custom PCB around a **pre-certified ESP32-S3 module**, with a camera FPC connector, an LED driver, load-switch power gating, a reed-switch input and a temperature sensor.
  - *DVT*: soft or bridge tooling, or printed/cast enclosures, built in tens to low hundreds.
  - *PVT*: hard tooling plus a factory test fixture.
- **Two SKUs at minimum (camera node and hub)**, plus mounts and cables, so plan on at least two tool sets. Converted from the cited ranges, soft tooling is about **C$4k–17k per tool set** and hard tooling about **C$21k–112k per tool set**. For both SKUs that is very roughly **C$10k–35k soft** or **C$45k–220k hard**. This is an inference: the sources don't say whether their figures are per mould or per product.
- **Stay below MOQ and tooling thresholds until demand is proven.** For 100–500 units, the inferred path is online or small-shop PCBA for boards, printed or urethane-cast enclosures, and hand assembly and testing in Alberta. Full turnkey EMS is reserved for runs of **≥1k units**, matching the cited 1k–10k MOQ norm.
- **Fridge-specific DFM risks** get no coverage in generic EVT guides. They are:
  - condensation and lens fog;
  - adhesives and mounts that hold on cold, wet liners;
  - cleanability next to food;
  - charging limits if batteries are used;
  - Wi-Fi through the steel cabinet;
  - frost in freezers.
- These should be EVT exit criteria, measured in **many different fridges**, not just the founder's.
- **QC for a camera node** means a per-unit factory test: flash and provision a device credential, capture a test image, check Wi-Fi RSSI, check LED current, and check sleep current. Build this fixture before DVT. This is standard practice rather than a sourced figure.
- **Design against the HNGRYnsite failure mode.** Provide local access and data export, and publish a plan for what happens if the cloud shuts down. This builds trust and reduces bad-press and consumer-protection risk.
- **Accelerator fit.** HAX is the closest "hardware help", but it is now branded deep tech and runs a six-month residency in Newark. It fits poorly for a part-time, solo, consumer smart-home founder until there is a team and traction.
- **Category headwind.** Samsung's 2026 Gemini update means incumbents are absorbing "AI recognition" into the fridge itself. The retrofit pitch has to be "any fridge, cheaply, with more coverage". The prior retrofit products failed on recognition and vendor longevity, not on demand evidence.

### Gaps
- No source was found on **North American low-volume EMS** (e.g., MacroFab-style platforms) or Alberta/Canadian EMS shops quoting **100–500 units**; this needs direct outreach.
- No figures were found on **third-party inspection** (AQL) or QC programme costs.
- **Brinc, Bolt, Hardware Club and Dragon Innovation** essays and programmes were not retrieved, so their current terms are unknown.
- **SAIT and NAIT** current applied-research and prototyping services, pricing and eligibility were not confirmed; the NAIT item is from 2014. Funding routes for college-partnered projects (NSERC, Mitacs) were not researched.
- Every tooling and stage figure is vendor or consultant content; none came from audited data.

---

## 2. Certification to sell in Canada and the US: FCC Part 15, ISED (RSS/ICES), what pre-certified modules save, lab costs and timelines, electrical safety, batteries, materials near food, bilingual labelling

### Takeaway
- **Use a pre-certified module.** An ESP32-S3 module with **full modular approval**, used with its approved antenna unchanged, means the US host only needs **Part 15B unintentional-emissions testing (SDoC)**. That costs roughly **US$1.5k–5.5k per product, in 1–4 weeks**, against **US$8k–20k+** for a product needing its own intentional-radiator grant. The module's FCC approval does **not** carry over to Canada, where ISED rules apply separately.
- **The FCC lab rule is the biggest 2026 change.** The FCC votes on **29 October 2026** on ending recognition of **mainland-China test labs**, effective **1 December 2028**. China-based labs tested about 82–83% of 2025 applications.
- **Batteries add UN38.3** testing (about **US$2k–7k, 4–6 weeks**).
- **USB power from a certified Class 2 adapter** is likely exempt from device-level electrical approval under Ontario-style rules. Alberta's own rule was not verified.
- **Quebec's French-labelling rules tightened on 1 June 2025.**

### Cited Findings

**FCC Part 15: modular approval and the host**
- FCC modular approval (47 CFR §15.212, interpreted in KDB 996369) "does not certify the host device; it certifies the transmitter under defined conditions". With **full** modular approval (all eight conditions met), the host needs only **Part 15B unintentional-emissions testing**. It also needs **an RF-exposure evaluation if antenna placement differs** from the module's grant. — [MarkReady, module certification](https://markready.io/learn/fcc-module-certification); [FCC KDB 996369](https://apps.fcc.gov/eas/comments/GetPublishedDocument.html?id=434&tn=183218)
- With **limited** modular approval, the integrator has only two options: a change in ID plus a Class II permissive change of the module, or a new FCC ID for the host. — [ACB](https://acbcert.com/radio-modules/radio-enabled-products-using-radio-modules/) (attribution best-effort)
- Reusing a modular certification also requires specific **label and user-manual statements** on the host. — [MarkReady](https://markready.io/learn/fcc-module-certification) (attribution best-effort)
- Cost and time figures from vendor and consultant pages:
  - Host-level testing with a pre-certified module costs about **US$2,500–5,500**, against **US$8,000–20,000+ per product** for intentional-radiator testing without a modular certification.
  - Products using pre-certified Wi-Fi/BLE modules cost **US$3,000–10,000**, and SDoC-only digital devices **US$1,500–5,000** — [MarkReady, FCC certification cost 2026](https://markready.io/learn/fcc-certification-cost).
  - Another source puts the SDoC route at **US$800–5,000** and **1–4 weeks** — [MarkReady guide](https://markready.io/guides/fcc-certification).
  - One engineer reported **US$1,900** at a US lab for a BLE sensor built on an **ESP32-WROOM** module — [Promise Legal](https://blog.promise.legal/fcc-certification-ce-marking-connected-devices-hardware-startups/) (attribution best-effort).
- "FCC approval alone does not establish compliance for Canada, and identical hardware may still require additional evaluation or documentation under ISED rules." — [MiCOM Labs](https://micomlabs.com/fcc-ised-wireless-module-compliance/)

**FCC "Bad Labs" rules and the pending China-lab exclusion (current as of 16 October 2026)**
- In **May 2025** the FCC adopted rules barring recognition of test labs and certification bodies owned or controlled by foreign adversaries, and sought comment on further restrictions. — [Wiley](https://www.wiley.law/alert-FCC-Bans-Bad-Labs-Connected-to-Foreign-Adversaries-Seeks-Comment-on-Additional-Restrictions-for-Equipment-Authorization-Program); [SC World](https://www.scworld.com/brief/fcc-bans-us-electronics-testing-in-risky-chinese-labs)
- The FCC says it has denied or withdrawn recognition for **23 labs** under those rules. — [MarkReady, "Bad Labs" vote](https://markready.io/blog/fcc-bad-labs-vote) (attribution best-effort)
- On **30 April 2026** the FCC unanimously approved a proposal to bar mainland-China labs. — [LightNow blog, May 2026](https://www.lightnowblog.com/2026/05/fcc-bans-chinese-test-lab-certifications-on-electronics/)
- On **29 October 2026** the FCC votes on a draft order that would **end recognition of mainland-China test labs, effective 1 December 2028**. The draft also covers labs in any country that denies reciprocal treatment to US labs. — [DroneXL, 10 Oct 2026](https://dronexl.co/2026/10/10/fcc-vote-chinese-test-labs-82-percent-us-devices/); [Asia Times, Oct 2026](https://asiatimes.com/2026/10/fcc-product-testing-ban-deepens-us-china-tech-decoupling/)
- China-based labs tested about **82–83%** of devices applying for FCC authorisation in 2025 (one source: 38,491 of 46,402 applications). US labs tested about **4%**. — [DroneXL](https://dronexl.co/2026/10/10/fcc-vote-chinese-test-labs-82-percent-us-devices/); [MarkReady](https://markready.io/blog/fcc-bad-labs-vote)
- These are news and commentary sources, not the FCC order text. The vote is pending as of this writing.

**ISED Canada (RSS / ICES)**
- Radio devices (standalone modules, host devices with modules, or radio devices) must be tested against the relevant RSS. The reports go, with the user manual, schematics, example labelling and application forms, to a certification body. — [Global Approvals](https://www.globalapprovals.com.au/canada-ised-certification/) (page about 6 years old; **dated**)
- An example Canadian marking reads "**Contains IC: [number]. CAN ICES-3 (B)/NMB-3(B)**". ICES-003 is the standard for information technology equipment, including digital apparatus. — [Global Approvals](https://www.globalapprovals.com.au/canada-ised-certification/)
- ISED's current certification fees were **not found** (see Gaps).

**Electrical safety (CSA/UL and the power supply)**
- The Canadian Electrical Code is adopted provincially and requires approval by a **Standards Council of Canada-recognised certification body**. — [JJR Lab](https://www.jjrlab.com/news/canada-electrical-product-compliance-certification.html) (test-lab marketing; secondary)
- **Ontario's exception** covers equipment on the output side of an **approved Class 2 power supply limited to 100 VA and ≤42.4 V peak or DC**. Equipment with an **integral power supply does not qualify** and still needs approval. — [ESA (Ontario)](https://esasafe.com/electrical-products/product-approval-exceptions/)
- The premise of CEC Section 16 is that voltages **below 30 V** pose no shock hazard and power **below 100 VA** poses no fire hazard. — [Electrical Industry News](https://electricalindustry.ca/latest-articles/guide-to-the-canadian-electrical-code-part-section-16-class-1-class-2-circuits/)
- CSA C22.2 No. 338 covers Class 2 USB outlets and combination receptacles. Its status is unclear: the SCC notice says "in development", while the CSA store lists a first edition. — [SCC](https://scc-ccn.ca/standards/notices-of-intent/csa-group/type-class-2-power-supplies-usb-and-combination-devices-1)

**Battery transport (UN38.3)**
- Cost estimates vary widely: **US$5,000–7,000** (one guide), **US$2,000–7,000 with 3–6 weeks** (another), about **US$300–930** in lab fees (one Chinese lab), and **£1,000–5,000 per test series** (a UK source). — [Epec](https://blog.epectec.com/understanding-un-38-3-testing-a-timeline-guide-for-oems); [Ufine Battery](https://www.ufinebattery.com/blog/essential-guide-to-battery-certification-types-costs-timeframes-and-standards/); [JJR Lab](https://www.jjrlab.com/news/how-much-does-un383-testing-cost.html) (attribution best-effort)
- Testing usually needs **16 rechargeable battery samples**, and cells without existing certification may need **25 more cells**. Turnaround is commonly **4–6 weeks**. — [Epec](https://blog.epectec.com/understanding-un-38-3-testing-a-timeline-guide-for-oems)
- In **2025**, new testing requirements were created for sodium-ion cells, and the cycling requirement was reduced. — [Epec](https://blog.epectec.com/understanding-un-38-3-testing-a-timeline-guide-for-oems)

**Bilingual and French-language labelling**
- **Quebec (Bill 96)**:
  - From **1 June 2025**, non-French trademarks on packaging and labelling must be **registered or translated**, and generic or descriptive words in registered marks must also appear in French.
  - The rule that no language may be given greater prominence than French on products sold in Quebec has applied **since 1977**.
  - Until **1 June 2027**, non-compliant products may still be sold if they were made before 1 June 2025 and meet the trademark condition.
  - Source: [McCarthy Tétrault](https://www.mccarthy.ca/en/insights/blogs/consumer-markets-perspectives/french-language-requirements-bill-96-and-june-1-2025-common-misconceptions)
- A **January 2024 draft regulation** would extend the trademark exemption to marks with **pending** applications. Its final adoption was not confirmed. — [BLG](https://www.blg.com/en/insights/2024/02/quebec-proposes-amendments-and-clarifications-to-bill-96-requirements-part-i)

### Inferences
- **Which module to choose.** Pick an ESP32-S3 module with **full** modular approval under both FCC and ISED for the node and the hub, and use its antenna and layout rules unchanged. If an external antenna is needed to get signal out of the fridge, choose a module variant whose grant already covers that antenna type rather than modifying one; modifying it triggers C2PC or a new FCC ID. Verify each part number's grant on the FCC ID search and the ISED Radio Equipment List.
- **Certification budget.** These are inferences, with US figures converted at 1.40.
  - **Modular, USB-powered kit (2 SKUs):** FCC 15B/SDoC, ICES-003, RF-exposure checks and one retest come to about **C$5k–20k** and **1–2 months**.
  - **Non-modular radio, or a modified antenna:** add about **C$11k–28k+ per product**.
  - **Battery-powered node:** add about **C$3k–10k** for UN38.3 per pack design, plus **4–6 weeks**. Other battery-safety standards (see Gaps) are extra. Buying cells or packs that already have UN38.3 reports reduces the risk.
- **The FCC lab rule changes where to test.** If the October 2026 order passes as drafted, any FCC testing after **1 December 2028** must use non-China labs. A first production run realistically lands in 2028–2029, so plan certification with a lab in Canada, the US or another recognised country. One lab recognised by both ISED and the FCC can cover both markets in one engagement. The cost of moving testing out of Shenzhen should be budgeted. Whether the rule reaches **SDoC** testing, and whether it affects already-issued module grants, is unverified (see Gaps).
- **Power from outside the fridge.** USB power from a **purchased, already-certified Class 2 adapter**, with no mains inside the fridge, fits the logic of the Ontario exception, though Alberta's own rule must be confirmed. It also avoids the integral-power-supply trap. Large retailers may still demand safety listings regardless. Battery-powered nodes avoid the adapter question but add UN38.3 and cold-charging problems; the earlier build guide already recommends USB power for v1.
- **Selling in Quebec.** Plan French packaging, manuals, in-app text and an app-store listing from the first retail SKU. Register the brand as a trademark early, because registered status matters under Bill 96.
- **Materials near food.** The nodes are not intended food-contact articles, but they sit beside unwrapped food in a cold, humid box. Specify plastics with food-contact compliance declarations, avoid PVC cables with plasticisers, and keep printed PLA/PETG away from unwrapped food (via earlier build guide). Ask a compliance consultant whether Health Canada or FDA food-contact rules, or California Prop 65 warnings, apply.

### Gaps
- **ISED fees** for certification and radio-equipment listing: not found.
- The **federal Consumer Packaging and Labelling Act** requirements (bilingual identity, net quantity, dealer name) and ISED's requirement for English/French compliance statements in manuals were not retrieved.
- **Alberta's specific approved-equipment rule** for extra-low-voltage, USB-powered devices was not verified; the cited exemption is Ontario's.
- The **IATA rule limiting lithium-ion state of charge to 30%** for batteries "packed with equipment" was not confirmed, nor whether it applies in 2026.
- **IEC 62133 / UL 2054** battery-safety requirements and costs were not researched.
- **Food-contact materials:** Health Canada's Letters of No Objection and FDA food-contact substance rules were not researched.
- **Distributing uncertified beta units:** the FCC pre-authorisation marketing rules and their ISED equivalent for 10 beta units given to testers were not researched. A test lab or lawyer should confirm.
- Whether the pending FCC China-lab order covers **SDoC testing**, and whether it affects **existing module grants**, is unknown.

---

## 3. Privacy, security and liability: in-home cameras, PIPEDA, Alberta PIPA, US state laws including BIPA, data retention, IoT security labels, and product liability for freshness alerts

### Takeaway
- **Canadian law is in flux.** Bill C-36, which would enact the **Protecting Privacy and Consumer Data Act (PPCDA)** and replace PIPEDA's private-sector rules, was tabled **15 June 2026** and is **not law**. Alberta's PIPA is unchanged but under review.
- **The OPC's 2020 guidance** for IoT manufacturers explicitly covers in-home cameras.
- **Avoid capturing people.** Photographing only when the door is closed, and never processing faces, removes most of the people problem, including BIPA. Most US state privacy laws have thresholds a startup won't hit, but Texas, Nebraska and Connecticut's sensitive-data trigger are exceptions.
- **No security label is available yet.** The US Cyber Trust Mark has a new lead administrator (ioXt, April 2026) but is **not yet certifying products**, and no Canadian equivalent was found.
- **Liability:** Health Canada's incident reporting applies from the first sale (2 days, then a 10-day written report). Freshness alerts must read as reminders with their basis shown, never as safety verdicts.
- A lawyer is needed for the privacy policy, consent flows, Terms of Service, beta agreements, the US-state and BIPA analysis, and insurance.

### Cited Findings

**Canada: federal and Alberta private-sector privacy law**
- **Bill C-36** was tabled on **15 June 2026**. It would enact the PPCDA and repeal the private-sector privacy parts of PIPEDA, and it is at second reading in the House of Commons, so it is **not law**. — [Lawson Lundell](https://www.lawsonlundell.com/publication/canada-rewriting-privacy-rule-book-bill-c-36); [MLT Aikins](https://www.mltaikins.com/insights/implications-of-canadas-proposed-privacy-overhaul-bill-c-36-for-organizations/)
- The predecessor, **Bill C-27**, died when Parliament was prorogued in **January 2025**. In **June 2025**, Minister Evan Solomon confirmed it would not return in its original form. — [Osler](https://www.osler.com/en/insights/reports/2025-legal-outlook/canadas-2026-privacy-priorities-data-sovereignty-open-banking-and-ai/) (attribution best-effort)
- **Alberta PIPA:**
  - A Standing Committee on Resource Stewardship review produced **12 recommendations**, followed by an **early-2026 consultation** on modernising the Act.
  - The recommendations sit with Cabinet, and as of **June 2026 no amendment bill** had been introduced.
  - Sources: [ClearBreach](https://clearbreach.ca/guides/alberta-pipa-reform-update/) (secondary); [McLennan Ross](https://www.mross.com/what-we-think/article/alberta-s-private-sector-privacy-law--consultation-on-potential-legislative-updates); [Legislative Assembly of Alberta committee paper](https://www.assembly.ab.ca/docs/default-source/committees/rs/pipa-emerging-issues.pdf?sfvrsn=fb63a400_1); [OPC issue sheets on the PIPA review, Sept 2024](https://www.priv.gc.ca/en/privacy-and-transparency-at-the-opc/proactive-disclosure/opc-parl-bp/ab_20240924/is_ab_20240924/)
- PIPA is "substantially similar" to PIPEDA, which keeps it in force for business within Alberta. Alberta would need to align with C-36 to keep that status once C-36 is enacted. — [Kukie](https://kukie.io/blog/provincial-privacy-laws-vs-pipeda-substantially-similar); [MLT Aikins](https://www.mltaikins.com/insights/implications-of-canadas-proposed-privacy-overhaul-bill-c-36-for-organizations/)
- **OPC guidance for IoT manufacturers (20 August 2020; still the operative OPC guidance found):**
  - It covers companies that build, design or are responsible for devices with sensors that collect personal information, with **cameras, doorbells, locks and smoke detectors** as examples.
  - It explains how PIPEDA applies and includes a **compliance checklist**.
  - A companion consumer document, "Smart Devices and Your Privacy", accompanies it.
  - Sources: [OPC announcement](https://priv.gc.ca/en/opc-news/news-and-announcements/2020/an_200820/); [IAPP](https://iapp.org/resources/article/opc-privacy-guidance-for-manufacturers-of-internet-of-things-devices)
- Manufacturers should also consider whether provincial private-sector privacy laws apply. — [Bereskin & Parr](https://www.bereskinparr.com/doc/making-connected-devices-federal-privacy-commissioner-publishes-guidance-for-manufacturers-of-intern)

**US: BIPA and state comprehensive privacy laws**
- **Illinois BIPA:**
  - Public Act 103-0769 (SB 2979), effective **2 August 2024**, says statutory damages are assessed **per person and per method, not per scan**. — [Seyfarth](https://www.seyfarth.com/news-insights/bipa-legislative-update-governor-pritzker-signs-amendment-limiting-damages-to-a-single-recovery-1.html)
  - On **1 April 2026**, the Seventh Circuit held in *Clay v. Union Pacific* that the amendment applies to cases already pending. — [Sidley Data Matters](https://datamatters.sidley.com/?p=8861); [Polsinelli](https://www.polsinelli.com/biometric-privacy-law/publications/bipa-amendment-limiting-damages-applies-retroactively)
- **State comprehensive privacy laws:**
  - The common trigger is **100,000 consumers**, or a lower count combined with revenue from data sales.
  - **Connecticut** dropped its threshold to **35,000** from July 2026, and its sensitive-data and sale triggers **no longer have a minimum processing threshold**. — [Morgan Lewis, July 2026](https://www.morganlewis.com/pubs/2026/07/us-state-consumer-privacy-law-update-notable-changes-across-existing-frameworks)
  - Thresholds elsewhere:

    | State | Threshold |
    |---|---|
    | Delaware, Rhode Island | 35,000, or 10,000 with 20% of revenue from data sales |
    | Maryland | 35,000 |
    | Montana | 25,000 |
    | Alabama (effective 1 May 2027) | 25,000 |
    | Utah | US$25M revenue **and** 100,000 consumers |
    | **Texas (TDPSA)**, Nebraska | Applies to any business that is not "small" under SBA definitions |

  - Sources for the table: [Consently](https://consently.net/blog/us-state-privacy-laws); [Beancount, Aug 2026](https://beancount.io/blog/2026/08/04/state-privacy-laws-2026-indiana-kentucky-rhode-island-texas-no-threshold-small-business-guide). These are secondary; verify against the statutes or a firm chart such as [Troutman's](https://www.troutman.com/wp-content/uploads/2024/12/U.S.-State-Comprehensive-Privacy-Laws-Chart-January-2025-revised-2.pdf).

**IoT security labels**
- **US Cyber Trust Mark:**
  - UL Solutions withdrew as Lead Administrator effective **19 December 2025**.
  - The FCC took applications from **7 January to 9 February 2026** and selected the **ioXt Alliance** on **13 April 2026**.
  - Sources: [FCC DOC-420764](https://docs.fcc.gov/public/attachments/DOC-420764A1.pdf); [Business Wire](https://www.businesswire.com/news/home/20260413891952/en/FCC-Names-ioXt-Alliance-Lead-Administrator-for-U.S.-Cyber-Trust-Mark-Program)
- On **11 August 2026** the FCC opened a filing window for Cybersecurity Label Administrator applications, and it is still reviewing implementation details such as the structure of the registry. — [FCC Cyber Trust Mark](https://www.fcc.gov/CyberTrustMark)
- One analysis says the programme is **not yet accepting product certification applications**. — [WeSpeakIoT](https://www.wespeakiot.com/u-s-cyber-trust-mark-new-lead-administrator/)
- A claim that the label becomes mandatory for federal suppliers from January 2027 could **not be verified**.

**Product safety and liability**
- **Canada Consumer Product Safety Act (CCPSA) s.14:**
  - Anyone who manufactures, imports or sells a consumer product for commercial purposes must give Health Canada (and their supplier) all information about an incident **within 2 days** of becoming aware of it.
  - **Manufacturers and importers** must also file a **written report within 10 days**.
  - Reportable incidents cover: serious harm or death; a defect that could cause such harm; labelling or instructions that could cause it; and a recall or corrective measure taken abroad.
  - Supporting records must be kept **in Canada for 6 years**.
  - Sources: [CCPSA s.14](https://laws-lois.justice.gc.ca/eng/acts/C-1.68/section-14.html); [Health Canada guidance](https://www.canada.ca/en/health-canada/services/consumer-product-safety/reports-publications/industry-professionals/canada-consumer-product-safety-act-information-direct-sellers.html); [Bennett Jones](https://www.bennettjones.com/Insights/Updates/The-Canada-Consumer-Product-Safety-Act-New-Obligations-for-Manufacturers-Importers-and-Sellers-of-Consumer-Products)
- **Authorities to anchor freshness wording on (via earlier build guide):**
  - CFIA: a best-before date "is not an indicator of food safety, neither before nor after the date" — [CFIA](https://inspection.canada.ca/en/food-labels/labelling/industry/date-markings-and-storage-instructions).
  - CFIA: "some foods will become unsafe before they spoil" — [CFIA](https://inspection.canada.ca/en/inspect-and-protect/food-safety/three-facts-about-best-dates-can-save).
  - USDA calls FoodKeeper storage times "useful guidelines and … not hard-and-fast rules" — [USDA](https://www.usda.gov/about-usda/news/blog/usda-updates-foodkeeper-app-include-new-food-items).
  - Disease-causing bacteria generally don't change how food looks, smells or tastes — [SFDA](https://sfda.gov.sa/en/faq/do-spoilage-bacteria-make-people-sick).
  - **55.4%** of 361 Scottish fridges averaged above 5 °C — [Food Standards Scotland](https://www.foodstandards.gov.scot/sites/default/files/migration/downloads/FROST_Final_Report_June_2025.pdf).

### Inferences
- **Collect less in the first place.**
  - Capture only after the door has stayed shut (the earlier build guide's design), so frames show shelves rather than people.
  - Drop any frame with motion or a person in it, and never run face recognition or face-geometry analysis.
  - Strip metadata.
  - Keep raw images briefly (e.g., delete after processing, or after N days by user choice) and retain only the derived inventory.
  - Give users one-tap export and delete.
  - Each step shrinks the PIPA/PIPEDA consent burden, breach exposure and BIPA risk at once.
- **Treat every image as personal information.** Photos of a household's interior, linked to an account, should be handled that way under PIPA/PIPEDA (and C-36 if enacted). Get express consent at setup. Disclose the **cloud AI subprocessors and cross-border processing**, since frames go to a US model provider. Write a retention schedule. *Lawyer needed.*
- **BIPA exposure** should be low if faces are never processed, but cloud vision models may "see" incidental faces. Have a lawyer review the no-face design, and consider explicit Illinois terms. *Lawyer needed.*
- **US state laws** are unlikely to apply until the startup has tens of thousands of users per state. The exceptions are **Texas and Nebraska**, which use a non-small-business test, and Connecticut's **sensitive-data** trigger. Avoid features or marketing that infer health conditions from food data.
- **Security baseline now, label later.** Use unique per-device credentials, signed OTA updates, no open inbound ports, encrypted transport, a vulnerability-disclosure contact and a stated support period. Pairing these with the OPC checklist positions the product for the Cyber Trust Mark whenever it opens to products. The exact Cyber Trust Mark criteria were not retrieved.
- **Liability levers, in order:**
  1. **UI and claims copy.** Never use "fresh", "safe" or "spoiled". Show the basis ("day 9 of a typical 5–7"). Treat "check it" as the strongest state, and recommend a fridge thermometer, or include a temperature sensor, because the windows assume ≤4 °C.
  2. **Terms of Service and disclaimers** with limitation of liability, whose enforceability against consumers needs a lawyer.
  3. **Product liability insurance** before units go into strangers' homes.
  4. A **CCPSA incident-handling and recall process** from the first sale. Battery, electrical and mounting hazards are likelier CCPSA incidents than food illness.
- **Where a lawyer is needed:**
  - privacy policy and consent UX;
  - Terms of Service and beta-tester agreement;
  - US-state and BIPA exposure;
  - cross-border data transfer;
  - product liability and insurance;
  - crowdfunding reward terms;
  - Quebec's Law 25 if selling in Quebec (not researched).

### Gaps
- **Quebec Law 25**, the strictest Canadian private-sector regime, was not researched.
- **Alberta PIPA breach-notification** mechanics were not verified.
- **Washington's My Health My Data Act**, which may matter if food data is treated as health data, was not researched.
- BIPA's statutory **damages amounts** and the statute's **photograph exclusion** were not verified.
- No **Canadian consumer-IoT security label** or mandatory standard was found; the search returned only US results.
- No case law or guidance was found on **liability for app-based food-safety advice**.
- **Product liability insurance premiums** for a small consumer-electronics startup were not researched.
- **COPPA and children in homes** were not researched.

---

## 4. IP: provisional patent costs and timelines in the US and Canada, trademarks, trade secrets, and whether patenting is worth it

### Takeaway
- **A US provisional is cheap.** Self-filed, it costs **US$65 (micro entity) or US$130 (small entity)**; professional drafting is about US$3k (single source). It buys a 12-month "patent pending" window before public disclosure.
- **Canada charges reduced small-entity fees in 2026:** about **C$241** to file and **C$482** to request examination.
- **Prior art is dense.** Bosch shelf cameras date from 2015, and there is Samsung AI Vision Inside, Smarter FridgeCam, HNGRYnsite and Haier's anti-fog fridge-camera patent. Broad claims are unlikely to hold.
- **Worth it at this stage:** a cheap provisional before any public launch, plus a trademark and disciplined trade secrets (the dataset, prompts and reconciliation logic). A full patent programme isn't worth funding yet.
- A **registered patent agent** is needed before relying on any filing.

### Cited Findings
- **USPTO provisional filing fee, 2026:** **US$325** (large entity), **US$130** (small), **US$65** (micro). — [Beancount, Aug 2026](https://beancount.io/blog/2026/08/31/uspto-2026-fee-schedule-small-business-trademark-patent-budget-guide); [Innovent Law](https://www.innoventlaw.com/uspto-patent-fees-friendly-guide/)
  - The micro-entity fee is set in the fee schedule under **37 CFR 1.16(d)** — [PatentAILab](https://patentailab.com/micro-entity-patent-cost-loophole/).
  - The **small-entity** 60% reduction under 37 CFR 1.27 applies to individuals and businesses with fewer than 500 employees — [Oppenhuizen](https://www.oppenhuizen.com/what-does-it-mean/).
- **Micro-entity income cap:** one source gives **US$262,380 since 15 September 2026**, another about **US$251,190** (2025). The sources conflict, so check USPTO guidance. — [PatentAILab](https://patentailab.com/micro-entity-patent-cost-loophole/)
- **Full US utility filing** (filing + search + examination) costs about **US$2,000 / 800 / 400** (large / small / micro), per one table. — [AdvoraHQ](https://advorahq.com/how-much-does-a-patent-cost/) (attribution best-effort)
- One result gave about **US$3,000** for a professionally drafted provisional. It could not be verified. — [Michael Meyer Law](https://www.michaelmeyerlaw.com/blog/how-much-does-a-patent-cost-complete-2026-fee-guide/) (attribution best-effort)
- **CIPO (Canada) 2026:** most patent fees rose **2.7% on 1 January 2026**. Small-entity versus standard fees:

  | Fee | Small entity (C$) | Standard (C$) |
  |---|---|---|
  | Application | 241.24 | 595.06 |
  | Examination request | 482.48 | 1,190.13 |
  | Final fee | 181.20 | 446.03 |
  | Maintenance, 2nd–4th anniversaries | 60.26 | 134.02 |

  - Sources: [Lexpert](https://www.lexpert.ca/news/legal-faq/how-much-does-a-patent-cost-in-canada/393696); [CIPO fees page](https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en/node/39). The official page snippet confirmed only the maintenance figures.
- CIPO fees rose **about 25% in 2024**, and "small entity" was broadened from 50 to **fewer than 100 employees** — [Canada IP Blog](https://canadaipblog.com/?p=1585). Another guide still says "50 or fewer", so the threshold is in conflict.
- CIPO **accepts small-entity declarations on the applicant's word**, which leaves the legal risk with the applicant. — [LawyerInfo](https://lawyerinfo.ca/guides/money-taxes-ip/intellectual-property/small-entity-declaration-for-canadian-patents-do-you-qualify/)
- **Prior art in this category (via earlier build guide):**
  - Bosch announced shelf cameras at **IFA 2015** — [Reviewed](https://reviewed.com/refrigerators/news/this-app-shows-you-whats-in-your-fridge).
  - Haier holds a patent on an **anti-fog fridge camera module** — [US11122203](https://patents.google.com/patent/US11122203).
  - Samsung AI Vision Inside, Smarter FridgeCam and Liebherr HNGRYnsite all shipped camera-in-fridge inventory products (see Q1).

### Inferences
- **Is patenting worth it?**
  - For a solo, cash-constrained founder: **a provisional, yes, as cheap insurance before public disclosure; a full patent programme, not yet.**
  - Broad "camera in fridge recognises food and tracks storage time" claims run into a decade of shipped products.
  - Any allowable claims are likely narrow, such as a specific multi-node retrofit geometry, or scan-to-scan reconciliation and confidence logic.
  - A small company also could not afford to enforce a patent against Samsung or LG.
  - What a pending application mainly gives is investor optics and some defensive value.
- **File the provisional before any public disclosure:** Kickstarter, demo days, a CDL pitch, YouTube or a public GitHub. Disclosure can destroy rights in absolute-novelty jurisdictions. Decide within 12 months, with a patent agent, whether to convert to a non-provisional or PCT application.
- **Trade secrets are the real moat.** That means the labelled fridge-photo dataset (the earlier build guide calls it the project's most durable asset), prompts, confidence thresholds, reconciliation rules and the firmware power-gating tricks. Protect them with NDAs, IP-assignment agreements from every contractor and co-founder to the corporation, access control, and by keeping model-facing logic server-side.
- **Trademark the brand early** in Canada and the US. Quebec's Bill 96 makes registered status matter for packaging (Q2), and a NUANS corporate-name search is **not** a trademark clearance. CIPO and USPTO trademark fees were not retrieved (see Gaps).
- **Professionals needed:** a registered patent agent for any filing beyond a self-filed provisional, and for freedom-to-operate questions; a lawyer for IP-assignment and NDA templates.

### Gaps
- **Canada's lack of a provisional application**, the 12-month Paris Convention priority window and Canada's 12-month grace period for an inventor's own disclosure are widely understood but **were not verified** in this session; confirm with a patent agent.
- Patent agent and attorney fees for Canadian filings, full cost-to-grant per country, and PCT costs: not retrieved.
- **CIPO and USPTO trademark fees** for 2026: not retrieved.
- Canadian and US **trade-secret law** basics: not researched.
- **Freedom-to-operate search costs**: not researched.
- Programmes that subsidise IP strategy were not verified: **ElevateIP** in Alberta, and IRAP's IP support. An aggregator listing titled "NRC IRAP support for intellectual property" exists ([HelloDarwin](https://hellodarwin.com/business-aid/programs/nrc-irap-support-for-intellectual-property)), but its details were not retrieved.

---

## 5. Funding options 2025–2026: IRAP, SR&ED, Alberta Innovates, AEC-backed funds, Platform Calgary, Edmonton Unlimited, CDL, Futurpreneur, BDC, angels, YC, crowdfunding, VC appetite and round sizes

### Takeaway
**Non-dilutive money needs a corporation and is mostly cost-shared or reimbursed:**
- **SR&ED** pays 35% refundable to CCPCs on up to **C$6M** of spending (Budget 2025, now law).
- **Alberta's IEG** adds up to about 20%.
- **IRAP** first projects are typically **C$75k–200k** (aggregator figures).
- **Alberta Innovates** offers vouchers of **C$10k / C$100k** and the PDP at **C$150k**. All show "registration closed 29 May 2026" alongside "continuous intake", which is contradictory.
- **Futurpreneur** lends up to **C$75k** to founders aged 18–39.

**Equity:**
- AEC's **Accelerate Fund IV** matches angels up to **C$500k**.
- **CDL Rockies** takes no equity, but its 2026/27 deadline passed on 24 July 2026.
- **YC** still offers **US$500k**, with hard tech rising to about 20% of recent batches.
- **HAX** offers **US$250k** and is now deep-tech focused.

**Crowdfunding:** Kickstarter's Technology category succeeds about **25%** of the time, and at most a third of funded hardware campaigns delivered on time.

**VC:** appetite for standalone consumer smart home is selective. Generic seed rounds are **US$2–4M**, and hardware raises more.

### Cited Findings

**NRC IRAP**
- Eligibility:
  - an **incorporated, for-profit business** in Canada with **fewer than 500 FTEs**;
  - developing technology-based products with real technical uncertainty;
  - able to **co-fund** its share;
  - startups can apply, but most guides expect **technical readiness** beyond the idea stage;
  - routine operations, sales and administration are ineligible.
  - Sources: [GrantCompass](https://grantcompass.ca/irap-funding-canada.html); [GrantHub](https://granthub.ca/guide/national-research-council-irap); [GrantOps](https://grantops.ai/en/irap/). **All are aggregators; nrc.canada.ca was unreachable.**
- Amounts: about **C$75,000 to C$1M+** per project, with first-time applicants typically getting **C$75,000–200,000** (one guide). Another lists up to **75% of project cost**, with a ceiling of **C$10M per year**. — [GrantCompass](https://grantcompass.ca/irap-funding-canada.html); [ImpactApplications](https://impactapplications.ca/irap)
- A new "**Defence Industry Assist**" stream appears in only one source and is unverified. — [Enno](https://enno.ca/nrc-irap-canada-sme-rd-funding-2026/)

**SR&ED (federal) and Alberta's Innovation Employment Grant**
- Budget 2025 raised the expenditure limit for the **35% enhanced refundable credit** for CCPCs from **C$3M to C$6M**. It applies to tax years beginning on or after **16 December 2024**, and the taxable-capital phase-out band moved to **C$15M–75M** (from C$10–50M). — [Mintz](https://www.mintz.com/insights-center/viewpoints/2906/2025-11-12-innovate-baby-innovate-key-enhancements-canadas-sred); [ThinkAccounting](https://thinkaccounting.ca/blog/sred-tax-credits-2025-2026-updates/); [Leyton](https://leyton.com/ca/en/insights/articles/federal-budget-2025-sred-program-expansion/)
- The Budget 2025 measures received **Royal Assent**. — [SR&ED Education](https://www.sreducation.ca/budget-2025-receives-royal-assent-what-this-means-for-sred/). Earlier sources describe the C$6M limit as "proposed", so check the final legislation, as the summary advised.
- The maximum is about **C$2.1M** of refundable credits per year at C$6M, and associated corporations share the limit. — [Mintz](https://www.mintz.com/insights-center/viewpoints/2906/2025-11-12-innovate-baby-innovate-key-enhancements-canadas-sred)
- **Alberta Innovation Employment Grant (IEG):**
  - Headline rate of "up to 20%" of qualifying spending. Sources disagree on the split: an 8% base plus an enhanced rate given as 12% in one source and 20% in another.
  - Covers up to **C$4M of annual R&D spending**, phasing out between **C$10M and C$50M** of taxable capital.
  - Filed with the AT1 corporate return (Schedule 29), with the federal T661 as a prerequisite. It appears active for 2026.
  - One aggregator says Alberta's 2025 budget made it permanent; this could not be verified.
  - Sources: [GovMoney](https://govmoney.ca/programs/alberta-ieg); [Canada Business Grants](https://canadabusinessgrants.com/alberta/innovation-employment-grant-ieg/); [HelloDarwin](https://hellodarwin.com/business-aid/programs/innovation-employment-grant)

**Alberta Innovates**

| Programme | Ceiling | Notes | Source |
|---|---|---|---|
| Micro Voucher | C$10,000 | For Alberta tech companies to design or develop solutions | [Alberta Innovates](https://albertainnovates.ca/funding/micro-voucher-program/) |
| Voucher | C$100,000 | For new-product commercialisation; Alberta-footprint test; Technology Development Advisor engagement | [Alberta Innovates](https://albertainnovates.ca/funding/voucher-program/); [May 2026 guide](https://albertainnovates.ca/wp-content/uploads/2026/05/Voucher-Standardized-Program-Guide-May-2026.pdf) |
| Product Demonstration Program | C$150,000 | | [Alberta Innovates](https://albertainnovates.ca/funding/product-demonstration-program/) |
| Alberta Digital Traction | C$50,000 | Software-focused companies | [Alberta Innovates](https://albertainnovates.ca/funding/alberta-digital-traction-program/) |

- **Intake status is contradictory.** All four pages show "**Registration closed: May 29, 2026 4:00 pm MDT**" next to "accepting applications on a continuous basis". One aggregator headline reads "**Vouchers Paused**". — [GrantCompass](https://grantcompass.ca/alberta-startup-grants.html)
- Aggregators say the vouchers cover **up to 75%** of admissible expenses, and one says **matching is required**. — [HelloDarwin](https://hellodarwin.com/business-aid/programs/alberta-innovates-voucher-program)
- The NSERC Alliance / Alberta Innovates Advance route, which requires an academic partner, had an EOI deadline of **14 September 2026** and a full-application deadline of **2 November 2026**. — [Alberta Innovates](https://albertainnovates.ca/funding/nserc-alliance-alberta-innovates-advance-program/)

**Platform Calgary, Edmonton Unlimited and Alberta Catalyzer**
- **Alberta Catalyzer** is a **free**, merit-based pre-accelerator co-delivered by **Platform Calgary and Edmonton Unlimited**. It is part of the Alberta Scaleup and Growth Accelerator Program, run by a consortium led by Alberta Innovates. — [Edmonton Unlimited](https://edmontonunlimited.com/accelerators/alberta-catalyzer/); [BetaKit](https://betakit.com/platform-calgary-and-innovate-edmonton-launch-new-pre-accelerator-alberta-catalyzer/)
- It runs three tracks, Engage, Traction and Velocity. Funding is set at consortium level (**C$35M over three years** for accelerators), not paid as founder grants. — [BetaKit](https://betakit.com/platform-calgary-and-innovate-edmonton-launch-new-pre-accelerator-alberta-catalyzer/)
- The latest cohort news found was **Cohort 18, late 2025**. — [Alberta Catalyzer](https://albertacatalyzer.com/news/velocity-north-cohort12)
- A 2026 City of Calgary document describes new Platform Calgary–Edmonton Unlimited programming for companies with about **C$100k–1M ARR**. — [City of Calgary CD2026-0060](https://pub-calgary.escribemeetings.com/filestream.ashx?DocumentId=360271)
- No founder cash awards were confirmed.

**Creative Destruction Lab (CDL) Rockies**
- CDL Rockies is housed at UCalgary's Haskayne School and "takes no equity or intellectual property and charges no fees". Its focus areas are energy evolution, AgTech and "technological innovations solving industries' biggest problems". — [Haskayne](https://haskayne.ucalgary.ca/cdl-rockies)
- Its Prime stream is aimed at early-stage ventures. — [CDL Rockies Prime](https://creativedestructionlab.com/streams/prime/rockies/)
- The 2026/27 general deadline was **24 July 2026**, and applications are now closed. — [CDL](https://creativedestructionlab.com/apply)

**Futurpreneur and BDC**
- Futurpreneur offers up to **C$75,000** of collateral-free financing with mentorship, in collaboration with BDC, for ages **18–39** and businesses up to 24 months old. This comes from a **September 2024** announcement; no 2025–2026 update was found. — [Futurpreneur](https://futurpreneur.ca/en/?p=10931); [BetaKit](https://betakit.com/as-futurpreneur-grows-its-loan-offering-ontario-cuts-funding/)
- A **"Side Hustle"** track offers up to **C$25,000** to people who keep a full-time job, provided the business stays their secondary income for 12 months. The page URL is BC-specific (`sidehustle-bc`), so availability in Alberta is unconfirmed. — [Futurpreneur Side Hustle](https://futurpreneur.ca/en/explore/sidehustle-bc/)

**Alberta Enterprise Corporation (AEC) and angels**
- **Accelerate Fund IV** was launched in **December 2024** with a **C$15M** AEC anchor, putting it more than halfway to its **C$25M** target. — [BetaKit](https://betakit.com/alberta-enterprise-corporation-launches-accelerate-fund-iv-with-15-million-for-early-stage-tech-startups-in-the-province/); [Newswire](https://www.newswire.ca/news-releases/alberta-enterprise-corporation-invests-15-million-into-its-fourth-accelerate-fund-for-tech-startups-855945427.html)
- It co-invests **up to C$500,000** on the same terms as angels, family funds and foundations, who must **match or exceed** its amount.
  - Eligibility: a **head office and more than 50% of employees in Alberta**, proprietary technology, and a **committed angel**.
  - Since 2012 it has backed 46 companies, with about 10× leverage.
  - Source: [BetaKit](https://betakit.com/alberta-enterprise-corporation-launches-accelerate-fund-iv-with-15-million-for-early-stage-tech-startups-in-the-province/)
- Fund III was managed by **Yaletown Partners with The A100**, with AEC as lead LP and the Opportunity Calgary Investment Fund also an LP. — [Automation Magazine](https://www.automationmag.com/alberta-enterprise-accelerate-fund-iv/) (attribution best-effort)

**Y Combinator and HAX**
- YC's standard deal is still **US$500k**: **US$125k for 7%** on a post-money SAFE, plus **US$375k** on an uncapped SAFE with a most-favoured-nation clause. — [Rebel Fund](https://www.rebelfund.vc/blog-posts/y-combinator-winter-2026-batch-true-costs-breakdown)
- YC's "State of Startups 2026" talk reportedly puts **hard tech at 20% of recent batches, up from 8%**. — [Dealroom](https://dealroom.co/news/talk-yslXlV2BP_Y-the-state-of-startups-2026-bits-to-atoms-solo-founders-and-hard-tech/)
- An analysis of the **W26** batch found about **14%** of companies build physical products. — [Extruct](https://www.extruct.ai/research/ycw26)
- YC's hardware directory listed about **113–115** companies in 2026, and there is a separate consumer-electronics category. — [YC hardware](https://ycombinator.com/companies/industry/hardware); [YC consumer electronics](https://www.ycombinator.com/companies/industry/consumer-electronics)
- No hardware-specific YC deal terms were found.
- HAX terms are in Q1: **US$250k** first cheque, deep-tech branding, Newark residency.

**Crowdfunding as pre-sales**
- Kickstarter success rates as of **January 2026**: **42.74%** overall and **24.93%** for Technology. Kickstarter takes **5%** of successful campaigns, plus payment processing fees. — [Voxbooster, citing Kickstarter stats](https://voxbooster.com/blog/fan-funding-statistics-2026) (secondary)
- A **2018 *Design Science*** review of **144 successfully funded Kickstarter hardware campaigns** found **no more than 32%** delivered on time. Delayed projects were significantly more likely to ship products missing promised features. — [Cambridge *Design Science*](https://www.cambridge.org/core/journals/design-science/article/identifying-challenges-in-crowdfunded-product-development-a-review-of-kickstarter-projects/F2659234936B8349EAF5AFCFBA2199E8) (**dated**, but the most rigorous source found)
- "75% of tech projects funded on Kickstarter don't finish on time". — [BrainStation](https://brainstation.io/magazine/75-of-tech-projects-funded-on-kickstarter-dont-finish-on-time) (**dated**)

**VC appetite and round sizes**
- Generic 2026 benchmarks:
  - pre-seed about **US$150k–1M**;
  - seed about **US$2–4M** (one cites a **US$3.1M** median);
  - deep-tech or hardware companies "may raise **US$5–10M** seed rounds".
  - Sources: [Pitchwise](https://www.pitchwise.se/blog/median-seed-round-size-by-industry-in-2026-data); [Dealroom.net](https://dealroom.net/faq/funding-stages) (attribution best-effort)
- **Smart home investment sentiment:**
  - Investors treat **Matter compatibility as table stakes**.
  - Standalone smart-home startups face "brutal competition" from Amazon, Google and Apple loss-leader pricing, so exits tend to be **smaller acquisitions**.
  - The Amazon Alexa Fund is described as investing from seed to late stage.
  - Source: [Ellty](https://www.ellty.com/blog/smart-home-investors) (marketing-style roundup)
- **Recent consumer-hardware rounds (September–October 2026):** Lumio raised **US$12M Series A** (led by Blume Ventures), kitchen-appliance startup EDT raised **US$2.4M** (led by Sauce VC), and NOX raised **€3M**. — [VentureRadar](https://peterson.ventureradar.com/funding/smart%20home%20devices)

### Inferences
- **Order of operations for this founder:**
  1. **Before incorporating**: own savings, free programmes (Alberta Catalyzer Engage, makerspaces) and, if eligible, Futurpreneur.
  2. **Incorporate as an Alberta CCPC** before significant R&D spending. IRAP requires incorporation, and the 35% refundable SR&ED rate plus the IEG are tied to corporate filings. Track R&D hours and contractor invoices from day one. *Accountant needed for SR&ED/IEG.*
  3. **Talk to an IRAP ITA** once there is a working beta, because the guides expect technical readiness. Ask Alberta Innovates whether vouchers or the PDP have reopened.
  4. **Pre-sales or crowdfunding** at Stage B.
  5. **Angels plus Accelerate Fund matching** (needs a committed angel, an Alberta head office and proprietary tech).
  6. A **seed round** for the first production run.
- **Non-dilutive money still needs cash up front.** IRAP and vouchers are cost-shared, often 25–50% from the company, and SR&ED/IEG pay out after the tax year. The founder therefore needs bridge cash or a loan (Futurpreneur or BDC) even when grants are approved.
- **Equity investors will want three things first:**
  - evidence that beta households keep using it;
  - pre-sales at a price that clears hardware margin plus cloud AI cost;
  - a **technical co-founder** with hardware or firmware experience.
- Their prior is shaped by FridgeCam and HNGRYnsite failing, Samsung absorbing the feature, and smart-home exits being small. YC and HAX are long shots for a solo, part-time consumer-hardware founder. YC's rising hard-tech share and its talk on solo founders are mild positives, but the 14–20% hard-tech share is dominated by robotics, defence and manufacturing according to the summary of the same talk.
- **Crowdfunding is market validation, not free money.** With a roughly 1-in-4 success rate for Technology campaigns and at most a third of funded hardware delivering on time, campaign only **after** DVT-level confidence and certification planning. Price in about 5% platform fees plus processing, fulfilment and duties. File the provisional patent first (Q4).
- **The CDL Rockies "technological innovations" stream** is a plausible fit for the next cycle, likely with a mid-2027 deadline (inferred from this year's 24 July date). It takes no equity, but it is cohort- and milestone-driven, so it suits a founder with a beta in hand.

### Gaps
- **BDC** startup loan products and terms in 2026: not researched beyond the Futurpreneur partnership.
- **Alberta angel groups** (e.g., VA Angels) and their typical cheque sizes: no results. Only Accelerate Fund and The A100 surfaced.
- **Edmonton Unlimited** and **Platform Calgary** stand-alone programmes, and any 2026 founder grants: not found.
- **Canadian pre-seed and seed medians** (e.g., from CVCA or Carta Canada data): not found. All round-size figures are generic or US.
- Official NRC IRAP figures could not be checked because the site was unreachable.
- **Kickstarter's payment-processing rate**, Indiegogo/BackerKit options, and the GST/HST and revenue-recognition treatment of pre-sales: not researched. *Accountant needed.*
- Whether YC or other US funds require a **Delaware parent ("flip")** for an Alberta company: not researched. *Lawyer needed.*

---

## 6. Founder path: keeping the day job, finding a hardware co-founder, incorporating in Alberta, and the capital and time needed at each stage gate (with the staged plan)

### Takeaway
- Incorporating in Alberta costs about **C$300 in government fees**, roughly **C$400–450 through a registry agent**, or **C$1.2k–1.8k+** as a full lawyer package. Incorporating unlocks IRAP and the enhanced SR&ED rate.
- **Keep the day job through the 10-unit beta**, and probably through the 100–500-unit pilot. Go full-time only when pre-sales or an angel round fund 12–18 months.
- The staged plan below estimates roughly:
  - **C$10k–30k and 6–12 months** to reach 10 beta kits;
  - **C$75k–400k and another 12–18 months** to reach 100–500 units;
  - **C$0.8M–2M and another 12–24 months** to reach a first production run of 1,000–2,000 units.
- That is **3–4 years part-time**, or about **2–2.5 years full-time** with a co-founder and funding.
- Each stage has explicit go/no-go gates.

### Cited Findings
- **Alberta incorporation costs:**
  - **Government fee:** sources conflict: **C$291.75** (September 2026 guide), **C$283.25** and **C$275**. Filing is done **only through an authorised registry agent**, who adds an unregulated service fee. — [2727 Coworking, Alberta guide](https://2727coworking.com/start-a-business-in-canada/provinces/alberta/); [Ontario Business Central](https://www.ontariobusinesscentral.ca/incorporate-in-alberta.php); [2727 Coworking, 2026 comparison](https://2727coworking.com/articles/canada-incorporation-costs-2026-federal-provincial)
  - **Registry agent total:** about **C$400–450**. — [LawyerInfo, April 2026](https://lawyerinfo.ca/guides/alberta/business-law-alberta/business-formation-alberta/how-much-does-it-cost-to-incorporate-a-new-business-in-alberta/)
  - **NUANS name report:** about **C$13.80** (May 2026 comparison) to **C$30–60** (legal guide). — [2727 Coworking](https://2727coworking.com/articles/canada-incorporation-costs-2026-federal-provincial); [LawyerInfo](https://lawyerinfo.ca/guides/alberta/business-law-alberta/business-formation-alberta/how-much-does-it-cost-to-incorporate-a-new-business-in-alberta/)
  - **Full professional package** (lawyer plus minute book): **C$1,200–1,800+**. — [LawyerInfo](https://lawyerinfo.ca/guides/alberta/business-law-alberta/business-formation-alberta/how-much-does-it-cost-to-incorporate-a-new-business-in-alberta/)
  - **Annual return:** **C$90** in Alberta (flagged as the figure most likely outdated) and **C$12** federally. — [2727 Coworking](https://2727coworking.com/articles/canada-incorporation-costs-2026-federal-provincial)
  - **Federal (CBCA) incorporation:** **C$200 online**. A federal corporation operating in Alberta still pays the Alberta extra-provincial fee, but needs no NUANS for that registration. — [2727 Coworking](https://2727coworking.com/articles/canada-incorporation-costs-2026-federal-provincial)
- IRAP requires an **incorporated for-profit** business (Q5 sources), and the 35% enhanced refundable SR&ED rate is for **CCPCs**. — [Mintz](https://www.mintz.com/insights-center/viewpoints/2906/2025-11-12-innovate-baby-innovate-key-enhancements-canadas-sred)
- **Day-job-compatible financing:** Futurpreneur's Side Hustle track lends up to **C$25,000** if the business stays secondary income for 12 months. The page is BC-specific; Alberta availability is unconfirmed. — [Futurpreneur](https://futurpreneur.ca/en/explore/sidehustle-bc/)
- YC's 2026 "State of Startups" talk is titled around "bits to atoms, **solo founders** and hard tech". Only the title and the hard-tech share were retrieved. — [Dealroom](https://dealroom.co/news/talk-yslXlV2BP_Y-the-state-of-startups-2026-bits-to-atoms-solo-founders-and-hard-tech/)
- **Places to meet hardware people in Alberta** (Q1): Protospace and Fuse33 in Calgary, TBD Edmonton, the AIH prototyping lab (Calgary airport), the free Alberta Catalyzer cohorts run by Platform Calgary and Edmonton Unlimited, and the CDL Rockies network.
- **Timeline anchors** (Q1): EVT–PVT takes **16–30 weeks**, and crowdfunded hardware takes **12–18 months** from funding to unboxing. One example seed budget is **US$400k NRE and tooling plus US$600k** for a 1,000–2,000-unit first run, with 18–24 months of runway.
- **Per-camera and running costs (via earlier build guide):**
  - A USB-powered XIAO ESP32-S3 + OV5640 camera build costs about **C$85–165**, and C$80–185 across the three builds.
  - Device AI calls cost about **US$0.65 per camera per month** at 15 captures/day on Haiku 5.5, against about **US$13** on Sonnet 5.5, before skipping unchanged frames.
  - App distribution costs about **C$139/year** for TestFlight and about **C$35 once** for Google Play.
  - Source: [Anthropic pricing](https://platform.claude.com/docs/en/about-claude/pricing) (via earlier build guide)

### Inferences

**Keeping the day job while validating**
- Through **Stage A** the work is evenings and weekends. Software can be built with AI coding tools, and the hardware is dev boards and printed shells.
- Before writing code or filing IP, **check the employment agreement** for IP-assignment or moonlighting clauses. A construction employer is unlikely to claim it, but verify. *Lawyer if unclear.*
- Book customer interviews and beta installs for weekends. Use pre-orders and deposits as the signal for when to quit, not enthusiasm.
- A sensible trigger to go full-time is when the **Stage B gate** is passed **and** cash covers 12–18 months of personal runway plus the production plan.

**Finding a hardware co-founder**
- **The gap to fill:** the founder brings software, AI tooling and the product drive. The missing skills are **embedded/firmware, RF and mechanical/DFM**, and ideally supply-chain experience.
- **Where to look:**
  - the makerspaces and AIH lab (people who already build things);
  - Alberta Catalyzer and CDL cohorts and mentors;
  - capstone projects in UCalgary, UAlberta, SAIT and NAIT engineering programmes;
  - online co-founder matching (not researched).
- **Test the partnership first.** Do a small paid or equity-for-milestone project, such as the EVT PCB, before splitting equity. Use a shareholder agreement with vesting and IP assignment. *Lawyer needed.*
- **Fallback:** hire contract engineers per stage (partly fundable via vouchers, IRAP and SR&ED) and keep the founder as product and software lead.

**Incorporation basics**
- Incorporate an **Alberta CCPC** before the first non-trivial R&D spending or outside money. The Alberta route is about C$700–1,800 depending on DIY versus lawyer (cited ranges).
- **Federal incorporation** (C$200 plus the Alberta extra-provincial fee) is worth it only if name protection nationwide matters before trademark registration.
- Get an accountant who does SR&ED early, and open a business bank account. Issue founder shares at nominal value early, before any value is created.

**The staged plan with go/no-go gates**

All CAD. Figures marked † are unsourced planning assumptions. The rest derive from the cited ranges at US$1 ≈ C$1.40.

| Stage | Goal | Time (part-time solo) | Approx. capital | Main spending | Likely funding | Go/no-go gate (all must pass) |
|---|---|---|---|---|---|---|
| **0. Prove the software and the habit** | Phone-scan PWA plus model bake-off, per the earlier build guide | Months 0–3 | **C$0–1k** | API credits, hosting (≈ free tier), landing page† | Own pocket | (1) Own household uses it ≥4 weeks. (2) A model scores acceptably on 30–50 labelled fridge photos. (3) ≥20 non-family interviews, at least half naming fridge waste or "what do we have?" as a pain they'd pay to fix†. (4) A waitlist of ≥100 sign-ups†. **No-go:** own household stops scanning, or recognition is too poor to be useful. |
| **A. 10 beta kits** | Works-like/looks-like kits (3–6 camera nodes plus hub) in ≥8 *other* households' fridges | Months 3–12 | **C$10k–30k** | Kits ≈ C$300–1,250 each (3–6 × C$80–185 per camera, plus a hub C$50–150†), with 30% spares; tools and printer C$0.5–2k†; incorporation C$0.7–1.8k; lawyer-drafted privacy policy, Terms of Service and beta agreement C$2–6k†; insurance (cost unknown); app-store fees ≈ C$0.2k | Savings; Futurpreneur if eligible; ask Alberta Innovates whether Micro Voucher (C$10k) intake has reopened | (1) ≥8 weeks in ≥8 different fridges. (2) On camera-visible shelves, ≥85–90% of items correctly identified, with "gone" errors under ~5%†. (3) ≥60% of households still weekly-active at week 8†. (4) Wi-Fi, fog and power need no weekly fiddling. (5) ≥30% of testers would pre-pay at target price, or ≥50 paid deposits from strangers†. (6) Projected landed bill of materials at 1k units leaves ≥50–60% hardware gross margin†. (7) Provisional patent filed before any public demo, and incorporated. **No-go:** novelty decay, a correction burden higher than phone scanning, or unworkable unit cost. |
| **B. 100–500 units (pilot / DVT-lite)** | Custom PCB on a pre-certified ESP32-S3 module; printed, cast or soft-tooled enclosures; FCC and ISED compliance; paying early customers | Months 12–30 | **C$75k–150k for 100; C$200k–400k for 500** | Kits at ≈ C$200–400 landed† (C$20k–200k); engineering spending, contracted or partly self-done, C$20k–80k†; soft tooling ≈ C$4k–17k per tool set (two SKUs), or none if printed; certification ≈ C$5k–20k modular (+C$11k–28k+ per product if non-modular; +C$3k–10k UN38.3 if batteries); legal, IP and insurance C$5k–20k†; crowdfunding campaign costs† | SR&ED (35% refundable) + IEG (up to ~20%); IRAP (first projects ~C$75k–200k, cost-shared); Alberta Innovates Voucher/PDP if reopened (≤C$100k / ≤C$150k); Futurpreneur (≤C$75k); friends, family and angels; Kickstarter or own-site pre-sales | (1) FCC Part 15B/SDoC + ISED ICES-003 (+RSS via the module) done for the production design. (2) ≥100 paying users with ≥60% retention at 3 months†. (3) Field failure or return rate under ~3–5%†. (4) Pre-orders covering ≥30–50% of first-run inventory cost†. (5) Two CM quotes at 1k–5k units with landed cost including duties. (6) Cloud AI plus hosting under ~30% of subscription revenue per household†. (7) Insurance bound and a CCPSA incident and recall process in place. (8) A hardware co-founder or committed contract team. **No-go:** retention collapses after month 1, certification needs a redesign beyond budget, or unit economics are negative. |
| **C. First production run (1,000–2,000 units; EVT→DVT→PVT proper)** | Hard tooling, PVT (200–1,000 units or 5–10% of the run), certified production, retail-ready packaging (EN/FR) | Months 24–48 (12–24 months after B; the cited funding-to-unboxing norm is 12–18 months) | **C$0.8M–2M** (the cited example of US$400k NRE/tooling + US$600k first run ≈ **C$1.4M**) | Hard tooling ≈ C$21k–112k per tool set (two SKUs); PVT build; inventory; certification finalised with a non-China lab if the FCC order passes; fulfilment and support; 12–18 months of salary runway | Angel round + Accelerate Fund IV match (≤C$500k, angels must match); seed round (generic US$2–4M; hardware rounds higher); continued SR&ED, IEG and IRAP; large pre-sale campaign; YC or HAX only as long shots | (1) PVT yield ≥95%†, with golden sample and test fixtures signed off. (2) All certifications in hand, plus EN/FR labelling and Bill 96 review. (3) ≥12–18 months of cash after the purchase order. (4) Pre-sales or retail commitments cover a large share of the run†. (5) The FCC lab-recognition status (effective 1 Dec 2028 if adopted) checked against the test plan. **No-go:** under-funded purchase order, uncertified design, or a demand signal that relies only on crowdfunding hype. |

**Notes on the plan**
- **A sound fallback at any gate.** Ship the **phone-first app** (Stage 0) as the product, and treat the camera kit as an optional add-on. The earlier build guide found that no fixed camera sees closed drawers or door bins, and that phone scanning covers them. This de-risks the business if Gate A or B fails on hardware rather than on demand.
- **Unit economics to watch.** At the earlier guide's price of about US$0.65 per camera per month on a cheap model, a 4-camera kit costs about **US$2.6 per household per month** in AI before frame-skipping. A pricier model at about US$13 per camera would break a consumer subscription. The model must stay cheap, or skip unchanged frames aggressively, and a subscription of roughly **C$4–8 per month†** is likely needed alongside the hardware margin.
- **Where professionals are mandatory:**
  - **Lawyer:** shareholder and vesting agreement, IP assignments, privacy policy and consent, Terms of Service and disclaimers, beta and crowdfunding terms, manufacturing agreements (tooling ownership, quality, IP).
  - **Patent agent:** provisional review, then the conversion decision at 12 months.
  - **Accountant:** SR&ED, IEG and GST/HST.
  - **Test lab:** pre-scan and certification plan.
  - **Insurance broker:** product liability.
  - **Customs broker:** importing from China (tariffs not researched).

### Gaps
- Evidence on **how founders keep day jobs** while validating hardware, and on solo-founder outcomes in hardware, was **not researched**. The day-job guidance above is inference.
- **Co-founder matching** platforms and Alberta hardware meetups were not researched. YC's view on solo founders was retrieved only as a talk title.
- **Insurance premiums**, lawyer fee ranges for the startup document set, and **landed unit costs** at 100–500 and 1k+ units are unsourced. They are marked † and need real quotes.
- **US tariffs, Canada–US trade measures, and duties** on China-made electronics in 2025–2026 were **not researched**, although they materially change landed cost and the Shenzhen-versus-elsewhere choice. *Customs broker needed.*
- Alberta's incorporation fee figures conflict (C$275 / C$283.25 / C$291.75), so confirm with a registry agent.
- The gate thresholds marked † are proposed rules of thumb, not benchmarks from sources. They should be adjusted after Stage 0 data.
