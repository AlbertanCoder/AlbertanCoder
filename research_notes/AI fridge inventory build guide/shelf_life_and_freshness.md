# Shelf-life data, freshness estimation and spoilage sensing for a household fridge/pantry tracker

_Notes compiled 2026-10-16 for an Alberta-based hobbyist build. Phase 1: phone photos and a vision AI, with first-seen dates tracked across scans. Phase 2: an ESP32-CAM-class camera inside the fridge._

_How these notes were gathered: WebFetch and curl could not reach fsis.usda.gov, catalog.data.gov, canada.ca or arxiv.org from this environment (DNS failures and a proxy 403). Nearly every finding below therefore comes from search-result summaries of the cited pages, not from reading the full pages. The web-search budget shared across agents ran out before every planned query was run, and the missed topics are listed under Gaps. Check numbers marked "via search snippet" against the live page before hard-coding them._

## 1. USDA FoodKeeper: contents, format, access, license, coverage, maintenance and developer quirks

### Takeaway
FoodKeeper is the only free, machine-readable, government shelf-life dataset I found. FSIS publishes it on data.gov as XLS and JSON in English, Spanish and Portuguese. Its listed last update is 22 Jan 2025, and that was still the listed date when the catalog was checked in Sept 2026. USDA's most recent stated count is "more than 650" foods and beverages.

Each product has min/max/unit fields for each storage location (pantry, fridge, freezer) and each condition, such as the `DOP_` ("from purchase") fields and the `_After_Opening` fields, plus free-text tips. A developer should expect to:
- normalize a spreadsheet-shaped export
- handle non-numeric "units" such as "When Ripe", "Indefinitely" and "Not Recommended"
- substitute Canadian values where Health Canada differs
- avoid depending at runtime on the plain-HTTP download URL

### Cited Findings
**Where it lives, format and license**
- The data.gov listing "FSIS – FoodKeeper Data" is published by USDA's Food Safety and Inspection Service (FSIS). It has six downloads: English, Spanish and Portuguese, each as XLS and as JSON. The listing reads "Dataset Last Updated: January 22, 2025", and the catalog page was last checked in Sept 2026. No CSV is offered. — [catalog.data.gov](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- The download links in the catalog metadata are `http://www.fsis.usda.gov/shared/data/EN/foodkeeper.json` (English), `/shared/data/ES/foodkeeper.json` (Spanish) and `/shared/data/PT/…` (Portuguese). Note that they use plain HTTP. — [catalog.data.gov](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- The catalog describes the FoodKeeper application as educating users on storing food and beverages so they stay fresh longer. — [catalog.data.gov](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- License: a mirror of the dataset on the AmeriGEOSS DataHub lists it as CC0 (public domain). I did not see the official data.gov license field. — [AmeriGEOSS mirror](https://data.amerigeoss.org/dataset/fsis-foodkeeper-data1)
- USDA itself presents FoodKeeper as an open-data product. — [USDA blog: "USDA's FoodKeeper App Uses Open Data…"](https://www.usda.gov/about-usda/news/blog/usdas-foodkeeper-app-uses-open-data-keep-consumers-safe-and-food-fresh)

**What the data contains (FSIS data dictionary)**
- FSIS's "Data Documentation – FoodKeeper Application" is an older document; its file path is dated 2020-06. It organizes the data into sheets:
  - **Version**: version number, modified date and an FSIS-approval flag.
  - **Category**: an integer ID, a category name and a subcategory name.
  - **Product**: an integer `Category_ID` that links to Category, plus the storage fields.

  — [FSIS data dictionary (PDF)](https://www.fsis.usda.gov/sites/default/files/media_file/2020-06/Data-Documentation-FoodKeeper-Application.pdf)
- Storage fields come in families: an integer `_Min`, an integer `_Max`, a `_Metric` (the unit) and sometimes a `_tips` text field. Documented examples are `Pantry_Metric`, `Refrigerate_After_Opening_Min/Max/Metric`, `DOP_Refrigerate_Min/Max/Metric/tips`, `DOP_Pantry_Min/Max/Metric/tips` and the `DOP_Freeze…` fields. — [FSIS data dictionary (PDF)](https://www.fsis.usda.gov/sites/default/files/media_file/2020-06/Data-Documentation-FoodKeeper-Application.pdf)
- The allowed `_Metric` values include Days, Weeks, Months, "When Ripe", "Indefinitely" and "Not Recommended". — [FSIS data dictionary (PDF)](https://www.fsis.usda.gov/sites/default/files/media_file/2020-06/Data-Documentation-FoodKeeper-Application.pdf)
- The search snippet did not spell out what "DOP" stands for. — [FSIS data dictionary (PDF)](https://www.fsis.usda.gov/sites/default/files/media_file/2020-06/Data-Documentation-FoodKeeper-Application.pdf)
- A third-party Rails API built on the data, jelera/food-shelflife-db, is described as follows:
  - Each product has a name, a category and subcategory, search keywords, and fridge/freezer min–max ranges with units. For example, goat meat keeps 3–5 days in the fridge.
  - It uses keys such as `dop_refrigerate` and `dop_freeze`.
  - Its "v1" serves the data as-is. Its "v2" serves "more semantic developer-friendly JSON", including `cooking_methods` (for example Oven and Broil/Grill, with time ranges).

  — [GitHub: jelera/food-shelflife-db](https://github.com/jelera/food-shelflife-db)

**Coverage and the app around the data**
- USDA's most recent count: FoodKeeper covers "more than 650 food and beverage items". An "Add Item" feature lets users suggest missing items. The date of this statement isn't shown in the results and it appears to be several years old. — [USDA: FoodKeeper updated to include new food items](https://www.usda.gov/about-usda/news/blog/usda-updates-foodkeeper-app-include-new-food-items); [FSIS news release](https://www.fsis.usda.gov/news-events/news-press-releases/usda-updates-foodkeeper-app-include-new-food-items)
- Earlier counts: "more than 400" items at first. A later update that added recall alerts expanded coverage "from about 400 to more than 500 items" (older). — [USDA blog: recalls integrated into FoodKeeper](https://www.usda.gov/about-usda/news/blog/usda-integrates-recalls-information-foodkeeper-application); [ProFoodWorld](https://www.profoodworld.com/leaders-new/business-drivers/food-safety/news/13277568/usdas-foodkeeper-app-gets-an-update)
- FSIS developed the app with Cornell University and the Food Marketing Institute (FMI). It gives refrigerator, freezer and pantry timelines and pushes FSIS and FDA recall notices. — [USDA open-data blog](https://www.usda.gov/about-usda/news/blog/usdas-foodkeeper-app-uses-open-data-keep-consumers-safe-and-food-fresh); [FMI FoodKeeper page](https://www.fmi.org/industry-topics/sustainability-new/food-keeper-food-storage-database); [Cornell Chronicle, Apr 2015 (older)](https://news.cornell.edu/stories/2015/04/dial-food-storage-cooking-advice-foodkeeper-app); [USDA recalls blog](https://www.usda.gov/about-usda/news/blog/usda-integrates-recalls-information-foodkeeper-application)
- The app covers meat, poultry, produce, seafood, dairy, eggs and more. It offers calendar reminders, and a web version is at foodsafety.gov/foodkeeper. — [FoodSafety.gov FoodKeeper page](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app); [USDA new-items blog](https://www.usda.gov/about-usda/news/blog/usda-updates-foodkeeper-app-include-new-food-items)
- USDA cautions that the storage times "are intended as useful guidelines and are not hard-and-fast rules. Some foods may deteriorate more quickly while others may last longer than the times suggested." This is quoted via a search snippet of USDA FoodKeeper material, and I could not pin down the exact page. — [USDA new-items blog](https://www.usda.gov/about-usda/news/blog/usda-updates-foodkeeper-app-include-new-food-items)

**Maintenance status (as of Oct 2026)**
- I found no USDA announcement from 2025 or 2026 about FoodKeeper content changes. The data.gov "last updated" date was still 22 Jan 2025 at the Sept 2026 catalog check. — [catalog.data.gov](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- A third-party app tracker lists the Android FoodKeeper app at version 9.0.1, updated 30 Oct 2025. This is a secondary source. — [AppBrain](https://www.appbrain.com/app/foodkeeper/gov.usda.fsis.foodkeeper2)

**Existing tooling**
- I found no maintained npm, PyPI or MCP package that wraps FoodKeeper. The nearby "USDA MCP servers" wrap FoodData Central, which is nutrition data, not storage data. `shelf-life-mcp` tracks a household's own expiry dates and has no USDA reference data. — [GitHub: mgnlia/shelf-life-mcp](https://github.com/mgnlia/shelf-life-mcp); [GitHub: cyanheads/usda-mcp-server](https://github.com/cyanheads/usda-mcp-server)

### Inferences
- **Normalize into a long table:** `(product_id, location ∈ {pantry, fridge, freezer}, basis ∈ {from_purchase (DOP_), base, after_opening, after_thawing?}, min, max, unit, flag, tips)`. Convert Weeks to days ×7 and Months to days ×≈30 for calculations, but keep the original text for display ("1–2 weeks").
- **Treat non-numeric metrics as flags:** "When Ripe" (produce on the counter), "Indefinitely" (some frozen or shelf-stable items) and "Not Recommended" (for example, freezing some foods) are flags, not numbers. Expect many null fields for any one product.
- **Meaning of `DOP_`:** it most plausibly means "date of purchase", so its clock starts at purchase. That is the anchor a first-seen-date tracker approximates, which makes the `DOP_` fields the natural default for this app. The non-`DOP_` fields are probably the "after the package date" or generic variant. Check a dozen products in the JSON against the app's on-screen text before relying on this.
- **Vendor a copy:** the content hasn't changed since Jan 2025 and the URL is plain HTTP. Keep a dated copy in your repo (and record its Version-sheet number and date) rather than fetching it live.
- **Use Canadian values where they exist:** the values are US guidance, so override them with Health Canada values for the categories Health Canada covers: meat, poultry, fish, eggs, deli meats and leftovers (see section 2).
- **Keywords for matching:** the per-product "search keywords" (as described by the jelera API) are a ready-made synonym list for matching AI-generated item names (see section 4).
- **No French version:** French and bilingual Canadian product names will need your own synonyms.

### Gaps
- I could not open the JSON or the full data dictionary. These remain unverified:
  - the exact top-level layout of the JSON
  - the current product and category counts in the file
  - the exact meaning of the non-`DOP_` fields
- From my own memory, not confirmed: the JSON is a spreadsheet-style export (a "sheets" list, each holding rows as arrays of single-key objects), and it may include cooking-tips/cooking-methods sheets and `*_After_Thawing` fields. Inspect the file before writing a parser.
- I did not confirm the official license on the data.gov record; I only saw the CC0 mirror. US federal works are generally public domain, but check.
- I did not confirm the date of the "650+ items" statement.
- An HTTPS download test from this sandbox was refused by the egress proxy, so I could not verify that the FSIS URL still resolves.

## 2. Canadian guidance (Health Canada, CFIA, Canada.ca, Love Food Hate Waste Canada) and how it differs from the US

### Takeaway
I found no downloadable Canadian shelf-life dataset. Health Canada's "Safe food storage" chart and its leftovers infographic (both HTML pages) cover the high-risk foods: meat, poultry, fish and shellfish, eggs, deli meats, salads and leftovers. Health Canada says its fridge times are for safety and its freezer times are for quality.

Canadian law differs from the US in three ways that matter for an app:
1. Best-before dates are mandatory on prepackaged foods with a durable life of 90 days or less. The US has no general federal requirement.
2. Dates are printed year first, then a bilingual two-letter month code, then the day (for example "26 OC 20").
3. True expiration dates appear only on formula and special-diet foods.

For several proteins, Health Canada's fridge times differ from US guidance: poultry is longer in Canada (2–3 days vs 1–2 days), and beef steaks are shorter (2–4 days vs 3–5 days).

### Cited Findings
**Date-label law (CFIA and the Food and Drug Regulations)**
- **Which foods must carry a best-before date:** prepackaged foods with a shelf life of 90 days or less, except fresh fruits and vegetables and certain other products.
  - Foods packaged somewhere other than the store selling them need a best-before date and any storage instructions.
  - Foods packaged at the store may instead carry a "packaged on" date plus durable-life information.
  - Foods keeping longer than 90 days (for example cereals and dry-cured sausage) don't need a date.

  — [CFIA consumer guide: date labels](https://inspection.canada.ca/en/food-labels/labelling/consumers/date-labels-food); [CFIA industry guide: date markings and storage instructions](https://inspection.canada.ca/en/food-labels/labelling/industry/date-markings-and-storage-instructions)
- **Expiration dates** are required only on foods for special dietary use, infant formula and human milk fortifiers. Examples are meal replacements, nutritional supplements and formulated liquid diets. — [CFIA consumer guide](https://inspection.canada.ca/en/food-labels/labelling/consumers/date-labels-food)
- An expiration date is described as the last day a food can safely be consumed (per CFIA-citing summaries). — [CFIA consumer guide](https://inspection.canada.ca/en/food-labels/labelling/consumers/date-labels-food)
- **A best-before date is about freshness and quality, not safety.** CFIA states that "a durable life date is not an indicator of food safety, neither before nor after the date." — [CFIA consumer guide](https://inspection.canada.ca/en/food-labels/labelling/consumers/date-labels-food); [CFIA industry guide](https://inspection.canada.ca/en/food-labels/labelling/industry/date-markings-and-storage-instructions)
- CFIA says an unopened food "stored according to the instructions on the package … could still be eaten days or even weeks after the best before date has passed". It advises checking for spoilage signs such as mould or an off smell. It also warns that **"some foods will become unsafe before they spoil, so follow safe food storage guidelines."** — [CFIA: three facts about best-before dates](https://inspection.canada.ca/en/inspect-and-protect/food-safety/three-facts-about-best-dates-can-save)
- **Once a package is opened**, the best-before date no longer applies; shelf life "may change" and consumers must use judgement. This comes from secondary sources citing CFIA; I did not see CFIA's own wording on opened products. — [Canadian Food Focus](https://canadianfoodfocus.org/in-your-kitchen/what-does-the-best-before-date-really-mean/); [Love Food Hate Waste Canada: best-before dates](https://lovefoodhatewaste.ca/use-it-up/best-before-dates/)
- "Use by" may replace "best before" only on prepackaged fresh yeast. — [CFIA industry guide](https://inspection.canada.ca/en/food-labels/labelling/industry/date-markings-and-storage-instructions)
- **Date format:**
  - When the year is shown, it comes first. The year is required only when needed for clarity, for example when the shelf life runs into the next year.
  - Abbreviated months must use one bilingual code each: JA, FE, MR, AL, MA, JN, JL, AU, SE, OC, NO, DE.
  - An archived Health Canada advisory gives the example "Best before 11 JA 22 / Meilleur avant", which means 2011 January 22. That advisory is archived and no longer updated.

  — [Food and Drug Regulations B.01.007](https://laws-lois.justice.gc.ca/eng/regulations/C.R.C.,_c._870/section-B.01.007.html); [CFIA industry guide](https://inspection.canada.ca/en/food-labels/labelling/industry/date-markings-and-storage-instructions); [Archived Health Canada advisory](https://recalls-rappels.canada.ca/en/alert-recall/best-and-expiration-dates-foods-what-do-they-mean)
- **Reform status:** CFIA's Food Labelling Modernization proposal would have extended date marking to all foods (with some exceptions), using fuller day-month-year formats. Its timing was listed as "December 2022 (TBC)", and I found no sign it was finalized. I found no 2025–26 consultation on date labels; the 2025–26 labelling deadline was for front-of-package nutrition symbols (1 Jan 2026). — [CFIA: proposed regulatory changes (FLM)](https://inspection.canada.ca/en/about-cfia/transparency/consultations-and-engagement/completed/proposed-flm/proposed-regulatory-changes); [CFIA FOP implementation plan](https://inspection.canada.ca/en/food-labels/labelling/implementation-plan)

**Health Canada storage guidance**
- Keep the fridge at 4 °C (40 °F) or lower and the freezer at −18 °C (0 °F) or lower. Refrigerate or freeze raw meat, poultry, fish, seafood and leftovers as soon as possible, within two hours. — [Health Canada: Safe food storage](https://www.canada.ca/en/health-canada/services/general-food-safety-tips/safe-food-storage.html)
- Health Canada states that "the following recommended refrigeration times are for safety, and the freezing times are for quality." — [Health Canada: Safe food storage](https://www.canada.ca/en/health-canada/services/general-food-safety-tips/safe-food-storage.html)
- Chart values from a copy of the Canada.ca page printed 19 Jul 2023 (older; the live page was not readable from here):

  | Food | Fridge | Freezer |
  |---|---|---|
  | Beef | 2–4 days | 10–12 months |
  | Ground meat | 1–2 days | 2–3 months |
  | Whole chicken or turkey | 2–3 days | 1 year |
  | Chicken pieces | 2–3 days | 6 months |
  | Lean fish (cod, flounder) | 3–4 days | 6 months |
  | Fatty fish (salmon) | 3–4 days | 2 months |
  | Clams, crab, lobster | 12–24 hours | 2–4 months |
  | Eggs in shell | 3–4 weeks | do not freeze |
  | Eggs out of shell | 2–4 days | 4 months |

  — [Copy of Canada.ca "Safe food storage" (printed 2023-07-19)](https://www.slfnha.com/wp-content/uploads/2024/09/Safe-food-storage-Canada.ca_.pdf)
- From the live page (via search snippet):
  - unopened hot dogs and lunch meat: about 2 weeks
  - opened hot dogs: about 1 week
  - opened lunch meat: 3–5 days
  - deli-packaged lunch meat: 3–4 days
  - deli or homemade salads: 3–5 days, and do not freeze

  — [Health Canada: Safe food storage](https://www.canada.ca/en/health-canada/services/general-food-safety-tips/safe-food-storage.html)
- The leftovers infographic gives cooked dishes containing eggs, meat and vegetables 3–4 days in the fridge and 2–3 months in the freezer, and soups 2–3 days in the fridge and 4 months in the freezer (via search snippet). — [Canada.ca: Storing leftovers infographic](https://www.canada.ca/en/services/health/publications/food-nutrition/infographic-leftovers.html)
- A provincial chart (New Brunswick) repeats the safety-vs-quality split. It adds that food kept frozen continuously at −18 °C stays safe indefinitely, so freezer times are about quality only. — [GNB cold storage chart (PDF)](https://www.gnb.ca/content/dam/GNB3/t/ls/hea/food-safety/docs/cold-storage-chart.pdf)
- An Alberta consumer page, "Food Safety: Storing", exists on My Health Alberta; I did not retrieve its content. BC FOODSAFE also publishes a "Recommended Storage Times" PDF aimed at food-service operators. — [My Health Alberta](https://myhealth.alberta.ca/Health/pages/conditions.aspx?hwid=te5049); [FOODSAFE (BC)](https://www.foodsafe.ca/docs/Recommended_Storage_Times.pdf)

**How Canadian guidance differs from US guidance**

| Item | Canada (Health Canada) | US (FoodSafety.gov / USDA-derived) | Difference |
|---|---|---|---|
| Fresh beef steaks/roasts | 2–4 d fridge / 10–12 mo freezer ([HC copy](https://www.slfnha.com/wp-content/uploads/2024/09/Safe-food-storage-Canada.ca_.pdf)) | Steaks 3–5 d / 4–12 mo ([FoodSafety.gov](https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts)) | Canada **shorter** |
| Raw poultry | 2–3 d ([HC copy](https://www.slfnha.com/wp-content/uploads/2024/09/Safe-food-storage-Canada.ca_.pdf)) | Fresh poultry 1–2 d ([Minnesota Dept. of Health chart, USDA-derived, older](https://www.health.mn.gov/people/foodsafety/store/cold.html)); ground poultry 1–2 d ([FoodSafety.gov](https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts)) | Canada **longer** (US more conservative) |
| Ground meat | 1–2 d | Ground poultry 1–2 d | Same where verified |
| Hot dogs, lunch meat | see above | Same timeframes per search comparison ([FoodSafety.gov](https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts)) | Same |
| Prepared salads | Deli/homemade 3–5 d | Egg, chicken, ham, tuna, macaroni salads 3–4 d ([FoodSafety.gov](https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts)) | Canada slightly longer |
| Cooked leftovers | 3–4 d / 2–3 mo ([HC infographic](https://www.canada.ca/en/services/health/publications/food-nutrition/infographic-leftovers.html)) | 3–4 d / 3–4 mo (USDA as reported by [FOX 26](https://www.fox26houston.com/news/meal-preppers-take-note-usda-says-leftover-food-only-safe-for-3-to-4-days-after-cooking)) | Fridge same; freezer quality window differs |
| Fridge / freezer target | ≤4 °C / ≤−18 °C | ≤40 °F (4 °C) / 0 °F ([FoodSafety.gov](https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts)) | Same |

- **US date-label law:** apart from infant formula, federal rules do not require product dating. For meat, poultry and egg products, FSIS allows voluntary dates that must show at least month and day (plus the year for shelf-stable and frozen items) next to a phrase such as "Best if Used By". FSIS says dates are not a safety indicator. Infant formula must carry a "Use-By" date. — [FSIS: Food Product Dating](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating); [FSIS Food Product Dating PDF](https://www.fsis.usda.gov/sites/default/files/media_file/2020-08/Food-Product-Dating.pdf)
- Because US rules aren't uniform, dating practices vary widely from state to state. — [Cornell Cooperative Extension](https://albany.cce.cornell.edu/resources/food-product-dating)

**Love Food Hate Waste Canada (and Alberta)**
- The National Zero Waste Council launched the campaign nationally in 2018, building on a Metro Vancouver program. Partners included Toronto, Vancouver, Victoria, the Capital Regional District, Metro Vancouver, the Province of BC, RECYC-QUÉBEC, Walmart Canada and Sobeys. Its goal was aligned with halving Canada's food waste by 2030. — [Newswire launch release (2018)](https://newswire.ca/news-releases/national-launch-of-love-food-hate-waste-in-canada-688514351.html); [Recycling Product News](https://www.recyclingproductnews.com/article/28658/love-food-hate-waste-initiative-launched-nationally-in-canada)
- It came to Alberta in June 2022 with the Recycling Council of Alberta, Strathcona County and the City of Lethbridge. Planned content included food-storage guidance and demystifying best-before dates. — [NZWC Alberta media release (2022)](https://nzwc.ca/media/releases/MediaReleases/20220628-LFHWCanada-MediaReleaase-AlbertaAnnouncement.pdf); [Strathcona County](https://www.strathcona.ca/council-county/news/news/2022/6/28/lfhw-2022)
- It publishes an A–Z food storage guide for the fruits and vegetables Canadians waste most. One example: apples ripen 6 to 10 times faster at room temperature than in the fridge. — [Half Your Plate](https://www.halfyourplate.ca/blog/meet-love-food-hate-waste-canada-to-discover-food-waste-tips/); [City of Chilliwack](https://www.chilliwack.com/main/page.cfm?id=2658)

### Inferences
- **Source hierarchy for an Alberta household:**
  1. Health Canada for the categories it covers (proteins, eggs, deli meats, salads, leftovers).
  2. FoodKeeper for the long tail (dairy, condiments, produce, pantry, beverages).
  3. Love Food Hate Waste Canada for produce storage tips only. It is a waste-reduction campaign, not a food-safety authority, and offers no dataset.

  Where Health Canada is more permissive than the US (poultry), either show Health Canada's value and note that US guidance is shorter, or deliberately use the shorter value for the "use soon" trigger. Make this an explicit, documented choice.
- **Packages give a better anchor than first-seen.** Canada's mandatory best-before on foods of 90 days or less means Canadian perishable packages (dairy, packaged meat, salads) usually carry a machine-readable anchor. The best-before applies only while unopened; after opening, switch to the "after opening" windows.
- **"Packaged on" dates are older than first-seen.** Store-packed meat often carries a "packaged on" date plus a durable life, and that date is earlier than the date the item first appears in a scan.
- **Date parser rules:** handle "YY MM DD" with the bilingual month codes (for example "26 OC 20" means 2026-10-20, **not** 26 Oct 2020). Handle bilingual "Best before / Meilleur avant" labels. Also handle US-format dates on imported products ("BEST IF USED BY OCT 20 2026"). Note that the year is optional on Canadian labels.
- **Produce without dates:** fresh produce is exempt from date labels, so loose produce has no printed anchor and first-seen is the only clock.
- **Same rules across Canada:** food labelling is federal (CFIA and the Food and Drug Regulations), so the same date rules apply in Alberta as everywhere else in Canada.

### Gaps
- I could not read the current Health Canada chart in full; values come from a July 2023 printout and search snippets. Its dairy, produce and condiment rows (if any) and the page's "date modified" are unconfirmed. A non-government Canadian site's milk figure looked implausible, so I did not use it.
- I found no Canadian downloadable or open-data shelf-life dataset. The search budget ran out before I could check open.canada.ca directly.
- I did not verify US figures for fresh fish, shellfish and eggs, so those Canada/US comparisons are incomplete.
- I did not retrieve the Love Food Hate Waste Canada A–Z guide or the My Health Alberta page contents.
- The status of the Food Labelling Modernization date-format proposal is unclear.

## 3. Other shelf-life datasets and APIs, and their licenses

### Takeaway
I found no other open dataset of storage durations that can be reused. StillTasty is a consumer website with no public API or reuse license. Open Food Facts offers open product identity, barcode, category-taxonomy and photo data under ODbL, DbCL and CC-BY-SA, but no storage durations; its `expiration_date` field is free-form text copied from one photographed package. The academic datasets are image sets (fresh vs rotten produce) and expiry-date OCR sets, not shelf-life tables.

### Cited Findings
- **StillTasty** says its timeframes come from "reputable sources that conduct studies on food storage and safety" and from food manufacturers, including the USDA, FDA and CDC. My searches found no StillTasty API, developer access or reuse license. — [Internet Scout record](https://archives.internetscout.org/r51585/still_tasty); [Tasting Table](https://www.tastingtable.com/682154/thats-the-question-and-stilltasty-has-the-answer)
- **Open Food Facts licensing:** the database is under the Open Database License (ODbL), individual contents under the Database Contents License (DbCL), and product images under CC-BY-SA. The JSON/XML API and the data dumps are free of charge. — [Open Food Facts data page](https://world.openfoodfacts.org/data)
- The official Python SDK is MIT-licensed, but SDK users must still comply with the ODbL. — [openfoodfacts-python](https://github.com/openfoodfacts/openfoodfacts-python)
- Open Food Facts also publishes its product database on Hugging Face. — [HF: openfoodfacts/product-database](https://huggingface.co/datasets/openfoodfacts/product-database)
- **Open Food Facts taxonomies** are plain-text files in the `taxonomies` folder of the openfoodfacts-server repository. Each is a directed acyclic graph in which a node can have several parents. — [OFF wiki: GSoC 2022 taxonomy editor](https://wiki.openfoodfacts.org/GSOC_2022_-_Taxonomy_editor)
- A product's `categories_tags` holds the union of its ancestor categories, so one product can be reached through several category paths. — [open-food-facts-ndjson-extractor](https://github.com/alexander-marquardt/open-food-facts-ndjson-extractor)
- **The OFF `expiration_date` field** is not normalized and holds dates in mixed formats. OFF also notes that "best before" and "use by" can mean different things in different countries. — [OFF wiki: Data fields](https://wiki.openfoodfacts.org/Data_fields)
- **Image and academic datasets:**
  - Kaggle "Fresh and Spoiled Food Image Dataset": 8 categories. — [Kaggle](https://www.kaggle.com/datasets/maheen00shahid/fresh-and-spoiled-food-image-dataset)
  - An expiry-date OCR dataset of 2,161 images from 162 food items, built for an improved-DBNet study. — [ResearchGate](https://www.researchgate.net/publication/370356971_Recognition_of_expiry_data_on_food_packages_based_on_improved_DBNet)
  - A Kaggle "Food expiry tracker" dataset exists; I did not check its contents. — [Kaggle](https://www.kaggle.com/datasets/prekshad2166/food-expiry-tracker)
- **Food ontologies used in research:** FoodOn, SNOMED-CT and the Hansard taxonomy are the targets of current food entity-linking work (FoodSEM, FoodyLLM). They are naming ontologies, not shelf-life tables. — [FoodSEM (arXiv 2509.22125)](https://arxiv.org/abs/2509.22125); [FoodyLLM (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12927182/)
- **Commercial recognition catalogues are proprietary.** Samsung's May 2026 Family Hub update reportedly recognizes more than 2,000 food items using Google Gemini plus OCR of packaged goods. This is a closed product, not a dataset. — [SamMobile](https://www.sammobile.com/news/samsung-bespoke-ai-refrigerator-family-hub-update-usa-gemini/); [Samsung Newsroom](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates)

### Inferences
- **Practical stack:** FoodKeeper (public domain) plus Health Canada values transcribed by hand form your shelf-life table. Open Food Facts is optional, for barcode-to-product-name lookups when a Phase 1 phone photo catches a barcode. An ESP32-CAM at fridge distances is unlikely to resolve barcodes or small print.
- **ODbL only matters if you share:** for personal household use there's no problem. If you ever publish a database derived from OFF, ODbL share-alike and attribution apply. Mixing OFF data into a published FoodKeeper-derived table would put the combined table under those obligations.
- **Crosswalk OFF categories by hand:** OFF categories (for example `en:yogurts`) could be mapped to FoodKeeper categories with a crosswalk of about 100 lines. Do not try to infer shelf life from OFF's `expiration_date` field.
- **Don't scrape StillTasty:** treat it as all rights reserved. Use it for occasional manual cross-checks only.

### Gaps
- I did not retrieve StillTasty's terms page, so its exact terms are unknown.
- I did not verify the FoodOn license or the size of the OFF category taxonomy.
- I found no peer-reviewed open dataset of household shelf-life durations beyond FoodKeeper.

## 4. Mapping free-text, AI-detected item names to shelf-life categories

### Takeaway
Treat mapping as constrained classification, not free generation. Turn each detection into structured attributes: food type, state (raw, cooked or leftover), opened or unopened, packaging, and location. Then choose from a closed list of curated shelf-life entries (your Health Canada rows plus FoodKeeper product IDs).

1. Use keyword or embedding search to build a shortlist of candidates.
2. Let an LLM pick from that shortlist, or answer "unknown".
3. Ask the user whenever confidence is low.

Research on food entity linking found that general-purpose LLMs do poorly when linking open-ended food names to large ontologies: few-shot scores on FoodOn were at most about 0.33 macro-F1. That argues for small closed label sets, retrieval, and caching each household's confirmed mappings. Never let the LLM invent a shelf-life number.

### Cited Findings
- **FoodSEM** (2025) is a fine-tuned open-source LLM for linking food mentions to FoodOn, SNOMED-CT and Hansard. Its authors state that food entity linking "cannot be accurately solved by state-of-the-art general-purpose language models or custom domain-specific systems." — [FoodSEM (arXiv 2509.22125)](https://arxiv.org/abs/2509.22125)
- **FoodyLLM** recasts recognition and linking as question-answering, and fine-tuning clearly beat prompting general models.
  - On artificial data for FoodOn linking, few-shot Llama 3 8B and Gemini 2.0 reached at most about 0.33 macro-F1, against about 0.93–0.98 for FoodyLLM.
  - On real corpora the scores were about 0.24–0.51 for the baselines against 0.67–0.84 for FoodyLLM.

  — [FoodyLLM (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC12927182/)
- **AgriBERT** frames food-description matching as answer selection. It uses FoodOn as external knowledge and sentence-transformer embeddings for a kNN model. FoodOn labels carry descriptive adjectives such as "frozen" or "creamy" that help matching. — [AgriBERT (IJCAI 2022)](https://www.ijcai.org/proceedings/2022/0715.pdf)
- A 2026 preprint (Epicure) uses an embedding model to compare candidate canonical names while removing duplicates, with LLM classification and rule-based checks around it. — [Epicure (arXiv 2605.22391)](https://arxiv.org/pdf/2605.22391)
- Food recognition models trained on recipe text generalize poorly to scientific text (SciFoodNER). This is a reminder that domain shift matters, here from recipe text to fridge-photo captions. — [SciFoodNER](https://www.researchgate.net/publication/367457135_SciFoodNER_Food_Named_Entity_Recognition_for_Scientific_Text)
- **How commercial apps map items:**
  - Fango's receipt scanner uses Claude to drop non-food lines and assign a typical expiry date based on each product's category. The vendor says dates sometimes need adjusting for items like fresh meat, because estimates come from categories, not printed dates (vendor claim). — [Fango blog](https://fango.fi/en/blog/expiry-date-tracker/)
  - Expireless adds a default expiry window by food category after a receipt scan; receipt scanning is in its Pro tier (from US$4.99/month). — [Expireless](https://expireless.app/food-expiry-tracker/)
  - SaveFood advertises "auto expiry estimation by food type & storage location". — [App Store: SaveFood](https://apps.apple.com/us/app/savefood-expiry-tracker/id6760724839)
  - freshIt claims its estimates sharpen the more you use it. — [freshit.app](https://freshit.app/)
  - iPerish, an older student project, used Tesseract OCR on receipts plus a local table of standard expiration dates. — [Devpost: iPerish](https://devpost.com/software/iperish)
- **Samsung:** its 2025 AI Vision Inside recognized 37 food items, and unrecognized items "may be listed as unknown". — [Samsung Newsroom, Mar 2025](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature)
- FoodKeeper products carry a category, a subcategory and search keywords, which suit keyword or embedding retrieval. — [GitHub: jelera/food-shelflife-db](https://github.com/jelera/food-shelflife-db)

### Inferences
- **Recommended pipeline (Phase 1):**
  1. **Ask for structure.** Prompt the vision model for structured output per item, not just a name: `{name, food_type, form: raw|cooked|leftover|prepared, packaging: sealed|opened|loose|container, location: fridge|freezer|pantry, visible_text: [...], printed_date_text, confidence}`.
  2. **Shortlist candidates.** Normalize the name (lowercase, strip sizes such as "4L" and brands), then run a keyword match against FoodKeeper keywords and your own synonyms. Fall back to embeddings for the top 5–10 candidates.
  3. **Let the LLM choose.** The LLM must output a candidate ID or "UNKNOWN", plus a reason. Validate the ID against the list; reject anything else.
  4. **Cache confirmed mappings.** Store each household's confirmed mapping (for example "baby spinach clamshell" → leafy greens, packaged) so the same phrase never needs an LLM call again.
- **Rules that should override the classifier:**
  - `form = leftover` or `container = opaque or reusable` maps to the "cooked leftovers" row (3–4 days fridge per Health Canada), whatever the ingredients are thought to be.
  - Raw meat, poultry and fish map to Health Canada rows.
  - Anything in the freezer uses freezer windows.
- **Worked examples:**
  - "2% milk 4L jug" maps to the milk row. Opened status is not visible in a photo, so either assume "opened" from the second sighting onward, or ask once.
  - "Baby spinach clamshell" maps to leafy greens (packaged). Use a printed best-before if one is readable.
  - "Leftover chili in container" maps to cooked leftovers.
- **Unknowns:** never silently drop them. Show an "Unclassified – tap to label" card. Until it's answered, apply a conservative generic-perishable rule, for example "check in 3 days" for fridge items. That number is a design choice, not official guidance, and the UI should say so.
- **Test before you trust it:** hand-label 100–200 items from your own photos and measure accuracy for the top-1 pick, for UNKNOWN, and for wrong-but-confident answers. Wrong-but-confident is the dangerous case, for example classing raw chicken as cooked.
- **Why a closed list is easier:** choosing among roughly 650 FoodKeeper rows plus a dozen Health Canada rows is a much smaller problem than open FoodOn linking. The poor general-LLM scores above are a ceiling warning, not a prediction for this task.

### Gaps
- I found no study that evaluates LLM or embedding mapping into FoodKeeper categories specifically, nor the accuracy of vision-LLM item naming on real fridge photos (beyond Samsung's item counts).
- The search budget ran out before I could look for peer-reviewed evaluations of LLM food-safety and storage advice. Treat any LLM-generated storage time as unvalidated.

## 5. Estimation logic for "use soon", how existing apps do it, and how to present uncertainty

### Takeaway
1. **Anchor** on the best date evidence available, in this order: a printed date (best-before while unopened, or packaged-on plus durable life), then a date the user enters, then the first-seen scan date.
2. **Apply the window for the item's condition**: unopened, opened, cooked or leftover, frozen, or thawed.
3. **Compute a date range, not a single point.** Purchase happened somewhere between the last scan without the item and the first scan with it.
4. **Map the range to traffic-light states.** Word them according to whether the limit is a quality limit or a safety limit:
   - Quality limits (produce, condiments, hard cheese): "check it".
   - Safety limits (leftovers, raw meat/poultry/fish, deli meats): "past Health Canada's recommended fridge time".

Never label anything "safe". Authorities stress that storage times are guidelines, that best-before dates say nothing about safety, and that pathogens can't be seen or smelled. Surveys show half to four-fifths of home fridges run above 5 °C. A cheap temperature log in Phase 2 is therefore likely worth more to the estimates than any gas sensor.

### Cited Findings
**Official anchors and windows**
- **Leftovers:**
  - Health Canada: cooked dishes 3–4 days in the fridge and 2–3 months in the freezer. — [Canada.ca leftovers infographic](https://www.canada.ca/en/services/health/publications/food-nutrition/infographic-leftovers.html)
  - USDA, as reported by news outlets: prepared meals 3–4 days in the fridge or 3–4 months in the freezer. — [FOX 26 citing USDA](https://www.fox26houston.com/news/meal-preppers-take-note-usda-says-leftover-food-only-safe-for-3-to-4-days-after-cooking)
  - An FSIS-derived document surfaced in search gives 2–6 months frozen for cooked meat and poultry. I am not sure of its exact source, so freezer windows for leftovers vary between sources. — [GovInfo FSIS publication (attribution uncertain)](https://www.govinfo.gov/content/pkg/GOVPUB-A110-PURL-gpo26772/pdf/GOVPUB-A110-PURL-gpo26772.pdf)
- **Freezer:** food kept frozen continuously at −18 °C / 0 °F is safe indefinitely, and freezer times are for quality. — [GNB cold storage chart](https://www.gnb.ca/content/dam/GNB3/t/ls/hea/food-safety/docs/cold-storage-chart.pdf); [UC ANR, USDA-derived chart](https://ucanr.edu/sites/default/files/2018-11/293976.pdf); [Health Canada](https://www.canada.ca/en/health-canada/services/general-food-safety-tips/safe-food-storage.html)
- **Opened vs unopened changes the window**, for example unopened lunch meat about 2 weeks but opened 3–5 days, and unopened hot dogs about 2 weeks but opened about 1 week. — [Health Canada](https://www.canada.ca/en/health-canada/services/general-food-safety-tips/safe-food-storage.html)
- The best-before date covers unopened product only; after opening, consumers must use judgement (CFIA-citing sources). — [Canadian Food Focus](https://canadianfoodfocus.org/in-your-kitchen/what-does-the-best-before-date-really-mean/)
- **Dates are not safety indicators:**
  - CFIA: "a durable life date is not an indicator of food safety, neither before nor after the date." — [CFIA industry guide](https://inspection.canada.ca/en/food-labels/labelling/industry/date-markings-and-storage-instructions)
  - FSIS: outside infant formula, dates are about quality, not safety. — [FSIS: Food Product Dating](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating)
- CFIA warns that "some foods will become unsafe before they spoil." — [CFIA: three facts about best-before dates](https://inspection.canada.ca/en/inspect-and-protect/food-safety/three-facts-about-best-dates-can-save)
- USDA says FoodKeeper times "are intended as useful guidelines and are not hard-and-fast rules". — [USDA (via search snippet)](https://www.usda.gov/about-usda/news/blog/usda-updates-foodkeeper-app-include-new-food-items)
- **Mould** (USDA guidance as relayed by Mayo Clinic and Ohio State Extension):
  - Hard and semi-soft cheese can be kept if you cut at least 1 inch (2.5 cm) around and below the mould.
  - Soft cheese, sliced or shredded cheese, yogurt, sour cream, lunch meats, leftover cooked meat, grains, pasta and casseroles, bread, jams and soft produce should be discarded.
  - Firm produce (cabbage, bell peppers, carrots) can be trimmed.

  — [Mayo Clinic](https://mayoclinic.com/health/food-and-nutrition/AN01024); [Ohio State University Extension (Ohioline)](https://ohioline.osu.edu/factsheet/hyg-5592)

**Real fridge temperatures, which undermine fixed windows**
- Health Canada's target is 4 °C or lower. — [Health Canada](https://www.canada.ca/en/health-canada/services/general-food-safety-tips/safe-food-storage.html)
- Survey results:
  - Scotland (FROST citizen-science study, 361 fridges, final report June 2025): mean 5.17 °C, and 55.4% of fridges averaged above 5 °C. — [Food Standards Scotland FROST report](https://www.foodstandards.gov.scot/sites/default/files/migration/downloads/FROST_Final_Report_June_2025.pdf)
  - Poland: 49.35% of fridges had a mean above 5 °C, and 3.9% exceeded 10 °C. — [PMC9957224](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9957224/)
  - Belgrade (120 households): 82.5% above 5 °C. — [Food Control (ScienceDirect)](https://www.sciencedirect.com/science/article/abs/pii/S0956713522000068)
  - Cardiff (201 self-selected participants): 71% above 5 °C, with readings from 0 °C to 20 °C. — [Food Cardiff](https://foodcardiff.com/cardiff-research-finds-71-of-household-fridges-tested-operating-at-unsafe-temperature/)
  - A compilation of Western surveys: mean about 6.0 ± 2.0 °C, about 54% above 5 °C and about 66% above 4 °C. Attributing this to the Bangkok paper's background section comes from a search summary. — [Bangkok domestic refrigerator study (ScienceDirect, 2025)](https://www.sciencedirect.com/science/article/pii/S2772502225008170)
- A review notes that fridge energy efficiency has improved but temperature performance "has not changed significantly in 30 years" (older review). — [Review of domestic refrigerator performance](https://www.researchgate.net/publication/222399795_A_review_of_the_performance_of_domestic_refrigerators)

**Reading printed dates with a camera**
- **Published results (not directly comparable):**
  - An MDPI Algorithms 2025 mobile method: 99.42% recognition on dates without spaces and 98.44% with spaces. — [doi:10.3390/a18050286](https://doi.org/10.3390/a18050286)
  - An improved DBNet: 97.9% character detection and 97.8% recognition on 2,161 images of 162 foods. — [ResearchGate](https://www.researchgate.net/publication/370356971_Recognition_of_expiry_data_on_food_packages_based_on_improved_DBNet)
  - A 2018 CRNN trained on synthetic data: 99.4% on 658 test images. — [ResearchGate](https://www.researchgate.net/publication/325279240_A_Novel_Camera_Based_Approach_for_Automatic_Expiry_Date_Detection_and_Recognition_on_Food_Packages)
  - Adding synthetic images improved accuracy by 9.4% over real images alone. — [Florea & Rebedea, IJUSI](https://rochi.utcluj.ro/ijusi/articles/IJUSI-13-1-Florea.pdf)
- **Field result:** a mobile OCR pipeline read the date correctly for 25 of 30 items that had a printed date (83.3%). — [MDPI Applied System Innovation 2025](https://www.mdpi.com/2571-5577/8/6/176)
- **Samsung (May 2026):** the Family Hub update adds OCR for packaged goods. Pre-launch CES coverage said the camera can read labels to alert on approaching expiry, but I found no confirmation that the shipped update does this. Samsung's AI Vision does not see freezer contents, and users may need to correct the automated lists by hand. — [Samsung Newsroom](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates); [SamMobile](https://www.sammobile.com/news/samsung-bespoke-ai-refrigerator-family-hub-update-usa-gemini/); [Quartz](https://qz.com/samsung-bespoke-fridge-google-gemini-ai-food-recognition-051126)

**How existing apps compute "use soon"**
- **Samsung Family Hub (2024):** the camera identified up to 33 fresh foods. **Users entered expiration dates by hand**, and the screen alerted them before those dates. — [KBB](https://kbbonline.com/products/samsung-bespoke-refrigerator-with-ai-vision-inside/95981/)
- **FoodKeeper app:** offers calendar reminders based on its storage times. — [FoodSafety.gov FoodKeeper](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app)
- **Category-default apps** (Fango, Expireless, SaveFood): assign a default window by food category and storage location, sometimes from receipt scans (see section 4). — [Fango](https://fango.fi/en/blog/expiry-date-tracker/); [Expireless](https://expireless.app/food-expiry-tracker/); [SaveFood](https://apps.apple.com/us/app/savefood-expiry-tracker/id6760724839)
- **Grocy** (open source, self-hosted), per its documentation:
  - A product's "default best before days" pre-fills a due date at purchase, and −1 means it never expires.
  - A separate default sets how many days the product stays edible once opened.
  - Moving a product to the freezer, or thawing it, replaces the due date with today plus a freezing or thawing default.
  - After users asked to keep the original date, a freezing default of 0 now leaves the due date unchanged.

  — [Grocy docs: food tutorial](https://github.com/grocy/grocy-docs/blob/master/tutorials/food.md); [Grocy issue #1880](https://github.com/grocy/grocy/issues/1880); [Grocy changelog](https://grocy.info/changelog)
- An IoT smart-fridge paper notes that cameras have replaced weight and gas sensors for inventory tracking, but that "pinpointing the exact age of food can be challenging". — [IoT-based smart refrigerator monitoring system](https://www.researchgate.net/publication/361929040_IoT_based_smart_refrigerator_monitoring_system)

### Inferences
**Suggested estimation logic**
1. **Age bounds from scans.** For an item first seen at scan *t₁*, where the previous scan of that zone was at *t₀*: age ≥ now − t₁ and age ≤ now − t₀. Display "day 9" when scans are frequent, or "day 9–12" when there is a gap. In Phase 2, several automatic captures a day shrink the gap to hours. Before Phase 2, prompt a scan after each grocery trip to keep the gap small.
2. **Item identity is the hard part.** A new 4L jug that looks like the old one can silently inherit the old first-seen date, or a moved item can look new and reset its clock. Mitigations:
   - Use a different printed date or fill level as a tie-breaker.
   - After a big restock, ask "Is this the same milk as before?"
   - Never let a lost detection reset the date of an item that reappears within a short window.
3. **Anchor priority, best first:**
   1. expiration date (rare; a hard stop)
   2. printed best-before (only while unopened)
   3. packaged-on date plus durable life
   4. a date the user enters
   5. first-seen plus the FoodKeeper `DOP_` window, or the Health Canada window
4. **Opened state.** When an item is first seen, or seen changed (lower fill level, broken seal), set the opened date and switch to the after-opening window. For items whose opened state can't be seen, assume opened at the first-seen date; this is the conservative choice.
5. **Freezer.** Moving into the freezer stops the fridge clock and starts a quality clock. Moving to the fridge counts as thawed: start a short after-thawing window. This is Grocy's approach, but keep the history so the original dates aren't lost.
6. **Produce.** Ripeness at purchase is unknown and spread is wide, so use the FoodKeeper range as-is. Let visual evidence only *shorten* an estimate, never extend it: browning, wilting or mould moves an item to yellow or red, while "looks fine" never moves it back to green.
7. **Temperature (Phase 2).** Storage windows assume ≤4 °C. If logged averages run above 4–5 °C, show a fridge-temperature warning and shorten windows by a documented factor. No sourced factor was gathered here; see Gaps.

**Presentation and wording**
- Use three states with careful wording:
  - **Green:** "within typical storage time". Never use the word "safe".
  - **Yellow:** "use soon / check it". Start at the window minimum, or a day or two before it.
  - **Red:** worded by limit type.
    - Quality-limited items: "past typical storage time – check before using".
    - Safety-limited items: "past Health Canada's recommended fridge time (cooked leftovers: 3–4 days)". Link to the guidance, and do **not** suggest a sniff or look test, because pathogens aren't detectable that way (see section 6).
- Always show the basis, for example "First seen 9 days ago (scan gap ±2 days) · Leafy greens, packaged: FoodKeeper 3–7 days". The window values in this example are illustrative, not verified.
- **Mould detected on a photo:** show the USDA rule for that food type, for example "hard cheese: cut 2.5 cm around" or "soft foods: discard".
- **Avoid alarm fatigue:** send a single daily digest ("3 items to use today") rather than one push per item.
- **Standing disclaimer:** "Reminder tool, not a food-safety test."

### Gaps
- I found no peer-reviewed study on the user-experience design of "use soon" alerts (traffic lights versus text) or on how they affect waste and safety behaviour.
- I did not confirm the default value of Grocy's stock "due soon" threshold.
- I did not gather predictive-microbiology temperature-adjustment models that would turn logged fridge temperature into a quantitative shelf-life correction.
- I found no data on the typical gap between purchase and first appearance in a scan, or on how well first-seen tracking works in practice.
- I did not retrieve FoodKeeper's own entries for spinach, leafy greens or milk, so the "spinach, day 9" thresholds are not verified.

## 6. What vision and gas/odor sensors can and cannot detect (and what to add to an ESP32 fridge build)

### Takeaway
Ordinary colour (RGB) camera vision can flag visible surface quality changes on produce: rot, browning, mould and wilting. On curated lab datasets it reaches roughly 95–99% accuracy, and roughly 80% or more for leafy vegetables. I found no peer-reviewed evaluation of in-fridge cameras.

Vision cannot detect pathogens, spoilage inside opaque packaging, or invisible chemical changes such as early souring. Health authorities stress that disease-causing bacteria usually don't change how food looks, smells or tastes.

Low-cost gas sensors (the MQ series, Bosch BME688/BME690) respond to spoilage gases such as ammonia and VOCs in lab setups. Their weaknesses:
- sensitivity to humidity and temperature, and drift over time
- poor selectivity between gases
- slow release of spoilage gases
- for MQ sensors, factory calibration done at 20 °C and 55% relative humidity (RH), not fridge conditions
- for BME688, a proprietary BSEC library
- in a BME688 meat study, Bosch's own AI-Studio classifier did poorly at spotting spoiled meat

Treat sensors as an experimental "the fridge smells different" signal, not as freshness verdicts, and prioritize a temperature/humidity log.

### Cited Findings
**Vision: what research shows it can do**
- A method combining deep features from three pretrained networks with principal component analysis (PCA) reached 96.98% accuracy for fruit and vegetable freshness. — [PMC10767316](https://pmc.ncbi.nlm.nih.gov/articles/PMC10767316/)
- A CNN-BiLSTM reached 97.76% accuracy, but was weaker on stale capsicum and stale tomato. — [PMC11252168](https://pmc.ncbi.nlm.nih.gov/articles/PMC11252168/)
- A 2025 systematic review (Journal of Food Science) of deep learning for freshness of primary agricultural products reports a CNN-LSTM with more than 80% accuracy for **leafy vegetable** freshness. That is lower than typical fruit results. — [Kang et al. 2025, J Food Sci](https://ift.onlinelibrary.wiley.com/doi/full/10.1111/1750-3841.70535)
- Many studies fine-tune on curated datasets covering several produce types and ripeness stages, which may not reflect varied lighting or backgrounds. — [Gabor CNN spoilage detection (Springer)](https://link.springer.com/chapter/10.1007/978-3-032-19672-9_17)
- **No peer-reviewed in-fridge camera evaluation:** a search for spoilage detection by refrigerator cameras found none. An IoT paper notes that cameras are used for inventory and that estimating exact food age is difficult. — [IoT smart refrigerator paper](https://www.researchgate.net/publication/361929040_IoT_based_smart_refrigerator_monitoring_system)
- **Commercial ceiling:** Samsung's AI Vision recognized 33 fresh foods in 2024 and 37 in 2025, plus 50 packaged goods according to Engadget (Jan 2026). It moved to Gemini plus OCR in May 2026, still can't see freezer contents, and needs Wi-Fi. — [KBB](https://kbbonline.com/products/samsung-bespoke-refrigerator-with-ai-vision-inside/95981/); [Samsung Newsroom, Mar 2025](https://news.samsung.com/global/samsung-unveils-new-refrigerator-lineup-equipped-with-screens-and-enhanced-ai-vision-inside-feature); [Engadget](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html); [SamMobile](https://www.sammobile.com/news/samsung-bespoke-ai-refrigerator-family-hub-update-usa-gemini/)

**What vision (and the human nose) cannot do**
- CDC (quoted by a secondary source): "you can't taste, smell, or see the germs that cause food poisoning." — [Tasting Table quoting CDC/USDA (secondary)](https://www.tastingtable.com/1323644/dangerous-mistake-avoid-checking-food-safety)
- The Saudi Food and Drug Authority (a government food regulator) says pathogenic bacteria grow rapidly between 40 and 140 °F and "do not generally affect the taste, smell, or appearance of food." — [SFDA FAQ](https://sfda.gov.sa/en/faq/do-spoilage-bacteria-make-people-sick)
- USDA notes that spoilage shows as changes in colour, texture, odour or taste. It adds that some spoilage bacteria are also pathogens: *Clostridium perfringens*, a common cause of meat and poultry spoilage, and *Bacillus cereus*, a common cause of milk and cream spoilage. — [USDA blog](https://www.usda.gov/node/19616)
- CFIA: "some foods will become unsafe before they spoil." — [CFIA](https://inspection.canada.ca/en/inspect-and-protect/food-safety/three-facts-about-best-dates-can-save)

**Gas and odor sensors: evidence and limits**
- **Bosch BME688:** Bosch lists spoiled-food detection among its typical applications, and its BME AI-Studio tool trains "gas scanner" models for specific uses. A Bosch example describes teaching the BME688 to recognize signs of bacterial growth on food, with the trained model running on the product's existing microcontroller. — [Bosch BME688 product page](https://www.bosch-sensortec.com/en/products/environmental-sensors/gas-sensors/bme688); [Bosch Sensortec: "Digital nose"](https://www.bosch-sensortec.com/en/news/digital-nose-for-air-quality.html)
- **Xu et al. (2021):** a multi-step classifier using BME688 data and BME AI-Studio sorts food into 4 categories, then identifies the food, then rates freshness. It is reported as robust and better than decision trees, SVM, MLP and CNN, but I did not retrieve a freshness accuracy figure. — [arXiv 2110.09956](https://arxiv.org/pdf/2110.09956)
- **BME688 meat study:**
  - It told chicken, sheep and cattle apart with near-perfect accuracy.
  - Gaussian Naive Bayes and bagged trees were the most promising classifiers.
  - Its highlights say BME AI-Studio's classifier was **not very successful at classifying spoiled meat**.

  — [ResearchGate: meat species recognition with BME688](https://www.researchgate.net/publication/391822232_A_New_Approach_for_Machine_Learning-Based_Recognition_of_Meat_Species_Using_a_BME688_Gas_Sensors_Matrix)
- **BME development-kit odour identification (MDPI 2025):** 90.50% accuracy with AI-Studio and 88.28% with the authors' method. — [MDPI Applied Sciences 15(17):9687](https://www.mdpi.com/2076-3417/15/17/9687)
- **Mixed odours in a refrigerator:** a lightweight-transformer study reports 90.6% average accuracy and an F1 score of 0.938. The attribution to this specific chapter comes from a search summary. — [Springer: "Sensing Odors…"](https://link.springer.com/chapter/10.1007/978-3-032-14953-4_27)
- **BSEC2 licensing and platform:**
  - The BSEC2 library is proprietary Bosch software, used only after accepting Bosch's license. ESPHome notes that the license forbids distributing compiled firmware that includes it, so ESPHome downloads it at build time. It works only with Bosch BME688/BME690 sensors.
  - BSEC2's AI features are reported to work only on some ESP32 chips, such as the ESP32-WROOM.
  - A successor, the BME690, uses BSEC3.

  — [ESPHome BME68x BSEC2 docs](https://esphome.io/components/sensor/bme68x_bsec2/); [arduinolibraries.info: bsec2](https://www.arduinolibraries.info/libraries/bsec2); [SparkFun BME68x hookup guide](https://learn.sparkfun.com/tutorials/sparkfun-environmental-sensor-breakout---bme68x-qwiic-hookup-guide); [GitHub: esphome-bme690 (BSEC3)](https://github.com/ryantmer/esphome-bme690)
- **BME688 power (from a hobby blog citing Bosch figures):** about 3.7 µA at 1 Hz for temperature, humidity and pressure only. With the gas element heated: about 90 µA in ultra-low-power air-quality mode, about 0.9 mA in low-power mode and about 3.9 mA in standard gas-scan mode. — [esp32.co.uk comparison](https://esp32.co.uk/bme280-vs-bme680-vs-bme688-which-is-best/)
- **MQ-series sensors:**
  - The MQ-137 (ammonia) datasheet references sensitivity to 50 ppm NH₃ at 20 °C and 55% RH. The MQ-135 is specified at 20 ± 2 °C and 55 ± 5% RH. A fridge runs at about 4 °C. — [Winsen MQ-137 datasheet](https://www.winsen-sensor.com/d/files/semiconductor/mq137.pdf); [Winsen MQ-135 datasheet](https://www.winsen-sensor.com/d/files/PDF/Semiconductor%20Gas%20Sensor/MQ135%20(Ver1.4)%20-%20Manual.pdf)
  - The MQ-137 is effective for detecting the *presence* of ammonia rather than its exact concentration, and has a long warm-up time. — [IET Wireless Sensor Systems 2025](https://ietresearch.onlinelibrary.wiley.com/doi/10.1049/wss2.70008)
  - The MQ-135 baseline shifts with temperature and humidity and needs periodic recalibration or compensation, and it cannot tell gases apart (vendor guide). — [Envistia MQ-135 guide](https://envistiamall.com/blogs/learn/mq-135-air-quality-gas-sensor-detector-module-user-guide)
  - **Example build:** "E-Sniffer" combines an MQ-137, an SGP40 and a DHT22 on an ESP32 with fuzzy logic to classify raw meat as fresh, slightly spoiled or not fresh. — [IIETA I2M](https://iieta.org/journals/i2m/paper/10.18280/i2m.240201)
- **Review-level limitations of gas sensing for spoilage** (attributions to specific reviews are per search summaries):
  - Gas sensors suffer interference in humid conditions.
  - Temperature sensors capture time-temperature history but not chemical change. — [Smart packaging sensors review (ScienceDirect 2026)](https://www.sciencedirect.com/science/article/pii/S2666833526001954)
  - Drift changes baselines and sensitivity, so frequent recalibration is needed. — [Sensors 26(16):5186 (2026)](https://doi.org/10.3390/s26165186)
  - Indicators and sensors need higher accuracy, precision and material stability. — [Foods 13(19):3047 (2024)](https://doi.org/10.3390/foods13193047)
  - Spoilage gases are released slowly, over hours or days rather than minutes. — [NFC gas-sensor packaging (PMC11686504)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11686504/)
  - A refrigerator prototype with a smart gas sensor told "fresh" from "semi-fresh" food in a proof of concept. — [PMC10575285](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10575285/)
- **Ethylene (a ripening signal, not a spoilage verdict):**
  - A low-cost electrochemical system had a theoretical detection limit of 0.413 ppm. It tracked apples, pears and kiwifruit below 0.8 ppm and responded to 0.1 ppm in under 50 s. — [PMC4851015](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4851015/)
  - A Co₃O₄–Pt sensor reached a 0.13 ppm detection limit. — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0924424723004569)
  - A 2026 Nature Communications wearable sensor reports 1.07 ppb (research grade). — [Nature Communications](https://www.nature.com/articles/s41467-026-71748-7)
  - MIT carbon-nanotube sensors cost about 25 cents each. — [SciTechDaily](https://scitechdaily.com/cost-effective-sensor-measures-fruits-ripeness/)
  - As little as 10 ppb of ethylene can speed up kiwi softening (per a review, via search summary). — [Review of ethylene detection for fruit ripening](https://www.researchgate.net/publication/341124523_Review_on_sensitive_and_selective_ethylene_detection_methods_for_fruit_ripening_application)
  - I found no household-fridge deployment.

### Inferences
**What a camera can reasonably do**
- **Phase 1 (phone photos):** good for identifying items, catching obvious visible mould, browning or wilting on produce and bread, and close-up OCR of dates.
- **Phase 2 (ESP32-CAM):**
  - It mainly gives frequent presence/absence data to tighten first-seen bounds.
  - Its low resolution, the dark fridge interior (light only while the door is open), condensation, occlusion and fixed angles make small date print and subtle quality cues unreliable.
  - Expect to capture on door-close using the fridge light, or to add a small LED.

**What a camera cannot do**
- See through opaque containers, milk jugs or cartons.
- Detect souring before curdling.
- Detect pathogens on meat or leftovers.
- See items hidden behind others.
- Judge anything in the freezer drawers it can't see.

**Sensor priority for Phase 2**
1. A temperature/humidity sensor, which is cheap, low power and well understood. It directly tests the "≤4 °C" assumption behind every storage window.
2. A BME688/BME690 as an *experiment*. Log its gas-resistance baseline and alert on sustained deviations (such as "smell spike in the fridge for 6 hours"). Don't expect it to identify the item or give a verdict; it smells the whole fridge, and door openings reset the air.
3. MQ sensors are a poor fit. Their heaters need warm-up, their factory calibration is far from fridge conditions, they can't tell gases apart, and they draw power continuously.

**Never use a gas signal as a negative.** A "no odor detected" reading must never move an item back to green, because pathogens can be present without spoilage odor and sealed packaging blocks gas.

**Treat accuracy figures with caution.** A 2026 paper on "leakage-free benchmarking" of electronic noses for beef freshness ([Foods, doi:10.3390/foods15162798](https://doi.org/10.3390/foods15162798)) suggests, from its title, that data leakage inflating e-nose accuracies is a recognized problem. Treat the 88–99% lab figures above as optimistic.

### Gaps
- I found no peer-reviewed evaluation of camera-based spoilage detection inside domestic fridges, and no field validation of camera-plus-gas multi-sensor fridges.
- I found no data on BME688 or MQ performance at fridge temperatures (about 2–5 °C) and high humidity, and I did not gather MQ heater power figures.
- I did not confirm BSEC2 compatibility with the ESP32-CAM's ESP32 chip specifically.
- I did not retrieve the Xu et al. freshness accuracy figure. A 2018 "miniaturized electronic nose in refrigerator" paper also exists ([ResearchGate](https://www.researchgate.net/publication/326516072_The_Real-time_Assessment_of_Food_Freshness_in_Refrigerator_Based_on_Miniaturized_Electronic_Nose)), but it predates the BME688, which launched around 2020. One search summary conflated the two papers.
- The search budget ran out before I could cover:
  - a peer-reviewed source comparing ordinary RGB imaging (surface only) with hyperspectral or near-infrared imaging (internal quality)
  - evidence on detecting milk souring
- Most vision figures come from Kaggle-style curated datasets; generalization to a home fridge is unmeasured.
