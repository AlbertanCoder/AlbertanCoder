# App Stack and Architecture: Phase 1 Phone App for a Camera-Based Fridge/Pantry Tracker

*Researched 2026-10-16. The repo evidence comes from a read-only inspection of `/home/user/cut-protocol` at commit `9e1877b` (dated 2026-08-28; the clone shows only that one commit). Prices are in USD unless marked CAD. CAD figures use about 1.40 CAD per USD (see Q7). The shared web-search budget ran out partway through, and webkit.org, MDN, supabase.com, expo.dev and developers.cloudflare.com could not be fetched (DNS errors), so some platform facts rest on secondary 2026 sources. Each such case is flagged.*

## 1. What is Cut Protocol's existing stack, and what could a pantry feature connect to?

### Takeaway
Cut Protocol is a **React 19 + Vite 8 + Tailwind 4 single-page web app** on a **Node/Express 5 + Prisma 6 backend**. It runs SQLite in a Windows **Electron** desktop build and **Supabase Postgres + Supabase Auth (Google OAuth)** when hosted on **Railway** in Docker. All **Anthropic** calls are server-side, and a separate key-holding **relay** enforces spend caps. It is **not native and not a PWA**: it has no manifest and no service worker, and a Capacitor wrap was planned but never started. On **2026-08-24** the owner narrowed it to "One user. One surface. No login, no paywall." Auth, billing and the AI layer are now parked, and the app runs as a local single-user desktop app. Its grocery-list, Food-library and LLM-cost-ledger models are the natural hooks for a pantry feature.

### Cited Findings
**Frontend**
- React ^19.2.7, Vite ^8.1.1, Tailwind ^4.3, radix-ui/shadcn, recharts ^3.9, lucide-react, and `@supabase/supabase-js` ^2.112 (used for auth only). — [frontend/package.json](/home/user/cut-protocol/frontend/package.json)
- There is no PWA manifest, no service worker and no `<link rel="manifest">`. `frontend/public/` contains only `favicon.svg`, `icons.svg`, `privacy.html` and `terms.html`. — [frontend/index.html](/home/user/cut-protocol/frontend/index.html); [roadmap/08-mobile-packaging.md](/home/user/cut-protocol/roadmap/08-mobile-packaging.md) ("No PWA manifest, no service worker, no `capacitor` deps present today")
- `frontend/src/lib/api.js` is the single HTTP seam. It calls relative `/api/*` paths on the same origin as the page (Express serves the built frontend). — [frontend/src/lib/api.js](/home/user/cut-protocol/frontend/src/lib/api.js)

**Backend and database**
- Express ^5.2, Prisma ^6.19, `@anthropic-ai/sdk` ^0.111, `jose`, `jsonwebtoken`, `bcryptjs`, `cookie-parser`, on Node >= 22.13 (CommonJS). — [backend/package.json](/home/user/cut-protocol/backend/package.json)
- There are two schemas. `backend/prisma/schema.prisma` uses provider `sqlite` (dev and desktop), and `backend/prisma/postgres/schema.prisma` uses provider `postgresql`, with separate migration histories. At build time the Dockerfile flips the provider (`buildPostgresSchema.mjs --patch-main`). — [backend/prisma/schema.prisma](/home/user/cut-protocol/backend/prisma/schema.prisma); [Dockerfile](/home/user/cut-protocol/Dockerfile)
- The schema is deliberately portable: no native enums, no scalar lists, enums stored as Strings with the legal values in comments, and lists stored as Json columns. — [backend/prisma/schema.prisma header comment](/home/user/cut-protocol/backend/prisma/schema.prisma)
- The cloud database is Supabase Postgres, reached through the **session pooler, which caps at 15 clients**. Deploys have hit a pool-exhaustion deadlock because Railway keeps the old container alive during handover. — [docker-entrypoint.sh:20](/home/user/cut-protocol/docker-entrypoint.sh)
- Supabase is used **only as Postgres + Auth**: "Data API off — decided." — [BUILD_PLAN.md:124](/home/user/cut-protocol/BUILD_PLAN.md)

**Auth**
- Web build: Supabase Auth with Google OAuth via PKCE. Only the *publishable* key is in the bundle, and the secret key is backend-only. — [frontend/src/lib/supabase.js](/home/user/cut-protocol/frontend/src/lib/supabase.js); [frontend/.env.example](/home/user/cut-protocol/frontend/.env.example)
- The backend verifies Supabase JWTs locally against the project JWKS using `jose`, with no per-request call to Supabase. — [backend/src/lib/supabaseAuth.js](/home/user/cut-protocol/backend/src/lib/supabaseAuth.js)
- Desktop build: bcrypt plus an HS256 JWT in an httpOnly cookie (`cutprotocol_session`). `requireAuth` checks a Bearer token first, then the cookie. — [backend/src/lib/auth.js](/home/user/cut-protocol/backend/src/lib/auth.js)
- The Google OAuth consent screen was still in "Testing" mode as of the deploy runbook. Only test users (the owner) can sign in until others are added or the app is published. — [docs/deploy/TONIGHT-RUNBOOK.md](/home/user/cut-protocol/docs/deploy/TONIGHT-RUNBOOK.md)

**Hosting and deploy**
- Docker on Railway: `railway.json` uses the DOCKERFILE builder with healthcheck `/api/health`, and the runbook says to choose the **Hobby** plan. — [railway.json](/home/user/cut-protocol/railway.json); [docs/deploy/TONIGHT-RUNBOOK.md](/home/user/cut-protocol/docs/deploy/TONIGHT-RUNBOOK.md)
- Windows desktop: Electron ^43 with an electron-builder NSIS installer and auto-update through GitHub releases (`AlbertanCoder/cut-protocol`). — [package.json](/home/user/cut-protocol/package.json)
- The owner's 2026-08-06 audit found **no error monitoring, no transactional email, and no scheduled jobs/workers ("Nothing fires on a clock")**. Cloud backups depend entirely on Supabase. — [TEARDOWN-2026-08-06.md](/home/user/cut-protocol/TEARDOWN-2026-08-06.md) (dated August; may have changed since)

**How it calls AI**
- All LLM calls are server-side through `@anthropic-ai/sdk`. `ANTHROPIC_API_KEY` lives only in `backend/.env`. — [backend/.env.example](/home/user/cut-protocol/backend/.env.example); [backend/src/lib/brain/llm.js](/home/user/cut-protocol/backend/src/lib/brain/llm.js)
- `brain/llm.js` can route through a **relay**: it sets the SDK `baseURL` and passes a per-device token as the API key, and "RELAY WINS over a direct key when both are present." — [backend/src/lib/brain/llm.js:33-65](/home/user/cut-protocol/backend/src/lib/brain/llm.js)
- `relay/` is a separate Node service that "holds the only copy of the ANTHROPIC_API_KEY and accepts a per-device token instead." It exposes only `/healthz` and `/v1/messages`, compares tokens in constant time and keeps logs content-free. — [relay/src/server.js](/home/user/cut-protocol/relay/src/server.js)
- Relay defaults: `maxTokens` ceiling 4096, **`maxBodyBytes` 256 KB** (checked before parsing, overridable with `RELAY_MAX_BODY_BYTES`), `monthlyUsd` 20, `dailyUsd` 2, `perRequestUsd` 0.5. — [relay/src/config.js:15-22, 78](/home/user/cut-protocol/relay/src/config.js)
- The `LlmUsage` table records model, phase, input/output/cache tokens and `costUsd` per user. — [backend/prisma/postgres/schema.prisma](/home/user/cut-protocol/backend/prisma/postgres/schema.prisma)

**Current project direction (decisive for Q8)**
- "**2026-08-24 — THE MISSION CHANGED** … strip Cut Protocol back to the one thing it is for — plan meals he will actually eat and hit his macros. One user. One surface. No login, no paywall. Park everything else." — [CLAUDE.md:1-8](/home/user/cut-protocol/CLAUDE.md)
- Parked modules include login + OAuth (`SINGLE_USER=1` in `electron/main.cjs`), billing and the premium gate, the AI brain (`BRAIN=off`), and the recipe importer + AI generation. — [PARKED.md](/home/user/cut-protocol/PARKED.md); [electron/main.cjs:377](/home/user/cut-protocol/electron/main.cjs)
- `SINGLE_USER` mode **refuses to boot in hosted environments** (Railway, Render, Fly, Heroku), because it would authenticate every visitor as the owner. — [backend/src/lib/singleUser.js](/home/user/cut-protocol/backend/src/lib/singleUser.js)
- The binding decisions list includes "**DEFERRED — the AI/brain layer.** Do not re-raise unprompted." — [HANDOFF-CURRENT.md:173](/home/user/cut-protocol/HANDOFF-CURRENT.md)

**Camera status**
- Every response sets `Permissions-Policy: camera=(), microphone=(), geolocation=()`, with the comment "Nothing here uses the camera." — [backend/server.js:106](/home/user/cut-protocol/backend/server.js)
- `BarcodeLookup.jsx` does contain an optional webcam scanner (`getUserMedia({video:{facingMode:"environment"}})` + `window.BarcodeDetector`). It is labeled a "BONUS", and manual UPC entry is "the required path." — [frontend/src/components/BarcodeLookup.jsx:86-191](/home/user/cut-protocol/frontend/src/components/BarcodeLookup.jsx)

**Mobile plans already on file**
- The roadmap recommends **Capacitor** (about "a day of setup"), with a PWA manifest as a "near-zero-cost side effect." It rejects a React Native rewrite as "multi-week." It notes cookie auth breaks under Capacitor and prescribes Bearer tokens plus CORS, and says iOS is "blocked until hardware exists" (no Mac). It skips push notifications for v1 and suggests `@capacitor/local-notifications` later. — [roadmap/08-mobile-packaging.md](/home/user/cut-protocol/roadmap/08-mobile-packaging.md)

**Data models and code a pantry feature could connect to**
- `Food`: name, category, `fdcId` (USDA), `upc`, `brand`, macros, `allergenTags`. The library has 14,122 foods and there are 889 recipes. — [schema](/home/user/cut-protocol/backend/prisma/postgres/schema.prisma); [README.md](/home/user/cut-protocol/README.md)
- `Recipe` / `RecipeIngredient` (`foodId`, `baseGrams`); `Plan` / `PlanSlot` (`ingredients` Json `[{foodId,name,grams,role}]`); `GroceryList` (one per plan, `items` Json `[{foodId,name,category,grams}]`); `CartItem` (recipe cart); `MealLog` (diary). These are all **per-user** (`userId`). There is no household concept. — [schema](/home/user/cut-protocol/backend/prisma/postgres/schema.prisma)
- The grocery list builder converts cooked grams to purchase quantities, groups items into store sections (protein/dairy/spices/produce/**pantry**/other) using a keyword classifier, and adds rough CAD cost estimates. — [backend/src/lib/groceryList.js:1-4, 100-144](/home/user/cut-protocol/backend/src/lib/groceryList.js)
- Routes: `POST/GET /api/plans/:planId/grocery-list` and `PUT .../grocery-list/check`. Check state is persisted server-side "so closing the app in aisle three does not lose your place." The Shopping screen is "the thing you open standing in a shop." — [backend/src/routes/plans.js:884-923](/home/user/cut-protocol/backend/src/routes/plans.js); [frontend/src/simple/SimpleShopping.jsx](/home/user/cut-protocol/frontend/src/simple/SimpleShopping.jsx)
- Open Food Facts barcode lookup is at `GET /api/foods/lookup-upc/:upc`. — [backend/src/routes/foods.js:98](/home/user/cut-protocol/backend/src/routes/foods.js)
- Existing design principles worth reusing: "No engagement bait: no streak-shaming, no notification spam"; "Every automatic adjustment is logged, visible, and reversible"; "The user's observed data beats the model's prediction." — [CLAUDE.md Constitution](/home/user/cut-protocol/CLAUDE.md)

### Inferences
- The **front-end skills and stack carry over directly**: React, Vite, Tailwind, shadcn and an AI-coding-tool workflow. A phone-first PWA in the same stack keeps the builder in familiar territory.
- The **relay pattern transfers directly to vision calls** (one key server-side, per-device tokens, USD caps). However, its 256 KB body cap would reject a base64 photo. A re-encoded 1–2 MP JPEG is typically a few hundred KB before base64's roughly one-third overhead (estimate). The cap would need raising via `RELAY_MAX_BODY_BYTES`, or the image should be passed by URL or Files-API id (see Q4).
- Today's primary surface is a **loopback-bound Windows desktop app in SINGLE_USER mode, which cannot be hosted**. A phone in a grocery store cannot reach it. The pantry app needs a hosted backend and multi-person household auth, which are exactly the pieces the owner parked.
- `Permissions-Policy: camera=()` would make `getUserMedia` fail on any page served by that Express server. That probably also breaks the BarcodeLookup webcam path in production and Electron, though it would still work under the Vite dev server, which doesn't send the header. A pantry UI served from this server would need `camera=(self)`.
- No scheduled-job mechanism exists, so "use-soon" reminders or digests would need new infrastructure: a cron on the host, a database scheduler, or a platform cron trigger. These options were not researched (see Gaps).

### Gaps
- The clone shows a single commit dated 2026-08-28 (it may be shallow). Work done since then, and whether the Railway/Supabase deployment from 2026-08-13 is still live, could not be determined.
- The app was not run (read-only constraint), so the mobile layout of the "simple" surface was not checked on a phone.
- Whether `<input type="file" capture>` is blocked by `Permissions-Policy: camera=()` was not verified (MDN was unreachable). The working assumption is that it is not blocked, because the OS camera app does the capture, but this is unconfirmed.

## 2. PWA vs React Native/Expo vs native (Swift/Kotlin) for a camera-heavy iPhone + Android app in 2026

### Takeaway
For a household-only Phase 1, a **PWA is the cheapest and lowest-friction choice**. It needs no store fees and no Mac, and one React codebase serves both platforms. On iOS 26, anything added to the Home Screen opens as a web app by default. The PWA's weak spots are all on iOS: push notifications only work after a Home Screen install, camera permission re-prompts have been reported in standalone mode, and storage/eviction rules are murky. None of these is fatal if the server is the source of truth and the photo is taken through the OS camera. **Native Swift is out** because the builder has no Mac. **Expo/React Native** is the better choice only if reliable local notifications or richer camera control become must-haves, and it brings the 99 USD/yr Apple fee for iPhone installs. The cheapest upgrade path from a PWA is the **Capacitor wrap** that Cut Protocol's own roadmap already chose, not a rewrite.

### Cited Findings
**iOS web apps in 2026**
- In Safari 26 on iOS/iPadOS 26, **every site added to the Home Screen opens as a web app by default**. Users can untick "Open as Web App" to get a plain bookmark. Previously a site needed a manifest or meta tag requesting standalone mode. — [WebKit: Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/); [heise](https://www.heise.de/en/news/iOS-26-and-iPadOS-26-Changed-web-app-behaviour-on-the-home-screen-10749652.html); [iDownloadBlog](https://www.idownloadblog.com/2025/06/17/apple-ios-26-safari-web-apps-home-screen-bookmarks/)
- iOS has **no automatic install prompt** (`beforeinstallprompt` is not implemented), so users install manually from Share → Add to Home Screen. — [Mobiloud 2026 guide](https://www.mobiloud.com/blog/progressive-web-apps-ios/); [TapPWA 2026](https://tappwa.com/blog/ios-pwa-limitations-2026). Cut Protocol's roadmap makes the same point: "no install prompt on iOS the way there is on Android/Chrome." — [roadmap/08-mobile-packaging.md](/home/user/cut-protocol/roadmap/08-mobile-packaging.md)
- **Web Push on iOS works only for web apps installed to the Home Screen**, and the permission request must follow a user interaction. One source lists Declarative Web Push as new in iOS 18.4. — [Mobiloud](https://www.mobiloud.com/blog/progressive-web-apps-ios/); [TapPWA](https://tappwa.com/blog/ios-pwa-limitations-2026) (secondary sources; WebKit's own post could not be fetched)
- iOS has **no Background Sync** for PWAs. — [TapPWA](https://tappwa.com/blog/ios-pwa-limitations-2026); [Brainhub](https://brainhub.eu/library/pwa-on-ios)
- **Storage and eviction: the sources conflict.** Some cite a fixed 50 MB Cache API cap per partition. Others say WebKit's current policy allows an origin quota of up to about 60% of disk (80% across all origins). Some say the 7-day script-writable storage cap still applies, while others say it never applied to Home Screen web apps. All agree Safari may evict less-used origins under storage pressure, and that `navigator.storage.persist()` exists. — [Synthetixis 2026](https://synthetixis.com/writing/pwa-ios-2026); [TapPWA](https://tappwa.com/blog/ios-pwa-limitations-2026); [Brainhub](https://brainhub.eu/library/pwa-on-ios) (conflicting secondary sources; the WebKit storage-policy post was unreachable)

**Camera in the browser**
- WebKit bug 215884 (2020) reports that Home Screen web apps **revoked camera permission whenever the URL hash changed**, while the same page in Safari kept its stream. Commenters reported re-prompts on every route change in router-based apps. The workarounds were to keep one persistent stream or avoid hash routing. — [WebKit bug 215884](https://bugs.webkit.org/show_bug.cgi?id=215884) (old, flagged)
- More recent reports describe Safari on iOS intermittently re-prompting for camera access between routes on the same origin (Apple Developer Forums), and a post-iOS 26 report of some Home Screen web apps showing the **camera sideways**. — [Apple Developer Forums, camera tag](https://developer.apple.com/forums/tags/camera); [Apple Community thread on repeated camera prompts in web apps](https://discussions.apple.com/thread/256081579)
- Barcode-SDK vendor Scandit keeps a support article titled "Why does iOS keep asking for camera permissions?", which suggests the repeated prompt is a known, long-running annoyance. — [Scandit support](https://support.scandit.com/hc/en-us/articles/360008443011-Why-does-iOS-keep-asking-for-camera-permissions)
- Cut Protocol already uses `getUserMedia({video:{facingMode:"environment"}})` plus `BarcodeDetector`, and treats it as an optional extra rather than the main path. — [frontend/src/components/BarcodeLookup.jsx](/home/user/cut-protocol/frontend/src/components/BarcodeLookup.jsx)

**Native and Expo**
- iOS native builds (including Capacitor's iOS target) "require a Mac + Xcode", and the builder has no Mac. — [roadmap/08-mobile-packaging.md](/home/user/cut-protocol/roadmap/08-mobile-packaging.md)
- Expo: the SDK and CLI are free. The **EAS Free plan gives 15 Android + 15 iOS cloud builds per month** (changed from 30 on 2025-10-09), with a low-priority queue that can wait 90+ minutes at peak and a 45-minute build timeout. Starter is $19/mo with $45 of build credit, and Production is $199/mo. — [Cadrant (dated 2026-10-13)](https://cadrant.ai/blog/eas-build); [AgentDeals](https://agentdeals.dev/vendor/expo). Older pages still say 30 free builds: [WaveMaker docs](https://docs.wavemaker.ai/docs/build-and-deploy/build/mobile/expo/); [PkgPulse](https://www.pkgpulse.com/guides/expo-eas-vs-fastlane-vs-bitrise-react-native-cicd-2026). expo.dev/pricing could not be fetched.

**Personal-use distribution: Apple**
- "The Apple Developer Program annual fee is **99 USD** … in local currency where available. Prices may vary by region and are listed in local currency during the enrollment process." Without enrolling, an Apple Account gives access to Xcode and lets you "test your apps on your devices". Enrollment is needed "to distribute apps [and] access beta software." — [Apple Developer: Enrollment](https://developer.apple.com/support/enrollment/)
- Apple's fee waivers cover nonprofits, accredited education and government. **Individuals and sole proprietors are excluded.** — [iMore (2020)](https://www.imore.com/apple-extends-developer-membership-fee-exemptions-australia-canada-and-more) (old, flagged)
- A **free Personal Team** allows up to 10 App IDs and 3 devices. **Provisioning profiles expire after 7 days**, after which the app must be rebuilt and reinstalled from Xcode, and there is a limit of 3 apps per device. — [Apple: Compare memberships](https://developer.apple.com/support/compare-memberships/) (via search summary)
- TestFlight allows **up to 100 internal testers** (team members with an App Store Connect role) and **up to 10,000 external testers**. The first build shared externally needs App Review for TestFlight. Testers can install on up to 30 devices, and up to 100 builds can be shared. — [Apple: TestFlight](https://developer.apple.com/testflight/)

**Personal-use distribution: Google**
- Google Play charges a **US$25 one-time registration fee** and requires government ID and a credit card in your legal name. The fee is not refunded if the ID is invalid. — [Play Console Help](https://support.google.com/googleplay/android-developer/answer/6112435)
- New personal Play accounts (created after 2023-11-13) must run a **closed test with at least 12 testers opted in for 14 continuous days** before getting production access. — [Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465)
- Android developer verification: limited-distribution accounts for **students and hobbyists** (share with **up to 20 devices**, "no government ID required") and an "advanced flow" for power users launched globally in **August 2026**. From **2026-09-30**, apps installed on certified devices in **Brazil, Indonesia, Singapore and Thailand** must be registered, but "Unregistered apps can be sideloaded with ADB or advanced flow." The requirement goes global in **2027**. A 2026-09-29 correction says the September rollout covers "participating stores" in "select regions." — [Android Developers Blog](https://developer.android.com/blog/posts/android-developer-verification-rolling-out-to-all-developers-on-play-console-and-android-developer-console); also [Foresight Mobile](https://foresightmobile.com/blog/android-developer-verification-2026) (direct downloads unaffected until 2027)

**Image limits that shape client-side capture**
- Claude accepts JPEG, PNG, GIF and WebP up to 8000×8000 px and **10 MB per image (base64) on the direct API**, with a 32 MB request limit. Images are downscaled to a **1568 px long edge on standard models, or 2576 px on Claude 4.7 and later**. Cost is ⌈w/28⌉×⌈h/28⌉ visual tokens. — [Claude docs: Vision](https://platform.claude.com/docs/en/build-with-claude/vision)

### Inferences
- **The best camera path for a PWA is probably `<input type="file" accept="image/*" capture="environment">`.** It opens the phone's own camera app (full resolution, OS autofocus, flash and HDR) and hands the file back. That sidesteps the standalone-mode `getUserMedia` re-prompt and orientation bugs above. This is based on general platform knowledge and could not be re-verified this session because MDN and WebKit were unreachable. Use `getUserMedia` only if a live in-app viewfinder is needed, for example for shelf-framing guides. If so, open one persistent stream per scan session and avoid hash/route changes while it is open.
- Before upload, resize on the client to a long edge of about 1568–2576 px (matching Claude's native maximums) and re-encode as JPEG or WebP at roughly 0.8 quality. This keeps uploads small on store LTE and caps vision tokens. Larger images are downscaled server-side anyway, so they cost bandwidth for no benefit.
- **Install friction is minor for 2–4 household members.** On iPhone it is a one-time Share → Add to Home Screen (and iOS 26 makes that a web app by default). On Android, Chrome can prompt to install.
- **The real PWA gap is notifications.** iOS web push needs the Home Screen install and a user-gesture permission, and it is the most fragile piece. For Phase 1 a pull-first design, plus an optional weekly email digest or iOS web push, avoids depending on it. This also matches Cut Protocol's "no notification spam" rule.
- **Distribution costs, personal use:**

  | Route | Cost |
  |---|---|
  | PWA, both platforms | $0 |
  | Android APK sideload | $0 (Canada not in the 2026 verification wave; ADB and advanced flow remain; hobbyist account allows 20 devices) |
  | Play Store | US$25 once + the 12-tester/14-day closed test, which is awkward for a household of 3 |
  | iPhone native/Expo/Capacitor via TestFlight | 99 USD/yr ≈ CAD 139/yr before tax |
  | Free Xcode provisioning | Needs a Mac; reinstall every 7 days |

- **Expo is the pick only if:** reliable *local* scheduled notifications are wanted (a PWA has no local-notification scheduling), or a richer in-app camera, or background uploads from Phase 2 tooling. EAS cloud builds remove the Mac requirement for *building*, but installing on an iPhone still needs the paid Apple program.
- **Native Swift/Kotlin** would mean two codebases and a Mac, with no benefit at this scale. Rejected.

### Gaps
- Primary WebKit/MDN documentation on `capture`, `getUserMedia`, the storage policy and Web Push requirements was unreachable (DNS). The findings above rely on secondary 2026 blogs, which conflict on storage.
- TestFlight build expiry (commonly cited as 90 days) is not stated on Apple's TestFlight page and was not confirmed.
- The exact CAD price Apple shows at enrollment in Canada was not found. Apple only says "local currency where available."
- Expo Go limits and whether `expo-camera`/`expo-notifications` work in Expo Go without a development build were not researched (search budget exhausted).
- No source compares in-browser `getUserMedia` frame quality with native capture for item recognition.

## 3. Backend options for a hobbyist: free tiers, photo storage, household sharing, realtime

### Takeaway
**Supabase** fits best. The builder already uses Supabase Auth and Postgres for Cut Protocol, and the free tier gives **500 MB of database, 1 GB of file storage, 5 GB of egress and 2 projects**. Its main catch is that **free projects pause after one week of inactivity**, which matters for an app that might sit unused while a family is away. **Cloudflare Workers + R2 + D1** is the cheapest at scale, with zero egress and no pausing, but auth has to be built separately and the runtime is new to the builder. **PocketBase** is the simplest single binary but means running a VPS. **Firebase** now requires the pay-as-you-go **Blaze** plan for Cloud Storage. Photo volume for one household is tiny, so any of these fits within free storage if photos are resized and old ones deleted.

### Cited Findings
**Supabase**
- Free plan: **2 active projects, 500 MB database per project, 50,000 MAU, 1 GB file storage, 5 GB egress (+5 GB cached egress)**. Projects **pause after one week without database activity**; data is kept and can be restored with one click. One comparison table lists **no backups** on Free. — [UI Bakery 2026](https://uibakery.io/blog/supabase-pricing); [MakerKit 2026](https://makerkit.dev/blog/saas/supabase-pricing); [DesignRevision 2026](https://designrevision.com/blog/supabase-pricing) (secondary; supabase.com/pricing unreachable)
- Pro costs **$25/org/month**. Guides report about 8 GB database, 100 GB storage, 250 GB egress and 100k MAU, plus a compute credit (described as $10) and no pausing. Sources disagree on the credit details. — [MakerKit](https://makerkit.dev/blog/saas/supabase-pricing); [CloudZero](https://www.cloudzero.com/blog/supabase-pricing/)
- Cut Protocol's own notes propose a free **UptimeRobot check every 5 minutes** that "doubles as the database touch that stops the Supabase free tier pausing after ~a week of low activity." — [V2-DELTA.md:249](/home/user/cut-protocol/V2-DELTA.md). The same repo's audit says the free tier is "7-day PITR at best" — [TEARDOWN-2026-08-06.md](/home/user/cut-protocol/TEARDOWN-2026-08-06.md). **This conflicts with** the third-party "no backups on Free".
- Edge Functions keep the provider key as a function secret (`supabase secrets set …`). Supabase's built-in gateway limits are **per project, not per user**, so per-user limits need a Postgres counter table that returns 429. One third-party page lists a 10 MB maximum Edge Function payload (unverified). — [RWIT](https://www.rwit.io/blog/supabase-edge-functions-ai-microservices/); [RapidDevelopers](https://rapidevelopers.com/supabase-tutorial/how-to-limit-api-requests-in-supabase)

**Firebase**
- **Cloud Storage for Firebase has required the Blaze plan since 2026-02-03, even at minimal volumes.** Blaze has no plan fee and keeps the no-cost allowances, so a quiet app can bill $0. On new `*.firebasestorage.app` buckets, the no-cost quotas apply only in us-central1, us-west1 and us-east1. Sources conflict on legacy `*.appspot.com` buckets. — [DEV Community: Spark vs Blaze](https://dev.to/androve2k/spark-vs-blaze-the-firebase-pricing-guide-i-wish-id-read-sooner-onb); [Flozic review](https://www.flozic.ai/blog/reviews/firebase-cloud-storage-review); [Omid Saffari](https://omidsaffari.com/blog/firebase-pricing) (secondary)

**Cloudflare**
- Workers Free allows **100,000 requests per day** and **10 ms CPU per HTTP request**. — [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits)
- D1 Free allows a 500 MB maximum database, 5 GB total per account, 10 databases and 50 queries per Worker invocation. **From 2026-09-01, D1 queries on the Free plan fail once the daily row-read/row-write limits are exceeded.** — [Cloudflare D1 limits](https://developers.cloudflare.com/d1/platform/limits/); [Cloudflare changelog 2026-09-01](https://developers.cloudflare.com/changelog/post/2026-09-01-d1-free-tier-limit-enforcement/)
- R2 Free gives 10 GB storage, 1M Class A and 10M Class B operations per month, and **zero egress fees**. — [Easton Dev (2026-05-26)](https://eastondev.com/blog/en/posts/dev/20260526-cloudflare-free-limits/) (secondary; the official R2 pricing page was unreachable)

**PocketBase**
- PocketBase is self-hosted only and scales only vertically on one server. Its FAQ claims it "can easily serve 10 000+ persistent realtime connections on a cheap $4 Hetzner CAX11 VPS." — [PocketBase FAQ](https://pocketbase.io/faq/)
- It is a single Go binary on SQLite with auth, realtime subscriptions and file uploads with thumbnails. Files are stored locally by default, with S3-compatible storage optional. It is **pre-1.0**, and SQLite has a single writer. Typical VPS cost is $4–10/month. — [Vibe Code with Matt](https://www.vibecodewithmatt.com/tools/pocketbase); [MakerStack](https://makerstack.co/reviews/pocketbase-review/); [DevMorph](https://www.devmorph.dev/blogs/stop-paying-for-supabase-self-hosted-pocketbase); [Railway template (\$5–10/mo)](https://railway.com/deploy/pocketbase-updated-sep-26--pocketbase)

**Railway (Cut Protocol's current host)**
- Hobby costs **$5/month and includes $5 of usage**. The fee is owed even with zero usage, and usage beyond the credit is billed. — [Railway docs: Pricing](https://docs.railway.app/reference/pricing). One secondary source puts usage rates at about $20/vCPU-month and $10/GB-month of RAM. — [LiveMyApp](https://livemy.app/blog/railway-pricing)

**Vision-API input options**
- Claude accepts images as **base64, a URL, or a Files-API `file_id`**. — [Claude docs: Vision](https://platform.claude.com/docs/en/build-with-claude/vision)

### Inferences
**Recommended backend: a separate Supabase project.** Cut Protocol uses one free project, and the pantry app would be the second free one.
- **Auth:** Supabase Auth with Google sign-in (already familiar) or email magic links for household members. If Google is used, each household member must be added as a test user while the OAuth app is in Testing.
- **Database:** Postgres with **Row-Level Security keyed on household membership**. Unlike Cut Protocol, turn the Data API **on**, so the PWA can read and write with `supabase-js` directly and no custom CRUD server is needed.
- **Storage:** a **private Storage bucket** for photos.
- **AI call:** **one Edge Function** (`/scan`) as the only place the vision key exists.

**Alternative if the builder prefers his Node code:** a small Express service on Railway Hobby (~$5/mo) reusing `brain/llm.js` and the relay ideas, with Supabase providing only Auth, Postgres and Storage, which is Cut Protocol's pattern. Use a **separate** Supabase project or pooler budget, given the 15-client session-pooler deadlock already seen in Cut Protocol.

**Household sharing:**
- Use `households` and `household_members` tables (see Q5), with every inventory row carrying `household_id`.
- RLS policy idea: `household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())`.
- Invite people with a one-time code or link. This is the standard Supabase multi-tenant pattern, but no 2026 source was retrieved for it.

**Realtime is optional.** With 2–4 people, refetch on app focus plus a "pull to refresh" is enough. Supabase Realtime (Postgres changes) can be added later so a spouse's scan appears live.

**Photo storage sizing (estimates):**
- About 300 KB per resized photo means 1 GB holds about 3,000+ photos.
- A household taking ~15 photos a week (fridge, freezer, pantry; a couple of shelves each) adds roughly 230 MB a year without deletion, or about 60 MB with a 90-day retention policy.
- **Storage won't be the constraint on any free tier. Pausing and backups are the real Supabase-free risks.**

**Comparison:**
- **Cloudflare Workers + R2 + D1** has no pausing and zero egress. The costs are a new runtime (Workers), D1's SQLite dialect and the 2026-09-01 hard daily row limits, and building auth yourself. It is a good fit for the Phase 2 ESP32 upload endpoint, but more net-new learning for Phase 1.
- **PocketBase** puts everything in one binary. It is best if the builder wants to own a $4–6 VPS, but backups, TLS and upgrades of a pre-1.0 project become his chores.
- **Firebase** needs a billing account on Blaze for Storage (bill-shock risk; set budget alerts), and moves the builder off SQL and Prisma.

### Gaps
- Official Supabase, Cloudflare R2 and Expo pricing pages could not be fetched. Supabase's free-tier realtime, Edge Function invocation quotas and image-transformation availability are unconfirmed.
- No source was retrieved for Supabase signed upload URLs or the household RLS policy syntax as of 2026.
- Supabase Free backup behavior is unclear (conflicting sources).
- Whether a keep-alive ping is acceptable under Supabase's terms was not checked.

## 4. Security: keeping the AI key out of the client, proxy patterns, rate limiting, and photo privacy

### Takeaway
The phone and the future ESP32 camera must **never hold the vision API key**. They upload a photo to private storage and call a **server-side function**. That function checks household membership and quotas, calls the vision API with a key kept in server secrets, and stores only structured results. Cut Protocol already implements the hard parts of this pattern: the key in one place, per-device tokens assumed extractable, and USD caps enforced server-side. On privacy, keep the bucket private, strip metadata, auto-delete photos after weeks rather than keeping them forever, and avoid "free tier" AI APIs whose terms allow human review of inputs.

### Cited Findings
- Cut Protocol's relay trust model: "the device token sits on a user's machine and must be assumed extractable. **Everything enforced on the client is therefore advisory.** The limits that actually bound the bill — model allowlist, max_tokens ceiling, USD caps — live here, and only here." — [relay/src/server.js:1-13](/home/user/cut-protocol/relay/src/server.js)
- Its caps are `dailyUsd` 2, `monthlyUsd` 20 and `perRequestUsd` 0.5. The body-size cap is enforced as bytes arrive, before parsing, and tokens are compared via SHA-256 + `timingSafeEqual`. — [relay/src/config.js](/home/user/cut-protocol/relay/src/config.js); [relay/src/server.js](/home/user/cut-protocol/relay/src/server.js)
- Cut Protocol's frontend env file warns never to put the secret (`sb_secret_…`) key in the bundle. — [frontend/.env.example](/home/user/cut-protocol/frontend/.env.example)
- Its Express throttles bucket on `req.ip`, and behind Railway's proxy that needs `TRUST_PROXY=1`. Otherwise all callers collapse into one bucket. — [backend/server.js (trust-proxy comment)](/home/user/cut-protocol/backend/server.js)
- Supabase Edge Function pattern:
  - Store the model key as a function secret; the browser receives only the project URL and public key.
  - Validate the Supabase access token inside the function.
  - Enforce ownership in queries.
  - Apply per-user limits (Postgres counter table → 429) before calling the model.

  — [RWIT](https://www.rwit.io/blog/supabase-edge-functions-ai-microservices/); [RapidDevelopers](https://rapidevelopers.com/supabase-tutorial/how-to-limit-api-requests-in-supabase)
- **Claude vision privacy notes:**
  - "Claude does not parse or receive any metadata from images passed to it."
  - "Image uploads are ephemeral and not stored beyond the duration of the API request."
  - "Anthropic does not use uploaded images to train models."
  - Claude "cannot be used to name people in images and refuses to do so."

  — [Claude docs: Vision (FAQ and Limitations)](https://platform.claude.com/docs/en/build-with-claude/vision)
- **Retention conflict:** Anthropic's privacy center says API inputs and outputs are removed "within 30 days," with exceptions for the Files API, zero-data-retention agreements, and Usage Policy flags (up to 2 years for flagged content). — [Anthropic Privacy Center](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data) (via search summary). A third-party blog says API log retention dropped to **7 days on 2025-09-14**. — [Char blog](https://char.com/blog/anthropic-data-retention-policy). This is unresolved.
- **Gemini API free tier:** Google may use inputs and outputs to improve products, and "human reviewers may read, annotate, and process your API input and output." Paid-tier data is not used this way. — [Simon Willison on Gemini terms (Oct 2024, older)](https://simonwillison.net/2024/Oct/17/gemini-terms-of-service/); [GeoToolbox 2026](https://geotoolbox.ai/blog/gemini-api-pricing.md)
- Claude allows up to 10 MB per image (base64, direct API) and a 32 MB request limit. It also offers the **Files API** (upload once, reference by `file_id`) and **URL** image sources. — [Claude docs: Vision](https://platform.claude.com/docs/en/build-with-claude/vision)
- For the commercial version, Cut Protocol's notes treat **Alberta PIPA** as the primary privacy statute, not PIPEDA. — [V2-DELTA.md (P3 — legal and copy)](/home/user/cut-protocol/V2-DELTA.md)

### Inferences
**Reference flow:**
1. The client resizes the photo, strips metadata and uploads it to `photos/{household_id}/{scan_id}/{n}.jpg` in a **private** bucket. RLS allows writes only to the uploader's household.
2. The client calls `POST /scan {scan_id}` with its Supabase JWT.
3. The function verifies the JWT and household membership, checks quotas, loads the photos server-side, and calls the vision API with the secret key. It can send base64, which fits easily under 10 MB after resizing, or a **5-minute signed URL**, which keeps a Cut-Protocol-style relay under its 256 KB body cap.
4. The function validates the JSON output against a schema, writes `sightings`, logs tokens and cost (like `LlmUsage`), and returns the diff.

**Rate limiting** (Cut Protocol's relay defaults are a sane template):
- Per household: about 20–30 scans a day, at most 4–6 photos per scan, a daily and monthly USD cap, and a per-request token ceiling.
- Rejects: oversize images and repeated identical images (dedupe by sha256).
- Client: disable the button while busy (advisory only).

**Phase 2 device auth:** give each ESP32-CAM its **own revocable device token**, stored hashed in a `devices` table and scoped to "upload to household X, location Y". It must never hold the AI key or the Supabase service-role key. This reuses the relay's "assume the token is extractable" stance.

**Photo privacy:**
- Keep the bucket private and serve photos only through short-lived signed URLs.
- Re-encode on the client through a canvas, which drops EXIF including GPS. This is general knowledge and was not verified this session.
- **Auto-delete photos after about 30–90 days** while keeping the extracted item rows. Keep only the latest photo per location for the "show me the shelf" view.
- Offer "delete all photos now".
- People can appear in frame. The app should frame shots at shelves, the model won't identify faces, and nothing should be sent to any face or person-recognition service.

**Provider choice for privacy:** use a paid API tier. Avoid Gemini's free tier for household photos because its terms allow human review. If Anthropic's retention is a concern, the conservative reading is "up to 30 days" until Anthropic's own page confirms 7.

### Gaps
- Anthropic's current API retention period (30 vs 7 days) could not be confirmed from a primary source; privacy.claude.com was unreachable by fetch.
- Whether Alberta PIPA or PIPEDA applies at all to a purely household, non-commercial tool was not researched.
- Exact EXIF-stripping behavior of canvas re-encoding in iOS Safari, and whether iOS strips GPS from photos shared through a file input, were not verified.
- OpenAI's vision-API retention terms were not researched (provider choice is covered elsewhere).

## 5. Proposed data model (scans, photos, items, sightings, corrections, locations, shelf-life categories)

### Takeaway
Model the problem as **append-only observations** (scans → photos → sightings) feeding a **derived inventory** (items with `first_seen` and `last_seen`), plus a **corrections log** that the diff engine respects. Shelf life comes from **USDA FoodKeeper** categories, with fridge, freezer and pantry times, keyed by location type. "Probably have / not sure / probably out" and "day 9, check it" are **computed**, not stored. Absences should be treated cautiously: a single missed sighting means "not sure", not "gone", because items get hidden behind each other.

### Cited Findings
- **USDA FSIS FoodKeeper** data is a free JSON file (`foodkeeper.json`, plus Excel and Spanish/Portuguese versions) under a **CC0** license. It covers **400+ foods and beverages** with **pantry, refrigerator and freezer storage timelines**, and ships with a PDF data dictionary. Catalog snapshots disagree on last-modified dates (2023-06-21 vs 2025-05-08). — [Data.gov: FSIS FoodKeeper Data](https://catalog.data.gov/dataset/fsis-foodkeeper-data); [USDA announcement](https://www.usda.gov/node/20090)
- There is precedent: the open-source pantry app Proviant has a feature request to suggest default shelf life from the product category using FoodKeeper. — [Proviant issue #303](https://zff.dev/isotop7/proviant/issues/303)
- Samsung's AI Vision Inside fridge "identifies the types of foods and tracks their movement in and out of the fridge," generating the contents list automatically. **Expiration dates are entered manually.** — [Tom's Guide (2024)](https://www.tomsguide.com/news/samsung-unveils-2024-bespoke-family-hub-refrigerator-with-vision-ai-heres-what-it-can-do) (2024 model; older)
- Claude "can give approximate counts … but might not always be precisely accurate, especially with large numbers of small objects", and "might hallucinate or make mistakes when interpreting low-quality, rotated, or very small images under 200 pixels." — [Claude docs: Vision](https://platform.claude.com/docs/en/build-with-claude/vision)
- Cut Protocol's conventions: `cuid` string IDs, enums stored as `String` with the legal values in a comment, lists as `Json`, and a law that "every automatic adjustment is logged, visible, and reversible." — [schema.prisma header](/home/user/cut-protocol/backend/prisma/schema.prisma); [CLAUDE.md](/home/user/cut-protocol/CLAUDE.md)

### Inferences
#### Proposed schema (Postgres/Supabase; easy to express in Prisma)

| Table | Key columns | Notes |
|---|---|---|
| `households` | id, name, timezone (default `America/Edmonton`), created_at | The unit of sharing |
| `household_members` | household_id, user_id (→ auth.users), role (`owner`/`member`), joined_at | Drives RLS |
| `locations` | id, household_id, name ("Main fridge"), **kind** (`fridge`/`freezer`/`pantry`/`door`/`drawer`/`other`), parent_location_id (e.g. door → fridge), storage_basis (`refrigerator`/`freezer`/`pantry`), sort_order | `storage_basis` selects the FoodKeeper column |
| `devices` *(Phase 2)* | id, household_id, location_id, name, token_hash, last_seen_at, revoked_at | ESP32-CAM auth |
| `scans` | id, household_id, location_id, **source** (`phone`/`device`), user_id or device_id, captured_at, **status** (`uploaded`/`processing`/`needs_review`/`confirmed`/`failed`), baseline_scan_id (previous scan compared against), model, prompt_version, input_tokens, output_tokens, cost_usd, error | One scan = one location at one moment (1–n photos) |
| `photos` | id, scan_id, storage_path, width, height, bytes, sha256, delete_after (retention), deleted_at | Rows outlive the file (path nulled on delete) |
| `shelf_life_categories` | id, name ("leafy greens"), fridge_days_min/max, freezer_days_min/max, pantry_days_min/max, after_opening_fridge_days, source (`foodkeeper`/`custom`), foodkeeper_id | Seeded from `foodkeeper.json` |
| `item_types` | id, household_id (null = global), canonical_name ("spinach"), aliases (json), shelf_life_category_id, default_location_kind, **cp_food_id** / fdc_id / upc (optional links to Cut Protocol `Food`) | Controlled vocabulary; prevents "baby spinach" vs "spinach" drift |
| `items` | id, household_id, location_id, item_type_id, display_name, qty_estimate (text, e.g. "~3", "half"), **first_seen_at**, first_seen_scan_id, **last_seen_at**, last_seen_scan_id, **missed_scans** (int), **status** (`present`/`not_sure`/`probably_gone`/`gone`/`used`/`tossed`), opened_at, use_by_override (user date), age_unknown (bool, true for items found on the very first scan) | The inventory "lot"; a re-buy after `gone` starts a new row (new first_seen) |
| `sightings` | id, scan_id, photo_id, item_id (null until matched), label_raw, item_type_id (guess), qty_estimate, confidence, bbox (json, optional), match (`matched`/`new`/`ambiguous`) | Raw model output, kept small and forever (cheap) |
| `corrections` | id, household_id, user_id, scan_id, target (`item`/`sighting`), target_id, **action** (`confirm`/`rename`/`merge`/`split`/`not_food`/`mark_gone`/`mark_used`/`moved`/`set_date`/`opened`), before (json), after (json), created_at | Event log; also used to teach naming (aliases) and to suppress repeat mistakes |
| `shopping_items` | id, household_id, name, item_type_id, source (`manual`/`ran_out`/`cut_protocol`), checked, created_at | Or link to Cut Protocol's `GroceryList.items` by food id |
| `usage_ledger` | id, household_id, scan_id, model, tokens, cost_usd, created_at | Mirrors Cut Protocol `LlmUsage` for caps |

#### Diff and status logic (computed)
1. **Prompt with context.** Send the photo(s) together with *the list of items currently believed to be at that location*. Ask the model to reuse those names when it sees them, and to return `{name, category, qty_estimate, confidence}` as JSON. This keeps names stable and makes "still here" matching simple.
2. **Match** detections to open items at the location by `item_type` (alias table first, fuzzy match second).
   - Matched items get `last_seen_at = captured_at` and `missed_scans = 0`.
   - Unmatched detections become **New** items (`first_seen_at = captured_at`).
3. **Absence is soft.** An open item not detected gets `missed_scans += 1`.
   - 1 miss → `not_sure` (it may be hidden behind the milk).
   - 2+ consecutive misses, or a user tap → `probably_gone`.
   - A user confirmation → `gone`/`used`/`tossed`.
4. **Moves and re-buys.**
   - A `gone` item at L1 plus a new same-type item at L2 within about 24 h → suggest "moved?" and keep the original `first_seen`.
   - The same type reappearing after `gone` → a new lot.
5. **Age and freshness.**
   - `days_here = today − first_seen_at`. Items from the first-ever scan get `age_unknown` and show as "day ≥ N".
   - `use_by = first_seen_at + shelf_life_max(storage_basis)`, unless overridden.
   - Thresholds: "check it" at ≥ min shelf life, "use soon" at ≥ ~75% of max, "past typical" beyond max. Example: spinach in the fridge on day 9 shows "check it".
6. **Store-view buckets.**
   - **Probably have:** seen in the latest scan of its location, and that scan is recent (e.g. ≤ 7–10 days).
   - **Not sure:** 1 miss, a stale scan, or past typical shelf life.
   - **Probably out:** `probably_gone`, `gone`, `used`, or `tossed`.
7. **Phase 2 fit.** Device scans are the same `scans` rows with `source='device'`. Fixed angles make diffs more reliable, but frequent captures need debouncing (e.g. at most one processed scan per location per N minutes, and skipping images whose perceptual hash hasn't changed).

### Gaps
- FoodKeeper JSON field names and structure were not inspected (the file was not downloaded). The column mapping above (min/max per storage type, after-opening times) is assumed from the dataset description.
- No published evaluation was found of vision-model accuracy on cluttered fridge shelves, which would inform the confidence thresholds and the 2-miss rule.

## 6. Which UX patterns keep upkeep low?

### Takeaway
Upkeep is what kills pantry apps. Manual systems like Grocy get dropped because "the effort involved simply outweighs the benefits," and even $3,600 camera fridges still rely on people typing expiry dates. The low-upkeep recipe:
- Scanning is a **10-second habit attached to putting groceries away**.
- The AI proposes a **diff** that is **accepted by default** with **one-tap fixes**.
- **No one enters dates.** First-seen is the clock and FoodKeeper supplies typical shelf life.
- The **store view** shows honest confidence buckets.
- Notifications are a **single calm digest**, not nags.

### Cited Findings
- **Grocy abandonment:** a Galaxus/Digitec writer dropped Grocy after about a week, saying "the effort involved simply outweighs the benefits." They described it as "semi-professional warehouse logistics" with barcode-based stocktaking. — [Galaxus](https://www.galaxus.de/en/page/how-i-want-to-digitise-the-contents-of-my-fridge-and-fail-to-do-so-39565)
- **Samsung AI Vision Inside (2024):** internal cameras identify food "as they come and go" and generate the contents list automatically. It recognizes up to **33 fresh food items** (trained on about 1M food photos). **Expiration dates are entered manually** and alerts fire near expiry. A reviewer doubted they'd ever add expiry dates. — [Tom's Guide](https://www.tomsguide.com/news/samsung-unveils-2024-bespoke-family-hub-refrigerator-with-vision-ai-heres-what-it-can-do) (2024; 2025–26 model changes not found)
- A receipt-scanning app's own comparison says smart-fridge cameras still depend on "someone tagging each item with a date." — [Fango](https://fango.fi/en/blog/smart-fridge-vs-food-tracking-app/) (vendor)
- **FridgeBuddy:** "photograph a fridge shelf or scan a receipt" to create inventory items, with multi-product single-photo capture listed as new on supported devices. Rated 4.6 from 208 ratings. — [App Store listing](https://apps.apple.com/us/app/pantry-fridge-fridgebuddy/id1500190823) (via search summary)
- **Recipy** (self-ranked first in its own test) advertises multi-item camera scans per photo and **7/3/0-day expiry alerts**. PantryAI is subscription-only. SuperCook added a fridge-photo scan in 2026 for recipe search, not inventory. — [Recipy blog](https://recipyapp.com/blog/best-pantry-tracking-apps-2026); [Eatvora list](https://www.eatvora.app/best/best-food-inventory-app) (vendor content)
- Bosch's HomeConnect Vision fridge (~$3,600) updates inventory from camera scans when the door closes. — [LifeToolsLab](https://lifetoolslab.com/best-smart-refrigerators-ai-inventory-2026/) (secondary listicle)
- Patterns Cut Protocol already uses:
  - The shopping list is a dedicated "door" you open in the store, with check state kept server-side. — [SimpleShopping.jsx](/home/user/cut-protocol/frontend/src/simple/SimpleShopping.jsx)
  - "One-tap 'ate as planned'" logging. — [HANDOFF-CURRENT.md](/home/user/cut-protocol/HANDOFF-CURRENT.md)
  - "No streak-shaming, no notification spam." — [CLAUDE.md](/home/user/cut-protocol/CLAUDE.md)
  - Skip push for v1; add one opt-in local reminder later. — [roadmap/08-mobile-packaging.md](/home/user/cut-protocol/roadmap/08-mobile-packaging.md)
- Claude's counts are approximate and it errs on low-quality or rotated images, so the UI must make correction cheap. — [Claude docs: Vision](https://platform.claude.com/docs/en/build-with-claude/vision)

### Inferences
**Fast scan flow (target under 15 s per location):**
- Open the app to a big **Scan** button. The location chips (Fridge / Freezer / Pantry) remember the last one used.
- The OS camera opens. Allow 1–4 shots (e.g. "top shelf, bottom shelf, door").
- Upload in the foreground with a progress chip. The user can put the phone down, and results arrive in seconds.
- Prompt at the right moment: a "Just got home with groceries?" home-screen hint, or a scheduled weekly nudge.

**One-tap diff review:**
- The card shows **New (+5)**, **Gone? (−3)** and **Still here (12, collapsed)**.
- Each row has ✓ (default), ✎ (pick from 3 suggestions or type) and ✕ ("not food / wrong").
- A big **"Looks right"** accepts everything. Unreviewed diffs auto-accept after about 12–24 h but stay flagged as lower confidence.
- "Gone?" rows offer **Used it / Tossed it / Still there**. "Tossed" feeds an optional waste count.

**No date entry:**
- First-seen drives "day N". FoodKeeper drives "use soon / check it".
- Optional long-press actions: "opened today" (switches to after-opening times) and "set date" for the rare item with a printed date the user cares about.

**At-the-store view:**
- Group items by store section (reuse Cut Protocol's produce/protein/dairy/pantry classifier) into **Probably have / Not sure / Probably out**, with the scan age shown ("Fridge scanned 2 days ago").
- Show freshness chips: "spinach · day 9 · check it".
- Cache the last snapshot offline, since stores often have poor signal.
- Search box: "do we have eggs?"

**Use-soon notifications:**
- One opt-in digest per day or per week at a chosen time, listing only items crossing a threshold ("3 things to use soon"). No badges, no streaks.
- Delivery: PWA web push (Android, and iOS only after a Home Screen install), a weekly email, or local notifications if wrapped with Capacitor or Expo later.

**Shopping-list integration:**
- "Probably out" items become one-tap "add to list".
- If linked to Cut Protocol, the meal-plan grocery list marks lines "probably have" rather than silently removing them. This matches Cut Protocol's honesty rule: label, don't hide.

**Gentle staleness handling:** when a location hasn't been scanned in 10+ days, its items drift to **Not sure** automatically instead of nagging the user to rescan.

### Gaps
- No independent, non-vendor accuracy or retention data was found for AI fridge-photo apps. The rankings above are vendor content.
- Samsung's 2025–2026 Vision Inside capabilities (item count, automatic expiry) were not found. The figures are from 2024.
- No user research was found on optimal digest frequency or auto-accept timing.

## 7. Rough monthly running cost for one household (excluding AI API costs)

### Takeaway
Excluding AI, a household PWA can run for **CAD $0/month** (Supabase Free plus free static hosting, if the pausing risk is managed). It costs about **CAD $7/month** if it reuses a Railway Hobby service, and about **CAD $42/month** only if the builder upgrades to Supabase Pro for no-pause and backups. Store distribution adds **about CAD $139/yr (≈ $11.55/mo)** for iPhone native/TestFlight, or **about CAD $35 once** for Google Play. A PWA or sideloaded APK costs $0.

### Cited Findings
- Supabase: Free $0 (1 GB storage, 5 GB egress, pauses after 1 week inactive); Pro $25/org/month. — [MakerKit](https://makerkit.dev/blog/saas/supabase-pricing); [UI Bakery](https://uibakery.io/blog/supabase-pricing)
- Railway Hobby: $5/month including $5 of usage. — [Railway docs](https://docs.railway.app/reference/pricing)
- Cloudflare: Workers Free 100k requests/day; D1 Free (500 MB per DB); R2 Free 10 GB with zero egress. — [Workers limits](https://developers.cloudflare.com/workers/platform/limits); [D1 limits](https://developers.cloudflare.com/d1/platform/limits/); [Easton Dev (R2)](https://eastondev.com/blog/en/posts/dev/20260526-cloudflare-free-limits/)
- PocketBase VPS: about $4–10/month (a $4 Hetzner CAX11 per the FAQ). — [PocketBase FAQ](https://pocketbase.io/faq/); [DevMorph](https://www.devmorph.dev/blogs/stop-paying-for-supabase-self-hosted-pocketbase)
- Firebase Blaze: no plan fee, with free allowances. Storage requires Blaze. — [DEV Community](https://dev.to/androve2k/spark-vs-blaze-the-firebase-pricing-guide-i-wish-id-read-sooner-onb)
- Distribution: Apple 99 USD/yr ([Apple](https://developer.apple.com/support/enrollment/)); Google Play US$25 once ([Google](https://support.google.com/googleplay/android-developer/answer/6112435)); Expo free tier of 15 + 15 builds/month, Starter $19/mo ([Cadrant](https://cadrant.ai/blog/eas-build))
- Cut Protocol's own cost note: "Railway hobby −$5–20 / month TOTAL… Supabase $0 free tier → $25/mo Pro." — [TEARDOWN-2026-08-06.md:132-133](/home/user/cut-protocol/TEARDOWN-2026-08-06.md)
- **Exchange rate:** snapshots range from about 1.39 to 1.44 CAD per USD and are undated. The most defensible dated figure is about **1.409 (2026-07-29)**. No October 2026 rate was found. — [PoundSterlingLive](https://poundsterlinglive.com/data/currencies/usd-pairs/USDCAD-exchange-rate); [Pluang](https://pluang.com/en/tools/currency-converter/usd-cad); [CurrencyConvert](https://currencyconvert.online/usd/cad)

### Inferences
| Setup (excl. AI) | USD/mo | ≈ CAD/mo (×1.40) | Notes |
|---|---|---|---|
| PWA on free static hosting + Supabase Free (Auth, DB, Storage, Edge Function) | $0 | **$0** | Add a 5-min uptime ping (free UptimeRobot, per Cut Protocol notes) or accept occasional manual un-pausing; no backups on Free (conflicting sources) |
| Cloudflare Pages/Workers + R2 + D1 (+ separate auth) | $0 | **$0** | No pausing, zero egress; new runtime; D1 free daily row limits hard-fail since 2026-09-01 |
| PWA + small Express API on Railway Hobby + Supabase Free (Cut Protocol pattern) | $5 | **~$7** | Reuses Node/Anthropic SDK code; Railway may bill above $5 if RAM/CPU exceed the credit |
| PocketBase on a small VPS | $4–10 | **~$6–14** | Self-managed backups, TLS and updates |
| Any of the above + Supabase Pro | +$25 | **+~$35** (e.g. Railway + Pro ≈ $42) | Buys no-pause and backups; overkill for one household |
| **Distribution add-ons** | | | |
| iPhone via TestFlight/App Store (Expo or Capacitor) | $99/yr | **≈ $139/yr (≈ $11.55/mo)** | Plus applicable tax; Apple charges in local currency at enrollment |
| Google Play listing | $25 once | **≈ $35 once** | Plus the 12-tester/14-day closed test for new personal accounts |
| PWA or Android APK sideload | $0 | **$0** | |
| Expo EAS Starter (only if 15 + 15 free builds/month is not enough) | $19 | **≈ $27** | Usually unnecessary for one builder |

- **Photo storage and egress cost is about $0 for one household on any free tier.** At roughly 300 KB per photo (estimate), even a year's photos without deletion (~230 MB) fit in Supabase's 1 GB or R2's 10 GB.
- A custom domain is optional. Platform subdomains work, for example Railway's "Generate Domain" per [DEPLOY.md](/home/user/cut-protocol/DEPLOY.md).

### Gaps
- No dated October 2026 USD/CAD rate was found (the Bank of Canada API was blocked by the proxy). CAD figures should be re-checked.
- Domain registration prices and Cloudflare Workers Paid pricing (for exceeding free limits) were not researched.
- Sales tax (GST) treatment of Apple and Google developer fees in Alberta was not checked.

## 8. Feature inside Cut Protocol or a separate app? Pros, cons, and overall recommendation

### Takeaway
**Build it as a separate, small app that shares Cut Protocol's stack and conventions, and integrate later through a thin API, not a merged codebase.** On 2026-08-24 the owner deliberately cut Cut Protocol to "one user, one surface, no login," parked the AI layer and the hosted multi-user pieces, and runs it as a single-user Windows desktop app. The fridge tracker needs exactly those parked pieces: phone access away from home, multi-person household auth, a hosted backend, AI vision and the camera. Folding it in would reopen the scope creep the owner just closed. Done separately, it can still feed Cut Protocol later, with "probably have" annotations on the grocery list and meal plans biased toward food on hand.

### Cited Findings
- The owner's direction to strip back to "One user. One surface. No login, no paywall. Park everything else." — [CLAUDE.md:1-8](/home/user/cut-protocol/CLAUDE.md). PARKED.md explains why: "The scope had outgrown the goal… finishing the goal needs focus." — [PARKED.md](/home/user/cut-protocol/PARKED.md)
- "**DEFERRED — the AI/brain layer.** Do not re-raise unprompted." — [HANDOFF-CURRENT.md:173](/home/user/cut-protocol/HANDOFF-CURRENT.md)
- `SINGLE_USER` mode refuses hosted environments. — [backend/src/lib/singleUser.js](/home/user/cut-protocol/backend/src/lib/singleUser.js). The server blocks the camera via Permissions-Policy. — [backend/server.js:106](/home/user/cut-protocol/backend/server.js)
- All Cut Protocol data models are per-user (`userId`), with no household concept. — [schema](/home/user/cut-protocol/backend/prisma/postgres/schema.prisma)
- The repo has heavy process machinery:
  - CLAUDE.md (~49 KB) and DO-NOT-TOUCH.md (~109 KB). — [repo root](/home/user/cut-protocol)
  - Append-only, hook-enforced campaign docs and checksum-drifted migrations ("`prisma migrate dev` WILL DEMAND A FULL DATABASE RESET"). — [HANDOFF-CURRENT.md](/home/user/cut-protocol/HANDOFF-CURRENT.md)
  - 1,729 tests at the deploy-night commit. — [docs/deploy/TONIGHT-RUNBOOK.md](/home/user/cut-protocol/docs/deploy/TONIGHT-RUNBOOK.md)
- Reusable assets: React/Vite/Tailwind UI conventions; Supabase Auth wiring; the Anthropic SDK wrapper plus relay with USD caps; the `LlmUsage` cost ledger; the `Food` library (14,122 foods with USDA `fdcId` and `upc`); Open Food Facts lookup; and the grocery-list section classifier and Shopping door. — files cited in Q1
- Cut Protocol's mobile plan (Capacitor, bearer tokens, CORS) is unexecuted, and iOS is blocked on Mac hardware. — [roadmap/08-mobile-packaging.md](/home/user/cut-protocol/roadmap/08-mobile-packaging.md)
- The free Supabase plan allows 2 active projects. — [UI Bakery](https://uibakery.io/blog/supabase-pricing)

### Inferences
**Pros of building inside Cut Protocol**
- One app and one login on the phone.
- Direct joins between inventory and `Food`, `GroceryList` and `PlanSlot`, so the planner could prefer on-hand foods and the grocery list could subtract them.
- Reuse of `llm.js`, the relay, `LlmUsage`, Supabase Auth, the Railway deploy and the Shopping "door" the owner already opens in stores.
- The "at the store" view overlaps naturally with Cut Protocol's shopping list.

**Cons of building inside Cut Protocol**
- **Contradicts the owner's explicit 2026-08-24 focus decision** and the "AI layer deferred" rule.
- It needs everything currently parked: hosted mode, multi-user auth, household tenancy across a per-user schema, AI calls, and lifting the camera block.
- Today's primary surface (Electron, loopback, SINGLE_USER) is unreachable from a phone at the store.
- Heavy repo guardrails and drifted migrations slow every schema change, and a pantry migration risks the meal-planner data.
- Mixing household members into an app holding one person's weight and health data widens the access surface.
- The Supabase session pooler (15 clients) has already deadlocked deploys, and a second workload on the same pooler adds risk.

**Pros of a separate app**
- A clean, household-first schema and RLS from day one.
- The tiny codebase is easy for AI coding tools to hold in context.
- Can be a PWA on day 1 with no Capacitor or auth migration needed.
- Failures can't break the meal planner.
- Free-tier friendly: a second Supabase project.
- Phase 2 ESP32 ingestion fits naturally.

**Cons of a separate app**
- A second app icon and login.
- Integration needs an API contract later.
- Some duplicated code (auth wiring, LLM wrapper), mitigated by copying patterns rather than coupling.

#### Overall recommendation
1. **Shape:** a separate household **PWA**, built in **React + Vite + Tailwind** (same as Cut Protocol) and deployed to free static hosting, with a web app manifest so it installs to the Home Screen.
   - Camera via `<input type="file" accept="image/*" capture="environment">`, then client-side resize to a ~1568–2576 px long edge and JPEG/WebP re-encode, which also strips EXIF.
   - Only build a `getUserMedia` viewfinder if needed.
2. **Backend:** a **new Supabase project** (second free project).
   - Auth (Google or magic link) for 2–4 household members.
   - Postgres with **household-scoped RLS** and the Data API on.
   - A **private Storage bucket** with auto-delete after 30–90 days.
   - **One Edge Function `/scan`** holding the vision key, with per-household daily scan, photo and USD caps modeled on Cut Protocol's relay (`dailyUsd`/`monthlyUsd`/`perRequestUsd`).
   - Usage logged like `LlmUsage`.
   - Add a free uptime ping (or accept un-pausing) to beat the 7-day pause.
   - *Alternative:* a small Express service on Railway (~CAD $7/mo) reusing `brain/llm.js` and relay code.
3. **Data model:** the scans → photos → sightings → items (`first_seen`/`last_seen`/`missed_scans`) → corrections design in Q5, with FoodKeeper-seeded shelf-life categories and optional `cp_food_id`/`fdc_id`/`upc` on `item_types` for later Cut Protocol linking.
4. **UX:** a scan right after putting groceries away; a diff that is accepted by default with one-tap fixes; no date entry; a store view with Probably have / Not sure / Probably out plus "day N, check it" chips, cached offline; at most one opt-in digest.
5. **Upgrade path:**
   - If iOS web push or camera quirks become painful, wrap the same React code with **Capacitor**, as Cut Protocol's roadmap already plans. That needs the 99 USD/yr Apple program for TestFlight and a Mac or cloud build for iOS.
   - **Don't rewrite in React Native, and skip Swift/Kotlin.**
   - Choose Expo only if local notifications or a native camera UX become must-haves before any Capacitor work.
6. **Phase 2:** the ESP32-CAM POSTs JPEGs with a **per-device revocable token** to an upload endpoint (Edge Function or Cloudflare Worker). These become `scans` with `source='device'` through the same diff engine, debounced per location.
7. **Integration with Cut Protocol, later and optional:** expose a read-only `GET /inventory/summary` from the pantry app. When the owner un-parks multi-user and hosted features, Cut Protocol can annotate grocery lines "probably have" and bias plans toward on-hand foods.
8. **Running cost (excluding AI):** about **CAD $0–7/month**, plus about **CAD $139/yr** only if/when shipping to iPhone via TestFlight.

### Gaps
- The owner's current intentions for Cut Protocol after 2026-08-28 (for example, whether multi-user or hosted features are coming back soon) are unknown. If they are returning, the cost-benefit of building inside improves.
- The household's actual phone mix (iPhone vs Android) was not given. An all-Android household makes sideloaded APKs or Play cheap, and an all-iPhone household makes the PWA vs TestFlight choice more important.
- Hands-on testing of iOS 26 standalone PWAs with the file-input camera flow was not possible in this environment.
