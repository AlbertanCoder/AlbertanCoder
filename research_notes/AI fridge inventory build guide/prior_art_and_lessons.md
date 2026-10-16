# Prior Art and Design Lessons: Camera/AI Fridge and Pantry Inventory Trackers (state as of 16 October 2026)

Method note for the report writer: WebFetch failed with DNS errors on every site tried (news.samsung.com, which.co.uk, trustedreviews.com), so every finding below comes from search-engine summaries of the linked pages, not full-page reads. Exact quotes and numbers are "as reported in the search summary of the linked page". The shared web-search budget ran out before a final batch of planned queries; those are listed under each section's Gaps. Status tags used: **[DISCONTINUED]**, **[DEAD]** (bricked or shut down), **[STATUS UNKNOWN]**, **[OLDER INFO]** (2013–2019 material).

## 1. Commercial camera fridges (Samsung, LG, Bosch, Liebherr/Microsoft, Hisense): how they recognize items, expiry tracking, reception, kept or dropped

### Takeaway
Two in-fridge camera designs have shipped. The first takes **shelf snapshots when the door closes**, for checking the fridge remotely (Samsung Family Hub from 2016; Bosch from IFA 2015). It never claimed much recognition. The second is Samsung's **"AI Vision Inside"** (2024 onward), where a top-mounted camera **watches items pass in and out** of the main cabinet. For years that camera recognized only 33–37 fresh foods plus about 50 packaged foods. It was blind to door bins, the freezer and drawers. It asked users to hold items up and wait for a beep, and it still needed expiry dates typed in by hand. Reviewers called it "slow", "a work in progress" or "more work than it's worth". In May 2026 Samsung moved recognition to **cloud Gemini** and claims more than 2,000 items, brand-level identification and warnings based on how long items have been stored. In effect it adopted the "big vision model on a photo" approach that a phone can already run. LG's 2020 auto-inventory promise went undelivered. A camera-based ThinQ Food feature has since appeared on premium models, but no independent accuracy data exists. The Liebherr/Microsoft recognition stayed a prototype as far as I found, and Liebherr's only camera product was shut down in 2025. Hisense relies on phone photos and manual entry, and its own R&D reportedly treats cameras as a supplement only.

### Cited Findings

#### Samsung Family Hub, generation 1: "View Inside" shelf snapshots [OLDER INFO, 2016–2019]
- The CES 2016 Family Hub introduced three interior cameras so owners could check the fridge's contents remotely from a phone and track consumption — [Entrepreneur Middle East](https://mena.entrepreneur.com/technology/ces-2016-highlights-samsung-family-hub/270875)
- A 2016 hands-on put the three cameras in the left door and said the photos let users label how many days have passed since an item was bought. That is a manual version of "how long has it been there" from 2016 — [Lowyat](https://lowyat.net/2016/94218/samsung-sea-forum-2016-a-closer-look-at-the-samsung-family-hub-refrigerator)
- A later owner on the SmartThings forum described a single camera above the doors. Its inside view refreshed only when the door was opened wide, and it became "very unreliable" after a firmware update — [SmartThings Community](https://community.smartthings.com/t/samsung-family-hub-camera-door-view/295877)
- Trusted Reviews' review of the RS6HA8891SL Family Hub found the camera's view of the fridge limited and the inside-view feature of limited use — [Trusted Reviews](https://www.trustedreviews.com/reviews/samsung-family-hub-rs6ha8891sl-eu-american-style-fridge-freezer)
- A promotional repair blog says the cameras capture stills only when the door closes and treats camera failure as a common service call (low reliability) — [EasyBear Appliance Repair](https://easybear-appliancerepair.com/blog/smart-refrigerator-camera-not-working)

#### Samsung, the AI step (CES 2020) [OLDER INFO]
- At CES 2020 Samsung added AI to the View Inside cameras to identify food and flag restocking needs, paired with Whisk meal planning (Whisk was bought in 2019) — [Pocket-lint](https://www.pocket-lint.com/smart-home/news/samsung/150558-samsung-s-ai-powered-smart-fridge-suggests-meals-and-tells-you-to-restock/); [Digital Trends](https://www.digitaltrends.com/home/samsung-fridge-ai-suggest-recipes-ces-2020/)
- Tech Advisor (date unclear in results): the AI Family Hub identifies 33 food types, mostly fresh produce, and "items have to be added one at a time" — [Tech Advisor](https://www.techadvisor.com/article/2286699/samsung-ai-family-hub-fridge-freezer.html)

#### Samsung AI Vision Inside (shipping 2024–2026): how it recognizes items
- Mechanism: a camera mounted at the top of the interior logs items as they go in or come out. In a launch demo, a carrot and a cucumber were logged with a **suggested use-by date**, the demonstrator was **prompted to adjust it**, and the fridge then registered their removal — [Homes & Gardens](https://www.homesandgardens.com/solved/samsung-ai-refrigerator)
- The same article says the camera would struggle with packaged items. With only one camera, it cannot see items below fully stocked top shelves, so some items must be entered by hand — [Homes & Gardens](https://www.homesandgardens.com/solved/samsung-ai-refrigerator)
- Samsung Australia describes the camera as identifying "up to 33 fresh food items when put in or taken out" and says users may need to adjust the list manually — [Samsung AU](https://www.samsung.com/au/family-hub-refrigerator)
- The required ritual: Trusted Reviews says users must **hold each item up and wait for a beep** before putting it inside. Items cannot go in door pockets, "otherwise AI Vision Inside thinks the item has been removed". The reviewer had trouble getting foods recognized and found the system slow — [Trusted Reviews, RF90F29AECRAA](https://www.trustedreviews.com/reviews/samsung-bespoke-ai-4-door-french-door-rf90f29aecraa)
- Coverage: Engadget's January 2026 review says AI Vision watches only the main cabinet. Anything put in the FlexZone drawer, the freezer or either door is not recorded — [Engadget review](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html)
- Occlusion disclaimers: Samsung Chile says food covered by a hand is not recognizable — [Samsung Chile product page](https://samsung.com/cl/c/p/RF29DB9950QDZS). It also says detection relies on a trained deep-learning model that may give incomplete or incorrect information, and that it cannot list food in door bins or freezer drawers — [Samsung Chile business page](https://www.samsung.com/cl/business/refrigerators/french-door/rf9000-t-style-french-door-32inch-family-hub-699l-stainless-steel-rf29db9950qdzs)
- Samsung US says the fridge recognizes and auto-labels 37 **"unobscured"** fresh foods. Other items may be labeled by hand or, if activated, recognized by Gemini. It requires internet and a Samsung Account, and Samsung adds "accuracy not guaranteed; check results" — [Samsung US refrigerators](https://www.samsung.com/us/refrigerators/)
- Count over time:
  - 2024: "up to 33" as of March 2024 — [Samsung Canada](https://www.samsung.com/ca/refrigerators/family-hub/); "more than 30" — [Samsung US 2024 update](https://news.samsung.com/us/samsungs-most-intelligent-fridge-is-getting-smarter-with-family-hub-for-2024-update)
  - April 2025: 37 fresh foods, plus "identify and suggest labeling" for up to 50 packaged foods that "must keep a certain packaged form". Unrecognized items may be listed blank — [Samsung US 2025 Family Hub update](https://news.samsung.com/us/samsung-family-hub-2025-update-elevates-smart-home-ecosystem/)
  - Australia stayed at 33 while other regions had 37 — [Samsung AU release](https://news.samsung.com/au/samsung-expands-one-ui-to-home-appliances-bringing-unified-software-experiences-across-devices)
- A "4-Door Refrigerator with AI Home and AI Vision Inside 2.0" was a CES 2025 Innovation Awards honoree — [CES](https://www.ces.tech/ces-innovation-awards/2025/4-door-refrigerator-with-ai-home-and-ai-vision-inside-20/)

#### Samsung expiry handling
- Samsung's own product document says the fridge automatically recognizes the types of food entering and leaving to build a food list. Each item's expiry date "should be manually entered by users via the SmartThings app" — [Samsung Bespoke AI Refrigerator doc](https://www.samsung.com/global/sustainability/popup/popup_doc/AYUr58faFhIAIx_C/)
- Samsung support: after adding items, you can set an expiration date for them — [Samsung US support](https://www.samsung.com/us/support/answer/ANS10006842/)
- Tom's Guide (2024): users can enter expiration dates by hand to get alerts — [Tom's Guide](https://www.tomsguide.com/news/samsung-unveils-2024-bespoke-family-hub-refrigerator-with-vision-ai-heres-what-it-can-do)
- Engadget: Samsung's software clears items out after a certain time, but "you will still need to delete food manually from time to time" — [Engadget review](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html)
- The Samsung Food phone app's help page says "we do not notify users about any items in the Food List that are close to their due date" — [Samsung Food support](https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List)
- An owner reported that the SmartThings app's AI Vision inventory showed only about a month of items, while the fridge screen showed a different window. Deleting old entries fixed it — [SmartThings Community](https://community.smartthings.com/t/samsung-family-hub-and-smartthings-ai-vision-inside/298419)

#### Samsung reception
- Engadget (Sam Rutherford, January 2026): AI Vision and food tracking are "a work in progress" that can still be useful — [Engadget review](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html)
- Trusted Reviews: slow and unreliable recognition — [Trusted Reviews](https://www.trustedreviews.com/reviews/samsung-bespoke-ai-4-door-french-door-rf90f29aecraa)
- Reviewed (RF29DB9900QD): the AI Vision Inside camera "might be more work than it's worth" — [Reviewed](https://www.reviewed.com/refrigerators/content/samsung-bespoke-refrigerator-rf29db9900qd-review)
- Tom's Guide hands-on (2024): the multi-detection feature had no problem seeing tomatoes and steak removed during a demo. It recognized 33 items, and Samsung reps said the number would grow. Price was $4,999 for the AI Family Hub+ 4-door — [Tom's Guide hands-on](https://www.tomsguide.com/home/smart-home/i-went-hands-on-with-samsungs-new-bespoke-ai-appliances-and-they-feel-like-the-next-step-for-smart-homes)
- A T3 writer who had considered smart fridges a gimmick changed their mind after a demo — [T3](https://www.t3.com/news/i-got-to-see-samsungs-new-bespoke-ai-fridge-freezer-and-this-is-my-favourite-feature)
- LOW RELIABILITY (probably low-quality or AI-written): a 2026 "hands-on" claims a 4K wide-angle sensor, says kale was identified "perfectly" but Tupperware contents were invisible, and relays a Reddit claim that only the front-most item is seen when items are stacked — [Techelectroniclive](https://techelectroniclive.com/samsung-family-hub-refrigerator-2026/)

#### Samsung Gemini upgrade (announced CES 2026, rolled out May 2026) and price
- Samsung announced "AI Vision built with Google Gemini". The earlier on-device version could recognize up to 37 fresh and 50 pre-registered processed foods. The new version is meant to recognize processed foods without manual registration — [Samsung Global Newsroom](https://news.samsung.com/global/samsung-to-unveil-ai-vision-built-with-google-gemini-at-ces-2026); [Samsung US Newsroom](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/); [Android Central](https://www.androidcentral.com/phones/samsung-galaxy/samsung-gemini-fridge-ces-2026)
- A headline derived from Korean press says the fridge can "even read handwritten labels" — [Ground News](https://ground.news/article/samsung-electronics-unveils-ai-refrigerator-combining-gemini-and-ai-even-reading-handwritten-labels)
- On May 11, 2026 an over-the-air update began for select US 32-inch Family Hub models. It recognizes more fresh produce and packaged goods, including popular brands and regional ingredients, and adds a better Bixby and FoodNote — [SamMobile](https://www.sammobile.com/2026/05/11/samsung-bespoke-ai-refrigerator-family-hub-update-usa-gemini/); [Samsung US Newsroom](https://news.samsung.com/us/samsung-expands-ai-capabilities-bespoke-ai-family-hub-refrigerators-major-update/); [Samsung Global Newsroom](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates)
- Engadget (May 10, 2026) on the update:
  - Recognized foods rise from about 100 to more than 2,000, by pairing on-device recognition with cloud Gemini. An active Wi-Fi connection is required.
  - It can tell Diet Coke from Coke Zero and keep a count of each.
  - It **tracks how long perishables have been stored and warns as they near the end of their shelf life**.
  - It will reach 9-inch models and other markets in phases through 2026.
  — [Engadget](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)
  - Conflict: Engadget's "about 100" starting count does not match Samsung's own 37 + 50 = 87.
- Techlicious tested Gemini on a phone. A photo of a cupboard with about 30 items gave a "nearly complete accounting", even though many items were partly hidden or turned the wrong way. The author argues the fridge, listing at $3,399, is a pricey way to get what a phone already does — [Techlicious](https://www.techlicious.com/blog/samsung-bespoke-fridge-vision-ai-with-google-gemini/)

#### Samsung shopping list and Instacart behavior
- Announced January 2025: AI Vision Inside tracks items running low and shows suggestions on the fridge screen. The user adds items to an Instacart cart from the touchscreen, and coverage stresses that checkout still needs user approval. Existing AI Family Hub+ units were to get it by over-the-air update — [TechSpot](https://www.techspot.com/news/106204-samsung-ai-fridges-soon-order-groceries-you-instacart.html); [Grocery Dive](https://www.grocerydive.com/news/instacart-samsung-shoppable-smart-fridge-tech/736286/); [PYMNTS](https://www.pymnts.com/news/delivery/2025/select-samsung-refrigerators-enable-grocery-orders-through-instacart/); [Digital Commerce 360](https://www.digitalcommerce360.com/2025/01/07/instacart-samsung-partnership-refrigerators/); [All About AI](https://www.allaboutai.com/ai-news/samsungs-ai-smart-fridges-now-suggest-groceries-through-instacart/)

#### LG InstaView ThinQ
- At CES 2020 LG announced a second-generation InstaView ThinQ that would use cameras and AI to track food, suggest meals and flag low stock — [LG press release](https://www.lgcorp.com/media/release/21430); [The Spoon](https://thespoon.tech/lg-and-samsung-to-show-off-new-food-identifying-smart-fridges-at-ces-next-week/); [HomeCrux](https://www.homecrux.com/lg-new-instaview-refrigerators/137718/)
- Promise not delivered [OLDER INFO, about 2022]: Reviewed found InstaView's cameras let you see inside, but the fridge was "unable to scan items or barcodes to automatically update a food inventory as seen in the demo". Reviewed "failed to find anything even remotely resembling what we've been promised" — [Reviewed](https://www.reviewed.com/refrigerators/features/smart-refrigerator-organize-groceries)
- [OLDER INFO, date unclear] An earlier LG smart fridge let users scan or enter foods, and the fridge tracked expiration dates — [NBC News](https://www.nbcnews.com/news/amp/wbna50364792)
- 2025–2026: Reviewed's InstaView guide describes a built-in AI camera and ThinQ Food system that identify stored ingredients, suggest recipes and track expiration dates, tied to a 2025 debut — [Reviewed InstaView guide](https://www.reviewed.com/refrigerators/features/what-lg-instaview-kitchen-appliances)
- At CES 2026 the LG Signature Smart InstaView had an internal camera that identifies ingredients and suggests recipes and substitutes. LG also showed a separate LLM-based conversational fridge with a 6.8-inch LCD — [LG Newsroom](https://www.lg.com/global/newsroom/news/home-appliance-and-air-solution/lg-signature-evolves-with-ai-redefining-premium-home-appliances-at-ces-2026/); [Reviewed](https://www.reviewed.com/refrigerators/features/lg-signature-ces-2026); [WifiHifi](https://wifihifi.com/ces-2026-lg-adds-ai-to-its-latest-signature-appliances/); [PR Newswire](https://www.prnewswire.com/news-releases/lg-signature-evolves-with-ai-redefining-premium-home-appliances-at-ces-2026-302641612.html)
- LG's newsroom describes ingredient recognition in its AI Gourmet *oven* camera, with "supported ingredients" that vary by model, which is a closed-set approach — [LG Newsroom story](https://www.lg.com/global/newsroom/lg-story/beyond-news/how-lg-linearcooling-and-ai-gourmet-turn-whats-already-in-your-fridge-into-dinner/)
- LOW RELIABILITY: a retailer blog says the LH29S8565S's camera "accurately identified most common items" and tracked expirations — [Masters Wholesale](https://blog.masterswholesale.com/lg-smart-instaview-french-door-refrigerator-lh29s8565s-review/). Home Depot lists that model as a MyColor / Craft Ice InstaView, and I could not confirm it has an interior camera — [Home Depot](https://www.homedepot.com/p/reviews/LG-29-cu-ft-SMART-MyColor-InstaView-Standard-Depth-MAX-4-Door-French-Door-Refrigerator-in-Stainless-Steel-with-Craft-Ice-LH29S8565S/329904698/1). Low-authority blogs also claim ThinQ fridges use cameras plus weight sensors, and quote accuracy figures of 89%, 76% and 63% that are not attributed to LG — [HNK Parts](https://www.hnkparts.com/blog/post/smart-home-devices-lg-thinq-technology); [TradeGradeTools](https://tradegradetools.com/electronics/how-to-use-your-smart-fridge-s-camera-to-log-meals-visually-without-manual-entry-fatigue)

#### Bosch
- At IFA 2015 Bosch announced a Home Connect fridge with interior cameras. The Series 8 model had two cameras that photograph the contents each time the door shuts, viewable remotely in the app — [Reviewed](https://reviewed.com/refrigerators/news/this-app-shows-you-whats-in-your-fridge)
- Current Bosch UK Home Connect pages still describe interior door cameras that take pictures when the door closes and send them to the phone — [Bosch UK](https://www.bosch-home.co.uk/bosch-innovations/homeconnect/homeconnect-fridges). The Series 8 side-by-side KAD92HBFP spec sheet lists cameras for checking contents from anywhere — [Bosch spec sheet](https://media3.bosch-home.com/Documents/specsheet/en-GB/KAD92HBFP.pdf). Only some high-end models have the camera — [Reviewed](https://www.reviewed.com/editseries/features/bosch-home-connect-refrigerator)
- At CES 2020 Bosch and Passio (an SRI Ventures startup) demoed a fridge with a door camera and an interior camera that took stills on each door close. Passio's software identified foods, and Passio claimed more than 95% accuracy (a vendor claim) — [SRI](https://www.sri.com/press/startup/sri-ventures-passio-introduces-smart-refrigerator-with-bosch-at-ces2020/)
- Bosch was an early partner of and investor in Chefling, the inventory software later bought by Smarter — [The Spoon](https://thespoon.tech/fridge-cam-maker-smarter-launches-new-models-at-ces-announces-acquisition-of-chefling/)
- At CES 2026 Bosch did not debut a new fridge. Its fridge AI is framed as object recognition for keeping produce fresh and using space, such as suggesting where to put fruit and vegetables — [Galaxus](https://www.galaxus.at/en/page/ces-2026-smart-fridges-from-samsung-lg-bosch-and-co-41082); [Gadget Flow](https://thegadgetflow.com/blog/ces-2026-smart-refrigerators/). Bosch's CES 2026 AI news was "Bosch Cook AI" in the Home Connect app — [Bosch Media US](https://us.bosch-press.com/pressportal/us/en/press-release-29760.html)

#### Liebherr (with Microsoft)
- [OLDER INFO, 2016–2017] Microsoft and Liebherr co-developed a next-generation SmartDeviceBox. Microsoft data scientists built an image-processing system to detect specific foods inside the fridge, starting from a general-purpose vision model that can learn new object types. Microsoft called it "a prototype", and the algorithms were released in its open-source CNTK toolkit — [Microsoft ML blog (archive)](https://learn.microsoft.com/en-us/archive/blogs/machinelearning/microsoft-and-liebherr-collaborating-on-new-generation-of-smart-refrigerators); [Digital Trends](https://www.digitaltrends.com/home/microsoft-teams-with-liebherr-on-smart-fridge/); [IBTimes UK](https://www.ibtimes.co.uk/microsofts-smart-fridge-project-might-soon-be-able-tell-you-when-youre-out-milk-1579783); [MSPowerUser](https://mspoweruser.com/microsoft-liebherr-working-together-next-gen-smart-refrigerators/)
- The SmartDeviceBox sold today is a Wi-Fi connectivity module (€89.99 in Estonia, $129–149 in the US). Retail listings mention no camera or food recognition — [Euronics EE](https://www.euronics.ee/en/appliances/refrigerators/refrigerator-accessories/612526500/liebherr-smartdevicebox-smart-device-accessory); [Gerhard's](https://www.gerhardsappliance.com/product/liebherr-smartdevicebox-6125265-1331004)
- Liebherr's only fridge camera found is the HNGRYnsite retrofit, which was shut down in 2025 (details in Section 2) — [Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste)

#### Hisense
- Hisense's Dish Designer, built with Microsoft Azure AI Studio, includes "AI Food Recognition": you **photograph food in the fridge or cupboards** and items are added to an inventory. This is phone-photo based, not an in-fridge camera — [T3](https://www.t3.com/home-living/appliances/hisense-takes-on-samsung-with-its-own-ai-dish-designer-for-meal-planning)
- CES 2025: the Smart Hub fridge has a 21-inch screen and offers inventory tracking and expiry reminders through ConnectLife — [Appliance Retailer](https://www.applianceretailer.com.au/ces-2025-hisense-introduces-ai-powered-refrigerator/); [EFTM](https://eftm.com/2025/01/hisense-launches-ai-powered-smart-hub-refrigerator-that-can-track-your-food-and-reduce-food-wastage-258926); [PR Newswire](https://www.prnewswire.com/news-releases/hisense-connectlife-brings-an-intelligent-experience-to-the-future-smart-home-with-ai-innovation-at-ces-2025-302346821.html)
- At IFA 2024 Hisense showed a fridge with "AI inventory tracking" but gave few details on how it works — [The Spoon IFA roundup](https://thespoon.tech/ifa-smart-kitchen-roundup-appliance-brands-try-to-tap-into-ai-zeitgeist-with-ai-powered-food-recognition/). Coverage of IFA 2025 says the same — [Tom's Guide](https://www.tomsguide.com/home/home-appliances/hisense-leans-into-ai-at-ifa-2025-and-its-smart-air-conditioner-is-the-one-to-watch)
- Hisense UK's PureFlat page describes **manual** inventory: you add items, name them and set expiration dates, then get notifications — [Hisense UK](https://uk.hisense.com/products/cooling/freestanding-refrigerators/american-side-by-side-refrigerators/REFRIG-BCD-628WY-RS9P628GPFE-HSN/p/000000000020015278)
- Hisense's RFID research, reported by an RFID vendor, says camera recognition has clear drawbacks, including **obstructed views and condensation from door openings**. The team concluded cameras "can only be used as a supplement… will not become the main force" — [Seiko RFID](https://www.seikorfid.com/news/RFID-ingredient-management-refrigerator.html)
- CES 2026: ConnectLife AI agents; the app offers remote food-inventory management — [Hisense USA](https://www.hisense-usa.com/post/hisense-appliance-innovations-and-ai-powered-home-assistance-coming-to-ces-2026)
- Industry context, IFA 2026: refrigeration systems "using cameras and sensors to understand what is being stored" — [kbbreview](https://www.kbbreview.com/87782/indepth/ifa-2026-review/)

### Inferences
- **Kept or dropped, as of October 2026:**
  - Samsung: kept and expanded (AI Vision Inside, then cloud Gemini).
  - LG: dropped the 2020 auto-inventory promise, then brought back camera-based ThinQ Food on premium models in 2025–26. Its accuracy is unverified.
  - Bosch: kept view-only door-close cameras on some high-end models for about 10 years. No evidence found that automatic recognition ever shipped beyond the 2020 Passio demo.
  - Liebherr: the Microsoft recognition stayed a prototype, and its camera product (HNGRYnsite) was killed in 2025.
  - Hisense: no evidence found of an in-fridge camera on a shipping model. It uses phone photos and manual entry.
- **The closed-set on-device recognizer plateaued.** Samsung sat at 33–37 fresh items for about six years, and its jump to more than 2,000 came from sending images to a cloud frontier vision-language model (VLM). The builder's Phase 1 (phone photo to VLM) is therefore the same approach the market leader converged on in 2026. Training a custom detector is probably wasted effort for Phase 1.
- **Watching items cross the door forces a ritual on the household.** Users must hold items up, wait for a beep and avoid door pockets. Hands block the view, and the camera is blind to door bins, drawers and the freezer. Reviewers' words ("slow", "more work than it's worth") suggest households don't keep up the ritual.
- **Snapshot-on-close lasts because it promises little.** Bosch's view-only cameras outlived every recognition feature, because "peek while at the store" is useful without being accurate.
- **Expiry was manual for most of the period.** Samsung's 2026 "how long stored, nearing shelf life" warning is the same idea as the builder's "spinach, day 9, check it", which suggests that is the right level of detail.
- **Even Samsung keeps a human in the loop** before anything is bought (Instacart) and tells users to "check results".
- Stale entries that need manual deletion (Engadget, the SmartThings forum) show that **detecting removals is the weakest link** even in the best-funded product.

### Gaps
- No independent, controlled accuracy test was found for Samsung AI Vision Inside (before or after Gemini) or for LG ThinQ Food.
- Full reviews could not be read because WebFetch was blocked. CNET, The Verge, Wirecutter and Which? verdicts on 2024–2026 camera fridges were not found in search.
- No user reception after the May 2026 Gemini update was found. Whether the Gemini update reaches Canadian units was not verified (Samsung Canada does sell Family Hub with AI Vision Inside).
- LG: which models have the interior camera, how many items it recognizes, and whether recognition runs on-device or in the cloud were not found.
- Bosch: whether camera models are sold in North America in 2026 was not verified. A "Bosch Vivuplus" camera fridge named by an AI-generated summary could not be confirmed and may not exist.
- GE, Whirlpool, Haier, Miele and Chinese-market camera fridges were not researched because the search budget ran out.

## 2. Retrofit fridge cameras (2017–2026): what went wrong, and what was discontinued

### Takeaway
Every retrofit fridge camera I found used the same design: a battery camera stuck to a shelf or door, taking a photo when the door closes and uploading it to the vendor's cloud. That covers the Smarter FridgeCam (2017 onward), Fridge Eye (2019) and Liebherr HNGRYnsite (2023–2025). All of them are now discontinued, shut down or of unknown status. Recognition was the weakest part: FridgeCam recognized **zero items** in two weeks of testing. Wi-Fi and setup were flaky, the camera saw only part of one or two shelves, and users were asked to tag items by hand. HNGRYnsite is the clearest lesson in cloud dependence. When Liebherr shut down the app on March 31, 2025, the cameras became e-waste with no local fallback. Non-camera retrofits (Ovie timer tags, the Amazon Dash weight shelf) traded recognition for manual setup and also faded.

### Cited Findings

#### Smarter FridgeCam (UK; launched about 2017) [DISCONTINUED]
- Concept: a camera "snaps a pic and sends it to the cloud when the fridge door closes" — [EFTM](https://eftm.com/?p=35056). In January 2018 it was described as using object recognition and tracking best-before and expiry dates — [Android Headlines](https://www.androidheadlines.com/2018/01/smarter-fridgecam-can-warn-you-about-your-groceries-expiring.html); [Mental Floss](https://www.mentalfloss.com/article/503764/smart-fridge-camera-will-warn-you-when-your-food-going-bad); early coverage — [Fortune (Jan 2017)](https://fortune.com/2017/01/03/fridgecam-waste-food)
- Marketing claimed the camera could halve household food waste. That is a claim, not an evaluated result — [Climate-KIC](https://www.climate-kic.org/?p=36905)
- Expert Reviews:
  - Object recognition was "the biggest problem": over a couple of weeks it recognized **no items at all**, including well-known brands.
  - Smarter said accuracy would improve **as more users tag items**.
  - The barcode scanner matched only Tesco products, and manual tagging was tedious.
  - At £150 (£99 with a Currys fridge) it was "a lot of money for what is essentially a low-resolution camera".
  - The main positive: a useful reminder of what's in the fridge.
  — [Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review)
- A syndicated copy of that review adds that the camera can't see items in the door or vegetable drawer. The battery rarely needs charging because the camera is only on when capturing and syncing — [TechServing](https://www.techserving.com/technology/smarter-fridgecam-review-make-your-fridge-less-dum/)
- Tech Advisor ("Not So Smart"):
  - Wi-Fi setup took several attempts and resets, and the app wouldn't load its setup videos.
  - The USB port and reset slot were misaligned with the case holes.
  - The camera "adds more things to track and worry about".
  - It takes only sporadic photos of some shelves, so it is hard to recommend even as a simple peek-in camera.
  — [Tech Advisor](https://www.techadvisor.com/article/719327/smarter-fridgecam-review.html)
- Which? (2019, first-person):
  - Routine connection problems; the app said to move the router closer although it was under 8 m away.
  - The door-open alert failed three times after the door was left open for two minutes.
  - The reviewer was "completely underwhelmed" and found it demanded too much effort.
  - Image quality was reasonable once a photo synced.
  - The reviewer wouldn't "close the door completely on fridge cameras just yet" if object recognition improves.
  — [Which?](https://www.which.co.uk/news/article/is-it-worth-buying-a-fridge-camera-aNLE02N0tb1Z)
- A blogger called the images a "fuzzy blurry mess" and the product "unboxing disappointment and false promises" — [Climbing Moss](https://climbing-moss.com/2018/08/23/the-not-so-smarter-fridgecam/)
- Hardware: about three months of battery claimed, micro-USB charging, roughly six hours of charging advised before pairing — [Smarter support](https://support.smarter.am/hc/en-us/articles/360001264945-My-FridgeCam-is-not-flashing-after-waking-it-up-with-the-reset-pin-)
- CES 2023 (The Spoon, January 4, 2023):
  - New models: FridgeCam2 (three-month battery, faster processor, one-click setup), FoodCam Mini, and FridgeCam Pro for appliance makers (USB-C powered).
  - Smarter bought **Chefling**, inventory, shopping-list and meal-planning software that had been "pretty quiet for the last year and a half", to pair with its image recognition.
  — [The Spoon](https://thespoon.tech/fridge-cam-maker-smarter-launches-new-models-at-ces-announces-acquisition-of-chefling/)
- Status: retailers list FridgeCam as "Discontinued – not available for purchase" — [Mobile Fun](https://www.mobilefun.com/smarter-fridgecam-wifi-enabled-food-tracking-camera-85610); [Zoro](https://www.zoro.com/smarter-fridgecam-wireless-camera-for-inside-any-refrigerator-sfc01/i/G7970996/). App Store reviews of the Smarter 3.0 app say the company "seems nonexistent now" and that support took two months to reply — [App Store](https://apps.apple.com/gb/app/smarter-3-0/id1196743717). No official shutdown notice was found.

#### Liebherr HNGRYnsite (IFA 2023 to March 2025) [DEAD]
- A modular camera that "makes any fridge a smart fridge" of any size, age or brand (very wide French-door models may be limited). It photographs the contents each time the door closes, lasts about three months per USB-C charge, and cost €149.90 in Liebherr's webshop. It worked with the HNGRY shopping app — [Liebherr press release](https://www.liebherr.com/en-us/n/always-know-what%E2%80%99s-inside-with-the-fridge-camera-hngrynsite-powered-by-liebherr-27846-3782185); [cuizine.be](https://cuizine.be/weet-altijd-wat-er-in-zit-met-de-koelkastcamera-hngrynsite-powered-by-liebherr/); [Liebherr IFA 2023 post](https://www.linkedin.com/posts/liebherr-home-appliances_hngrynsite-ifa2023-liebherrappliances-activity-7104787572551229440-AnKn)
- Shutdown: on **March 31, 2025** Liebherr discontinued the HNGRY app and deleted user accounts. The camera **lost all functionality**: no local image access, no offline mode and no firmware to repurpose it. Refunds went only to buyers from Liebherr's webshop; others were told to contact their retailer — [Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste); [Tommi blog (competitor app; read as partisan)](https://gettommi.com/en/blog/hngry-turned-off/)
- No independent hands-on review of its images or recognition was found.

#### Fridge Eye (brezzl, Munich; about 2019 Indiegogo) [STATUS UNKNOWN]
- A battery camera for a fridge, freezer or cupboard that photographs the contents each time the door closes and sends them over Wi-Fi to an app. It had USB-C charging and replaceable batteries, a planned price of $79 and a $25,000 goal. Image recognition was "still in beta", and coverage warned "buyer beware" — [The Spoon](https://thespoon.tech/fridge-eye-is-a-cheap-connected-camera-to-smarten-up-your-fridge-or-cupboard/); [Gadget Flow](https://thegadgetflow.com/product/smart-refrigerator-camera/); [smarthomeassistent.de](https://www.smarthomeassistent.de/fridge-eye-eine-kamera-macht-den-kuehlschrank-smart/)

#### Non-camera retrofits (contrast cases)
- **Ovie Smarterware** (CES 2019) [STATUS UNKNOWN]:
  - Food containers and tags with colored light rings: teal means more than 24 hours left, yellow 24 hours or less, red time is up. Works with Alexa.
  - The shipped "LightTags" are set by **clicking once per day** of desired tracking.
  - Tracking is based on food type and the date it went in, **not on any actual sensing**.
  — [Dezeen](https://www.dezeen.com/2018/05/29/smarterware-ovie-smart-tupperware-internet-of-things-food-waste/); [New Atlas](https://newatlas.com/ovie-smarterware/52890/); [Mental Floss](https://mentalfloss.com/article/570146/ovie-smarterware-containers-will-tell-you-when-food-goes-bad); [The Spoon](https://thespoon.tech/?p=54559); [Las Vegas Review-Journal](https://www.reviewjournal.com/?p=1569423)
- **Amazon Dash Smart Shelf** [DISCONTINUED per one blog; no date]: a Wi-Fi weight pad that could notify you or **auto-reorder** when stock ran low. Items had to be programmed so the shelf "knows" what is on it. Consumers in the US reportedly paid $20 — [AFTVnews](https://www.aftvnews.com/tag/amazon-dash); [TechRecipe](https://en.techrecipe.co.kr/posts/10933/amp); [PYMNTS](https://www.pymnts.com/?p=1103639). A blog reports it as discontinued — [eturns blog](https://stock.eturns.com/resources/blog/?p=6)
- **FreshFridge** (Kickstarter) [STATUS UNKNOWN]: connected containers and sensors that track temperature and inventory — [Kickstarter](https://www.kickstarter.com/projects/freshfridge/freshfridge-the-affordable-smart-kitchen-ecosystem)

### Inferences
- The standard retrofit design (battery, door-close snapshot, vendor cloud, closed-set recognition) failed on four separate fronts. Recognition: 2017–2019 closed-set computer vision, with crowd tagging as the plan to improve it. Coverage: the front of one or two shelves, missing the door and crisper. Connectivity: Wi-Fi from inside a metal box. Longevity: the company or the app disappeared.
- The only value reviewers consistently liked was **remote peeking** at the store. That is also why Bosch's view-only cameras survived.
- For the builder's Phase 2, the HNGRYnsite lesson is concrete. Keep images and data on hardware the household controls (for example Home Assistant or a home server), use open protocols such as ESPHome, MQTT or HTTP, and require no vendor account. The vision model then becomes a swappable component, not a single point of failure.
- FridgeCam's "accuracy will improve as users tag items" was a bet on crowd-labeled data that never paid off. General-purpose vision models now remove the need for user tagging as the main recognition path.

### Gaps
- No hands-on review of FridgeCam2 (2023) was found, and Smarter's company status is unconfirmed.
- No evidence on whether HNGRYnsite did any recognition beyond photos.
- The final status of Fridge Eye, FreshFridge and Ovie is unknown.
- No user-count, retention or return-rate data exists publicly for any retrofit camera.

## 3. Phone apps (2024–2026) for photo-, AI- and receipt-based fridge/pantry inventory: features, "items going out", ratings, pricing

### Takeaway
By 2024–2026 the app market splits three ways:
1. **Photo or vision-model "scan your fridge" apps**: Samsung Food+ Vision AI and many small 2025–26 apps such as FridgeBuddy, FridgeSmart, ScanMyPantry and Food Expiry AI. They make *adding* items easy but say little about removal.
2. **Receipt or loyalty-card importers**: Cooklist, NoWaste.ai, Expireless. They capture purchases but not consumption.
3. **Barcode and manual trackers**: KitchenPal, classic NoWaste, Grocy. They have explicit "consume" actions.

No app publicly solves "items going out" automatically. The approaches in use are explicit consume taps or scans, deduction from recipes (Samsung Food removes ingredients after you cook), and time-based expiry. Evidence of abandonment points to manual effort. The one academic pilot found no measurable effect on food waste, and users cited "too many manual operations". The app that syncs with store accounts (Cooklist) rates 4.7 on iOS but about 3.2 on Android, largely because store logins break.

### Cited Findings

#### Samsung Food (formerly Whisk), Food+ and Vision AI
- Samsung Food+ with Vision AI (IFA 2024) recognizes ingredients in **phone photos** and adds them to a Food List shared with the Family Hub screen — [Samsung Newsroom](https://news.samsung.com/global/upgraded-samsung-food-raises-the-bar-for-food-experiences-at-ifa-2024); [SamMobile](https://www.sammobile.com/news/samsung-food-update-scan-ingredients-using-phone/)
- Reported to recognize more than 40,000 ingredient types in the cloud, against 33 for the fridge's built-in camera (secondary source) — [ControlF5 blog](https://blog.ctrlf5.software/blog/with-ai-food-recognition-samsung-food-could-be-the-ultimate-meal-planning-app/)
- Handling items going out: after you cook a recipe, the app can remove the used ingredients. Checked-off shopping-list items move back into the Food List — [Samsung Newsroom](https://news.samsung.com/global/upgraded-samsung-food-raises-the-bar-for-food-experiences-at-ifa-2024); [SamMobile](https://www.sammobile.com/news/samsung-food-update-scan-ingredients-using-phone/)
- Price: Vision AI is in the paid Food+ tier, about $60 per year per a third-party guide. One review says premium isn't needed for most users — [MealThinker](https://mealthinker.com/blog/samsung-food-alternative); [Savor](https://www.savortheapp.com/blog/food-tracking-apps/samsung-food-app-review/); what Food+ includes — [Samsung Food support](https://support.samsungfood.com/hc/en-us/articles/32709269852052-What-s-Included-in-Your-Samsung-Food-Subscription)
- Limits: apart from the fridge integration you add items by hand. It doesn't learn from shopping habits or suggest meals based on what's expiring — [MealThinker](https://mealthinker.com/blog/samsung-food-alternative). The Food List does not send due-date alerts — [Samsung Food support](https://support.samsungfood.com/hc/en-us/articles/30025317487508-Getting-Started-with-Food-List)
- UNVERIFIED: a 2026 update reportedly added confidence scores and prompts a manual review below 80%. Hidden ingredients such as oils are hard to detect — [Savor](https://www.savortheapp.com/blog/diet-lifestyle-tracking/samsung-food-vision-ai-calories/)

#### Smaller photo, OCR and vision-model apps (2025–26; vendor claims, not tested)
- FridgeBuddy (iOS): turns a photographed shelf into inventory items. Its newest feature handles several products in one photo on supported iOS 27 devices — [App Store](https://apps.apple.com/us/app/pantry-fridge-fridgebuddy/id1500190823)
- FridgeSmart (iOS and Android): fridge scan, expiry tracking, reminders, AI recipes — [FridgeSmart](https://www.fridgesmartapp.com/)
- ScanMyPantry (iPhone): works offline with on-device Apple Core ML vision and needs no account — [ScanMyPantry](https://scanmypantry.app/)
- Food Expiry AI (iPhone): OCR and label extraction of name, brand, expiry date, quantity and storage instructions. Full extraction is in the Pro tier — [App Store](https://apps.apple.com/xk/app/food-expiry-ai/id6789433988)
- Others in the category: AI Fridge – Food Expiry Manage (Android) — [Google Play](https://play.google.com/store/apps/details?id=com.foodguard.app&hl=en_US); AI Fridge: Food Expiry Tracker (iOS) — [App Store](https://apps.apple.com/us/app/id6670494340); Forky fridge scanner (photo to recipes with macros) — [Forky](https://forkyai.com/fridge-scanner/)
- Hisense's ConnectLife Dish Designer also does phone-photo inventory (see Section 1) — [T3](https://www.t3.com/home-living/appliances/hisense-takes-on-samsung-with-its-own-ai-dish-designer-for-meal-planning)

#### Receipt and loyalty-card importers
- **Cooklist**:
  - Features: receipt scanning, plus loyalty-card sync with Walmart, Kroger and more than 75 US grocers — [App Store](https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944); [Recipy blog](https://recipyapp.com/blog/best-pantry-tracking-apps-2026)
  - Ratings: 4.7 on iOS from about 11,000 ratings, but about 3.2 on Google Play (about 2,270 reviews) or 3.3 (1,964) — [App Store](https://apps.apple.com/us/app/cooklist-pantry-meals-recipes/id1352600944); [Google Play](https://play.google.com/store/apps/details?id=com.cooklist.android&hl=en_US); [Grand Screen](https://grand-screen.com/apps/cooklist-pantry-cooking-app/#reviews). A tracker shows a recent average of 2.80 against 3.14 all-time, with complaints of crashes and freezing — [JustUseApp](https://justuseapp.com/en/app/1352600944/cooklist-pantry-to-recipes/reviews)
  - Sync problems: Play users say they "can't connect to any" store, and the changelog lists fixes for Ralphs, Fred Meyer and King Soopers logins — [Google Play](https://play.google.com/store/apps/details?id=com.cooklist.android&hl=en_US)
  - Pricing conflicts across sources: Pro at $5.99 a month versus Premium at $4.99 — [Educational App Store](https://www.educationalappstore.com/app/cooklist-pantry-meals-recipes); [Eatvora](https://www.eatvora.app/best/pantry-app-alternative)
- **NoWaste.ai**: two apps with similar names, which makes sources ambiguous.
  - NoWaste.ai reads a receipt photo into a pantry, and its listing tells users to review auto-added items because the AI can misread them. It also offers AI recipes, a voice or typed assistant, and offline scanning that syncs later — [Google Play](https://play.google.com/store/apps/details?id=com.nowaste.ai&hl=en_US); [nowaste.ai](https://nowaste.ai/)
  - 2026 comparison posts give its pricing as 50 free items and 5 receipt scans per month, Family at $4.99 per month and Premium at $9.99 per month. They also say receipt scanning fails often enough that reviewers mention it, and that barcode lookups sometimes return wrong expiry dates. These posts are vendor-adjacent — [fango.fi](https://fango.fi/en/blog/best-before-app-alternatives/); [Pantry Persona](https://www.pantrypersona.com/blog/best-pantry-inventory-apps-2026)
- **Classic NoWaste** (nowasteapp.com): barcode scanning plus photo recognition; newer versions add a receipt scanner and recipe generation — [App Store](https://apps.apple.com/us/app/nowaste-food-inventory-list/id926211004)
  - Reviews: one user said a bulk entry session took 5–10 minutes, "was tedious and I was too frustrated to do it again". Another lost about 20 newly added items in a crash — [App Store reviews](https://apps.apple.com/us/app/nowaste-food-inventory-list/id926211004?see-all=reviews)
- **Expireless**: receipt scanning that sorts items into fridge, freezer or pantry automatically — [Expireless](https://expireless.app/). **Eatvora**: cross-platform, with receipt photo scanning — [Eatvora](https://www.eatvora.app/best/best-food-inventory-app)

#### Barcode and manual tracker: KitchenPal
- Input: barcode database of more than 5 million products, voice, typing, and camera identification of produce.
- Receipts: two competitor comparisons say it has **no receipt scanning**; MealThinker lists it among apps that do.
- Price: Premium is $3.99 a month, $14.99 a year or $29.99 lifetime, with a family lifetime option at $39.99. The free tier may cap at 100 items.
- Reception: rated 4.2 on one aggregator; reviews call the features overwhelming and search slow.
— [KitchenPal compare page](https://kitchenpalapp.com/en/compare.html); [Pantry Persona vs KitchenPal](https://www.pantrypersona.com/blog/pantry-persona-vs-kitchenpal); [Foodat](https://www.foodat.co/blog/best-pantry-tracker-apps-in-2026); [MealThinker](https://mealthinker.com/blog/meal-planning-app-pantry-tracking); [JustUseApp](https://justuseapp.com/en/app/1084982489/kitchenpal-pantry-recipes/reviews); [Grand Screen](https://grand-screen.com/apps/kitchenpal-pantry-inventory/)

#### Evidence on abandonment and retention
- JMIR Formative Research (2022) ran a crossover pilot: 6 students used TotalCtrl Home and Too Good To Go for one month each. It found **no measurable effect** on food waste, healthy eating or spending. Participants said the apps had **too many manual operations** for lasting use — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)
- The MySusCof app study found engagement depended on gamification (fun and social elements) as well as functional features — [PMC](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9329747/)
- A UNEP report cites a pilot of the Winnow smart bin in UK households with a 22% average reduction in food waste. That is hardware, not an app — [UNEP CCC](https://unepccc.org/wp-content/uploads/2021/11/reducing-consumer-food-waste-using-green-and-digital-technologies.pdf)
- Vendor-adjacent 2026 comparison posts argue that "the graveyard of pantry apps has one common cause of death: manual entry". They add that a half-updated inventory can be worse than none because users stop trusting it, and that updating has no payoff at the moment you have to do it. Treat this as directional — [Pantry Persona](https://www.pantrypersona.com/blog/best-pantry-inventory-apps-2026); [fango.fi](https://fango.fi/en/blog/best-pantry-inventory-app/)

### Inferences
- **Getting items into the list is largely solved; getting them out is not.** Every app handles outflow with explicit actions (consume taps, scan-to-consume), recipe deduction, or time-based expiry. The builder's idea of observing absence across scans is a different answer that no surveyed app publicly advertises, and it is the one that can catch untracked consumption (snacking, items thrown out).
- **Receipt and loyalty sync is US-centric and fragile.** Cooklist's grocers (Kroger, Walmart US, Ralphs) do not cover Alberta, and its Android ratings show how often store integrations break. For an Alberta household, photos and manual corrections are a sturdier base than store sync.
- **The pattern that keeps people logging** is a short, deliberate session with an immediate payoff, such as a ranked "use these first" list right after scanning, not constant per-item logging. Ten minutes of tedious entry made a NoWaste user quit; a scan of about a minute with one-tap corrections is the bar to beat.
- **Pricing benchmark**: consumer apps charge roughly $15–60 a year. For the builder, the relevant cost is vision-model calls per scan, which at household volume (a few scans a week) is likely small. That is unverified here.

### Gaps
- No public retention or active-user data exists for any of these apps; only store ratings were found, mainly for Cooklist and KitchenPal.
- No independent accuracy test was found for Samsung Food Vision AI or any small fridge-photo app.
- No app that explicitly compares successive fridge photos to detect removals was found. The targeted search for this was not run because the budget ran out, so absence is not confirmed.
- Ratings for Samsung Food, FridgeBuddy, FridgeSmart and NoWaste.ai were not retrieved, and Canadian-receipt support was not researched.

## 4. Academic research: occlusion, doorway ("transaction") vs shelf cameras, multi-camera, datasets, accuracy

### Takeaway
Research splits into two designs:
- **Transaction systems** watch items cross the door plane: CloudFridge (2014), Kyocera's YOLACT-based webcam system (2024), and snapshots triggered by a PIR motion sensor. They must cope with hand occlusion, motion blur and distance.
- **Static shelf or scene systems**, which include most YOLO and ESP32-CAM papers, are limited by occlusion and coverage.

The unmanned-vending literature, which has the most data, makes the tradeoff explicit. Static recognition needs roughly one camera per shelf and misses an item picked up and put back. Dynamic recognition loses accuracy when items move. Commercial cabinets combine vision with weight sensors. Reported accuracies of 84–95% detection, and about 92–94% mAP50 in Kyocera's best case, come from closed sets of 15–30 classes and small datasets. There is no standard household-fridge benchmark, and no fridge-specific evaluation of general vision-language models was found. VLM benchmarks show strong food identification but counting that degrades as numbers grow.

### Cited Findings

#### Transaction-based (door-plane) recognition
- **Kyocera (Frontiers in AI, 2024), "Robust deep-learning based refrigerator food recognition"**:
  - A single webcam recognizes food **as it is moved into or out of the fridge**.
  - The authors modify YOLACT's feature pyramid network ("BroadFPN") and add a two-stage augmentation that **simulates distortion and occlusion**.
  - They evaluate at distances under 20 cm, 20–60 cm and 60–100 cm. YOLOv8n was adequate at 20–60 cm, while BroadFPN-YOLACT was more accurate at all distances.
  - mAP50 values of 92.2% and 93.8% appear for objects under 20 cm, but which model each belongs to was unclear in the snippet.
  — [Frontiers](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2024.1442948/full); [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11652515/)
- **CloudFridge (arXiv 1401.0585, 2014)**:
  - An HD webcam captures frames from door open to door close. Recognized items get an activity ID that resets on each opening, and a **time gap between recognitions is treated as a separate item**, so two identical bottles are counted twice.
  - A proximity sensor tracks where items are placed. Door events alone were unreliable for matching positions to objects, because the door can close before the recognizer finishes, so the two streams run asynchronously.
  — [arXiv](https://arxiv.org/pdf/1401.0585)
- A 2022 Wiley IIoT book chapter pairs a camera with a PIR motion sensor and takes a snapshot whenever a product is placed or removed — [Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1002/9781119769026.ch11)
- A US patent describes cameras on the body and door that capture objects **passing through the entrance plane** as they are loaded or removed — [USPTO 12392548](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12392548)

#### Multi-camera and occlusion
- A University of Passau master's thesis (Bokhari, 2023) reports that multiple cameras improved detection and helped when **hands blocked objects** during movement, though no head-to-head numbers appeared in the snippet. It cites earlier systems: a YOLOv3 system at 84.63% across 25 object types and a YOLO model at 95%. These figures are not comparable with each other — [Uni Passau thesis](https://www.fim.uni-passau.de/fileadmin/dokumente/fakultaeten/fim/lehrstuhl/sauer/geyer/BA_MA_Arbeiten/MA-BokhariMohamed-202305.pdf)
- An industry overview says Faster R-CNN is more accurate in clutter and heavy occlusion but costs more compute for real-time use — [BasicAI (smart fridges)](https://www.basic.ai/blog-post/computer-vision-for-smart-fridges-how-it-works-models-data-and-annotations)

#### Static shelf / scene recognition, including ESP32-CAM
- **Mereddy (arXiv 2312.12486; IEEE WI-IAT 2023, pp. 474–479)**: grocery tracking is well established in retail but largely absent from homes, and fridges and storage are harder to analyze than retail shelves. The paper combines retail shelf data, a fruit dataset and 360-degree views of home storage, using YOLO. No accuracy figures were retrieved — [arXiv](https://arxiv.org/abs/2312.12486); [IEEE Xplore](https://ieeexplore.ieee.org/document/10350064/)
- **Nong Thuc et al. (arXiv 2509.07400, September 2025)**: an IoT fridge using an **ESP32-CAM** for food detection, inventory and temperature. The main contribution is confidence calibration (focal loss plus per-class temperature scaling) to keep detection reliable under **varying lighting**. Training data mixed ESP32-CAM images with online images. An automated review disputes the result, saying the baseline model is better calibrated — [arXiv](https://arxiv.org/abs/2509.07400); [Pith review (automated)](https://pith.science/paper/2509.07400)

#### Unmanned vending: the closest large-scale analogue
- Static vision compares shelf images before and after the door opens, which "often requires one camera per shelf". It has trouble with in-session changes such as an item picked up and put back. Dynamic vision analyzes the removal motion instead — [BasicAI (vending)](https://www.basic.ai/blog-post/computer-vision-for-smart-vending-machines-how-it-works-models-data-and-annotations)
- "Towards New Retail" benchmark: 3,046 images of customers removing drinks (dynamic) against a static set of 155,153 annotated instances. Dynamic **accuracy declines when the consumer is moving items**. An infrared sensor near the door detects the hand and triggers the camera — [Towards New Retail (PDF)](https://dl2link.com/Selected%20Journal%20Publications/Towards%20New%20Retail%20A%20Benchmark%20Dataset%20for%20Smart%20Unmanned%20Vending%20Machines.pdf)
- Patents describe:
  - Filming the whole removal and recognizing it in the cloud — [USPTO 12657564](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12657564)
  - **Combining image and weight (gravity) sensing**, because static image recognition is costly and demands careful product placement — [Patsnap CN111815852A](https://eureka.patsnap.com/patent-CN111815852A)
  - Several camera angles to identify a product held in the hand, with a weight sensor as a cross-check — [USPTO 11935022](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11935022)
- A survey of sensing in autonomous retail exists but was not read — [arXiv 2503.07997](https://arxiv.org/pdf/2503.07997)

#### Fridge datasets (all small or closed-set)
- AICook: 516 images of ingredients inside a fridge, 30 ingredients chosen from the top 50 in a Recipe1M subset. Version 2 has 3,050 augmented images. MIT licence — [Roboflow AICook](https://universe.roboflow.com/objectdetectionlearning-4empo/aicook-lcv4d-zzbgs)
- Roboflow "Refrigerator Food": 30 classes but only about 50 images, CC BY 4.0 — [Roboflow](https://universe.roboflow.com/personal-dvpdm/refrigerator-food). "smart_refrigerator": 15 vegetable classes — [Roboflow](https://universe.roboflow.com/personal-2uusc/smart_refrigerator). "food-tracker-yolo": 4,977 images of convenience-store packaged goods, MIT, not fridge scenes — [Roboflow](https://universe.roboflow.com/foodtrackerdataset/food-tracker-yolo). Others — [Roboflow fridge-food-images](https://universe.roboflow.com/fridge-dataset/fridge-food-images)
- A GitHub YOLOv11 fridge-food system lists 30 classes and a 2,896 / 103 / 51 train/validation/test split, but the data requires sponsorship — [GitHub](https://github.com/lonlonago/yolov11-refrigerator-food-detection-system)

#### General vision-language models (VLMs): nearest evidence
- A 2026 bioRxiv benchmark tested 10 approaches on 3,229 food images. Gemini 3.0 Flash was best at calorie estimation (CCC 0.767, mean absolute error 80.7 kcal). Gemini 3.1 Flash Lite was best at ingredient recognition at the lowest cost — [bioRxiv](https://www.biorxiv.org/content/10.64898/2026.07.26.740845v1)
- A 2025 study asks whether six VLMs (GPT-4o, Gemini 2.0 Flash, Claude 3.5 Sonnet and open models) are "ready for dietary assessment" — [arXiv 2504.06925](https://arxiv.org/pdf/2504.06925)
- Counting: GPT-4o, Gemini 1.5 Pro and Claude 3.5 Sonnet count small numbers well, but **performance degrades with larger numbers** — [LVLM-COUNT](https://arxiv.org/html/2412.00686v1). In another study Gemini was most accurate on every dataset, but accuracy fell for visually mixed objects — [arXiv 2512.15254](https://arxiv.org/html/2512.15254)

### Inferences
- In vending terms, the builder's Phase 1 is **"static" recognition with a human camera operator**: compare before and after images. The weakness the literature names for static methods, an item moved and put back, appears at home as **an item moved between zones**, which looks like one removal plus one addition. Samsung's door-pocket confusion is that failure in a product. So diffs should be computed across the whole household inventory in one session, not shelf by shelf.
- Transaction capture (watching the doorway) sees removals directly. In practice it needs a trigger sensor, a view of the door plane, fast exposure against motion blur, and a way to handle hands. The documented failure is hand occlusion, and Samsung's commercial workaround is a user ritual. That argues against making doorway capture the backbone of Phase 2.
- Confidence calibration is a live research problem (the 2025 ESP32-CAM paper). A vision model's self-reported confidence should not be treated as calibrated; agreement across scans and user confirmations are better signals.
- Counting degrades as numbers grow, so the system should track presence and categories reliably and treat exact counts above small numbers (for example "11 yogurts") as approximate.

### Gaps
- Full papers could not be accessed. Which Kyocera model scored which mAP, Mereddy's accuracy and CloudFridge's accuracy were not retrieved.
- No paper was found that evaluates GPT-4o, Gemini or Claude on real fridge or pantry photos, or on detecting changes between scans.
- No multi-camera fridge paper with head-to-head numbers was found beyond the thesis.
- The Microsoft "FridgeObjects" dataset was not confirmed by search.
- No research was found on condensation or fogging of in-fridge camera lenses; it is mentioned only in Hisense's R&D report.

## 5. Open-source and DIY projects (Grocy, Home Assistant fridge-cams incl. fridge-core, DecayDock, notable GitHub projects)

### Takeaway
Open source already has a mature inventory backend in **Grocy**. With **Barcode Buddy**, barcode scans become purchase or consume events, and unknown barcodes are looked up on OpenFoodFacts. Since 2025–26 a wave of fridge-camera builds using vision models has appeared:
- Jan Dubovsky's **fridge-core + fridge-card**: ESP32-CAM, reed switch and LED, through Home Assistant's ai_task, into a To-Do list with editable items and "mark as eaten".
- **Michdo93's** openHAB + Claude fridge-cam.
- **m0nklabs'** ESP32-S3 / OV5640 firmware that triggers on the fridge light and captures a burst.
- Photo-to-inventory apps **GhostPantry** and **SmartFridge Vision**.

**DecayDock** is the notable fully on-device ESP32-CAM build (Edge Impulse) with time-based freshness bars. The shared pattern: the AI produces a draft list and a human edits it. None of them claims reliable automatic removal tracking or real spoilage detection.

### Cited Findings

#### Grocy and Barcode Buddy
- Grocy calls itself "ERP beyond your fridge", a self-hosted household inventory system with add-ons — [Grocy](https://grocy.info/); [Grocy add-ons](https://grocy.info/addons)
- Barcode Buddy passes barcodes to Grocy. A known barcode "reduces / increases the inventory or manipulates the shopping list". Unknown barcodes are looked up on OpenFoodFacts first, and a USB scanner can push every scan automatically — [Barcode Buddy docs (PDF)](https://barcodebuddy-documentation.readthedocs.io/_/downloads/en/stable/pdf/); [docs index](https://github.com/Forceu/barcodebuddy-documentation/blob/v1.8.1.5/docs/index.rst)
- Camera scanning: Grocy's web UI camera button uses Quagga2 and requires HTTPS — [Grocy (fork README)](https://github.com/coder2000/grocy). There is an Android scanner app — [F-Droid](https://f-droid.org/en/packages/de.bulling.barcodebuddyscanner/) — and an iOS Shortcut where you **choose Consume or Purchase**, then scan — [RoutineHub](https://routinehub.co/shortcut/20574/)
- grocy-scanner creates products automatically and "will never ask you to map it to an existing product" — [GitHub](https://github.com/manuel-rw/grocy-scanner)

#### Jan Dubovsky (jan-tdy): fridge-core + fridge-card (Home Assistant)
- Hardware: an AI-Thinker ESP32-CAM, the GPIO4 flash LED as fridge light, and a **reed-switch door sensor on GPIO13** that needs no external resistors. An HA blueprint plus a custom Lovelace card. The **photo is taken when the door opens** and sent to an AI vision model to build an editable inventory — [HA Community thread](https://community.home-assistant.io/t/fridge-cam-ai-content-recognition-esp32-cam-ha-blueprint-a-custom-lovelace-card/1023750)
- Pipeline: door opens, LED on, a **640×480 JPEG** is saved, then HA's `ai_task.generate_data` runs with the image attached, and the parsed items are added or updated in an HA **To-Do list**. The project is MIT-licensed. The guide warns the output is "an AI-assisted inventory that you can correct, not a database you can trust without checking" — [PopularAI guide](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)
- fridge-card shows the latest photo and lets you add, edit or delete items, **mark items as eaten**, and rotate a crooked mount. Each item has a **brand field "set by hand and never touched by the AI"**, and the card reads from an HA todo entity — [GitHub fridge-card](https://github.com/jan-tdy/fridge-card)
- Active project: v1.17.0 was released on 8 October 2026 with a fix to the door and light status display — [Release v1.17.0](https://github.com/jan-tdy/fridge-card/releases/tag/v1.17.0)

#### Other ESP32 fridge-cam builds
- Michdo93/fridge-cam: an ESP32-CAM takes a photo **every time the door closes**, streams live video on demand, and sends events to openHAB, with the **Claude API** analyzing contents — [GitHub](https://github.com/Michdo93/fridge-cam)
- 7Z0nE/esp32-fridgecam: photo and upload whenever the door closes — [GitHub](https://github.com/7Z0nE/esp32-fridgecam)
- m0nklabs/fridge-cam-firmware: ESP32-S3 with an **OV5640** (higher resolution than the ESP32-CAM's usual sensor), Wi-Fi upload and deep sleep. A **light sensor detects the fridge light coming on** when the door opens, triggers an interrupt, and the board sends a short burst of frames to a server. Part of "HungryFoodTool" — [GitHub](https://github.com/m0nklabs/fridge-cam-firmware)
- LLM Vision, a general HA integration, analyzes images, video and camera feeds with multimodal language models. It has no fridge-inventory logic of its own — [GitHub ha-llmvision](https://github.com/valentinfrlch/ha-llmvision); [llmvision.org](https://llmvision.org/)

#### DecayDock (2026)
- An Instructables project by ptallthings93: an ESP32-CAM plus a TFT screen, with a model running **locally** via Edge Impulse. It recognizes items such as tomatoes, onions, bananas, spinach, milk cartons and leftovers, and shows freshness as color-coded progress bars — [Instructables](https://www.instructables.com/DecayDock-AI-Smart-Fridge-Companion/); [Hackster](https://www.hackster.io/news/decaydock-the-tiny-ai-device-that-combats-food-waste-3a34ddad9cbf); [DesignSpark](https://www.rs-online.com/designspark/decaydock-ai-powered-smart-fridge-companion-for-reducing-household-food-waste); [LetsDataScience](https://letsdatascience.com/news/decaydock-uses-local-ai-to-track-fridge-freshness-a980b35c)
- Hackaday (May 20, 2026) notes the system "is only making estimates and cannot actually detect spoilage" such as mold or sourness — [Hackaday](https://hackaday.com/2026/05/20/decaydock-keeps-track-of-spoilage/)
- No official DecayDock GitHub repository was found in search.

#### Photo-to-inventory and other GitHub projects
- GhostPantry (highercomve): offline-first. Photos are used to estimate what is in the fridge **and how full each item is**. Stock is kept in local SQLite and turned into restock lists. Vision runs on OpenAI gpt-4o or gpt-4o-mini, and the app is built with Oriel (Zig, SQLite, Webview) and React/TypeScript — [GitHub](https://github.com/highercomve/ghostpantry)
- SmartFridge Vision (Abhinav1296/fridge): a photo goes to a vision model, which returns an inventory with freshness ratings. It works with any OpenAI-compatible endpoint and defaults to OpenRouter's free vision models — [GitHub](https://github.com/Abhinav1296/fridge)
- Fridge Vision (otawfik): YOLOv8 detection plus logistic-regression freshness, with no API keys — [GitHub](https://github.com/otawfik/fridge-vision). smart-fridge-project: identify, log, reorder, recipes — [GitHub](https://github.com/jaden530/smart-fridge-project). foodGPT: the photo inventory step was not implemented — [GitHub](https://github.com/sammymans/foodGPT)
- Expiry trackers without vision: jerrychen017/fridge-food-tracker (barcode, manual entry or **scan a whole receipt**) — [GitHub](https://github.com/jerrychen017/fridge-food-tracker); [ayns01/Fridge](https://github.com/ayns01/Fridge); [CaduTrack](https://github.com/JulioMoralesB/CaduTrack); [FoodBox](https://github.com/hann013/FoodBox)

#### Shelf-life data and practical hardware notes
- USDA FSIS **FoodKeeper** data is downloadable as `foodkeeper.json` and Excel (English, Spanish, Portuguese). It includes storage timelines for the refrigerator, freezer and pantry, is licensed **CC0**, and is updated irregularly. No query API was found — [data.gov](https://catalog.data.gov/dataset/fsis-foodkeeper-data); [USDA](https://www.usda.gov/node/20090). A self-hosted pantry app (Proviant) has an open feature request to use FoodKeeper for default shelf life — [Proviant issue #303](https://zff.dev/isotop7/proviant/issues/303)
- ESP32-CAM practicalities:
  - It works on 2.4 GHz only. The onboard antenna is fine near the access point, but the AI-Thinker board can switch to an external antenna by moving a jumper resistor — [Random Nerd Tutorials](https://randomnerdtutorials.com/esp32-cam-troubleshooting-guide/); [DroneBot Workshop](https://dronebotworkshop.com/esp32-cam-intro/)
  - Check the power supply first when the board misbehaves — [EngineersGarage](https://www.engineersgarage.com/esp32-cam-errors-and-solutions/)
  - One report found Wi-Fi performance depended on temperature; cooling the board and lowering resolution fixed most problems — [espressif/arduino-esp32 #4655](https://github.com/espressif/arduino-esp32/issues/4655)
- Hackaday's ESP32 freezer-alarm build uses a reed switch polled every few minutes and alarms after two consecutive "open" readings. Commenters flagged **condensation** risk (use an enclosure or conformal coating) and suggested a Hall sensor and a temperature probe — [Hackaday](https://hackaday.com/2023/07/27/esp32-freezer-alarm-keeps-tabs-on-tricky-door/)

### Inferences
- The builder does not need to invent a data model. Grocy already has products, locations, best-before dates and purchase or consume events, and it can be the system of record. HA To-Do lists are a lighter option. fridge-card's UI patterns are worth copying: one-tap "mark eaten", and fields owned by humans that the AI never overwrites.
- **Capture trigger choices:**
  - Door open (fridge-core) captures early but may catch hands and motion.
  - **Door close** (Michdo93, 7Z0nE, FridgeCam, HNGRYnsite, Bosch) captures a settled scene with no hands, which is better for comparing scenes.
  - A **light-sensor trigger** (m0nklabs) needs no wiring to the door.
- 640×480 JPEGs (fridge-core) are probably too low-resolution to read labels or dates; the "low-resolution camera" was one of FridgeCam's criticisms. An OV5640 or similar 5 MP module on an ESP32-S3 is the obvious upgrade path. That is an inference and untested here.
- FoodKeeper (CC0 JSON) can supply the "typical shelf life" defaults. The Proviant request shows other self-hosters want the same.

### Gaps
- The fridge-core repository README could not be retrieved directly, and nothing was found on its real-world accuracy or community uptake.
- DecayDock's source code location was not found.
- Maintenance status and real accuracy of GhostPantry, SmartFridge Vision and others were not verified (no repository access by design).
- No DIY write-up was found on lens fogging, cold-induced battery drain, or Wi-Fi through a closed steel fridge. Those risks are inferred from general ESP32 sources and Hisense's R&D note only.
- Whether FoodKeeper's JSON has separate "after opening" timelines was not verified.

## 6. Synthesis: design decisions that worked vs failed, unsolved gaps, and realistic opportunities for this builder

### Takeaway
The decisions that worked were modest and honest:
- snapshots for remote peeking;
- large general-purpose vision models instead of narrow fixed-list classifiers;
- AI output treated as a draft the human confirms;
- "days stored plus typical shelf life", framed as "check it";
- explicit approval before anything is bought or reordered.

What failed:
- fixed-list recognizers;
- rituals at the door (hold up, wait for beep, no door pockets);
- manual or crowd tagging as the main path;
- hardware tied to a vendor cloud;
- implied freshness "detection";
- lists that silently go stale.

The unsolved gaps are reliable removal and partial-use tracking; leftovers in opaque containers; coverage of the freezer, door bins and pantry; item identity across scans; and opened versus purchased dates. A phone-first, local-first tool at household scale can realistically do better than commercial products on several of these.

### Cited Findings

#### Status ledger (as of October 2026)
- Samsung AI Vision Inside: active and expanding (Gemini over-the-air update from May 2026, US 32-inch first) — [Engadget](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)
- LG: 2020 auto-inventory demo not delivered — [Reviewed](https://www.reviewed.com/refrigerators/features/smart-refrigerator-organize-groceries). A camera-based ThinQ Food appears on 2025–26 premium models — [Reviewed](https://www.reviewed.com/refrigerators/features/what-lg-instaview-kitchen-appliances)
- Bosch: view-only door-close cameras still on current UK pages — [Bosch UK](https://www.bosch-home.co.uk/bosch-innovations/homeconnect/homeconnect-fridges)
- Liebherr/Microsoft recognition: "prototype" (2016–17) — [Microsoft](https://learn.microsoft.com/en-us/archive/blogs/machinelearning/microsoft-and-liebherr-collaborating-on-new-generation-of-smart-refrigerators). Liebherr HNGRYnsite: **[DEAD]** since March 31, 2025 — [Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste)
- Smarter FridgeCam: **[DISCONTINUED]** at retailers — [Mobile Fun](https://www.mobilefun.com/smarter-fridgecam-wifi-enabled-food-tracking-camera-85610)
- Amazon Dash Smart Shelf: **[DISCONTINUED]** per one blog — [eturns](https://stock.eturns.com/resources/blog/?p=6)
- Fridge Eye, Ovie Smarterware, FreshFridge: **[STATUS UNKNOWN]** — [The Spoon](https://thespoon.tech/fridge-eye-is-a-cheap-connected-camera-to-smarten-up-your-fridge-or-cupboard/)

#### Decisions that worked
1. **Door-close snapshot for remote viewing only.**
   - Bosch has offered it since IFA 2015 and still does — [Reviewed](https://reviewed.com/refrigerators/news/this-app-shows-you-whats-in-your-fridge); [Bosch UK](https://www.bosch-home.co.uk/bosch-innovations/homeconnect/homeconnect-fridges)
   - FridgeCam's one consistent positive was being "a useful reminder of what's in your fridge" — [Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review)
   - Which? found image quality reasonable once synced — [Which?](https://www.which.co.uk/news/article/is-it-worth-buying-a-fridge-camera-aNLE02N0tb1Z)
2. **General-purpose vision models instead of fixed-list classifiers.**
   - Samsung went from roughly 87–100 items to more than 2,000 by adding cloud Gemini — [Engadget](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)
   - A single phone photo of about 30 partly hidden cupboard items came back nearly complete — [Techlicious](https://www.techlicious.com/blog/samsung-bespoke-fridge-vision-ai-with-google-gemini/)
   - Samsung Food's cloud recognition reportedly covers more than 40,000 ingredients — [ControlF5](https://blog.ctrlf5.software/blog/with-ai-food-recognition-samsung-food-could-be-the-ultimate-meal-planning-app/)
   - Current Gemini models lead food-recognition benchmarks — [bioRxiv](https://www.biorxiv.org/content/10.64898/2026.07.26.740845v1)
3. **A suggested use-by date the user can adjust, and time-in-fridge warnings.**
   - Samsung's demo logged items with a suggested use-by date and prompted the user to adjust it — [Homes & Gardens](https://www.homesandgardens.com/solved/samsung-ai-refrigerator)
   - The 2026 update warns as perishables near the end of their shelf life based on time stored — [Engadget](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)
4. **AI output as an editable draft.**
   - fridge-card offers edit, delete and mark-eaten, and keeps fields the AI never touches — [GitHub](https://github.com/jan-tdy/fridge-card)
   - The fridge-core guide says "correct, not trust" — [PopularAI](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)
   - NoWaste.ai asks users to review auto-added items — [Google Play](https://play.google.com/store/apps/details?id=com.nowaste.ai&hl=en_US)
   - Samsung says "accuracy not guaranteed; check results" — [Samsung US](https://www.samsung.com/us/refrigerators/)
5. **Human approval before buying.** Samsung's Instacart flow fills a cart but the user approves checkout — [TechSpot](https://www.techspot.com/news/106204-samsung-ai-fridges-soon-order-groceries-you-instacart.html); [Grocery Dive](https://www.grocerydive.com/news/instacart-samsung-shoppable-smart-fridge-tech/736286/)
6. **Explicit or inferred outflow events.**
   - Barcode Buddy's consume and purchase modes — [Barcode Buddy docs](https://barcodebuddy-documentation.readthedocs.io/_/downloads/en/stable/pdf/); [RoutineHub](https://routinehub.co/shortcut/20574/)
   - Samsung Food removes ingredients after cooking — [Samsung Newsroom](https://news.samsung.com/global/upgraded-samsung-food-raises-the-bar-for-food-experiences-at-ifa-2024)

#### Decisions that failed
1. **Narrow fixed-list recognition.**
   - FridgeCam recognized zero items in two weeks — [Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review)
   - Samsung was stuck at 33–37 fresh foods from 2020 to 2025 — [Samsung Canada](https://www.samsung.com/ca/refrigerators/family-hub/); [Samsung US 2025](https://news.samsung.com/us/samsung-family-hub-2025-update-elevates-smart-home-ecosystem/)
   - LG's 2020 demo was not delivered — [Reviewed](https://www.reviewed.com/refrigerators/features/smart-refrigerator-organize-groceries)
2. **Watching the doorway with a single in-fridge camera.**
   - Users must hold items up and wait for a beep; using door pockets makes the fridge think an item was removed — [Trusted Reviews](https://www.trustedreviews.com/reviews/samsung-bespoke-ai-4-door-french-door-rf90f29aecraa)
   - Food covered by a hand is not recognized — [Samsung Chile](https://samsung.com/cl/c/p/RF29DB9950QDZS)
   - Earlier, "items have to be added one at a time" — [Tech Advisor](https://www.techadvisor.com/article/2286699/samsung-ai-family-hub-fridge-freezer.html)
   - Vending research shows dynamic accuracy falls when items move — [Towards New Retail](https://dl2link.com/Selected%20Journal%20Publications/Towards%20New%20Retail%20A%20Benchmark%20Dataset%20for%20Smart%20Unmanned%20Vending%20Machines.pdf)
3. **Photographing shelves with one fixed camera.**
   - It cannot see below fully stocked top shelves — [Homes & Gardens](https://www.homesandgardens.com/solved/samsung-ai-refrigerator)
   - FridgeCam couldn't see the door or crisper — [TechServing](https://www.techserving.com/technology/smarter-fridgecam-review-make-your-fridge-less-dum/)
   - It took "sporadic photos of some shelves" — [Tech Advisor](https://www.techadvisor.com/article/719327/smarter-fridgecam-review.html)
   - Static vision usually needs one camera per shelf — [BasicAI](https://www.basic.ai/blog-post/computer-vision-for-smart-vending-machines-how-it-works-models-data-and-annotations)
4. **Manual or crowd tagging as the main path.**
   - FridgeCam relied on users tagging, which reviewers found tedious — [Expert Reviews](https://www.expertreviews.co.uk/home-garden/large-appliances/smarter-fridgecam-review)
   - The Dash shelf needed every item programmed — [AFTVnews](https://www.aftvnews.com/tag/amazon-dash)
   - The JMIR pilot cited "too many manual operations" — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)
   - A NoWaste user was "too frustrated to do it again" after bulk entry — [App Store reviews](https://apps.apple.com/us/app/nowaste-food-inventory-list/id926211004?see-all=reviews)
5. **Hardware tied to a vendor cloud.**
   - HNGRYnsite was bricked with no local fallback — [Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste)
   - FridgeCam was discontinued and its maker went unresponsive — [App Store](https://apps.apple.com/gb/app/smarter-3-0/id1196743717)
   - Samsung's new recognition requires active Wi-Fi — [Engadget](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)
6. **Overclaiming freshness.**
   - Ovie's tags were timers, not sensors — [New Atlas](https://newatlas.com/ovie-smarterware/52890/); [Mental Floss](https://mentalfloss.com/article/570146/ovie-smarterware-containers-will-tell-you-when-food-goes-bad)
   - DecayDock "cannot actually detect spoilage" — [Hackaday](https://hackaday.com/2026/05/20/decaydock-keeps-track-of-spoilage/)
   - FridgeCam marketing claimed it could halve food waste — [Climate-KIC](https://www.climate-kic.org/?p=36905)
   - Hisense's own R&D says cameras are only a supplement — [Seiko RFID](https://www.seikorfid.com/news/RFID-ingredient-management-refrigerator.html)
7. **Lists drifting out of date.**
   - Samsung still needs manual deletion — [Engadget review](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html)
   - The app and fridge-screen lists disagreed — [SmartThings Community](https://community.smartthings.com/t/samsung-family-hub-and-smartthings-ai-vision-inside/298419)
   - "A half-updated inventory can be worse than none" (vendor-adjacent claim) — [Pantry Persona](https://www.pantrypersona.com/blog/best-pantry-inventory-apps-2026)
8. **Fragile third-party integrations.** Cooklist's store-login failures — [Google Play](https://play.google.com/store/apps/details?id=com.cooklist.android&hl=en_US); Liebherr's HNGRY app shutdown — [Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste)
9. **Auto-reorder hardware.** The Dash Smart Shelf offered auto-reorder and is reported discontinued; no reason was given, so failure cannot be blamed on auto-reorder itself — [AFTVnews](https://www.aftvnews.com/tag/amazon-dash); [eturns](https://stock.eturns.com/resources/blog/?p=6). Dash buttons were also wound down — [PYMNTS](https://www.pymnts.com/?p=1103639)

#### Evidence for unsolved gaps
- **Door bins, freezer and drawers**: Samsung explicitly can't see them — [Samsung US 2025](https://news.samsung.com/us/samsung-family-hub-2025-update-elevates-smart-home-ecosystem/); [Engadget review](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html)
- **Opaque containers and leftovers**: Gemini claims to read handwritten labels — [Ground News](https://ground.news/article/samsung-electronics-unveils-ai-refrigerator-combining-gemini-and-ai-even-reading-handwritten-labels). A low-reliability report says Tupperware contents were unseen — [Techelectroniclive](https://techelectroniclive.com/samsung-family-hub-refrigerator-2026/)
- **Quantity and partial use**: GhostPantry attempts to estimate how full an item is — [GitHub](https://github.com/highercomve/ghostpantry). Vision-model counting degrades as numbers grow — [LVLM-COUNT](https://arxiv.org/html/2412.00686v1)
- **Identity of duplicates**: CloudFridge separated identical bottles only by time gaps — [arXiv](https://arxiv.org/pdf/1401.0585). Samsung's 2026 update now counts Diet Coke and Coke Zero separately — [Engadget](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)
- **Real spoilage sensing**: not solved by any surveyed product or project — [Hackaday](https://hackaday.com/2026/05/20/decaydock-keeps-track-of-spoilage/)
- **Shelf-life data**: open data exists (FoodKeeper JSON, CC0) — [data.gov](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- **Long-term engagement**: no evidence that any app sustains use; the pilot found no effect — [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)

### Inferences

#### Doorway vs shelves
- In-fridge, neither works alone. Doorway capture needs rituals and fails on hands and door pockets. Fixed shelf cameras miss whatever is hidden or out of frame.
- The builder's Phase 1 is a third option: **shelf photos taken by a person**. The person can open drawers, door bins, the freezer and the pantry, which are exactly where every commercial camera is blind, and can move a jar aside. Phone cameras are also far sharper than fridge cameras.
- The cost is a short scan session. It has to stay at roughly a minute or two per zone with one-tap corrections, or it repeats the manual-entry failure.

#### How to handle "what's gone"
This is the core design risk.
- Treat "not seen this scan" as **"possibly gone, please confirm"**, never as an automatic delete. Occlusion is the top documented failure mode in research and in Samsung's disclaimers.
- Compare across all zones in one session, so an item moved from a shelf to the door bin is not counted as one removal plus one addition (the static-vision "moved item" failure).
- Prompt pattern: give the vision model the previous inventory list plus the new photos and ask for a structured diff (added, likely removed, unchanged, uncertain) for a single confirmation screen.
- Keep each item's "first seen" date stable across scans. That is what makes "spinach, day 9" meaningful.
- When a new item matches an existing one (for example a second bag of spinach), ask "same or new?" only for perishables where it matters.

#### Freshness wording
- Copy the honest framing: "day 9 of a typical 5–7 days, check it", never "spoiled".
- FoodKeeper gives defaults. Let the user adjust shelf life per item, as Samsung's demo did.
- Do not imply sensing. DecayDock and Ovie show the community calls this out.

#### Shopping list
- Suggest, never silently edit or order. Samsung, with every commercial incentive to automate, still requires approval.
- Silent changes compound the trust problem: once a user catches one wrong automatic edit, they stop trusting the whole list. This is inference; no direct user-complaint evidence was found.

#### Phase 2 (ESP32-CAM) should be a supplement, not the system of record
- Expect FridgeCam- and HNGRYnsite-class limits: one camera sees the front of a shelf or two, in a cold, wet, metal box with weak 2.4 GHz Wi-Fi.
- Best uses:
  - an automatic door-close snapshot for remote peeking;
  - a nudge such as "big change since last scan, want to confirm?";
  - catching quick consumption between phone scans.
- Build choices:
  - wired USB power if possible;
  - capture on door close (settled scene) with the LED;
  - higher-resolution sensors (OV5640-class) if labels matter;
  - an external antenna;
  - an enclosure designed against condensation;
  - local storage only.

#### Local-first and swappable AI
- Keep photos and the database on household hardware, such as Home Assistant or Grocy, with the vision-model provider behind one adapter. That avoids the HNGRYnsite fate and lets the builder change models as prices and quality move. Gemini Flash-class models lead food-ID benchmarks on cost as of mid-2026.

#### Realistic opportunities for this builder
1. **Scan-to-scan comparison with one-screen human confirmation.** No surveyed product publicly does this; it is the builder's core novelty.
2. **Whole-house coverage**: fridge, freezer, door bins and pantry. This is the documented commercial blind spot.
3. **Leftovers via labels.** A strip of masking tape with a date, or a quick "what's in this container" photo; vision models can read handwriting, as Samsung's 2026 marketing claims.
4. **A ranked "use first" list** at the end of every scan. This is the immediate payoff the app literature says is missing.
5. **Durable, local-first ownership**, so the household is not tied to a vendor app.

Less realistic for a hobbyist: automatic partial-use tracking (how much milk is left), true spoilage detection, and robust in-fridge doorway recognition with hands in frame. Research and Samsung both struggle with these.

### Gaps
- No direct evidence was found on how users react to apps **silently editing shopping lists**. The closest cases are Samsung Food moving checked-off items back into the Food List and Barcode Buddy "manipulating the shopping list" on scan. User sentiment about these is unknown.
- No public evaluation of a vision model's accuracy at **comparing two fridge scans** (detecting removals, matching identity, handling occlusion) was found. The builder will need a small home test set to measure it.
- Searches not run because the budget was exhausted: apps that compare successive scans; Canadian receipt formats and grocer integrations (Superstore/PC Optimum, Sobeys/Safeway, Co-op, Costco Canada); Wirecutter, CNET and The Verge verdicts on 2025–26 camera fridges; GE, Whirlpool and Haier camera fridges; FoodKeeper "after opening" fields; and peer-reviewed retention data for inventory apps.
- No quantitative real-world data (as opposed to anecdotes) was found on in-fridge camera failure modes such as condensation, cold-related battery drain or Wi-Fi attenuation.
