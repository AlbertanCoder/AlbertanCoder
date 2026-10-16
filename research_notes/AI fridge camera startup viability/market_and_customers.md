# Market Size and Customer Demand: Retrofit AI Fridge Camera (Canada and US)

*Compiled 16 October 2026. Money is in CAD unless marked; USD is converted at 1.40. Method: 31 WebSearch queries. WebFetch and curl were blocked for every primary domain tried (statcan.gc.ca, eia.gov, ncbi/pmc, wrap.ngo, lovefoodhatewaste.ca), so the figures below come from search-result summaries of the cited pages, not from opening the documents themselves. "Estimate" marks my own arithmetic, with the math shown. "(background)" marks items taken from the cited sources of the earlier build guide (`/home/user/AlbertanCoder/reports/AI fridge inventory build guide.md`), which were not re-checked. Dated sources are flagged inline.*

## 1. Households and fridges: counts, smart/camera share, lifespans, second fridges

### Takeaway
There are about **135M US households (2025)** and about **16.5M Canadian households (2026, my estimate; 15.0M at the 2021 census)**, about **1.9M of them in Alberta (estimate)**. Together they hold **roughly 200M fridges (estimate)**. About a third of US homes run a second fridge, mostly in garages and basements. No source gives the share of camera-equipped fridges, and it is plausibly ≤1–2%. Fridges last about 13–18+ years, and smart models are roughly 3–4% of annual units. The non-camera installed base will therefore dominate for 10+ years, so the retrofit window is long.

### Cited Findings
**United States**
- 134.79M households in 2025: 85.96M family households and 48.83M nonfamily households. — [FRED TTLHH (Census CPS)](https://fred.stlouisfed.org/graph/?g=1QoeM); [FRED family households](https://fred.stlouisfed.org/series/TTLFHH); [FRED nonfamily households](https://fred.stlouisfed.org/series/TTLNHH)
- 39.7M one-person households, or 29% of all households (20% in 1975). Married couples are 47% of households. More than 1 in 4 householders are 65+ (1 in 5 in 1975). Note that 39.7M ÷ 29% ≈ 137M, slightly above FRED's 134.8M; this is likely rounding and was not verified. — [US Census Bureau, 2 Dec 2025](https://www.census.gov/newsroom/press-releases/2025/families-and-living-arrangements.html)
- The share of homes with 2+ refrigerators rose from **30% (2015) to 34% (2020)**: 42.53M of 123.53M homes have a second fridge. RECS 2020 is the newest edition found, so this is 6 years old. — [EIA press release](https://www.eia.gov/pressroom/releases/press510.php); [EIA RECS 2020 State Appliances table](https://www.eia.gov/consumption/residential/data/2020/state/pdf/State%20Appliances.pdf)
- Location of those 42.53M second fridges: 16.25M in garages, 9.68M in basements and 2.94M outside. These counts were read off EIA table HC3.2 by the search tool. — [EIA HC3.2](https://www.eia.gov/consumption/residential/data/2020/hc/pdf/HC%203.2.pdf)
- A commercial re-analysis of RECS 2020 by Fridge.com (press release, Feb 2026) reports that 37.4% of households run 2+ fridges, with second fridges 39.5% in garages, 25.3% in basements and 28.1% in main living areas. The gap from EIA's 34% is unexplained; prefer EIA. — [Fridge.com press release](https://lifestyle.kbew98country.com/story/77587/fridge-com-report-how-america-refrigerates-federal-survey-data-from-18496-households-reveals-1-2-or-3-fridges/)

**Canada and Alberta**
- 2021 census: **14,978,940 private households**, average size 2.4, and two-person households were the largest group (34.2%). — [Statistics Canada Census Profile 2021](https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm); Wikipedia gives 14,978,941 occupied dwellings out of 16,284,235 — [2021 Canadian census](https://en.wikipedia.org/wiki/2021_Canadian_census)
- Alberta, 2021 (third-party compilation of census data): **1,633,220 private dwellings occupied by usual residents** (equal to private households), 1,772,670 total private dwellings (+7.2% vs 2016), and a population of 4,262,635. — [CareerBeacon](https://www.careerbeacon.com/en/canada/alberta)
- Alberta's population was **5,101,050 on 1 July 2026** (StatCan's September 2026 revision). It was the fastest-growing province in the year to July 2026 (1.5% vs 0.5% nationally), driven mainly by interprovincial migration. Canada's population was 41,798,407 on 1 July 2026 (+189,425 year on year). — [ATB Financial, 23 Sep 2026](https://www.atb.com/company/insights/the-twenty-four/alberta-population-update-september-23-2026/)
- Second fridges in Canada. All three sources are dated and they conflict:
  - **StatCan Survey of Household Spending** (release dated Feb 2009, c. 2007 data): 99.8% of households have a fridge and 26.7% have 2 or more. — [Statistics Canada via canada.ca](https://www.canada.ca/content/dam/canada/news/migration/web/Dha.do-fileName-2714_20090210154235_en_dq090210-eng.pdf)
  - **University of Alberta study** (Denise Young, sponsored by Natural Resources Canada): about 3 in 10 Canadian homes have an extra fridge (reported Dec 2007). — [MinnPost](https://www.minnpost.com/environment/2007/12/want-slow-global-warming-dont-cool-lot-beer)
  - **StatCan Households and the Environment table** (11-526-S, c. 2011): the Canada row reads "50 11 22 37 48 71" across main fridge, second fridge, stand-alone freezer and other columns. The search tool read this as 11% with a second fridge and 22% with a stand-alone freezer, but the columns may measure something else, such as the Energy Star share. Treat it as unusable until the table is opened. — [StatCan table](https://www150.statcan.gc.ca/n1/pub/11-526-s/2013002/t021-eng.htm)

**Lifespan and replacement**
- A DOE study, as summarised by a home-warranty company, gives a mean functional life of **19.8 years** (median 17.7). AHAM's figure is about a **13-year** average useful life. Many owners replace working units for remodel or cosmetic reasons, so replacement comes earlier than failure. This is a secondary source, not checked against DOE or AHAM. — [Liberty Home Guard](https://www.libertyhomeguard.com/blog/home-maintenance/how-long-do-refrigerators-last-by-brand/)
- AHAM's 2025 unit shipments were not found; search returned only a trade-data page without figures. — [AHAM](https://www.aham.org/Consumer/Search)

**Smart and camera share**
- **23% of US internet households own at least one smart appliance** of any type (May 2025), up from 15% in 2020. The **annual purchase rate is only 3%**, held back by high prices, long replacement cycles and limited feature differentiation. No fridge-specific share was given. — [Parks Associates via PR Newswire](https://www.prnewswire.com/news-releases/parks-associates-23-of-us-internet-households-now-own-at-least-one-smart-appliance-up-from-15-in-2020-302448102.html)
- A Consumer Reports survey (Oct 2022, 2,084 US adults) found that about one-fifth of Americans own a smart appliance, but **only 7% own a large smart appliance and use its smart features**. — [Consumer Reports](https://www.consumerreports.org/appliances/do-you-need-wifi-to-cook-a-roast-a9457457941/); [Consumer Reports (smart appliance risks)](https://www.consumerreports.org/home-garden/smart-home/how-smart-appliances-could-expose-you-to-hacking-risks-a8909055279/)
- Market-research teaser: US smart-refrigerator revenue was about US$1.2B (C$1.68B) in 2025, 80% of the North American total. Other firms put North America at 29.6–33% of a global market of about US$4.3–4.46B. These come from paid-report summaries with differing definitions of "smart", so confidence is low. — [GMI](https://www.gminsights.com/industry-analysis/smart-refrigerator-market)
- Samsung's camera recognition sits on premium Family Hub models. The May 2026 Gemini update reached existing 32-inch Family Hub models in the US by software. — [Samsung Global Newsroom](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates). The reviewed model costs US$3,399 (C$4,759). — [Techlicious](https://www.techlicious.com/blog/samsung-bespoke-fridge-vision-ai-with-google-gemini/) (background)

### Inferences
- **Canadian households in 2026 (estimate): about 16.5M.** Scaling by population: 14.98M × (41.80M ÷ 36.99M) = 16.93M, where 36,991,981 is the 2021 census population (from my background knowledge, not re-verified this session). This overstates somewhat, because the 2026 figure is an undercount-adjusted estimate while the 2021 figure is a raw census count. I use **about 16.5M (range 16.0–16.9M)**.
- **Alberta households in 2026 (estimate): about 1.9M.** 1,633,220 × (5,101,050 ÷ 4,262,635) = 1.95M, trimmed for the same reason, gives **about 1.9M (range 1.85–1.95M)**, or about 11.5% of Canadian households.
  - Alberta households are larger: 2.61 persons per household in 2021 (4,262,635 ÷ 1,633,220) against 2.47 nationally (36.99M ÷ 14.98M). Both are estimates, and the numerators include people in collective dwellings.
- **Fridge counts (estimate):**
  - US: 134.8M × 1.34 ≈ **181M** (ignores third fridges).
  - Canada: 16.5M × 1.27–1.30 ≈ **21.0–21.4M**, using the dated 26.7–30% second-fridge rates.
  - Alberta: 1.9M × 1.27–1.30 ≈ **2.4–2.5M**.
  - Total for Canada and the US: about **200M fridges**.
- **Second fridges** are mostly in garages or basements: (16.25 + 9.68) ÷ 42.53 = 61% of US second fridges. They are overflow and beverage storage, so they make a natural add-on SKU (one more camera) but are lower value per camera than the kitchen fridge. Garage fridges in Alberta winters would also face cold-temperature and condensation conditions (inference, untested).
- **Replacement flow (estimate):** installed base ÷ lifespan gives US 181M ÷ 13–17.7 years ≈ **10–14M fridges a year**, and Canada about **1.2–1.6M a year**.
  - US smart-fridge revenue of about US$1.2B at an assumed US$3,000 average price implies about 400k units a year, or about **3–4% of annual units** (low confidence).
  - With 13–18-year lives, even if every new fridge had cameras from today, half of the installed base would still lack them around 2033–2035.
- **Camera-equipped share of installed fridges:** no source found. Camera fridges are US$3,000+ flagships, and the 3% annual purchase rate covers all smart appliance categories, so the share is plausibly **≤1–2%** (inference, unverified).

### Gaps
- RECS 2024 or newer data was not found.
- AHAM 2025 shipments were not found.
- No Canadian second-fridge data newer than about 2009, and nothing specific to Alberta.
- No published share of camera-equipped fridges in either country.
- The 2021 Canadian population used for the 2026 household estimate was not re-verified this session.

## 2. Smart home adoption 2024–2026, attitudes to cameras in the home, and gadget abandonment

### Takeaway
About **half of households in both countries already run at least one connected device**: 45% of US internet households (excluding smart speakers), and 47% of Canadian households in 2022. Indoor cameras are now common, at about 20% of Canadian households (2022) and 28–36% of US respondents in 2025 surveys, and acceptance is rising. A durable **30–40% minority distrusts devices** with their data. The bigger commercial risk is abandonment:
- about **half of "smart" appliances are never connected or drop off Wi-Fi**;
- connected appliances report more problems;
- the number of devices per smart home has fallen from 8 to 6.2 since the pandemic.

### Cited Findings
**Adoption**
- **US:** 45% of internet households own at least one core smart home device, excluding smart speakers. The owner base is about 54M households, about 13M of them new since 2020. These figures come from different survey waves, so check exact values before quoting. — [Parks Associates via PR Newswire](https://www.prnewswire.com/news-releases/parks-associates-estimates-approximately-13-million-new-us-internet-households-have-entered-the-smart-home-market-since-2020-302523800.html); [Parks: 2025 Smart Home Trends: Cooling off Period](https://www.parksassociates.com/blogs/digital-media-and-content-distribution/2025-smart-home-trends-cooling-off-period)
- **US:** the average smart-home household has **6.2 connected devices, down from a pandemic-era peak of 8**. The figure is from Parks as summarised; attribution to the "cooling off" piece is probable. — [Parks Associates](https://www.parksassociates.com/blogs/digital-media-and-content-distribution/2025-smart-home-trends-cooling-off-period)
- **US:** smart home hubs are flat at 5% of internet households (Aug 2026). — [Parks Associates, Aug 2026](https://www.parksassociates.com/blogs/pr-smart-home/19-of-smart-home-device-owners-pay-for-subscription-service-for-a-video-security-device-adoption-of-smart-home-hubs-remains-flat-at-5-of-us-internet-households)
- **Canada** (Canadian Internet Use Survey 2022, primary residence): **47.4% of households used an internet-connected smart home device**, up from 42% in 2020. Device shares were:
  - smart speaker or assistant: 30.0%;
  - **internet-connected video camera: 19.8%**;
  - smart plugs or lights: 13.8%;
  - smart thermostat: 12.7%.

  — [Statistics Canada, Canada at a Glance 2023](https://www150.statcan.gc.ca/n1/pub/12-581-x/2023001/sec11-eng.htm); [The Daily, 20 Jul 2023](https://www150.statcan.gc.ca/n1/daily-quotidien/230720/dq230720b-eng.htm)
- **Canada 2018** (base is internet users, so not comparable): 53% had a smart home device, including smart TVs (41%), smart speakers (15%) and video cameras (9%). — [The Daily, 29 Oct 2019](https://www150.statcan.gc.ca/n1/daily-quotidien/191029/dq191029a-eng.htm)

**Cameras and privacy**
- **Canada:** some respondents said they did not trust **smart speakers (40%), AI technologies (31%) or other smart home devices (28%)** with their personal information. Which Canadian Internet Use Survey release this comes from (2019 or 2023) is not confirmed. — [The Daily, 2023](https://www150.statcan.gc.ca/n1/daily-quotidien/230720/dq230720b-eng.htm); [The Daily, 2019](https://www150.statcan.gc.ca/n1/daily-quotidien/191029/dq191029a-eng.htm)
- **US News & World Report survey** (Aug 2025, 1,200 adults):
  - 36% use indoor cameras (base unclear), 62% outdoor cameras and 56% video doorbells;
  - **64% approve of cameras monitoring service providers inside the home, up from 49% in 2022**;
  - 37% remain concerned about privacy and data breaches.

  — [SecurityInfoWatch](https://www.securityinfowatch.com/residential-technologies/smart-home/article/55323461/more-cameras-fewer-fears-as-survey-reveals-the-new-face-of-home-security); [CEPRO](https://www.cepro.com/news/american-home-security-trends-and-takeaways-in-the-smart-home/622985/)
- A survey of 1,001 homeowners (Sep 2025) found that 28% own indoor cameras. Attribution to this page is probable. — [American Home Shield](https://www.ahs.com/home-matters/lifestyle/home-security-camera-statistics/)
- SafeHome.org's 2026 report (2,435 adults): **37% of camera users worry about who can access their footage**, and 23% feel uneasy about how much technology watches their home. — [SafeHome.org](https://www.safehome.org/resources/home-security-industry-annual/)
- A Dec 2024 survey of 1,006 homeowners and renters: **57% worried about how smart-device data is collected and used**, and more than 1 in 3 worried about devices recording without permission. Attribution to this page is probable. — [American Home Shield Smart Home Survey 2024](https://www.ahs.com/home-matters/quick-tips/smart-home-survey/)
- Reviews.org's 2026 headline: "Americans Want More Control Over What Their Devices Collect" (details not retrieved). — [Reviews.org](https://www.reviews.org/smart-home/smart-home-privacy/)

**Abandonment and non-use**
- WSJ reporting (2023): **roughly half of smart appliances sold are never connected** to the internet. LG said fewer than half of its smart appliances stay connected; Whirlpool said more than half of its do. 80–90% of LG appliances sold have smart features. Reasons given were changed Wi-Fi passwords or ISPs, power outages and privacy concerns. — [Tech Brew, Mar 2023](https://www.techbrew.com/stories/2023/03/23/consumers-aren-t-connecting-their-smart-appliances-to-the-internet-and-it-s-a-challenge-for-appliance-makers); [GovTech](https://www.govtech.com/question-of-the-day/what-percentage-of-customers-dont-connect-their-smart-appliances)
- J.D. Power 2025: appliances with Wi-Fi or Bluetooth report **87 problems per 100 appliances, against 69** across all appliances. Owners who use the connected features report 92. — [J.D. Power via Business Wire](https://www.businesswire.com/news/home/20250925369703/en)
- Retrofit precedent (background):
  - Liebherr's HNGRYnsite fridge cameras **stopped working when the app shut down on 31 Mar 2025**. — [Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste)
  - Smarter FridgeCam is listed as discontinued. — [Mobile Fun](https://www.mobilefun.com/smarter-fridgecam-wifi-enabled-food-tracking-camera-85610)
  - A writer abandoned the Grocy inventory app after about a week. — [Galaxus](https://www.galaxus.de/en/page/how-i-want-to-digitise-the-contents-of-my-fridge-and-fail-to-do-so-39565)

### Inferences
- **Smart-home-ready pool:** roughly half of households in both countries (US 45% excluding speakers; Canada 47.4%). This is the first SAM filter.
- **Indoor cameras:** cameras for security are mainstream, and approval of in-home monitoring rose from 49% to 64% between 2022 and 2025. A fridge camera points at shelves, not people, which should be an easier sell. The **37–40% privacy-concerned or distrustful minority** will still be lost unless the design answers it, for example by capturing only after the door closes, cropping to shelves and offering local processing. I model **60% acceptance** among smart-home-ready households (assumption).
- **Abandonment is the central commercial risk.** If about 50% of big-brand smart appliances never get connected, a retrofit product whose entire value depends on connectivity must make setup and reconnection near-effortless, or expect heavy churn.
  - Plan for **20–40% of hardware buyers going inactive in year 1**. This is my assumption, loosely anchored on the ~50% non-connection rate and the drop from 8 to 6.2 devices per home.

### Gaps
- No census-quality 2024–2026 US figure for smart-speaker or indoor-camera penetration.
- No results from the 2024 Canadian Internet Use Survey were found.
- Nothing specific to Alberta.
- No survey asks about attitudes to cameras inside a fridge specifically.
- No measured abandonment rate for smart kitchen gadgets; only appliance connection rates and device-count trends are available.

## 3. Causes of household food waste: how much a fridge camera could address

### Takeaway
**"Not used in time" is the largest single cause of household food waste.** It accounts for about 48% of avoidable waste (WRAP UK, 2012) and about a third of all food waste, or roughly half of the edible part (WRAP Wales, 2021–22). NRDC's US diaries also found "moldy or spoiled" to be the top reason. Produce dominates: fruit and vegetables are about 45% of avoidable household waste in Canada and about two-thirds in Guelph families. My estimates:
- **30–45% of avoidable household waste is food forgotten in the fridge until it spoiled.** That is **C$390–585 of LFHW Canada's C$1,300 per household**.
- If the tool prevents 20–30% of it, an engaged household saves **about C$80–175 a year**, or 6–14% of its total waste.

### Cited Findings
**UK (WRAP): the best cause data**
- UK 2012 (dated; relayed by a secondary source citing WRAP 2013): of avoidable household food waste,
  - **48% was not used in time**;
  - 31% was cooked, prepared or served in excess (large servings and leftovers);
  - 14% was personal preference;
  - 4% was accidents such as freezer failure.

  — [WRAP, Household Food and Drink Waste in the UK 2012](https://www.wrap.ngo/sites/default/files/2020-12/Household-Food-and-Drink-Waste-in-the-United-Kingdom-2012.pdf)
- UK 2021–22: the biggest single reason was food not used in time because it "either smelled or looked off, or was past the date on the label". The excerpt gave no percentage. — [UK Parliament research briefing CBP-7552](https://researchbriefings.files.parliament.uk/documents/CBP-7552/CBP-7552.pdf)
- Wales 2021–22: 19% of all wasted food was thrown away because it smelled or looked off, and 14% because it was past the label date. Together that is **33% "not used in time"**. The base includes inedible parts. — [WRAP, Household Food and Drink Waste in Wales 2021-22](https://www.wrap.ngo/resources/report/household-food-and-drink-waste-wales-2021-22)

**United States**
- NRDC kitchen diaries (Denver, Nashville and New York City; published Oct 2017, so dated):
  - the most common reason for discarding edible food was **moldy or spoiled**, followed by not wanting leftovers (11% of discards);
  - **only 4% was discarded for being past the label date**, although 46% of respondents named date labels as their main source of information;
  - 68% of discarded food was edible, counting questionably edible food.

  — [NRDC report](https://www.nrdc.org/sites/default/files/food-waste-city-level-report.pdf); [NRDC press release](https://www.nrdc.org/press-releases/two-thirds-food-wasted-home-three-major-us-cities-edible)
- ReFED's 2026 report (2024 data):
  - 70M tons of US surplus food, 29% of the food supply, worth US$380B (C$532B);
  - **homes produce about a third** of it, and residential waste fell about 950k tons in 2024;
  - consumers spend **more than US$762 (C$1,067) per person per year** on food that goes to waste, in and out of the home.

  — [ReFED 2026 report](https://refed.org/food-waste/refed-us-food-waste-report-2026/); [Waste Dive](https://www.wastedive.com/news/refed-food-waste-report-shows-decline/816947/)
- ReFED's 2023 fact sheet put homes at 26M tons, or 35.2% of surplus food. Its 2025 report says residential estimates are now about 40% lower than previously published, so older residential tonnages are not comparable. — [ReFED fact sheet](https://refed.org/uploads/refed-fact-sheet-2024-stats-2.pdf); [ReFED 2025 report](https://refed.org/downloads/refed-us-food-waste-report-2025.pdf)

**Canada**
- NZWC benchmark (2017 study, updated 2022): **63%** of the food Canadian households throw away could have been eaten, about **140 kg per household per year**. — [Love Food Hate Waste Canada](https://lovefoodhatewaste.ca/about/food-waste/)
- **45% of avoidable household food waste is fruit and vegetables.** With produce, people "over purchase, store incorrectly, or forget about it completely" (Divert NS, citing NZWC). — [Divert NS](https://divertns.ca/learn/waste-not-news/get-loose-food-waste-action-week)
- Breakdown by weight, from search-result summaries of the NZWC 2022 update: vegetables **30%**, fruit **15%**, leftovers **13%**, bread and bakery **9%**, dairy and eggs **7%**, meat about **6%**. The primary report was not retrieved, and secondary pages mix 2017 and 2022 figures. The 30% + 15% matches Divert NS's 45%. It is not confirmed which of these pages carries the exact breakdown. — [Canadian Cattlemen](https://www.canadiancattlemen.ca/news/the-drive-to-reduce-food-waste-in-canada/); [SEEDS / Youth in Food Systems](https://seeds.ca/schoolfoodgardens/the-canadian-food-waste-crisis/); [Government of Canada, Taking stock](https://www.canada.ca/en/environment-climate-change/services/managing-reducing-waste/food-loss-waste/taking-stock.html)
- National totals:
  - about 2.2M tonnes of avoidable household food waste — [Recycling Product News](https://www.recyclingproductnews.com/article/37436/national-campaign-to-address-22-million-tonnes-of-avoidable-food-waste-in-canada);
  - an NZWC-based figure of about 2.3M tonnes of edible food a year, costing more than $20B, seen on a secondary page (exact page not identified; candidates: [LFHW Canada three-year report](https://nzwc.ca/Documents/lfhw-canada-three-year-report-2018-2021.pdf), [City of Toronto](https://www.toronto.ca/services-payments/recycling-organics-garbage/waste-management/waste-reduction/food-waste/)).
- Waste audit of 94 Guelph, Ontario families with young children (published 2019):
  - **2.98 kg of avoidable food waste per household per week**;
  - fruit and vegetables about **two-thirds** of avoidable weight, bread and cereals about a quarter;
  - **the top items were bread, tomatoes and apples**.

  — [von Massow et al., Frontiers in Nutrition 2019](https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2019.00143/full); [Guelph Food Waste Research Project](https://guelphfoodwaste.com/); [KelownaNow](https://www.kelownanow.com/news/news/National_News/Five_meals_a_week_Scientists_audit_garbage_to_assess_household_food_waste/)

### Inferences
**How much of the waste a fridge camera could address (estimates)**
- **Cross-check of the "not used in time" share:** Wales' 33% of all waste ÷ an edible share of 0.63–0.68 (NZWC 63%, NRDC 68%) ≈ **49–52% of edible waste**. That matches WRAP 2012's 48%, so I use **about 48% of avoidable waste as "not used in time"**.
- **Method A, by cause:** 48% not used in time × 60–75% of that held in the fridge (my assumption; the rest is counter produce, bread, pantry and freezer) = **29–36%**. Adding fridge-stored leftovers that later spoil, assumed to be a third of WRAP's 31% "cooked or served too much", gives **39–46%**.
- **Method B, by food type:** the fridge-stored share of avoidable waste is
  vegetables 30% × 0.75 + fruit 15% × 0.5 + leftovers 13% × 0.9 + bread 9% × 0.1 + dairy and eggs 7% × 1.0 + meat 6% × 0.6 + other 20% × 0.25 ≈ **58%**. Multiplying by the 75% that spoils or expires rather than being over-served gives **about 44%**. All the storage fractions are my assumptions.
- **Working range: 30–45% of avoidable household waste is fridge-forgotten.**

**What that is worth per household (estimates)**
- **Canada:** C$1,300 × 30–45% = **C$390–585 per household per year** at stake. Assuming the tool prevents 20–30% of it for engaged users (see Section 6), that is **C$78–176 per household per year**, or 6–14% of the C$1,300.
- **US, on two bases:**
  - The EPA's US$2,913 per family of four (given in the brief) × 30–45% × 20–30% = **US$175–393 (C$245–551)**.
  - The EPA's US$728 per person is the same order as ReFED's "in and out of the home" US$762, so it may include waste outside the home. A home-only alternative: ReFED's home share (about a third × US$380B ≈ US$127B, assuming value splits like tonnage) ÷ 134.8M households ≈ **US$940 (C$1,320) per household**, nearly identical to LFHW Canada's C$1,300. On that base the saving is **US$56–127 (C$79–178)** a year.
  - Prefer the ReFED-based figure for average US households, and treat the EPA figure as an upper bound for large families.
- **Cross-check of the 140 kg:** UNEP's 79 kg per person (from the brief) × 2.47 persons per Canadian household ≈ 195 kg of total waste per household. 140 kg ÷ 195 kg ≈ 72% edible, consistent with the 63–68% above.
- **Families:** Guelph's 2.98 kg per week ≈ 155 kg a year of avoidable waste. At LFHW's implied C$9.29/kg (1,300 ÷ 140) that is about **C$1,440 a year**, only about 11% above the average household. Waste does not scale linearly with household size.

**Design implications**
- **Coverage:** three of the top items (bread, tomatoes, apples), plus bananas and potatoes, are often stored outside the fridge, so a fridge-only camera misses part of the produce problem. Pantry, counter and freezer coverage, for example by phone scan, extends the addressable share.
- **Date labels:** they cause only about 4% of discards (NRDC), yet people rely on them to decide. Loose produce has no label, and "days since first seen" is exactly the missing signal.
- **Over-cooking and plate waste:** these are about 31% of avoidable waste (WRAP 2012) and mostly beyond reach, except for leftovers ageing in the fridge.

### Gaps
- No retrieved study measures what share of wasted food had been stored in the fridge versus on the counter, in the pantry or in the freezer. This is the **largest single uncertainty** in the addressable share; the 60–75% is my assumption.
- Not retrieved, because the primary documents could not be opened:
  - NRDC's exact moldy/spoiled percentage;
  - WRAP UK 2021–22 percentages by cause;
  - NZWC 2022 cause-level data for Canada (for example, "forgot about it").

## 4. Willingness to pay, subscription tolerance and price points

### Takeaway
**No study measures willingness to pay for fridge cameras or smart-fridge food-waste features.** The comparable evidence is mixed:
- half of US consumers say they would pay more for packaging that reduces food waste;
- "smart" freshness labels can make a product *less* attractive;
- **households that waste the most food will pay the least** for waste reduction.

On subscriptions, **53% of US smart-home owners pay none** (Aug 2026). AI-assistant subscriptions are spreading, though: 16% pay for one and 42–52% say they would. With savings of about C$80–175 a year, a pure money pitch supports only roughly a C$100–200 kit with a C$0–5/month subscription. **Convenience and peace of mind have to justify any higher price.**

### Cited Findings
**Comparable willingness-to-pay studies**
- Survey of 1,000 US consumers: **50% willing to pay more** for food in packaging that reduces household food waste, and 40% "may". Only 32% knew intelligent packaging can show freshness. — [Foods 2023 (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10705878/)
- Choice-based conjoint on milk: consumers value longer shelf life and an eco-label, but **a smart spoilage label creates disutility**. — [ResearchGate: WTP for shelf life of HTST milk](https://www.researchgate.net/publication/372454907_Consumer_willingness_to_pay_for_shelf_life_of_high_temperature_short_time_pasteurized_fluid_milk_Implications_for_smart_labeling_and_food_waste_reduction)
- Natural-coating study: **high-food-waste households were willing to pay the lowest premium** for a waste-reducing technology. — [Dsouza et al. 2023, JAAEA](https://onlinelibrary.wiley.com/doi/full/10.1002/jaa2.47)
- 230 young Indonesian consumers: the intention to reduce food waste did not translate into buying intelligent packaging. — [ResearchGate](https://www.researchgate.net/publication/372599451_Drivers_of_Young_Consumers'_Willingness_to_Reduce_Food_Waste_and_Buy_Intelligent_Packaging)

**Subscription tolerance**
- Parks Associates (Aug 2026, 8,000 US internet households):
  - **53% of smart home device owners pay no subscription fees** for their devices, systems or appliances;
  - 37% pay for a home security service, 19% for a video device subscription, and 17% for network or cybersecurity services;
  - **16% pay for a premium AI voice assistant** (Alexa+, Google Home Premium with Gemini, Josh.ai).

  — [Parks Associates via PR Newswire](https://www.prnewswire.com/news-releases/parks-associates-19-of-smart-home-device-owners-pay-for-subscription-service-for-a-video-security-device-adoption-of-smart-home-hubs-remains-flat-at-5-of-us-internet-households-302861262.html)
- Parks, Jul 2025: **42–52% of consumers are willing to pay a monthly fee** for an AI smart home assistant covering security, convenience and automation. — [PR Newswire](https://www.prnewswire.com/news-releases/parks-associates-up-to-52-of-consumers-are-willing-to-pay-a-monthly-fee-for-an-ai-smart-home-assistant-that-offers-security-convenience-and-automation-use-cases-302505001.html)
- Parks (undated): most interested households would pay **US$10–30 (C$14–42) a month** for convenient, proactive services. — [Parks Associates](https://www.parksassociates.com/blogs/home-systems-and-controls/parks-associates-new-service-models-emerge-for-smart-home-ecosystem)
- Parks 2024 home-services benchmark: households without a bundle spend about US$53 a month on a security service. Attribution to this release is probable. — [Parks Associates via PR Newswire](https://www.prnewswire.com/news-releases/parks-associates-spending-on-standalone-mobile-phone-internet-service-and-pay-tv-increased-again-in-q3-2024-302313000.html)

**Price points of comparable products**
- Fridge Eye retrofit camera: **US$79 (C$111)** backer price on Indiegogo, 2019. — [The Spoon](https://thespoon.tech/fridge-eye-is-a-cheap-connected-camera-to-smarten-up-your-fridge-or-cupboard/); [BackerKit](https://www.backerkit.com/projects/fridge-eye-turn-your-fridge-into-a-smart-fridge)
- Liebherr HNGRYnsite camera: **€149.90** (background). — [Liebherr](https://www.liebherr.com/en-us/n/always-know-what%E2%80%99s-inside-with-the-fridge-camera-hngrynsite-powered-by-liebherr-27846-3782185)
- Samsung's camera fridge: **US$3,399** (background). — [Techlicious](https://www.techlicious.com/blog/samsung-bespoke-fridge-vision-ai-with-google-gemini/)
- The 3% annual purchase rate for smart appliances is held back partly by "high prices". — [Parks via PR Newswire](https://www.prnewswire.com/news-releases/parks-associates-23-of-us-internet-households-now-own-at-least-one-smart-appliance-up-from-15-in-2020-302448102.html)

### Inferences
- **The savings ceiling (estimate).** Avoided waste is worth C$78–176 a year to an engaged Canadian household. Against a **C$199 kit**:
  - a C$5/month (C$60/year) subscription eats **34–77% of that saving**;
  - with the subscription, the kit pays back in **1.7 years** (C$175 saving, C$115 net) to **9.9 years** (C$80 saving, C$20 net);
  - without a subscription, it pays back in 1.1–2.5 years.
- **Who can pay more.** Large US families (US$175–393 a year of value on the EPA base) and caregivers can support higher prices. Caregivers are buying peace of mind and are anchored on US$10–30/month monitoring services.
- **Framing.** Most-wasteful households value prevention least, and smart freshness labels put people off. Both point towards selling **convenience** ("see what's in the fridge from the store", "what to cook tonight") and **safety** rather than "waste less". Avoid sounding like a freshness verdict.
- **Bundling risk.** The 2026 wave of AI-assistant subscriptions (16% paying, 42–52% willing) makes a small AI subscription more normal. But a fridge feature could be bundled into Alexa+, Gemini or SmartThings, which would cap standalone subscription pricing.
- **Model price assumptions used in Section 8:** a C$199 three-camera kit plus C$5/month. The background report puts AI and hosting costs at about C$0.20–0.75 plus C$0–7 a month, so a C$5 subscription has margin at scale.

### Gaps
- No direct willingness-to-pay study (survey, conjoint or experiment) for fridge cameras or smart-fridge inventory features.
- No Canadian smart-home subscription data.
- Prices of mass-market indoor cameras (for example, sub-US$50 models) were not retrieved this session.
- The source of Parks' US$53 security benchmark is only probable.

## 5. Customer segments: pain points, size and willingness to pay

### Takeaway
Ranked by fit:
- **Busy multi-person families**: the largest absolute waste, and the "massive family" use case reviewers name.
- **Aging-in-place caregivers**: the highest willingness to pay, a real food-safety risk, and existing spending on monitoring. The adult child is the buyer and the parent is the user.
- **Budget-squeezed households**: feel the pain most (Canadian food prices are up 27% in five years, with another 4–6% expected in 2026) but can least afford hardware.
- **Eco-motivated households**: the attitude is near-universal (94%), but nobody has sized them as buyers.
- **Roommates, meal-preppers and people with diet goals**: plausible niches with little data.

### Cited Findings
**Busy families**
- Guelph families with young children: 2.98 kg of avoidable waste per week; produce about two-thirds; the top items are bread, tomatoes and apples. — [Frontiers in Nutrition 2019](https://www.frontiersin.org/journals/nutrition/articles/10.3389/fnut.2019.00143/full)
- US: 85.96M family households; married couples are 47% of households. — [FRED](https://fred.stlouisfed.org/series/TTLFHH); [US Census Bureau](https://www.census.gov/newsroom/press-releases/2025/families-and-living-arrangements.html)
- A camera fridge is "a specific tool for a specific type of person—usually someone who hates wasting food or has a massive family to feed." — [PonderWorthy](https://ponderworthy.com/buying-a-fridge-with-camera-inside-is-it-actually-worth-the-hype-rlx)

**Budget-squeezed households (Canadian food inflation)**
- Canada's Food Price Report 2026 (Dalhousie and partners, Dec 2025):
  - food prices are forecast to rise **4–6% in 2026**;
  - a family of four will spend **C$17,571.79**, up to **C$994.63** more than in 2025;
  - food already costs **27% more than five years earlier**;
  - **Alberta** is among the provinces expected to see increases above the national average;
  - meat rose 5–7% in 2025.

  — [Dalhousie news release](https://www.dal.ca/news/2025/12/04/canada-food-price-report-2026.html); [Report page](https://www.dal.ca/sites/agri-food/research/canada-s-food-price-report-2026.html)
- Households that waste the most food will pay the smallest premium for waste reduction. — [Dsouza et al. 2023](https://onlinelibrary.wiley.com/doi/full/10.1002/jaa2.47)

**Eco-motivated households**
- June 2020 survey of 1,200 Canadians (dated, taken during COVID): **94% were motivated to reduce avoidable food waste**, and 24% said they were throwing away or composting less. — [Newswire](https://www.newswire.ca/news-releases/covid-19-driving-canadians-to-waste-less-food-survey-830882830.html)

**Roommates and shared fridges**
- US: 48.83M nonfamily households, of which 39.7M are one-person. — [FRED](https://fred.stlouisfed.org/series/TTLNHH); [US Census Bureau](https://www.census.gov/newsroom/press-releases/2025/families-and-living-arrangements.html)

**Meal-preppers and people with diet goals**
- Gallup (web panel of 5,065, 28 May–5 Jun 2026): **11% of US adults currently take a GLP-1 drug for weight loss, up from 3% in 2024**; 15% have ever taken one for weight loss. — [Gallup](https://news.gallup.com/poll/712157/glp-usage-reaches-new-high.aspx)
- KFF (Oct–Nov 2025, any reason, as reported secondhand): 12% currently take one and 18% ever have. — [Pabau summary](https://pabau.com/blog/glp-1-statistics/)

**Aging-in-place caregivers (adult children monitoring a parent)**
- Caregiving in the US 2025 (AARP and the National Alliance for Caregiving, Jul 2025): **63M family caregivers**, almost a quarter of US adults. — [AARP](https://www.aarp.org/pri/topics/ltss/family-caregiving/caregiving-in-the-us-2025/)
- Boston College counts 59M people caring for an adult family member, against a BLS estimate of 38M. — [Boston College CRR](https://crr.bc.edu/family-caregivers-how-many-and-who-are-they/)
- Caregivers' use of **remote monitoring nearly doubled, from 13% in 2020 to 25% in 2025**. — [Caregiving in the US 2025 technology brief](https://www.caregivingintheus.org/wp-content/uploads/2026/03/CGUS25_Technology-Use-Among-Family-Caregivers.pdf)
- Parks Associates: **16.3M US households use assistive technologies** (14.4M in 2022). Parks sees a **US$5B (C$7B) annual opportunity** in "aging well" packages that bundle smart locks, fall detection and sensor-based wellness insights. — [Parks Associates](https://www.parksassociates.com/blogs/digital-health/the-future-of-senior-care-how-ambient-sensing-is-transforming-aging-in-place)
- Market-size claims conflict: US$1.76B (2025) for elderly protection monitoring systems against US$43.76B for broader elderly tech. Both are press-release quality. — [OpenPR](https://www.openpr.com/news/4664186/elderly-protection-monitoring-system-market-to-grow-at-7-0-cagr)
- US seniors living alone:
  - **26% of adults 65+ lived alone in 2023**, including 31% of women, down from 1990. — [Pew Research Center, Dec 2025](https://www.pewresearch.org/short-reads/2025/12/04/a-smaller-share-of-older-us-adults-live-alone-today-than-in-1990/)
  - Counts range from **13.8M to 16.7M** depending on year and source, about **15.8M in the 2024 American Community Survey**, as cited by a vendor page (exact page not identified; candidates [RetirementLiving](https://www.retirementliving.com/aging-in-place/how-many-seniors-live-alone), [CareTrigger](https://caretrigger.io/research/seniors-living-alone-statistics)).
  - The share rises with age: about 23% at 65–74, 36% at 75–84 and 47% at 85+ (vendor compilation, same candidate pages).
- Canadian seniors living alone, from the 2021 census as attributed to StatCan by a vendor: **20.7% of people aged 65–69, 26.7% of those 75–79 and 41.8% of those 85+**. — [imalive.co](https://imalive.co/data/canada-living-alone-statistics). A national total of about 1.7M appeared on another vendor page and is unverified.
- Listeria risk:
  - Adults 65+ had a listeriosis incidence of 1.3 per 100,000 as reported, a **rate ratio of 4.4** against the overall population (CDC Vital Signs, 2009–2011 data, dated). — [CDC MMWR](https://www.cdc.gov/mmwr/preview/mmwrhtml/mm6222a4.htm)
  - CDC still lists people 65+ among the higher-risk groups and estimates about 1,600 US cases a year. — [CDC Listeria prevention](https://www.cdc.gov/listeria/prevention/index.html)
  - USDA FSIS explains why adults 65+ are an at-risk population. — [USDA FSIS](https://www.fsis.usda.gov/news-events/news-press-releases/adults-65-and-older-risk-population-why)
- Smell loss: in a population-based smell test (JAMA 2002, dated), **24.5% of older adults and 62.5% of those over 80 had impaired smell, but only 9.5% reported it**, so most affected people do not know. — [Murphy et al., JAMA](https://jamanetwork.com/journals/jama/fullarticle/195502)
- An older review found that 45% of elderly subjects could not detect the warning odour added to natural gas at the safety-standard concentration. — [Anosmia: Loss of Smell in the Elderly](https://www.researchgate.net/publication/23769218_Anosmia_Loss_of_Smell_in_the_Elderly)

### Inferences
Segment sizes and willingness to pay. Sizes are my estimates; assumptions are labelled.

| Segment | Size (estimate) | Main pain | Willingness to pay (inference) |
|---|---|---|---|
| Busy families | US about 34M households, *if* about 25% have children under 18 (unverified assumption). Canada and Alberta not sized. Alberta's larger households (2.61 vs 2.47 persons) and above-average food inflation make it a good beachhead | Most absolute waste (about C$1,440 a year in Guelph families); several people moving food; duplicate buying | Medium: the C$80–175 value case plus convenience |
| Budget-squeezed | Broad: every Canadian household faces 4–6% food inflation; a family of four spends C$17,572 | C$1,300 of waste is about **7.4% of a family-of-four food budget** (1,300 ÷ 17,572) | Low upfront; needs a cheap kit or no subscription |
| Eco-motivated | Attitude near-universal (94%); buyer share unknown | Guilt, values | Low to medium; a real but small premium (packaging studies) |
| Roommates / shared fridges | US about **9.1M** multi-person nonfamily households (48.83M − 39.7M; includes unmarried partners) | Unclear ownership of food; nobody tracks shared items | Low: renters, short tenures, split payers |
| Diet goals / GLP-1 / meal prep | About **29M US adults** on GLP-1s for weight loss (11% × about 262M adults; the adult count is my assumption) | Hypothesis (untested): smaller appetites leave planned food uneaten; meal-preppers need date tracking for batch-cooked food | Medium; fits with a meal-planning app |
| Aging-in-place caregivers | US about **2.37M households** (15.8M seniors living alone × 30% with an engaged remote caregiver × 50% consenting to a fridge camera; both percentages are assumptions). Canada about **255k** (1.7M unverified × 0.3 × 0.5). Separately, about **15.75M caregivers already use remote monitoring** (63M × 25%) | Listeria risk 4.4×; most seniors with smell loss don't know it; caregivers can't see spoilage from afar; a fridge left unopened can signal trouble | **Highest**, anchored on US$10–30/month monitoring services. At C$10/month: US about **C$284M/yr**, Canada about **C$31M/yr** |

- **Caregiver risks:**
  - consent and dignity, since the parent is being watched by the child;
  - liability: "probably bad" must never read as "safe";
  - competition from ambient-sensing bundles (Parks' "aging well" packages);
  - medical-device creep if the product is positioned as health monitoring.
- **Caregiver channel and product:** the buyer (adult child) and the user (parent) differ, so the product needs a caregiver dashboard and alerts, for example "deli meat opened 6 days ago" or "fridge not opened in 24h".
- **Families as the volume segment:** Guelph's top items and the "massive family" use case point to families, but much of their produce waste happens on the counter or in the pantry, outside a fridge camera's view.

### Gaps
- Not retrieved:
  - counts of households with children under 18 for the US, Canada or Alberta;
  - Canadian caregiver counts (StatCan's General Social Survey);
  - Health Canada's listeria guidance for older adults;
  - what caregivers spend per head on monitoring technology, and typical medical-alert or sensor subscription prices;
  - the share of people who meal-prep;
  - counts of Canadian roommate households;
  - any data on waste in shared fridges;
  - any study linking GLP-1 use to household food waste.
- The KFF figure was seen only secondhand.

## 6. Behaviour change: does such a tool reduce waste, and what keeps people using it?

### Takeaway
**No rigorous trial shows that a fridge camera alone reduces household food waste.** The evidence so far:
- the best camera evidence is a small study combining cameras with colour-coding: waste fell 29–51%, and the result was only marginally significant (p < 0.10);
- app-only studies range from **no measurable effect** to about 40% less waste in an uncontrolled study;
- reviews find that reminders and social norms help, that programs with several components beat single tools, and that monthly reminders fade within weeks;
- Panasonic and Yokohama ran a 30-household AI fridge-camera trial in Oct–Nov 2025, with no results published.

Assuming **20–30% prevention among engaged users is optimistic but defensible**. Whether the effect lasts beyond a few months is unknown.

### Cited Findings
**Camera and inventory studies**
- "Technicolouring the Fridge" (cameras plus colour-coding, c. 2015, small sample): average weekly waste per household fell **29–51%** in the intervention group, with little change among controls. The interaction was only **marginally significant (p < 0.10)**, and the camera's effect cannot be separated from the colour-coding. An earlier FridgeCam study had only 4 households and no quantitative analysis. — [ResearchGate](https://www.researchgate.net/publication/273885759_Technicolouring_the_Fridge_Reducing_food_waste_through_uses_of_colour-coding_and_cameras); [FridgeCam figure](https://www.researchgate.net/figure/Successive-images-from-FridgeCam-showing-changes-in-the-fridge-as-it-is-used_fig1_236962066)
- An Android inventory app tested with 35 households over 30 days reported about **40% less weekly waste**. The design was pre/post with no control group, in a low-tier journal, so treat it as weak. — [IJCR](http://jjrip.org/ijcr/en/article/download/4/9)
- **Panasonic and the City of Yokohama** tested an AI fridge camera with **30 households, Oct–Nov 2025**, surveying changes in food-waste awareness and behaviour. No outcomes were found as of Oct 2026. — [Zenbird](https://zenbird.media/panasonic-and-yokohama-trial-ai-fridge-camera-to-reduce-food-waste/)
- A JMIR pilot of two food-waste apps (background) found **no measurable effect**; participants blamed "too many manual operations". — [JMIR Formative Research](https://pmc.ncbi.nlm.nih.gov/articles/PMC9482070/)
- Vendor "product insight" pages cite a "Consumer Reports field study" and an "MIT 2024 Food Tech Audit" showing 22–34% reductions. Neither could be verified, so treat them as unreliable. — [Alibaba product insights](https://www.alibaba.com/product-insights/smart-fridge-cameras-vs-manual-inventory-apps-which-solution-actually-reduces-food-waste-at-home.html)

**Reviews and trials of nudges and other interventions**
- Systematic review of nudges: **social norms, reminders, and social norms combined with disclosure** changed household food-waste behaviour; disclosure alone did not. Only 4 of 18 studies were judged reliable. — [ResearchGate](https://www.researchgate.net/publication/355300139_What_Nudge_Techniques_Work_for_Food_Waste_Behaviour_Change_at_the_Consumer_Level_A_Systematic_Review)
- 2024 systematic review: **interventions with several components beat single ones**. Individual coaching plus text, email or phone nudges cut waste by up to 79% (Roe et al. 2022, small sample). — [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S235255092400335X); [Agrarforschung Schweiz summary](https://www.agrarforschungschweiz.ch/en/2025/02/a-systematic-literature-review-of-impactful-food-waste-interventions/)
- Randomized trial of a "use-up day" with flexible recipes: **monthly reminders were not enough** to stop waste rising again, with no significant difference at the 8-week follow-up. — [Resources, Conservation & Recycling 2023](https://www.sciencedirect.com/science/article/pii/S0921344923001222)
- A randomized trial of nudges through the FoodImage app is registered, but only the protocol was found, with no results. — [ClinicalTrials.gov NCT03309306](https://cdn.clinicaltrials.gov/large-docs/06/NCT03309306/Prot_SAP_005.pdf)

**Why people abandon these tools**
- **Stale images:** a Family Hub owner said the interior view was days old because it refreshes only when the door opens wide; he used it mainly to check the milk. — [SmartThings Community](https://community.smartthings.com/t/samsung-family-hub-camera-door-view/295877)
- **Blocked views:** a large item in front of the lens hides everything behind it. — [PonderWorthy](https://ponderworthy.com/buying-a-fridge-with-camera-inside-is-it-actually-worth-the-hype-rlx)
- **Manual rituals** (background): Samsung required holding each item up to the camera and typing expiry dates by hand. — [Trusted Reviews](https://www.trustedreviews.com/reviews/samsung-bespoke-ai-4-door-french-door-rf90f29aecraa); [Samsung](https://www.samsung.com/global/sustainability/popup/popup_doc/AYUr58faFhIAIx_C/)
- **Lost connections and reliability problems.** — [Tech Brew](https://www.techbrew.com/stories/2023/03/23/consumers-aren-t-connecting-their-smart-appliances-to-the-internet-and-it-s-a-challenge-for-appliance-makers); [J.D. Power](https://www.businesswire.com/news/home/20250925369703/en)
- **Vendor shutdown.** — [Consumer Rights Wiki](https://consumerrights.wiki/w/HNGRYnsite_Camera:_From_smart_kitchen_aid_to_e-waste)

### Inferences
- **Effect size.** The evidence supports "plausibly 20–40% for engaged users, unproven", not a guarantee.
  - Section 8 uses **20–30% prevention of fridge-forgotten waste**.
  - Because the evidence is thin (at most 35 households per group, at most 8 weeks, no randomized trial of a camera alone), any business case should also test 0–10%.
- **What keeps people using it (inference):**
  1. **No manual input** and an inventory that stays current. This is where apps and Samsung's first generation failed.
  2. **Full coverage**, including door bins and drawers. This is the multi-camera thesis.
  3. **Nudges at decision moments** (at the store, before shopping, at dinner time) rather than calendar reminders, which faded in the use-up-day trial.
  4. **Household sharing and social norms**, from the nudge review.
  5. **Visible proof of savings.**
- **Product as a bundle.** "Camera + suggestions + reminders" mirrors the multi-component designs that work best.
- **Evidence as a marketing asset.** Independent proof is missing, so an own study, for example a 30-household Alberta pilot measured with waste diaries, would itself help sell the product.

### Gaps
- No randomized trial of fridge cameras or smart fridges that measures waste over more than 3 months.
- The Yokohama results are unpublished.
- No engagement or retention data from Samsung, LG or app vendors.

## 7. Demand signals: Samsung AI Vision Inside reception, crowdfunding, search and sentiment

### Takeaway
Demand signals are **lukewarm**:
- Samsung's Gemini-powered AI Vision Inside drew **"promising, needs work"** reviews.
- **Consumer Reports said it "probably" needs "more cameras"**, which directly supports the multi-camera retrofit thesis.
- No sales or engagement data are public.
- Retrofit fridge cameras have crowdfunded only **in the low hundreds of backers**, and the trade press says VCs avoid food-waste gadgets.
- Owner sentiment centres on stale or blocked views and the "gimmick" label. One use case recurs: checking supplies from the store.

### Cited Findings
**Samsung AI Vision Inside reception**
- The **May 2026 software update** brought AI Vision food recognition, a more conversational Bixby and widgets to existing 32-inch Family Hub models without new hardware. It recognises a much wider list of foods and suggests recipes from the most-used ingredients. — [Samsung Global Newsroom](https://news.samsung.com/global/samsung-expands-ai-capabilities-of-bespoke-ai-refrigerator-family-hub-with-major-updates)
- Before Gemini, recognition covered 37 fresh foods and 50 pre-registered processed foods, on-device. — [Samsung US Newsroom, CES 2026](https://news.samsung.com/us/samsung-unveil-ai-vision-google-gemini-ces-2026/)
- With Gemini, it recognises more than 2,000 foods (background). — [Engadget](https://www.engadget.com/2167892/samsungs-bespoke-update-is-big-step-towards-a-useful-ai-for-your-fridge/)
- Early testers report better recognition of niche products and freshness tracking, but the AI **can mislabel items and sound overconfident**, and Bixby remains the visible assistant. — [Dataconomy, 11 May 2026](https://dataconomy.com/2026/05/11/samsung-upgrades-bespoke-refrigerators-with-gemini-powered-ai/)
- Engadget (Jan 2026): the food tracking is a **"work in progress"** that can still be useful, with limited recognition listed as a drawback. — [Engadget](https://www.engadget.com/home/kitchen-tech/samsung-bespoke-fridge-with-ai-review-all-the-bells-and-whistles-140000099.html)
- Consumer Reports: the concept is promising but needs more work, **"and probably more cameras"**. — [Consumer Reports](https://www.consumerreports.org/appliances/refrigerators/samsung-bespoke-fridge-review-a1409236571/)
- Techlicious: a pricey way to get what a phone's Gemini app already does. — [Techlicious](https://www.techlicious.com/blog/samsung-bespoke-fridge-vision-ai-with-google-gemini/)
- Reviewed, on the earlier camera: it "might be more work than it's worth" (background). — [Reviewed](https://www.reviewed.com/refrigerators/content/samsung-bespoke-refrigerator-rf29db9900qd-review)

**Crowdfunding**
- **Fridge Eye** (Indiegogo, closed Nov 2019): about **US$39,460 against a US$25,000 goal from 220 backers** at US$79. Image recognition was promised for a later release. — [BackerKit](https://www.backerkit.com/projects/fridge-eye-turn-your-fridge-into-a-smart-fridge); [The Spoon](https://thespoon.tech/fridge-eye-is-a-cheap-connected-camera-to-smarten-up-your-fridge-or-cupboard/)
- **FreshFridge** (Kickstarter; sensors plus an app that add temperature and inventory tracking to *existing* fridges): **US$23,783 from 86 backers** against a US$20,000 goal (date not retrieved). — [Kickstarter](https://www.kickstarter.com/projects/freshfridge/freshfridge-the-affordable-smart-kitchen-ecosystem)
- **FoodTusker** (smart containers for leftovers): **US$9,254 from 78 backers** against a US$5,000 goal. — [Kickstarter](https://www.kickstarter.com/projects/stevehong/foodtusker-worlds-first-truly-smart-food-container-system)
- The Spoon headline: "Food Waste Gadgets Can't Get VC Love, But Kickstarter Backers Are All In" (date not retrieved). — [The Spoon](https://thespoon.tech/food-waste-gadgets-cant-get-vc-love-but-kickstarter-backers-are-all-in/)

**Sentiment**
- No Reddit threads surfaced in search.
- Coverage notes that fridge cameras take a snapshot when the door seals rather than live video, that a big item blocks everything behind it, and that critics call them a gimmick. It also notes the camera is mainly useful for checking supplies from the store. — [PonderWorthy](https://ponderworthy.com/buying-a-fridge-with-camera-inside-is-it-actually-worth-the-hype-rlx)
- A failed fridge camera means replacing the module plus labour. — [EasyBear Appliance Repair](https://easybear-appliancerepair.com/blog/samsung-smart-refrigerator-error-code-cam-e)
- A Family Hub owner's interior image was days old. — [SmartThings Community](https://community.smartthings.com/t/samsung-family-hub-camera-door-view/295877)

### Inferences
- **Signal strength: weak to moderate.** Interest is real but niche.
  - Crowdfunding for fridge cameras and similar gadgets has peaked at about **80–220 backers**, a realistic anchor for a solo founder's first campaign.
  - A 2026 campaign with a working AI demo could do better, but that is unproven.
- **Where incumbents are weak.** Reviewers complain about partial coverage, stale images, mislabelled items and price. These are exactly the points where a cheap multi-camera retrofit that asks the user when unsure could be better.
- **Incumbent threats:**
  - Samsung can push recognition to existing fridges by software, so owners of camera fridges will not buy a retrofit.
  - Bundling into Gemini, Alexa+ or SmartThings could commoditise the AI layer.
  - Phones already recognise food (Techlicious).
  - The retrofit's defensible value is therefore **passive, multi-angle, continuous capture**, not recognition itself.

### Gaps
- No Google Trends data (the interactive tool was not reachable).
- No primary Reddit threads.
- No Samsung sales, attach-rate or engagement figures.
- No 2025–2026 crowdfunding campaign for an AI fridge camera was found.
- No Amazon review base for retrofit fridge cameras (few appear to be on sale now).

## 8. Bottom-up market estimate (TAM / SAM / SOM) for Canada and the US

### Takeaway
On my labelled assumptions:
- **TAM (theoretical: every household buys a C$199 three-camera kit plus C$5/month):** about **C$16.6B a year** (US C$14.8B, Canada C$1.81B, Alberta C$0.21B).
- **SAM (smart-home-ready, camera-accepting, target-fit households):** about **20.5M households, about C$2.25B a year** (US C$2.0B, Canada C$255M, Alberta C$29M).
- **SOM, solo part-time founder over 3 years:** **300–1,500 paying households**, which is C$60k–300k of hardware revenue plus C$18k–90k a year of subscriptions. That is a micro-business.
  - With funding and a team, reaching 0.25–1% of SAM would mean **C$3–12M a year in subscriptions plus C$10–41M of hardware** over about 5 years.
- **Caregiver niche:** about **C$315M a year** of SAM across both countries at C$10/month.

### Cited Findings
- **Households:** US 134.79M (2025) — [FRED](https://fred.stlouisfed.org/graph/?g=1QoeM); Canada 14,978,940 (2021) — [StatCan](https://www12.statcan.gc.ca/census-recensement/2021/dp-pd/prof/details/page.cfm); Alberta 1,633,220 (2021) — [CareerBeacon](https://www.careerbeacon.com/en/canada/alberta); July 2026 populations — [ATB](https://www.atb.com/company/insights/the-twenty-four/alberta-population-update-september-23-2026/)
- **Smart-home-ready share:** US 45% of internet households, excluding speakers — [Parks](https://www.prnewswire.com/news-releases/parks-associates-estimates-approximately-13-million-new-us-internet-households-have-entered-the-smart-home-market-since-2020-302523800.html); Canada 47.4% (2022) — [StatCan](https://www150.statcan.gc.ca/n1/pub/12-581-x/2023001/sec11-eng.htm)
- **Privacy concern:** 37% — [SecurityInfoWatch](https://www.securityinfowatch.com/residential-technologies/smart-home/article/55323461/more-cameras-fewer-fears-as-survey-reveals-the-new-face-of-home-security); [SafeHome](https://www.safehome.org/resources/home-security-industry-annual/); distrust of smart devices 28–40% — [StatCan](https://www150.statcan.gc.ca/n1/daily-quotidien/230720/dq230720b-eng.htm)
- **Subscription tolerance and price anchors:** 53% of smart-home owners pay no fees — [Parks 2026](https://www.prnewswire.com/news-releases/parks-associates-19-of-smart-home-device-owners-pay-for-subscription-service-for-a-video-security-device-adoption-of-smart-home-hubs-remains-flat-at-5-of-us-internet-households-302861262.html); US$10–30/month for proactive services — [Parks](https://www.parksassociates.com/blogs/home-systems-and-controls/parks-associates-new-service-models-emerge-for-smart-home-ecosystem); Fridge Eye at US$79 — [BackerKit](https://www.backerkit.com/projects/fridge-eye-turn-your-fridge-into-a-smart-fridge)
- **Purchase-rate ceiling:** 3% of US internet households buy any smart appliance a year — [Parks](https://www.prnewswire.com/news-releases/parks-associates-23-of-us-internet-households-now-own-at-least-one-smart-appliance-up-from-15-in-2020-302448102.html)
- **Crowdfunding demand:** 220, 86 and 78 backers for comparable fridge and food-tracking gadgets — [BackerKit](https://www.backerkit.com/projects/fridge-eye-turn-your-fridge-into-a-smart-fridge); [Kickstarter FreshFridge](https://www.kickstarter.com/projects/freshfridge/freshfridge-the-affordable-smart-kitchen-ecosystem); [Kickstarter FoodTusker](https://www.kickstarter.com/projects/stevehong/foodtusker-worlds-first-truly-smart-food-container-system)
- **Caregiver inputs:** 63M caregivers, 25% using remote monitoring — [AARP](https://www.aarp.org/pri/topics/ltss/family-caregiving/caregiving-in-the-us-2025/); [CGUS technology brief](https://www.caregivingintheus.org/wp-content/uploads/2026/03/CGUS25_Technology-Use-Among-Family-Caregivers.pdf); about 15.8M US seniors living alone (vendor-cited 2024 ACS) — [RetirementLiving](https://www.retirementliving.com/aging-in-place/how-many-seniors-live-alone)

### Inferences
**Assumptions (all mine, labelled):**

| # | Assumption | Value | Basis |
|---|---|---|---|
| A1 | Households, 2026 | US 134.8M; Canada 16.5M; Alberta 1.9M | Section 1 estimates |
| A2 | Kit price | C$199 for 3 cameras | Between Fridge Eye's US$79 single camera (2019) and HNGRYnsite's €149.90 |
| A3 | Subscription | C$5/month = C$60/year | Below Parks' US$10–30 range; AI cost under C$1/month (background) |
| A4 | Hardware amortisation period | 4 years | Assumption |
| A5 | Annual revenue per household | C$199 ÷ 4 + C$60 = **C$110/year** | From A2–A4 |
| A6 | Smart-home-ready share | US 45%; Canada and Alberta 47% | Parks; StatCan |
| A7 | Accepts a camera in the fridge | 60% | Inverse of the 37–40% privacy-concerned or distrustful |
| A8 | Target fit (multi-person household, meaningful fridge waste, a priority segment) | 50% | Assumption; 71% of US households are not one-person |
| A9 | Waste reduction for engaged users | 20–30% of the fridge-forgotten 30–45% | Sections 3 and 6 |

**TAM** (theoretical ceiling: every household):

| Market | Households | Annual revenue (C$110 per household) | One-time kits only (C$199) |
|---|---|---|---|
| US | 134.8M | **C$14.8B** (US$10.6B) | C$26.8B |
| Canada | 16.5M | **C$1.81B** | C$3.28B |
| Alberta | 1.9M | **C$0.21B** | C$0.38B |

Value-at-stake cross-check for Canada: 16.5M households × C$390–585 of fridge-forgotten waste ≈ **C$6.4–9.7B a year of food** (estimate). The product would capture only a small fraction of the value it addresses.

**SAM** = households × A6 × A7 × A8:

| Market | Calculation | SAM households | SAM revenue (C$110/year) | Hardware only (C$50/year) |
|---|---|---|---|---|
| US | 134.8M × 0.45 × 0.6 × 0.5 | **18.2M** | **C$2.0B/year** | C$0.91B/year |
| Canada | 16.5M × 0.47 × 0.6 × 0.5 | **2.33M** | **C$255M/year** | C$116M/year |
| Alberta (part of Canada) | 1.9M × 0.47 × 0.6 × 0.5 | **268k** | **C$29M/year** | C$13M/year |
| Canada + US | | **20.5M** | **C$2.25B/year** | C$1.03B/year |

Caregiver niche SAM:
- US: 15.8M × 0.30 × 0.50 = **2.37M households × C$120/year = C$284M/year**.
- Canada: 1.7M (unverified) × 0.30 × 0.50 = **255k households = C$31M/year**.

**SOM** (share of the combined SAM):

| Scenario | Households | Share of SAM | Hardware revenue (cumulative) | Subscription revenue per year |
|---|---|---|---|---|
| A. Solo, part-time, direct-to-consumer, 3 years (anchored on 78–220 crowdfunding backers for comparable products) | 300–1,500 | 0.0015–0.007% | C$60k–298k | C$18k–90k |
| A′. Alberta beachhead (0.1–0.5% of Alberta SAM) | 268–1,340 | — | C$53k–267k | C$16k–80k |
| B. Funded team, 5 years | about 51k | 0.25% | C$10.2M | C$3.1M |
| C. Aggressive, 5 years | about 205k | 1% | C$40.8M | C$12.3M |

For scale on scenario C: 205k households is about **4.5% of one year's smart-appliance buyers** across both countries (3% × 151M households ≈ 4.5M). This is a loose proxy, because Parks' 3% is measured on US internet households and covers every smart-appliance category.

**Sensitivities, largest first:**
1. **The subscription.** If buyers refuse one (53% of smart-home owners pay none), SAM revenue roughly halves (C$2.25B → C$1.03B).
2. **Camera acceptance (A7) and target fit (A8).** Each ±10 points moves SAM by about ±17–20%.
3. **Churn.** Section 2 plans for 20–40% of buyers inactive in year 1, which cuts subscription revenue directly.
4. **Effect size.** At 0–10% prevention, the savings pitch collapses to under C$60 a year, leaving convenience and safety as the only reasons to buy.

**Read-through:** the market is **large on paper and thin in practice**. For a solo founder the realistic 3-year outcome is hundreds to low thousands of households. The caregiver niche (higher willingness to pay, clear safety story) and Alberta families (larger households, above-average food inflation, local reach) are the most defensible places to start.

### Gaps
- Every penetration, acceptance and target-fit percentage is an assumption; no survey measures purchase intent for a retrofit fridge camera.
- The price inputs are untested; the next evidence step would be a landing-page or pre-order test.
- Hardware cost of goods, returns and support costs are excluded (out of scope).
- The Canadian count of seniors living alone and all counts of households with children are unverified.
