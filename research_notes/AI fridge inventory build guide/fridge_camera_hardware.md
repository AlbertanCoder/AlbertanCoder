# Phase 2 Hardware: A DIY In-Fridge Camera That Photographs Contents Automatically

*Research date: 16 Oct 2026. Method note for the report writer: WebFetch failed (DNS errors) on every primary page I tried (Home Assistant forum, arXiv, Instructables). The shared WebSearch budget ran out before my last verification batch. Every "Cited Finding" below therefore comes from search-engine summaries of the linked pages, not from reading the full pages. Where a summary was ambiguous I say so. Items I could not verify are listed under Gaps. Older sources (2018–2023) are flagged inline.*

---

## 1. Which board and camera options are available as of 2026, and what are their tradeoffs?

### Takeaway
In 2026 there are three realistic tiers. (a) The **AI-Thinker ESP32-CAM** costs about CAD 14–17, has a 2 MP OV2640 and runs the Jan Dubovsky build, but its sleep current is poor and its images are low on detail. (b) **ESP32-S3 boards with 8 MB PSRAM and a better sensor**: the XIAO ESP32S3 Sense (now shipping with an OV3660 or an optional OV5640 autofocus module), generic ESP32-S3 N16R8 + OV5640 boards (the m0nklabs fridge build), or the M5Stack Unit CamS3-5MP. (c) A **Raspberry Pi Zero 2 W + Camera Module 3 Wide** (12 MP, 120° diagonal, autofocus, about CAD 73 for the pair at PiShop.ca) gives by far the best images. It cannot realistically run on batteries, and the camera is rated only 0–50 °C, so it is fine in the fridge but not the freezer. For coverage, the lens matters more than megapixels: no stock ESP32 lens is wide enough to see a whole fridge.

### Cited Findings
**AI-Thinker ESP32-CAM (OV2640)**
- OV2640 is a 2 MP sensor, 1600×1200 max — [Universal Solder (Canada)](https://www.universal-solder.ca/product/esp32-cam-espressif-esp32-wifi-bluetooth-ble-module-and-2mp-camera/)
- The classic board has no USB port. You need an FTDI/CH340 programmer or the ESP32-CAM-MB base to upload code — [Microcontrollerslab 2026 buying guide](https://microcontrollerslab.com/best-esp32-cam-kits-camera-wi-fi-ai-projects/)
- Some bundles mix two OV2640 module versions (identified by ribbon colour) — [Probots listing](https://probots.co.in/esp32-cam-mb-micro-usb-programmer-ch340g-serial-chip-ov2640-camera.html). Some listings advertise 8 MB PSRAM — [Circuit.rocks listing](https://circuit.rocks/products/esp32-cam-usb-programmer-esp32-cam-mb-ov2640-2mp-wi-fi-ble-usb-c-ch340-8mb-psram)
- Current draw is about 180 mA @ 5 V with the flash off and about 310 mA @ 5 V with the flash at full brightness. Deep sleep is quoted "as low as 6 mA @ 5 V" — [Joy-it datasheet](https://www.lextronic.fr/lextronic_doc/joy-it/SBC-ESP32-CAM.pdf); [Components101](https://components101.com/modules/esp32-cam-camera-module)
- Operating temperature is −20 to 85 °C per Components101 and Joy-it. SunFounder contradicts this with −20 to 70 °C — [Components101](https://components101.com/modules/esp32-cam-camera-module); [SunFounder](https://docs.sunfounder.com/projects/galaxy-rvr/en/latest/hardware/cpn_esp_32_cam.html)
- Elektor's analysis of battery use:
  - The AMS1117-class regulator draws about 10 mA quiescent, which makes it poorly suited to small batteries.
  - During very long deep sleep, current sometimes rose to about 100 mA "endlessly", which they traced to the camera module.
  - Their redesign with a TI buck-boost reached about 0.5 mA in deep sleep with EXT0 wake.
  - [Elektor Labs](https://www.elektormagazine.de/labs/esp32-low-consumption-power-supply-for-lithium-battery-solar-recharge)
- One user measured about 20 mA "deep sleep" on an AMS1117-based ESP32 board (a different board; treat as an upper bound) — [esp32.com](https://esp32.com/viewtopic.php?p=52679)
- Canadian prices:
  - ESP32-CAM + ESP32-CAM-MB USB adapter: CAD 13.95–14.97 (2–3 week lead time when out of stock); bare ESP32-CAM: C$16.99 — [Universal Solder](https://universal-solder.ca/esp32-cam-mb-with-usb-adapter/); [Universal Solder bare board](https://www.universal-solder.ca/product/esp32-cam-espressif-esp32-wifi-bluetooth-ble-module-and-2mp-camera/)
  - A third-party OV2640 + CH340 bundle is listed on BestBuy.ca (seller rating 3.0, 2 reviews) — [BestBuy.ca](https://www.bestbuy.ca/en-ca/product/esp32-cam-wifi-bluetooth-development-module-board-with-ov2640-camera-ch340-programmer-bt-type-c-for-iot-ai-projects/20156520)
- Drop-in 24-pin OV2640 modules with a 160° wide-angle lens sell for about US$13.88 — [Walmart OV2640 listings](https://www.walmart.com/c/kp/ov2640)

**Seeed Studio XIAO ESP32S3 Sense**
- Specs:
  - ESP32-S3 dual-core, 240 MHz, 8 MB PSRAM, 8 MB flash, SD slot, digital mic, detachable camera, and Li-battery charging — [Amazon.ca listing](https://www.amazon.ca/Seeed-Studio-XIAO-ESP32S3-Sense/dp/B0C69FFVHH)
  - Deep sleep is listed at 14 µA for the bare board — [Seeed wiki](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/)
- The camera sensor has changed over time, and the sources disagree:
  - DigiKey says older units shipped with the OV2640 and newer ones with the OV3660 — [DigiKey.ca](https://www.digikey.ca/en/products/detail/seeed-technology-co-ltd/113991115/18724504)
  - Switch Science says current stock ships with the OV3660 — [Switch Science](https://www.switch-science.com/products/8969)
  - Seeed's wiki (about 5 months old at search time) says the board moved to an OV5640 with autofocus because the OV3660 went out of stock — [Seeed wiki](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/)
- The OV3660 gives 2048×1536 and the OV5640 gives 2592×1944 — [Seeed wiki](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/)
- Seeed sells a separate "OV5640 Camera for XIAO ESP32S3 Sense (with heat sink)" with autofocus, from QVGA up to QSXGA 2592×1944. DigiKey.ca stocks it as part 114993115 — [Seeed Studio](https://www.seeedstudio.com/OV5640-Camera-for-XIAO-ESP32S3-Sense-With-Heat-Sink-p-5739.html); [DigiKey.ca 114993115](https://www.digikey.ca/en/products/detail/seeed-technology-co-ltd/114993115/21277047)
- Autofocus does not work out of the box. It needs specific register commands or a library — [Seeed forum](https://forum.seeedstudio.com/t/ov5640-camera-for-xiao-esp32s3-sense-how-to-use-autofocus/272485?page=2)
- The OV2640 and OV3660 are fixed-focus. The OV5640 usually has a voice-coil focus motor controlled over I²C, which allows roughly 5 cm to infinity — [espboards.dev camera comparison](https://www.espboards.dev/blog/esp32-camera-modules-compared/)
- Deep sleep with the camera attached is far above spec:
  - About 2–2.8 mA when the camera is present but not initialised; about 90 mA after a capture and SD save.
  - `esp_camera_deinit()` makes no difference.
  - Users concluded the camera's LDOs can't be switched off without a hardware switch.
  - A register write that puts an OV3660 into standby got under 5 mA. One user reports about 1 mA overnight with an OV3660 (an anecdote).
  - [Seeed forum thread p.1](https://forum.seeedstudio.com/t/xiao-esp32s3-sense-camera-sleep-current/271258); [p.2](https://forum.seeedstudio.com/t/xiao-esp32s3-sense-camera-sleep-current/271258?page=2); [p.3](https://forum.seeedstudio.com/t/xiao-esp32s3-sense-camera-sleep-current/271258?page=3); ["very high deep sleep current" thread](https://forum.seeedstudio.com/t/esp32s3-sense-camera-very-high-deep-sleep-current-any-solution/274705)
- Wi-Fi drops at the default transmit power. The fix in an ESPHome guide is `output_power: 8.5dB` with power save disabled — [DigiKey Maker project](https://www.digikey.ca/en/maker/projects/diy-ip-camera-with-the-seeed-xiao-esp32-sense-esphome-home-assistant/a015ed69dda64f0eafbdf12b664eea6d)
- The ESP32-S3 has no 5 GHz Wi-Fi and no Bluetooth Classic — [Universal Solder XIAO comparison](https://www.universal-solder.ca/comparison-xiao-modules/)
- Prices:
  - TME Canada: US$21.55 for 1, US$18.84 at 10, 93 in stock — [TME Canada](https://www.tme.com/ca/en/katalog/development-kits_100636/p,seeed-studio_1325/)
  - Amazon.ca: about CAD 51 (third-party). DigiKey: about $22 (currency unclear in summary) — [Amazon.ca](https://www.amazon.ca/Seeed-Studio-XIAO-ESP32S3-Sense/dp/B0C69FFVHH); [DigiKey.ca](https://www.digikey.ca/en/products/detail/seeed-technology-co-ltd/113991114/19285530)
  - Amazon.com: US$23.99 on 27 Jun 2026 — [camelcamelcamel](https://camelcamelcamel.com/product/B0C69FFVHH)

**Espressif ESP32-S3-EYE**
- ESP32-S3R8 in a WROOM-1 module, 8 MB octal PSRAM, 8 MB flash.
- OV2640 with a 66.5° field of view, 1600×1200 max.
- 1.3" 240×240 LCD, digital mic, microSD slot and a QMA7981 accelerometer.
- Micro-USB power, with optional Li-ion via solder pads.
- [Espressif ESP32-S3-EYE Getting Started Guide](https://github.com/espressif/esp-who/blob/master/docs/en/get-started/ESP32-S3-EYE_Getting_Started_Guide.md)

**ESP32-P4X-EYE (new)**
- The original ESP32-P4-EYE is now obsolete at DigiKey and Mouser. Its successor, the ESP32-P4X-EYE, sells for about US$33.68 at DigiKey and US$35 at Mouser. Mouser began shipping it in Aug 2026 — [DigiKey](https://www.digikey.com/en/products/detail/espressif-systems/esp32-p4-eye/27555429); [Mouser](https://mouser.com/ProductDetail/Espressif-Systems/ESP32-P4X-EYE?qs=Naspt24KZtmIGEWd+wLduw%3D%3D); [Electropages, Aug 2026](https://www.electropages.com/blog/2026/08/mouser-now-shipping-espressif-esp32-p4x-eye-vision-development-kit)
- Wi-Fi, Bluetooth, Thread and Zigbee come from an onboard ESP32-C6-MINI-1U module. The camera is a 2 MP MIPI-CSI unit with a manually adjustable focal length. The board also has a 1.54" LCD, a mic and a rotary encoder — [CNX Software, Apr 2025](https://www.cnx-software.com/2025/04/24/espressif-systems-esp32-p4-eye-development-kit-looks-like-a-camera/); [Espressif blog](https://developer.espressif.com/blog/2025/05/introducing-p4-eye/)
- The DFRobot FireBeetle 2 ESP32-P4 (2-lane MIPI camera port, Wi-Fi 6) is listed at US$16.50 — [DFRobot](https://www.dfrobot.com/product-2915.html)

**M5Stack**
- **Timer Camera X**:
  - ESP32-D0WDQ6-V3 with 8 MB PSRAM.
  - OV3660, 3 MP, 2048×1536, DFOV 66.5°.
  - 140 mAh battery and a BM8563 RTC.
  - M5Stack states a 2 µA sleep current and "over a month" at one photo per hour (vendor claims, not independently tested).
  - [M5Stack docs](https://docs.m5stack.com/en/unit/TimerCamera-X); [ThingsBoard device page](https://thingsboard.io/docs/devices-library/m5stack-timer-camera-x/)
- **CoreS3**: its camera is a 0.3 MP GC0308 (VGA), too low-resolution for this use — [M5Stack docs](https://docs.m5stack.com/en/core/CoreS3)
- **Unit CamS3-5MP**:
  - ESP32-S3, 8 MB PSRAM, 16 MB flash.
  - PY260 5 MP sensor, 88° DFOV, 2592×1944, fixed focus at 0.6 m, JPEG output.
  - Not compatible with programs written for the original Unit CamS3.
  - [M5Stack docs](https://docs.m5stack.com/en/unit/Unit_CamS3-5MP); [M5Stack shop](https://shop.m5stack.com/products/unit-cams3-wi-fi-camera-5mp)

**Freenove ESP32-S3 WROOM CAM**
- 8 MB PSRAM, dual-core 240 MHz, Wi-Fi and BLE 5. Listings disagree on flash (8 MB vs 16 MB).
- OV2640 camera and SD slot.
- About US$46–47 at Newegg US (16 MB variant), €27.95 at Bitsandparts (temporarily unavailable).
- [Newegg Business](https://www.neweggbusiness.com/p/9B-3C6-03VM-01X10); [Bitsandparts](https://www.bitsandparts.nl/en/ESP32-S3-WROOM-ESP32-CAM-Development-board-WiFi-Buetooth-p1926701); [Newegg SG](https://www.newegg.com/global/sg-en/p/3C6-02AV-019R8)

**LILYGO T-Camera S3**: ESP32-S3, OV2640 with a rear fisheye lens, 0.96" OLED, 16 MB flash and 8 MB PSRAM — [Hubtronics listing](https://hubtronics.in/h644)

**Generic ESP32-S3 + OV5640 (as in the m0nklabs fridge build)**
- The m0nklabs build uses an ESP32-S3-N16R8 board with an OV5640 5 MP autofocus camera — [m0nklabs/fridge-cam-firmware](https://github.com/m0nklabs/fridge-cam-firmware)
- Getting an OV5640 working on ESP32-S3 CAM boards can be fiddly (open Arduino-ESP32 issue) — [arduino-esp32 #12236](https://github.com/espressif/arduino-esp32/issues/12236)
- One esp32.com poster found an OV5640 board stayed at about 100 mA in sleep, versus about 6 mA with an OV2640 on the same code. Holding PWDN high didn't help, and several boards behaved the same — [esp32.com](https://esp32.com/viewtopic.php?p=126832)

**Wide-angle OV5640 breakouts**: Adafruit sells an OV5640 breakout with a 160° lens (2×9 header, VMotor jumper for autofocus) and a 120° autofocus variant — [Adafruit 5841](https://www.adafruit.com/product/5841); [Adafruit Learn guide](https://learn.adafruit.com/adafruit-ov5640-camera-breakout?view=all); [The Pi Hut](https://thepihut.com/products/adafruit-ov5640-camera-breakout-160-degree-wide-angle)

**Camera driver support**
- Espressif's esp32-camera driver (used by Arduino, ESP-IDF and ESPHome) supports the OV2640, OV3660 (max 2048×1536) and OV5640 (max 2592×1944), plus others such as the OV7725.
- It needs PSRAM except for JPEG at CIF or lower resolution.
- One user reports the OV7725 can't output JPEG.
- [espressif/esp32-camera](https://github.com/espressif/esp32-camera)
- MicroPython camera firmware supports only the OV2640 — [MicroPython discussion](https://github.com/orgs/micropython/discussions/12032)

**Raspberry Pi**
- Pi Zero 2 W:
  - Measured 280 mA idle and 580 mA under stress (2021 review) — [Tom's Hardware](https://www.tomshardware.com/reviews/raspberry-pi-zero-2-w-review)
  - 512 MB RAM; operating temperature −20 to +70 °C — [CNX Software launch article (2021)](https://www.cnx-software.com/2021/10/28/raspberry-pi-zero-2-w-launched-with-quad-core-cpu-512mb-ram/?amp=1)
  - Powered at 5 V/2.5 A over micro-USB — [CNX power test](https://www.cnx-software.com/2021/12/09/raspberry-pi-zero-2-w-power-consumption/)
- Camera Module 3 Wide:
  - Sony IMX708, 12 MP — [DigiKey.ca](https://www.digikey.ca/en/product-highlight/r/raspberry-pi/camera-module-3-and-m12-mount-high-quality-camera)
  - 120° diagonal / 102° horizontal / 67° vertical, 2.75 mm f/2.2, focus 5 cm to infinity — [Raspberry Pi sensor-assembly brief](https://datasheets.raspberrypi.com/camera/sensor-assembly-product-brief.pdf)
  - Operating temperature 0–50 °C, "should be operated in a dry environment", and needs ventilation — [Camera Module 3 product brief](https://cdn.sparkfun.com/assets/c/b/3/a/1/Camera_Module_3_Product_Brief.pdf)
- Every Pi Zero model needs the narrower "Zero" camera cable; the standard cable doesn't fit — [Pakronics](https://pakronics.com.au/products/raspberry-pi-camera-module-3-wide-rpi-sc0874)
- Canadian prices:
  - Pi Zero 2 W: CAD 21.95 at PiShop.ca, or 25.95 with header — [PiShop](https://www.pishop.ca/product/raspberry-pi-zero-2-w/); [PiShop with header](https://www.pishop.ca/product/raspberry-pi-zero-2-w-with-header/)
  - BC Robotics: $28.95 (out of stock), $32.95 with header — [BC Robotics](https://bc-robotics.com/shop/raspberry-pi-zero-2w/)
  - CanaKit: $16.35, or $19.60 with header (currency not stated) — [CanaKit](https://www.canakit.com/raspberry-pi-zero-2-w.html)
  - Camera Module 3 Wide: CAD 50.95 at PiShop (in stock); BC Robotics $67.95 (temporarily out); DigiKey.ca $55.52; CanaKit $37.95 (currency not stated) — [PiShop](https://www.pishop.ca/product/raspberry-pi-camera-module-3-wide/); [BC Robotics](https://bc-robotics.com/shop/raspberry-pi-camera-module-3-wide/); [DigiKey.ca](https://www.digikey.ca/en/product-highlight/r/raspberry-pi/camera-module-3-and-m12-mount-high-quality-camera); [CanaKit](https://www.canakit.com/raspberry-pi-camera-module-3.html)
  - A Wide NoIR variant is the same price — [PiShop NoIR](https://www.pishop.ca/product/raspberry-pi-camera-module-3-wide-noir/)

### Inferences
- **Comparison synthesised from the findings above.** CAD figures are from Canadian listings where found; USD figures are converted at about 1.38 (my assumption; verify).

| Option | Sensor / max res | Stock FOV | Realistic sleep current | Approx. CAD | Fit for this project |
|---|---|---|---|---|---|
| AI-Thinker ESP32-CAM | OV2640 2 MP (1600×1200), fixed focus | ~66° class (OV2640 on S3-EYE is 66.5°); 160° modules available | 6 mA spec; 20–100 mA anomalies reported | 14–17 (+~19 for a 160° module) | Cheapest and proven (Dubovsky). Low detail. Needs mods for battery; best on USB power. |
| XIAO ESP32S3 Sense | OV2640 → OV3660 (3 MP) → optional OV5640 AF (5 MP) | not found | 1–2.8 mA with camera (anecdotes); 14 µA bare | ~30 (TME) to ~51 (Amazon.ca) + OV5640 module (price not found) | Best compact ESP32-S3 choice. Onboard charger is a cold-charging hazard. |
| ESP32-S3 N16R8 + OV5640 (generic) | OV5640 5 MP AF | depends on module (120°/160° exist) | OV5640 may sit near 100 mA unless power-gated | not found in CAD | Matches the m0nklabs fridge build. |
| M5Stack Unit CamS3-5MP | PY260 5 MP, fixed focus 0.6 m | 88° DFOV | not found | not found | Good FOV and focus distance for a door-to-back-wall view (~0.5 m). |
| M5Stack Timer Camera X | OV3660 3 MP | 66.5° DFOV | 2 µA (RTC power-off, vendor) | not found | Built for timed snapshots on battery; door-event wake not documented. |
| ESP32-S3-EYE / Freenove S3 CAM / LILYGO T-Camera S3 | OV2640 2 MP | 66.5° / ? / fisheye | not low-power designs | Freenove ~€28–US$47 | Dev and learning boards; no advantage here. |
| ESP32-P4X-EYE | 2 MP MIPI, manual focus | not found | not found | ~46–49 (converted) | Newest and most capable. Overkill and less mature for a hobby build. |
| Pi Zero 2 W + CM3 Wide | IMX708 12 MP AF | 120° diag (102×67°) | 280 mA idle; no practical deep sleep | 21.95 + 50.95 + cable ≈ 78+ | Best images by far. USB power only; camera rated 0–50 °C, so fridge only. |

- **Image quality vs the Phase 1 pipeline.** Phase 1 uses 12 MP+ phone photos. A 2 MP OV2640 behind a 120–160° lens resolves far less detail per item (see the pixel-density math in Q6). Expect the vision AI to identify broad categories ("yogurt cup", "milk carton") but not brands or labels. If the AI must read labels or dates, the Pi + CM3 Wide (or an OV5640 at full 2592×1944) is the realistic floor.
- **Low light.** Inside a closed fridge it is pitch dark, so every option needs its own illumination. The ESP32-CAM's single onboard flash LED will create hotspots. Diffuse white LEDs are preferable (see Q2).
- **Freezer.** The CM3's 0–50 °C rating rules it out at −18 °C. The ESP32-CAM's lower bound (−20 °C) leaves almost no margin. Plan the freezer node separately: USB-powered, heated window (see Q5).
- **Suggested v1 for this builder (fridge only):**
  - A USB-powered ESP32-S3 + OV5640 AF node (XIAO ESP32S3 Sense + OV5640 module, or an N16R8 + OV5640 board like m0nklabs).
  - For a weekend prototype, an ESP32-CAM + 120–160° OV2640 module instead.
  - Upgrade to Pi Zero 2 W + CM3 Wide if the AI pipeline needs more detail.
  - Avoid batteries in v1 (see Q3).

### Gaps
- No measured low-light or noise comparison between the OV2640, OV3660, OV5640, PY260 and IMX708 sensors was found.
- I found no CAD prices for:
  - M5Stack Timer Camera X / Unit CamS3-5MP
  - the Freenove ESP32-S3 CAM in Canada
  - the Seeed OV5640 module for XIAO
  - the Adafruit OV5640 120°/160° breakout
  - Amazon.ca ESP32-CAM listings

  Check Elmwood Electronics, Canada Robotix and DigiKey.ca directly.
- Not verified here (believed from prior knowledge):
  - the XIAO ESP32S3 has a u.FL antenna connector and ships with an external antenna;
  - the AI-Thinker ESP32-CAM's stock lens FOV and PSRAM size (4 MB usable on many units);
  - the IMX708 native resolution (believed to be 4608×2592).
- Whether the ESPHome/esp32-camera driver supports the M5Stack PY260 sensor is unknown.
- The USD→CAD rate for Oct 2026 was not checked.
- An unverified search summary reported a stock ESP32-CAM deep-sleep current of 2.8 mA, dropping to 0.8 mA with the regulator removed. I could not identify the originating page.

---

## 2. How should capture be triggered, and should it shoot while the door is open or after it closes?

### Takeaway
Use a **magnetic reed switch** as the primary trigger. It gives clean open and close edges, works in compartments with no light, and is what the Dubovsky build uses (GPIO13). An **LDR that detects the fridge light** is a proven zero-wiring alternative for lit compartments (m0nklabs). Accelerometers can detect door motion but cannot tell "open and still" from "closed". The most reliable approach for a scan-diff pipeline is: shoot **after the door closes** (after a settle delay), using your own diffuse white LED, as a short burst, and keep the sharpest frame. That gives static, repeatable, hand-free "shelf snapshots". Tracking items as they move in and out needs one-at-a-time scanning even in Samsung's commercial product, and is not realistic on ESP32-class hardware.

### Cited Findings
- **Dubovsky fridge-core:**
  - The ESPHome config reads a reed-switch door sensor on GPIO13 and drives the flash LED on GPIO4.
  - It snapshots the contents when the door opens. The LED turns on, the code waits for the interior to light up, saves a 640×480 JPEG, and sends it to HA's `ai_task.generate_data`.
  - [HA Community post](https://community.home-assistant.io/t/fridge-cam-ai-content-recognition-esp32-cam-ha-blueprint-a-custom-lovelace-card/1023750); [Popular AI guide](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)
- **m0nklabs fridge-cam-firmware:**
  - A GL5528 LDR with a 10 kΩ pull-down detects the fridge light coming on and raises a GPIO interrupt that wakes the ESP32-S3 from deep sleep (about 10 µA per the README).
  - It captures a burst of 3 frames over 4 s, picks the sharpest by Laplacian variance, uploads it, and goes back to sleep.
  - [m0nklabs/fridge-cam-firmware](https://github.com/m0nklabs/fridge-cam-firmware)
- **Michdo93 fridge-cam:** the trigger comes from the smart fridge's own door sensor. A Miele fridge's door item in openHAB changing OPEN→CLOSED (delivered via SSE) makes a Python script request a photo from the ESP32-CAM — [Michdo93/fridge-cam](https://github.com/Michdo93/fridge-cam)
- **7Z0nE esp32-fridgecam:** photographs and uploads "whenever the door is closed" (ESP-IDF based) — [7Z0nE/esp32-fridgecam](https://github.com/7Z0nE/esp32-fridgecam)
- **Smarter FridgeCam (2017–18):**
  - Takes a snapshot each time the door is closed — [KBB Review](https://www.kbbreview.com/?p=11158). Stuff says it shoots when the door opens, so the sources conflict — [Stuff](https://stuff.tv/news/smarters-fridge-cam-watching-your-food)
  - It has an LED flash and a fisheye lens — [Expert Reviews (2018)](https://www.expertreviews.co.uk/gadgets/1407382/smarter-fridgecam-review)
- **Samsung "AI Vision Inside" (2024 Bespoke AI Family Hub):**
  - A camera at the top of the fridge identifies foods as they move in and out; Samsung expanded recognition to more than 30 fresh items (other coverage says 33).
  - Items must be scanned one at a time, and food covered by a hand may be listed as "unknown". Door bins and the freezer are not covered.
  - [Samsung Newsroom](https://news.samsung.com/us/samsungs-most-intelligent-fridge-is-getting-smarter-with-family-hub-for-2024-update); [Tom's Guide](https://www.tomsguide.com/news/samsung-unveils-2024-bespoke-family-hub-refrigerator-with-vision-ai-heres-what-it-can-do); [retailer listing](https://compughana.com/products/samsung-636l-4-doors-bespoke-ai-fridge-black)
  - It runs an on-device detection and classification model and automatically blurs surroundings other than the food — [Samsung AU Newsroom](https://news.samsung.com/au/samsung-introduces-ai-family-hubtm-french-door-refrigerator-the-latest-in-the-home-appliance-lineup-featuring-enhanced-connectivity-and-ai-capabilities); [retailer listing](https://compughana.com/products/samsung-636l-4-doors-bespoke-ai-fridge-black)
- **DecayDock** sidesteps triggering: the user holds food up to the camera — [Hackaday (May 2026)](https://hackaday.com/2026/05/20/decaydock-keeps-track-of-spoilage/)
- **Placement sensitivity:** an ESP32-CAM + Edge Impulse freezer system had 98.1% training accuracy, but test accuracy ranged from 71% to 99% depending on object positioning — [ResearchGate](https://www.researchgate.net/publication/389362447_Application_of_Edge_Impulse_and_ESP32-CAM_in_Smart_Freezer_Systems_for_Object_Recognition)
- **Accelerometer option:**
  - The LIS3DH has ultra-low-power modes (down to about 2 µA) and configurable wake-up interrupts — [ST AN3308](https://cdn.sparkfun.com/assets/learn_tutorials/5/9/6/LIS3DH_AppNote_DocID_18198rev1.pdf); [aipcba](https://www.aipcba.cn/part/lis3dh-cm4358837.html)
  - Adafruit's MagTag guide wires LIS3DH INT1 to an ESP32-S2 pin with a latched interrupt as a wake source — [Adafruit](https://learn.adafruit.com/magtag-dishwasher-status/wake-on-flip)
  - Pitfalls: a latched interrupt stays asserted until you read the interrupt register — [esp8266.com](https://www.esp8266.com/viewtopic.php?p=54139). Configure the interrupt before enabling the mode, or you lose the first one — [RIOT forum](https://forum.riot-os.org/t/lis3dh-inertial-wakeup/3487). Forum replies disagree on interrupt polarity — [ST community](https://stcommunity.st.com/t5/mems-sensors/lis3dh-tilt-angle-and-shock-interrupts-adc/td-p/803921)
- The ESP32-S3-EYE has an onboard QMA7981 accelerometer — [Espressif](https://github.com/espressif/esp-who/blob/master/docs/en/get-started/ESP32-S3-EYE_Getting_Started_Guide.md)
- **Illumination cost:** the ESP32-CAM draws about 310 mA with the flash at full, versus 180 mA without — [Joy-it datasheet](https://www.lextronic.fr/lextronic_doc/joy-it/SBC-ESP32-CAM.pdf)

### Inferences
- **Trigger comparison:**

| Trigger | Pros | Cons | Verdict |
|---|---|---|---|
| Reed switch + magnet (cabinet edge + door) | Deterministic open/close edges; works in unlit freezers; near-zero current (N.O. switch); proven (Dubovsky GPIO13) | Needs wiring to the door frame; the magnet must align across the gasket | **Primary choice** |
| LDR on the fridge light (m0nklabs) | No door hardware; one GPIO interrupt | Fails where the compartment has no light (many freezers); threshold tuning; daylight leaks | Good for the fresh-food compartment |
| Accelerometer on a door-mounted node | Self-contained in the door unit | Detects motion only. It cannot measure door angle (the door swings about a vertical axis, so gravity doesn't change) or tell "open and still" from "closed" | Secondary signal only |
| Fridge's own smart door sensor (Michdo93) | Free if the fridge is connected | Most fridges aren't | Situational |
| Timer only (Timer Camera X style) | No wiring | Misses changes between intervals; LED fires every time | Fallback |

- **Open vs closed:**
  - *Shooting while the door is open* gets free light from the fridge lamp, and a cabinet-mounted camera aimed at the door can see the door bins. But hands, people (privacy), motion blur and a variable door angle make frames inconsistent. Samsung's limits ("one at a time", hands produce "unknown") show the cost.
  - *Shooting after close* gives a static, people-free, repeatable frame, which is ideal for diffing against the previous scan. The cost is your own LED and a settle delay.
  - Delay the capture after close, because fog forms on a cold lens exactly when warm room air rushes in (see Q5). Start with 30–120 s, then measure. Take 3 frames and keep the sharpest by Laplacian variance (as m0nklabs does). The same metric can reject foggy frames and trigger a retry.
- **Debounce state machine** (to cut energy, API cost and duplicate scans):
  1. On door close, start a timer (e.g., 60 s).
  2. If the door reopens, cancel the timer.
  3. When the timer expires, capture.
  4. Optionally enforce a minimum interval between captures (e.g., 5 min) and always capture after the last close of a burst of activity.
- **Snapshots vs tracking.** Snapshot diffing fits the existing Phase 1 pipeline (compare scans: what's new, what's gone, how long it's been there). In/out tracking needs video-rate detection and still struggles with occlusion, even for Samsung.
- **Lighting.** Use diffuse white LEDs (an LED strip or COB behind a frosted diffuser) switched by a logic-level MOSFET, and avoid glare on glass shelves and glossy packaging. IR/NoIR imaging loses colour, which is a key cue for produce, so avoid IR for identification.
- **Wiring the reed switch.** Use an RTC-capable GPIO so it can wake the chip from deep sleep (ESP32 ext0/ext1 wake). Use a normally-open reed switch, held closed by the magnet when the door is shut, so it draws no current in the most common state. Check the logic on your board.

### Gaps
- No source gives a typical number of fridge-door openings per day; it is needed for energy and API-cost estimates.
- No source measures capture quality with the door open vs closed, or how long lens fog takes to clear after the door closes.
- The ESP32 ext0/ext1 wake documentation and RTC-GPIO pin lists for each board were not re-verified (search budget exhausted).

---

## 3. How should it be powered, and how long would batteries last at fridge and freezer temperatures?

### Takeaway
For v1, **power it over USB**: a certified 5 V adapter outside the fridge, with a thin or flat cable passed under the door gasket. That removes the two hardest problems: cold-charging safety and the real sleep current of ESP32 camera boards, which is milliamps, not microamps. If batteries are needed:
- Make sleep near-zero by **hard power-gating** the board and camera.
- Use **18650s** for a fridge node and **lithium primary AA cells** (Energizer Ultimate Lithium, rated to −40 °C) for a freezer node.
- **Never charge Li-ion or LiFePO4 at or below 0 °C.** Even at 2–4 °C, charge current must be reduced (fast charging is specified only from 5 °C), so take batteries out to charge at room temperature.
- Expect roughly 2–5 weeks per 18650 on a stock ESP32-CAM, versus months with power gating (estimates below).

### Cited Findings
- **Active and sleep current:**
  - ESP32-CAM: 180 mA @ 5 V with flash off, 310 mA with flash on, 6 mA deep sleep (spec) — [Joy-it datasheet](https://www.lextronic.fr/lextronic_doc/joy-it/SBC-ESP32-CAM.pdf)
  - An AMS1117 regulator wastes about 10 mA quiescent; the camera can cause 100 mA plateaus during long sleep; a buck-boost redesign gave 0.5 mA — [Elektor Labs](https://www.elektormagazine.de/labs/esp32-low-consumption-power-supply-for-lithium-battery-solar-recharge)
  - XIAO ESP32S3 Sense with camera: 2–2.8 mA uninitialised, about 90 mA after a capture, and camera LDOs that can't be switched off without a hardware switch — [Seeed forum](https://forum.seeedstudio.com/t/xiao-esp32s3-sense-camera-sleep-current/271258); [Seeed forum (very high current thread)](https://forum.seeedstudio.com/t/esp32s3-sense-camera-very-high-deep-sleep-current-any-solution/274705)
  - OV5640 boards: about 100 mA in sleep — [esp32.com](https://esp32.com/viewtopic.php?p=126832)
  - Timer Camera X: 2 µA sleep, 140 mAh battery, "over a month" at 1 photo per hour (vendor) — [M5Stack](https://docs.m5stack.com/en/unit/TimerCamera-X)
  - Pi Zero 2 W: 280 mA idle — [Tom's Hardware](https://www.tomshardware.com/reviews/raspberry-pi-zero-2-w-review)
- **The m0nklabs build** powers its ESP32-S3 + OV5640 from 2× 18650 through a Type-C "UPS module" in a separate enclosure — [m0nklabs](https://github.com/m0nklabs/fridge-cam-firmware)
- **Charging Li-ion in the cold:**
  - Charging below freezing plates metallic lithium on the anode, which is permanent damage to both performance and safety — [Grepow](https://www.grepow.com/blog/charge-and-discharge-design-of-low-temperature-battery)
  - "Li-ion can be fast charged from 5 °C to 45 °C. Below 5 °C the charge current should be reduced, and no charging is permitted at freezing temperatures." Research puts the allowable rate at −30 °C at 0.02C. Some specialty Li-ion cells can charge down to −10 °C at a reduced rate — [Battery University–derived "Charging at high and low temperatures" PDF](https://www.elfa.nl/wp-content/uploads/2023/08/Charging-at-high-and-low-temperatures.pdf); [CandlePowerForums](https://www.candlepowerforums.com/threads/avoid-charging-li-ion-batteries-at-extremely-low-temperature.481422/)
  - A 2026 AIChE abstract on 18650 LFP cells reports that multistep charging with a low initial current step reduces lithium plating at low temperature — [AIChE 2026](https://proceedings.aiche.org/conferences/aiche-spring-meeting-and-global-congress-process-safety/2026-1003)
- **Discharge in the cold:**
  - The Panasonic NCR18650B is rated for discharge from −20 to +60 °C, and its datasheet includes discharge curves at 0, −10 and −20 °C (numbers not extracted) — [NCR18650B datasheet](https://files.batteryjunction.com/frontend/files/Panasonic-NCR18650B.pdf). A 2021 *Data in Brief* dataset has measured NCR18650B discharges at several temperatures — [DOAJ](https://doaj.org/article/68b752677dc84eed99dac571bdddf4d4)
  - Approximate capacity at −20 °C: about 50–60% for LFP, about 70% for NMC and about 90% for LTO (unverified supplier blog) — [Polinovel](https://www.polinovelpowbat.com/info/lithium-batteries-in-cold-weather-performance-103353600.html)
  - Battery University's position (relayed in a forum): discharging cold causes no lasting damage; rate capability drops at about −20 °C because electrolyte impedance rises; usable to −30 °C "with acceptable results" — [CandlePowerForums](https://www.candlepowerforums.com/threads/lithium-ion-below-freezing-temperature-performance.219215/)
  - Hackaday commenters on an ESP32 freezer alarm noted that cold drains lithium batteries and can starve the radio during transmit bursts (2023) — [Hackaday](https://hackaday.com/2023/07/27/esp32-freezer-alarm-keeps-tabs-on-tricky-door/)
- **LiFePO4:**
  - RELiON says charge current must be reduced to 0.1C below 0 °C and 0.05C below −10 °C, or the battery can be irreversibly damaged — [RELiON](https://relionbattery.com/knowledge/how-do-lifepo4-batteries-perform-in-cold-temperatures)
  - Other manufacturers say LiFePO4 "cannot be charged below 0 °C" — [Bluetti community](https://community.bluettipower.com/t/elite-400-charging-temps/40954)
  - RELiON's LT series self-heats so it can charge down to −20 °C — [Del City](https://blog.delcity.net/relions-lithium-batteries-for-cold-weather-performance)
- **Lithium primary AA:**
  - Energizer Ultimate Lithium (Li-FeS2) operates from −40 to 60 °C per a 2010 sell sheet (older document) — [Energizer sell sheet](https://data.energizer.com/pdfs/liaa_sellsheet_may2010.pdf)
  - The L91 datasheet has a capacity-vs-temperature chart (values not extracted) — [Energizer L91](https://data.energizer.com/pdfs/L91.pdf)
  - A generic lithium-AA spec gives about 3000 mAh to 1.0 V at 200 mA and 21 °C (not confirmed as the L91's figure) — [Energizer L91SBP via AlarmGrid](https://www.alarmgrid.com/documents/energizer-l91sbp-data-sheet)
- **TP4056 charger temperature protection:**
  - The TEMP pin reads an NTC thermistor in the pack and suspends charging when the pin is below about 45% or above about 80% of supply, i.e. battery too cold or too hot. Tying TEMP to ground disables the protection while the other charge functions keep working — [PT4056 (TP4056 clone) datasheet, LCSC](https://wmsc.lcsc.com/wmsc/upload/file/pdf/v2/lcsc/1912111437_PUOLOP-PT4056_C351416.pdf); [ADOM parts wiki](https://wiki.adom.inc/p/pg_ffmf2easfj)
  - A forum thread suggests driving TEMP from the MCU to block charging (untested idea) — [esp8266.com](https://www.esp8266.com/viewtopic.php?p=62641)
- **The XIAO ESP32S3 Sense charges a Li battery onboard** — [Amazon.ca listing](https://www.amazon.ca/Seeed-Studio-XIAO-ESP32S3-Sense/dp/B0C69FFVHH)
- **Cables through the gasket:**
  - A purpose-made 3 m flat thermistor cable is designed to pass through a fridge or freezer door seal "with minimal effect" (IP66) — [Gemini Data Loggers PB-5019-3M](https://www.geminidataloggers.com/probes/thermistor-probes/pb-5019-3m?loc=en)
  - MOCREO sells a 1.3 mm probe cable that it says fits the roughly 1.5 mm gap between door gaskets — [MOCREO](https://mocreo.com/product/connection-cables/)
  - Forum reports:
    - A thin eSATA cable worked behind the gasket after a slot was cut in the door liner.
    - Flat phone cord was thick enough to break the seal.
    - Stranded 26 AWG wire with the jacket removed worked for a freezer logger.
    - [MySensors forum](https://forum.mysensors.org/post/6527); [Cocoontech](https://cocoontech.com/threads/solution-for-wireless-monitoring-of-freezer-and-or-refrigerator-temps.20730/page-2)
  - If drilling, HA users advise going close to the door edge where the steel bends, to avoid refrigerant lines — [HA Community](https://community.home-assistant.io/t/fridge-freezer-temp-sensors/744045)

### Inferences
- **Battery-life model.** Daily drain = sleep current × 24 h + events per day × energy per event.
  - **My assumptions (not sourced):**
    - About 30 captures per day after debouncing.
    - About 0.3 mAh per event for an ESP32-S3 board (≈150 mA × 5 s plus a 1 s LED flash).
    - About 0.55 mAh per event for an ESP32-CAM fed through a 5 V boost (≈250 mA @ 5 V × 5 s, 85% efficient).
    - Usable capacity at 2–4 °C of about 90% of nominal (2700 of 3000 mAh for an 18650; 900 of 1000 mAh for a LiPo).
  - **Sanity check:** M5Stack's own claim (140 mAh lasting a month at 24 photos per day) implies about 0.19 mAh per photo including sleep, which fits these per-event figures.

| Scenario (fridge, ~3 °C) | Sleep current | mAh/day | Est. life |
|---|---|---|---|
| Stock ESP32-CAM, 18650 | 6 mA (spec) | 144 + 16.5 ≈ 160 | **~17 days** |
| Stock ESP32-CAM, 18650 | 2.8 mA (unverified report) | 67 + 16.5 ≈ 84 | ~32 days |
| ESP32-CAM, regulator replaced / buck-boost (Elektor-style) | ~0.5–0.8 mA | ~16 + 16.5 ≈ 32 | ~2.8 months |
| XIAO S3 Sense + OV3660 standby, 1000 mAh LiPo | ~1 mA (anecdote) | 24 + 9 = 33 | ~27 days |
| XIAO S3 Sense + OV3660 standby, 18650 | ~1 mA | 33 | ~82 days |
| XIAO S3 Sense, camera not in standby, 18650 | ~2.8 mA | 67 + 9 ≈ 76 | ~35 days |
| ESP32-S3 + OV5640, **not** power-gated | ~100 mA | ~2400 | **~1 day** |
| Any board, **hard power-gated** (reed/latch cuts all power), 18650 | ~0.01–0.05 mA | ~1 + 9 ≈ 10 | ~9 months (self-discharge then dominates) |
| Pi Zero 2 W, 18650 (11.1 Wh) | 280 mA idle @ 5 V = 1.4 W | — | **~7 h**, so not viable |

- **Freezer (−18 °C).** Multiply usable capacity by about 0.5–0.7 (unverified supplier figures for NMC/LFP at −20 °C). Expect voltage sag during Wi-Fi transmit bursts (300+ mA), which risks brownout resets. Lithium-primary AAs are the safest battery for a freezer: 2× AA gives about 3.0–3.6 V, fed through an LDO or buck-boost to the 3.3 V rail. Better still, run a USB cable, which also powers a lens heater (Q5).
- **Hard power-gating is the key battery design move.** ESP32 camera sleep currents are dominated by the camera LDOs, the regulator and sensor quirks (OV5640 about 100 mA). So switch the whole board off and let the trigger switch it on:
  1. The door event turns on a load switch or P-MOSFET latch.
  2. The MCU holds power via a GPIO.
  3. The MCU releases the latch when the upload is done.

  This also fixes the "camera won't sleep" problems above. Note that it makes "capture N seconds after close" harder unless the MCU stays powered through the delay. A light-sleep wait costs mA × the delay, so a 60 s wait at about 20 mA is 0.33 mAh per event.
- **Charging rules for this build:**
  - Never charge in the freezer.
  - At 2–4 °C, charging is below the 5 °C fast-charge threshold, and boards with simple chargers (XIAO onboard charger, "UPS modules", TP4056 modules with TEMP grounded) won't reduce current. Don't leave a Li-ion cell attached to a USB-powered node inside the fridge; it will keep topping up in the cold.
  - Swap batteries instead: keep two cells and charge at room temperature.
  - When bringing a cold battery or device into the house, let it warm up (ideally in a sealed bag) before charging so condensation doesn't form on the electronics.
  - Use protected 18650s in a proper holder and never use swollen LiPo pouches.
- **LiFePO4 offers no cold-charging advantage** (the same 0 °C rule applies). Its benefits are thermal stability and a 3.2 V nominal voltage close to the ESP32's 3.3 V rail, though using that directly is unverified here.
- **Mains safety:**
  - Keep all 120 V AC equipment outside the fridge. Only Class-2-style low-voltage DC (5 V USB) should cross the gasket.
  - Don't tap the fridge's internal light or door-switch wiring; it may be mains voltage.
  - Use a certified USB adapter on a GFCI-protected kitchen circuit where available.
- **Voltage drop on thin USB cables.** Assume 28 AWG power conductors at about 0.21 Ω/m (a standard wire-table value, not sourced here). A 2 m cable then has a loop resistance of about 0.85 Ω:
  - At ESP32-CAM peaks (0.3 A) that drops about 0.26 V, which is OK.
  - At Pi Zero 2 W stress current (0.58 A) it drops about 0.5 V, which risks under-voltage. Use a 5.1–5.25 V supply or a cable with thicker power conductors for a Pi.
- **Routing the cable through the gasket:**
  - Pick the shortest, flattest path, typically along the top edge near the hinge, and tape it flat.
  - Check the seal with a paper-slip test.
  - Watch for frost or condensation near the cable over the first week; either means air is leaking past the seal.
  - Don't drill the cabinet; refrigerant lines run in the walls.

### Gaps
- I found no numeric capacity retention for 18650 or LiPo cells at 2–4 °C or −18 °C from a primary source. Read it off the NCR18650B datasheet curves or use the *Data in Brief* dataset.
- No source gives the energy per capture event for an ESP32 camera board (Wi-Fi connect + capture + upload); my figures are estimates. Bench-measure with a USB power meter or a current shunt.
- Unknown: whether the XIAO ESP32S3's charger has any temperature sensing. Unknown: whether common TP4056 breakout modules ship with TEMP grounded (widely believed, but not verified here).
- No CAD prices were found for 18650 cells, holders, TP4056/UPS modules, lithium AAs, flat USB cables or load-switch modules.
- No source was found for "fast connect" techniques (static IP, cached BSSID/channel) to shorten the Wi-Fi time per wake.

---

## 4. How badly does a fridge's metal enclosure block Wi-Fi, and what are the workarounds?

### Takeaway
Real-world reports say ESP32s inside fridges and freezers usually **still connect**, because RF leaks out through the non-metal door gasket and seams. A steel cabinet is a leaky Faraday cage, not a sealed one. The signal is weakened, though, and placement matters. Measure RSSI with the door closed first. Below about −75 to −80 dBm, use an **external antenna** (ESP32-CAM: move the 0 Ω resistor to the IPEX connector) placed near the gasket, or route it outside. As a last resort, use an **ESP-NOW link to a USB-powered relay** placed right next to the fridge. This only helps by shortening the hop, since ESP-NOW is still 2.4 GHz.

### Cited Findings
- **Field reports:**
  - A Hackaday commenter on an ESP32 freezer alarm (2023): "you would think it was a Faraday cage, but it does indeed get out" — [Hackaday](https://hackaday.com/2023/07/27/esp32-freezer-alarm-keeps-tabs-on-tricky-door/)
  - A Home Assistant user with an ESP device in a fridge reported the Wi-Fi was "surprisingly working well" (per a search summary of the thread; not read directly) — [HA Community "Smart Refrigerator w/ESP8266"](https://community.home-assistant.io/t/smart-refrigerator-w-esp8266/305563)
- **Metal boxes are imperfect shields:** "any breaks in the metalwork will act as resonant slot antennas", so gaps where wires enter will radiate — [Arduino Forum](https://forum.arduino.cc/t/esp32-in-a-metal-housing/1029463)
- **Low-quality consumer articles** (flag): they say fridges reduce rather than block Wi-Fi and that the compressor adds EMI. One claims 2.4 GHz is "more susceptible due to shorter wavelength", which is physically backwards: 2.4 GHz has the longer wavelength — [CyCookery](https://cycookery.com/article/can-a-refrigerator-interfere-with-wifi); [MyHomeNiche](https://myhomeniche.com/2673/does-refrigerator-interfere-with-wifi/)
- **Rules of thumb:** the ESP32 becomes unstable below about −80 dBm. Use u.FL/SMA external antennas where available and keep antennas away from metal — [espboards.dev](https://www.espboards.dev/troubleshooting/issues/wifi/esp32-wifi-signal-weak/)
- **ESP32-CAM external antenna:**
  - A 0 Ω resistor beside the IPEX connector selects the antenna. Move it to the IPEX position (or bridge the pads with solder), and only one antenna can be used at a time — [Random Nerd Tutorials](https://randomnerdtutorials.com/esp32-cam-connect-external-antenna/)
  - The tiny resistor is hard to rework cleanly without proper tools — [Core Electronics forum](https://forum.core-electronics.com.au/t/2-4ghz-6dbi-antenna-with-u-fl-ipex-connector-fit0505/13903)
  - Press U.FL plugs straight down. MHF4 cables won't mate with U.FL/MHF1 receptacles — [Teachmemicro](https://www.teachmemicro.com/adding-antenna-to-esp32/)
  - An external antenna "can potentially easily increase range" — [Elektroda](https://www.elektroda.com/rtvforum/topic4124039.html)
  - A 2.4 GHz 6 dBi u.FL antenna is a reasonable match for the single-band ESP32-CAM — [Core Electronics forum](https://forum.core-electronics.com.au/t/2-4ghz-6dbi-antenna-with-u-fl-ipex-connector-fit0505/13903)
- **XIAO ESP32S3 Sense:** connection drops at default TX power; set `output_power: 8.5dB` and disable power save — [DigiKey Maker](https://www.digikey.ca/en/maker/projects/diy-ip-camera-with-the-seeed-xiao-esp32-sense-esphome-home-assistant/a015ed69dda64f0eafbdf12b664eea6d)
- **ESP-NOW for images:**
  - The ESPNowCam library (Arduino/PlatformIO) supports point-to-point, broadcast and many-to-one links. It reaches about 9–11 FPS at QVGA and 6 FPS at HVGA and was tested on the XIAO ESP32S3 Sense (Feb 2025) — [CNX Software](https://www.cnx-software.com/2025/02/24/espnowcam-library-enables-esp32-video-camera-or-data-transmission-with-the-esp-now-protocol/)
  - ESP-IDF (v5.0 docs) says to send at most 250 bytes per `esp_now_send` and to wait for the previous send callback. Delivery isn't guaranteed at the application layer, so add sequence numbers, ACKs and retransmits. Sender and receiver must be on the same channel — [ESP-IDF ESP-NOW docs](https://docs.espressif.com/projects/esp-idf/en/v5.0/esp32s2/api-reference/network/esp_now.html)
  - A JPEG-over-ESP-NOW experiment found a 220 ms frame interval (about 5 fps) stable; under about 200 ms caused collisions — [Zenn](https://zenn.dev/kinose/articles/45fe30ec43e4f5)

### Inferences
- **Why it usually works.** The steel shell is broken by a continuous metres-long slot: the magnetic gasket around the door. At 2.4 GHz (λ ≈ 12.5 cm) that slot leaks RF well, so **antenna placement next to the gasket line** is the cheapest fix. A rear or deep-cabinet mount is the worst case.
- **Measure first.**
  - Log RSSI (ESPHome `wifi_signal` sensor, or `WiFi.RSSI()` in Arduino) with the door closed and the compressor both on and off, at the planned mount point.
  - About −70 dBm or better: fine.
  - −70 to −80 dBm: add an external antenna or move the node.
  - Worse than −80 dBm: relay or redesign.
- **External antenna options:**
  1. A u.FL antenna inside the cabinet, stuck near the gasket.
  2. A thin u.FL pigtail (about 1.1–1.4 mm coax; the 1.3 mm probe-cable precedent suggests it can pass the gasket) so the antenna sits outside the fridge. Check that repeated door cycles don't fatigue the coax.
- **ESP-NOW relay design.**
  - Benefits:
    - No AP association or DHCP on wake, so a faster, lower-energy wake.
    - A hop of under 1 m to a USB-powered hub on top of or beside the fridge.
    - The hub (any ESP32) does the Wi-Fi/HTTPS work.
  - Costs:
    - A custom chunk, ACK and retry protocol: a roughly 100–250 KB UXGA/QXGA JPEG is about 400–1000 chunks of 250 bytes.
    - Channel locking, since the hub's Wi-Fi channel dictates the ESP-NOW channel.
    - A second device to maintain.
  - Extrapolating ESPNowCam's QVGA frame rates, a single large still should take about 2–5 s.
  - Use it only if the direct Wi-Fi RSSI is bad.
- **Architecture alternative that removes the RF problem entirely:** keep the computer *outside* and put only the sensor inside, for example a Pi Zero 2 W outside with a thin camera cable or a USB camera through the gasket. Commercial "anti-fog, anti-moisture USB cameras for fridges" exist — [CM Technology](http://www.camera-module.com/product/others/anti-fog-anti-moisture-usb-camera-fridge-freezer.html). This also puts power and heat outside.

### Gaps
- I found no measured attenuation (dB) for a household fridge or freezer door, closed vs open. The community evidence is anecdotal.
- No before/after range figures exist for the ESP32-CAM external-antenna mod.
- Not verified (search budget exhausted): newer ESP-IDF (≥5.4) "ESP-NOW v2" payload limits (believed to be larger than 250 bytes); Pi CSI cable maximum lengths and how a CSI flat-flex cable tolerates being pinched by a door gasket.
- The ESPHome issue #16926 status (Q7) and any fridge RSSI threads could not be checked.

---

## 5. How do you deal with condensation and lens fogging, and what enclosure materials should you use?

### Takeaway
Fog forms when warm, humid room air reaches a lens colder than the air's dew point, which happens at every door opening. Haier patents a dedicated refrigerator-camera anti-fog design, so it is a real engineering problem. For a battery node:
- avoid the problem by **delaying the capture until the fog clears**;
- reject foggy frames with a sharpness check;
- seal the electronics with **desiccant**.

For a USB-powered node, add a **low-wattage heater on a small window in front of the lens**. Alberta's dry winter indoor air (low dew point) should fog a 3 °C lens far less than humid summer air. The freezer (−18 °C) will frost almost regardless. **PETG** is the practical enclosure material for a fridge. All common FDM plastics become brittle around −20 °C, and printed parts are not food-contact surfaces.

### Cited Findings
- **Mechanism:**
  - Dew forms when the glass cools to a few degrees below the air's dew point — [Sky at Night](https://www.skyatnightmagazine.com/advice/diy/make-camera-lens-dew-heater-stop-fogging)
  - When the door opens, warm air enters, mixes with cold air and condenses as fog, especially when room air is warm and humid — [Maytag](https://producthelp.maytag.com/Refrigeration/Full-size_Refrigerators/Tips_and_Tricks/What_is_the%22fog%22_When_the_Doors_are_Opened); [Whirlpool](https://producthelp.whirlpool.com/Refrigeration/Full-Size_Refrigerators/Product_Info/Tips_and_Tricks/What_is_the%22fog%22_When_the_Doors_are_Opened)
  - Typical setpoints are 4–5 °C for the fridge and −18 °C for the freezer — [Beko](https://www.beko.com/us-en/support/refrigerator--troubleshooting--article/how-can-i-prevent-condensation-in-my-refrigerator)
- **Patents (fridge-specific):**
  - Haier's US11122203B1 (priority May 2020), "Refrigerator camera modules and methods for preventing lens fog", generates heat at the camera module in the chilled chamber. It notes this can be done without a dedicated resistance heating element — [Google Patents](https://patents.google.com/patent/US11122203)
  - Haier also has US 2023/0308632, "...methods for addressing persistent conditions on the camera lens" — [Justia](https://patents.justia.com/patent/20230308632)
  - CN106091557B starts a heating wire when someone approaches to open the door — [Google Patents](https://patents.google.com/patent/CN106091557B/en). Related: [CN106123475B](https://patents.google.com/patent/CN106123475B/en), [KR20170050546A lens heater with temperature control](https://patents.google.com/patent/KR20170050546A/en), [WO2017048014A1 thin-film camera heater](https://patents.google.com/patent/WO2017048014A1/en)
- **Commercial modules:** "anti-fog and anti-moisture" 1.2 MP USB cameras for fridges and freezers are sold B2B — [CM Technology](http://www.camera-module.com/product/others/anti-fog-anti-moisture-usb-camera-fridge-freezer.html)
- **DIY dew control (astro and security-camera practice):** hand warmers or USB heating strips on lenses — [Sky at Night](https://www.skyatnightmagazine.com/advice/diy/make-camera-lens-dew-heater-stop-fogging); [NightSkyPix](https://nightskypix.com/condensation-in-camera-lens/). Silica-gel desiccant in housings, replaced as needed, and heated ventilated housings for persistent cases — [Reolink](https://reolink.com/blog/security-camera-condensation-causes-solutions/); [SecurityWow](https://securitywow.com/security-camera-condensation-and-fogging-solutions/)
- **Existing DIY build:** the Dubovsky project doesn't specify a sealed enclosure or protection against condensation; the guide notes the fridge is cold and humid — [Popular AI](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)
- **Pi camera spec:** Camera Module 3 should be operated in a dry environment at 0–50 °C — [CM3 product brief](https://cdn.sparkfun.com/assets/c/b/3/a/1/Camera_Module_3_Product_Brief.pdf)
- **Materials:**
  - PLA and PETG both become brittle around −20 °C — [All3DP](https://all3dp.com/2/petg-vs-pla-3d-printing/); [Snapmaker](https://www.snapmaker.com/blog/petg-vs-pla/)
  - PETG's parent plastic, PET, is common in food packaging; whether a given grade is food-safe depends on the grade — [ThinkRobotics](https://thinkrobotics.com/blogs/learn/petg-vs-pla-3d-printing-material-guide-for-makers-and-professionals); [FacFox](https://facfox.com/docs/kb/petg-vs-pla-filament-the-differences)
  - The FDM process leaves micro-gaps that harbour bacteria; use filament with food-contact approval if food will touch it — [ThinkRobotics](https://thinkrobotics.com/blogs/learn/petg-vs-pla-3d-printing-material-guide-for-makers-and-professionals); [3Dnatives](https://www.3dnatives.com/en/pla-vs-petg-which-material-should-you-choose-110520215/amp/)
  - PLA softens around 60 °C and PETG up to about 80 °C, which matters for dishwasher cleaning — [ThinkRobotics](https://thinkrobotics.com/blogs/learn/petg-vs-pla-3d-printing-material-guide-for-makers-and-professionals)

### Inferences
- **Dew-point math** (Magnus formula, my calculation). The lens sits at fridge temperature (about 3 °C):

| Room air at 21 °C | Dew point | Fog on a 3 °C lens? |
|---|---|---|
| 20% RH (typical heated Alberta winter interior; assumption) | ≈ −2.8 °C | Unlikely |
| 30% RH | ≈ 2.8 °C | Borderline |
| 40% RH | ≈ 6.9 °C | **Yes** |
| 60% RH (humid summer, cooking) | ≈ 12.9 °C | **Yes, heavily** |

  - In the freezer (−18 °C), room air at 21 °C would need RH below about 5% to avoid frost, so **frost on a freezer lens is essentially certain** at every opening.
- **Ranked anti-fog strategy:**
  1. **Time it out.** Capture 1–3 min after close (tune by testing). Score frames for sharpness (Laplacian variance, as m0nklabs does) and retry later if foggy. This costs nothing on battery.
  2. **Shield the lens.** Recess it behind a small hood and a flat glass or acrylic window so the gust of room air doesn't hit the optics directly. Seal the electronics enclosure with a gasket or O-ring and a silica-gel packet. Conformal-coat the PCB if you're comfortable doing so.
  3. **Heat the window (USB-powered only).**
     - Continuous: a resistor heater at about 0.25 W (e.g., 5 V across about 100 Ω) uses about 6 Wh/day, more than half an 18650 (11.1 Wh) per day. That is impossible on a battery but trivial on USB.
     - Event-driven: heating for 60 s per door event costs about 34 mAh/day at 30 events. That roughly doubles the ~33 mAh/day budget of an efficient node, or adds 20–40% on a stock ESP32-CAM. It is possible, but only helps if the heater starts as the door opens (the CN patent's "on approach" idea), because clearing fog after it forms is slow.
  4. **Freezer node:** USB power plus a heated window are effectively required.
- **Materials:**
  - **PETG** for fridge enclosures: tough, low-odour, food-packaging chemistry, wipeable.
  - **ASA/ABS** are fine mechanically but harder to print.
  - **PLA** works at 3 °C but is brittle and can't be dishwashed.
  - In the freezer, use thicker walls, avoid thin snap-fits and living hinges, and fasten with screws or VHB tape.
  - Keep printed parts out of direct food contact. Design smooth outer surfaces (top-surface ironing, chamfers, no crumb-trapping crevices) and clean with mild soap and water. Use isopropyl alcohol on a microfibre cloth for the lens window.
- **Placement vs moisture:** don't mount directly in the cold-air outlet stream or near the crisper drawers' humid zone. Keep the window vertical or angled down so drips run off.

### Gaps
- I found no DIY fridge build that reports its fogging experience or how long fog takes to clear. This needs testing.
- The Haier patent's actual heat source and claims weren't readable in search results.
- No test data on hydrophilic anti-fog coatings (e.g., goggle or mirror sprays) at fridge temperatures.
- No source on fridge interior RH.
- The Alberta indoor-humidity figures are my assumption.

---

## 6. Where should it be mounted, and how many cameras are needed (field-of-view math)?

### Takeaway
No single camera sees a whole fridge.
- A **door-mounted ultra-wide (fisheye ~150–170°) camera** looking back into the cabinet when closed gives the best one-camera overview (the FridgeCam approach). Reviewers still said it "can't see everywhere".
- A **120° rectilinear camera** (Pi CM3 Wide) at about 50 cm from the back wall covers about 124 × 66 cm. That is roughly a full shelf width but only 2–3 shelves of height, and the front edges of the top and bottom shelves fall outside the frame.
- Full coverage realistically needs **one camera per shelf zone**, plus separate solutions for door bins and crisper drawers. Neither Samsung's commercial system nor any DIY build covers those.

**Pragmatic plan:** one main-compartment camera now (or two stacked), and keep phone scans (Phase 1) for drawers and door bins.

### Cited Findings
- **Lens figures:**
  - CM3 Wide: 120° diagonal, 102° horizontal, 67° vertical, focus 5 cm to infinity — [Raspberry Pi brief](https://datasheets.raspberrypi.com/camera/sensor-assembly-product-brief.pdf)
  - ESP32-S3-EYE OV2640: 66.5° — [Espressif](https://github.com/espressif/esp-who/blob/master/docs/en/get-started/ESP32-S3-EYE_Getting_Started_Guide.md)
  - Timer Camera X OV3660: 66.5° DFOV — [M5Stack](https://docs.m5stack.com/en/unit/TimerCamera-X)
  - Unit CamS3-5MP: 88° DFOV, fixed focus 0.6 m — [M5Stack](https://docs.m5stack.com/en/unit/Unit_CamS3-5MP)
  - Adafruit OV5640: 160° fisheye, or a 120° autofocus version — [Adafruit](https://www.adafruit.com/product/5841)
  - 160° OV2640 24-pin modules — [Walmart listings](https://www.walmart.com/c/kp/ov2640)
  - LILYGO T-Camera S3 has a fisheye lens — [Hubtronics](https://hubtronics.in/h644)
- **Smarter FridgeCam (2018–19):**
  - Mounts with a sticky pad, usually on the door, facing the main shelves — [Tech Advisor](https://www.techadvisor.com/article/719327/smarter-fridgecam-review.html). Or by suction cup inside the fridge — [Stuff](https://stuff.tv/news/smarters-fridge-cam-watching-your-food)
  - Its fisheye lens sees top to bottom with an LED flash, but it "can't see everywhere" — [Expert Reviews](https://www.expertreviews.co.uk/gadgets/1407382/smarter-fridgecam-review)
- **Samsung AI Vision Inside:** a camera at the top of the fridge; door bins and the freezer are not covered — [Tom's Guide](https://www.tomsguide.com/news/samsung-unveils-2024-bespoke-family-hub-refrigerator-with-vision-ai-heres-what-it-can-do); [retailer listing](https://compughana.com/products/samsung-636l-4-doors-bespoke-ai-fridge-black)
- **Dubovsky's fridge-card** has rotation settings "for a crooked mount" — [Popular AI](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant); [fridge-card](https://github.com/jan-tdy/fridge-card)
- **m0nklabs firmware** is configured per camera with a camera ID and a zone (fridge or freezer), i.e. multi-camera by design — [m0nklabs](https://github.com/m0nklabs/fridge-cam-firmware)
- **Object position** strongly affects ESP32-CAM recognition (71–99% test accuracy) — [ResearchGate](https://www.researchgate.net/publication/389362447_Application_of_Edge_Impulse_and_ESP32-CAM_in_Smart_Freezer_Systems_for_Object_Recognition)

### Inferences
**FOV math (my calculations).**

**Formulas**
- Coverage at distance *d*: 2·d·tan(FOV/2)
- Required FOV for width *W* at distance *d*: 2·atan(W/2d)

**Assumed geometry** (only width and depth come from the brief; the rest is my assumption)
- Shelves 60–75 cm wide × 40–45 cm deep (from the brief).
- Shelf pitch about 25 cm.
- Main compartment about 100 cm tall.
- About 50 cm from the door inner face to the back wall.

**Converting diagonal FOVs to 4:3 sensors.** These are rectilinear approximations; fisheyes deviate.
- 66.5° diagonal → about 55° H × 43° V.
- 88° → about 75° × 60°.
- 120° → about 108° × 92°.

**A. Door-mounted camera looking back (door closed), coverage at the back wall (50 cm):**

| Camera | Coverage W × H at 50 cm | Pixels across 7 cm item* |
|---|---|---|
| OV2640 stock ~66° (1600 px) | 52 × 39 cm, about one shelf | ~215 px |
| Unit CamS3-5MP 88° (2592 px) | 77 × 58 cm, one 75 cm shelf width × ~2 shelves | ~235 px |
| OV2640 + 120° lens (1600 px) | 139 × 104 cm, whole wall (distorted) | ~80 px |
| OV5640 + 120° lens (2592 px) | 139 × 104 cm | ~130 px |
| CM3 Wide, landscape (4608 px†) | 124 × 66 cm, ~2.5 shelves | ~260 px |
| CM3 Wide, portrait | 66 × 124 cm, full height, but clips ~5 cm per side on a 75 cm shelf | ~275 px (2592 px across 66 cm) |

*A 330 mL can is about 6.6 cm wide. †4608 px assumed (IMX708; not verified here). Dubovsky's 640×480 frames give about 4× fewer pixels than full-res OV2640.

- **Blind spot.** Shelf fronts are only about 10–15 cm from a door-mounted lens. To see the front edge of a shelf 50 cm above or below the lens axis, the half-angle must be atan(50/12.5) ≈ 76°, a full vertical FOV of about **150°+**. That is why FridgeCam uses a fisheye. Rectilinear 120° lenses miss the front 10–20 cm of the top and bottom shelves.
- **B. Top-down camera under each shelf** (looking at the shelf below from about 25 cm):
  - Needs about 100° H (60 cm shelf) to 113° H (75 cm) × 77–84° V (40–45 cm depth), i.e. about **120° diagonal** minimum.
  - Shows lids and tops only (labels unreadable). Tall items come within about 5 cm of the lens, closer than fixed-focus lenses can resolve (Unit CamS3-5MP focuses at 0.6 m), so autofocus (OV5640/IMX708) helps.
  - One camera per shelf: 3–4 for a full fridge.
- **C. Front-edge camera under each shelf, angled back and down at about 30–45°:**
  - Sees the front faces of items on the shelf below, with a better chance to read labels.
  - Needs about 80° H to span 75 cm at the back (45 cm away). Front corners are still missed.
  - Also one per shelf.
- **D. Ceiling front-centre, angled back and down:** sees mainly the top shelf; lower shelves are occluded by items on upper shelves (glass doesn't help when items block the view).

**Recommendations**
- **One-camera build:**
  - Door-mounted near the top of the inner door liner, looking back and slightly down.
  - Use a 150–170° fisheye OV2640/OV5640 for coverage, or the CM3 Wide in portrait for detail (accepting front-edge blind spots on the top and bottom shelves).
  - On French-door fridges, a camera on one door sits off-centre; a ceiling front-centre mount may suit better.
  - Consistent framing across scans matters more than total coverage for the scan-diff pipeline. Fix the mount mechanically and keep the door-closed geometry identical.
- **Two-camera build, ranked options:**
  1. Two door- or ceiling-mounted cameras stacked (upper and lower zones) for the main compartment.
  2. One main camera plus one freezer camera (USB-powered and heated; see Q5).
  3. One main camera plus one door-bin camera. The door-bin camera sits on the cabinet's front side wall near the hinge, aimed at the door, and shoots while the door is open (light is available). The door angle varies, so the reed switch alone can't confirm framing. Use a burst and pick the frame with the most bin area.
- **Crisper drawers** are opaque or translucent and closed, so a fixed camera can't see in. The options are a small camera mounted under the glass shelf above the crisper, looking through the glass cover if it is clear, or keeping drawers on Phase 1 phone scans. Samsung doesn't cover them either.
- **Door bins:** a top-down view from the top of the door liner sees only the top bin. Lower bins are hidden under upper ones.

### Gaps
- I found no published FOV or coverage measurements from any DIY fridge-cam build. Dubovsky's mount position and lens aren't documented in the snippets I could read.
- Typical fridge internal dimensions (shelf pitch, compartment height, door-to-back-wall distance) are my assumptions. Measure the actual fridge.
- Fisheye projection makes the rectilinear numbers approximate; real coverage and edge resolution need a test shot.
- Whether vision-LLMs cope well with heavy fisheye distortion vs a dewarped image is untested here. Dewarping on the server with OpenCV is an option.

---

## 7. Firmware, upload paths, Home Assistant integration, and existing open-source builds

### Takeaway
- **Firmware.** Because this product already has its own backend, the most direct path is **Arduino-ESP32 (PlatformIO) or ESP-IDF firmware that HTTP-POSTs the raw JPEG to the backend**. That is how the m0nklabs and 7Z0nE fridge cams work. **ESPHome** is the quickest route only if Home Assistant is the hub (Dubovsky's fridge-core). It is pull-oriented (HA fetches snapshots), and a 2026 regression (#16926) broke some camera boards, so pin a known-good version.
- **Transport.** Use **MQTT only for metadata**, because large images break typical MQTT buffers.
- **Home Assistant.** `ai_task.generate_data` (with camera attachments and structured output) and the **LLM Vision** integration both support vision LLMs including Anthropic, OpenAI, Gemini and Ollama.
- **Starting points.** The closest open-source match to Phase 2 is **m0nklabs/fridge-cam-firmware**: ESP32-S3 + OV5640, light-triggered wake, burst capture with sharpest-frame selection, upload to a server for AI. For an HA-centric reference with a polished UI, use Dubovsky's **fridge-core + fridge-card** (MIT).

### Cited Findings
#### Firmware frameworks and upload paths
- **ESPHome `esp32_camera`:**
  - Needs I²C and PSRAM; frame buffers default to PSRAM; higher resolutions need more memory or you get startup errors — [ESPHome docs](https://esphome.io/components/esp32_camera/)
  - An esphome-docs PR added 3 MP and 5 MP resolutions and an arbitrary camera clock — [esphome-docs PR #2759](https://github.com/esphome/esphome-docs/pull/2759)
  - Example configs use `jpeg_quality` values of 6–13 — [HA Community ESP32-S3 OV2640 thread](https://community.home-assistant.io/t/esp32-s3-ov2640-camera/912863)
- **2026 regression:** on ESPHome **2026.5.3**, OV2640 and OV3660 boards failed with `ESP_ERR_NOT_SUPPORTED`, while the same hardware worked with Arduino's CameraWebServer example. Fix status unknown — [esphome/esphome #16926](https://github.com/esphome/esphome/issues/16926)
- **ESPHome pull model:** an ESP32-CAM wakes periodically and serves snapshots via the `esp32_camera_web_server` snapshot port, and HA pulls the image with a shell command. The poster wished the device could upload directly instead — [HA Community](https://community.home-assistant.io/t/esp32-cam-capture/340620/12)
- **OV5640 ESPHome config example** (pins, external clock) — [HA Community](https://community.home-assistant.io/t/esp32-camera-ov5640/507409/4)
- **Full ESPHome configs** for the AI-Thinker ESP32-CAM — [Haade.fr](https://haade.fr/en/blog/esp32cam-ai-thinker-homeassistant-esphome-full-configuration); [James A. Chambers](https://jamesachambers.com/cheap-esp32-cam-home-assistant-esphome-camera-guide/)
- **MQTT vs HTTP:**
  - Base64 inflates images, and a 2 MP image (about 217 KB base64) can exceed ESP32 internal RAM — [esp32.com](https://esp32.com/viewtopic.php?p=84242)
  - A long base64 string was too big for `client.publish()`. Suggested fixes: chunk it, store the image elsewhere and send a link, or use HTTP — [HiveMQ community](https://community.hivemq.com/t/unable-to-publish-base64-code-to-websocket/2517)
  - The default ESP-IDF MQTT buffer is 4096 bytes; raising it to 16384 still crashed on large payloads — [HA Community](https://community.home-assistant.io/t/handling-large-mqtt-payloads/708996)
  - For HTTP multipart, stream the JPEG in chunks and make `Content-Length` include the multipart header and tail — [Particle community](https://community.particle.io/t/how-to-integrate-esp32-cam-with-particle-boron/61541)
  - A common bug is the binary not being inserted correctly into the multipart body — [Arduino forum](https://forum.arduino.cc/t/send-post-to-api-esp32cam/1112757)
  - Avoid building large Arduino `String`s for UXGA images — [esp32cam-gdrive issue](https://github.com/gsampallo/esp32cam-gdrive/issues/4)
- **Home Assistant AI Task:**
  - The AI Task entity arrived in HA 2025.7 — [HA AI Task integration](https://www.home-assistant.io/integrations/ai_task/); [HA 2025.8 release](https://www.home-assistant.io/blog/2025/08/06/release-20258/)
  - `ai_task.generate_data` returns free text or structured data (via a `structure` map of fields with selectors). It accepts `attachments` such as a camera via `media-source://camera/<entity_id>` — [HA docs: Generate data](https://www.home-assistant.io/actions/ai_task.generate_data/)
  - Community reports say remote providers (OpenAI, Gemini) can't use media-source paths, so a local media path may need `allowlist_external_dirs` — [HA Community blueprint threads](https://community.home-assistant.io/t/ai-camera-analysis/911634); [HA CCTV-to-Gemini guide](https://community.home-assistant.io/t/guide-for-cctv-snapshot-on-motion-send-to-google-generative-ai-get-notification-with-description-snapshot/706358/190)
  - Under Ollama, gpt-oss failed at camera analysis while gemma3:12b worked — [HA Community](https://community.home-assistant.io/t/using-music-assistant-tts-announcement-to-play-ai-image-recognition-task-response-text/944854)
- **LLM Vision** (valentinfrlch/ha-llmvision):
  - Providers: OpenAI, Anthropic, Google Gemini, AWS Bedrock, Groq, Ollama, LocalAI, Open WebUI and any OpenAI-compatible endpoint (some listings add Azure and OpenRouter).
  - "Memory" (reference images with descriptions) and a "Timeline" of analysed events with a Timeline Card.
  - [LLM Vision docs](https://llm-vision.gitbook.io); [Providers](https://llm-vision.gitbook.io/getting-started/setup/providers); [GitHub wiki](https://github.com/valentinfrlch/ha-llmvision/wiki)

#### Existing builds: hardware used and problems reported
**1. Jan Dubovsky (GitHub `jan-tdy`), "fridge-core" + "fridge-card" (MIT, 2026)**
- **Hardware:** AI-Thinker ESP32-CAM running an ESPHome config with a video stream, the GPIO4 flash LED and a GPIO13 reed-switch door sensor.
- **Capture flow:** snapshots on door open. The LED lights the interior, a 640×480 JPEG is saved, and it goes to `ai_task.generate_data`. The response is parsed into items and added to or updated in an HA to-do list.
- **AI provider:** the blueprint works with Google Generative AI, OpenAI Conversation and others, but needs a vision-capable AI Task provider.
- [HA Community](https://community.home-assistant.io/t/fridge-cam-ai-content-recognition-esp32-cam-ha-blueprint-a-custom-lovelace-card/1023750); [Popular AI](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)
- **fridge-card:**
  - Shows the latest photo, with rotation settings for a crooked mount and optional saving and browsing of past photos.
  - Editable item list (mark eaten, delete). User-edited quantity, condition, note or brand fields are protected from AI overwrite on the next scan.
  - Releases ran from about v1.10.0 (early Sep 2026) to v1.17.0 (8 Oct 2026), with fixes to the door and light status indicators and to edit handling, plus confirmation before permanent deletion.
  - [fridge-card](https://github.com/jan-tdy/fridge-card); [v1.17.0](https://github.com/jan-tdy/fridge-card/releases/tag/v1.17.0); [v1.10.0](https://github.com/jan-tdy/fridge-card/releases/tag/v1.10.0)
- **Problems reported:** none were found in search results. The guide notes no sealed enclosure or condensation protection is specified — [Popular AI](https://www.popularai.org/p/diy-ai-fridge-camera-home-assistant)

**2. DecayDock (Instructables user ptallthings93; Hackster and Hackaday coverage, 2026)**
- **Hardware:** ESP32-CAM with a TFT display in a custom **magnetic enclosure on the fridge door** — [Hackster](https://www.hackster.io/news/decaydock-the-tiny-ai-device-that-combats-food-waste-3a34ddad9cbf); [Instructables](https://www.instructables.com/DecayDock-AI-Smart-Fridge-Companion/)
- **Model:**
  - An Edge Impulse model runs locally (no cloud). It recognises tomatoes, onions, bananas, spinach, milk cartons and leftovers.
  - It was trained on dozens of images captured with the ESP32-CAM under varied lighting.
  - [Hackster](https://www.hackster.io/news/decaydock-the-tiny-ai-device-that-combats-food-waste-3a34ddad9cbf); [LetsDataScience](https://letsdatascience.com/news/decaydock-uses-local-ai-to-track-fridge-freshness-a980b35c)
- **Use:** items are **held up to the camera**. Freshness shows as green, yellow or red on the LCD.
- **Limitations:** Hackaday (20 May 2026, Zoe Skyforest) notes it only estimates freshness and can't detect mould or sour milk — [Hackaday](https://hackaday.com/2026/05/20/decaydock-keeps-track-of-spoilage/)
- **Award:** Second Prize in Instructables' "Dream a Better World" contest — [Instructables contest](https://www.instructables.com/contest/betterworld26/)
- **Conflicting version:** RS DesignSpark describes an Arduino UNO Q "dual brain", a temperature sensor, a web dashboard and WhatsApp alerts. It estimates freshness from food type, storage duration, fridge temperature and user interaction history. This may be a later or planned iteration — [RS DesignSpark](https://www.rs-online.com/designspark/decaydock-ai-powered-smart-fridge-companion-for-reducing-household-food-waste)

**3. arXiv 2509.07400, "A smart fridge with AI-enabled food computing"**
- **Paper:** Khue Nong Thuc + 4 co-authors; submitted 9 Sep 2025; eess.SY; 9th OISP Science & Technology Symposium for Students, HCMUT (VNU-HCM) — [arXiv](https://arxiv.org/abs/2509.07400)
- **System:** an ESP32-CAM monitoring subsystem for real-time food detection, inventory tracking and temperature monitoring — [arXiv PDF](https://arxiv.org/pdf/2509.07400)
- **Model and data:**
  - Uses YOLO with focal loss (more stable validation loss) and temperature scaling for class-wise calibration, which they say improves reliability under varying lighting.
  - Dataset: real ESP32-CAM images plus online images with Roboflow augmentation.
  - [arXiv PDF](https://arxiv.org/pdf/2509.07400)
- **Unverified details:**
  - MQTT pub/sub messaging (seen only in a German translation of the abstract) — [alphaXiv (DE)](https://www.alphaxiv.org/de/abs/2509.07400)
  - "YOLOv7 on a YOLO UNO board", and focal-loss variants being underconfident (needing post-hoc calibration) — [Pith review](https://pith.science/paper/2509.07400)
- **Problems reported:** lighting variability; overfitting before focal loss.

**4. Smarter FridgeCam (2017–19; older product, flag)**
- **Hardware and use:**
  - Fisheye lens covering top to bottom, with an LED flash.
  - Battery needs charging infrequently because it runs only to take photos and sync — [Expert Reviews (2018)](https://www.expertreviews.co.uk/gadgets/1407382/smarter-fridgecam-review)
  - 1800 mAh battery, micro-USB charging, 2.4 GHz Wi-Fi — [retail listing](https://www.desertcart.com.cy/products/97372531)
  - Six-hour initial charge — [Which? (2019)](https://www.which.co.uk/news/2019/03/is-it-worth-buying-a-fridge-camera/)
  - Snapshot on door close — [KBB Review](https://www.kbbreview.com/?p=11158)
  - Can stream up to 1080p — [Reviewed](https://reviewed.com/refrigerators/features/smarter-fridge-cam-shows-whats-in-your-refrigerator)
- **Problems reported:**
  - Object recognition "failed to recognise a single item" in two weeks; "can't see everywhere"; "overpriced" — [Expert Reviews](https://www.expertreviews.co.uk/gadgets/1407382/smarter-fridgecam-review)
  - The review unit's micro-USB port was misaligned — [Tech Advisor](https://www.techadvisor.com/article/719327/smarter-fridgecam-review.html)
  - Unclear how expiry tracking works — [Mental Floss](https://www.mentalfloss.com/article/503764/smart-fridge-camera-will-warn-you-when-your-food-going-bad)

**5. Other open-source fridge cams found**
- **Michdo93/fridge-cam:**
  - ESP32-CAM Arduino sketch plus a Python script. It photographs on door close, triggered by a Miele fridge's door state in openHAB via SSE, sends the image to the **Claude API**, and writes the description back to an openHAB item.
  - Streams live video on demand.
  - [GitHub](https://github.com/Michdo93/fridge-cam)
- **7Z0nE/esp32-fridgecam:** ESP-IDF; photographs and uploads on door close — [GitHub](https://github.com/7Z0nE/esp32-fridgecam)
- **m0nklabs/fridge-cam-firmware** (part of "HungryFoodTool"):
  - ESP32-S3-N16R8 + OV5640 5 MP autofocus.
  - GL5528 LDR wake, about 10 µA sleep (claimed).
  - 3-frame burst, sharpest frame by Laplacian variance, Wi-Fi upload with all AI on the server.
  - Power: 2× 18650 via a Type-C UPS module.
  - PlatformIO config header for Wi-Fi, server URL, camera ID and zone (fridge or freezer).
  - [GitHub](https://github.com/m0nklabs/fridge-cam-firmware)

**6. Commercial reference: Samsung AI Vision Inside (2024)** — see Q2 and Q6 for its constraints (one item at a time, no door bins or freezer) — [Samsung Newsroom](https://news.samsung.com/us/samsungs-most-intelligent-fridge-is-getting-smarter-with-family-hub-for-2024-update)

### Inferences
- **Recommended firmware path for this project:**
  - PlatformIO + Arduino-ESP32 (the builder uses AI coding tools, and Arduino has the most examples), modelled on m0nklabs's flow.
  - **Steps:**
    1. Wake on reed or LDR.
    2. Wait the debounce and fog delay.
    3. Turn on the LEDs.
    4. Discard 1–2 frames while auto-exposure and white balance settle (common ESP32-CAM practice; unsourced).
    5. Capture a 3-frame burst at full resolution and keep the sharpest.
    6. HTTP POST.
    7. Sleep or power off.
  - **POST format:** send the raw JPEG with `Content-Type: image/jpeg`, plus headers or a query string for device ID, zone, door-event ID, capture time, battery voltage, RSSI, firmware version and sharpness score. This avoids multipart pitfalls.
  - **Server behaviour:** the backend acknowledges fast and processes asynchronously.
  - **Security:** use a per-device bearer token.
  - **TLS:** use HTTPS if the backend is on the internet (it costs ESP32 RAM and about 1–2 s of handshake). Alternatively POST over the LAN to a local relay that forwards over HTTPS.
  - **Offline fallback:** store-and-forward to an SD card when Wi-Fi fails (XIAO, Freenove and ESP32-CAM all have SD slots).
  - **Updates:** enable OTA so the fridge unit never needs to be removed.
- **S3-compatible storage:** let the backend write to S3, R2 or MinIO. Presigned-URL uploads straight from the device add a round trip and complexity, so they are not worth it for one household.
- **MQTT:** use it only for small JSON (capture done, door state, battery, RSSI) and HA discovery; never for the JPEG.
- **ESPHome route (HA-first):**
  - Use a `binary_sensor` for the reed switch and the `esp32_camera` entity.
  - An HA automation runs `camera.snapshot` and then `ai_task.generate_data` with `structure` (or LLM Vision `image_analyzer`), and the fridge-card renders the result.
  - Pin an ESPHome version known to work on your board, given the 2026.5.x regression.
  - This route keeps everything inside HA, but it duplicates the product's own pipeline. Use it only if the product is HA-based.
- **Which build to fork:**
  - m0nklabs (closest architecture to Phase 2: server-side AI, deep sleep, burst + sharpest frame).
  - Dubovsky (best HA UX patterns, notably protecting user edits from AI overwrite, which is directly relevant to the product's item-history logic).
  - Michdo93 (an example of a Claude API integration).
- **Lessons from the builds:**
  - Every DIY build uses a single camera, and none reports coverage, fogging or battery data. These are the open problems to test early.
  - FridgeCam's failure was the recognition software, not the hardware. Today's vision LLMs are the big change since 2018.
  - Item positioning drives accuracy (71–99%).

### Gaps
- The fridge-core repository README, its exact ESPHome YAML, and any issue-tracker problem reports were not readable. GitHub pages failed DNS; I followed the instruction not to use GitHub tools on third-party repos.
- The status of ESPHome issue #16926 (fixed or not, which version) could not be checked because the search budget was exhausted.
- arXiv 2509.07400's exact hardware (camera module, lighting, mount), final mAP numbers and Wi-Fi or condensation issues could not be read (arXiv fetch failed).
- DecayDock's full BOM and power source were not available (Instructables fetch failed).
- The 7Z0nE build's upload endpoint, trigger hardware and problems are unknown.
- No source covers ESPHome deep-sleep camera workflows in detail. An HA thread exists but wasn't read — [HA Community](https://community.home-assistant.io/t/esp32camera-deep-sleep/760073)

---

## 8. Parts list with approximate CAD costs (one-camera and two-camera builds) and tools

### Takeaway
- A **one-camera ESP32 build costs roughly CAD 80–165**. The core boards (ESP32-CAM about CAD 14–17; XIAO ESP32S3 Sense about CAD 30–51) are cheap; the lens, LEDs, antenna, cable and enclosure make up the rest.
- A **Pi Zero 2 W + Camera Module 3 Wide build costs roughly CAD 130–185**. The board and camera are about CAD 73 at PiShop.ca.
- **Two-camera builds roughly double this.** Sharing a power supply saves a little; a freezer node adds a heater and wiring.
- Only the core-board and Pi prices below are sourced from Canadian listings. **Every small-part price is my estimate** and needs checking (the search budget ran out).

### Cited Findings
- ESP32-CAM + ESP32-CAM-MB: CAD 13.95–14.97; bare board C$16.99 — [Universal Solder](https://universal-solder.ca/esp32-cam-mb-with-usb-adapter/); [Universal Solder](https://www.universal-solder.ca/product/esp32-cam-espressif-esp32-wifi-bluetooth-ble-module-and-2mp-camera/)
- 160° OV2640 24-pin module: about US$13.88 — [Walmart](https://www.walmart.com/c/kp/ov2640)
- XIAO ESP32S3 Sense:
  - US$21.55 for 1 or US$18.84 at 10 (TME Canada) — [TME](https://www.tme.com/ca/en/katalog/development-kits_100636/p,seeed-studio_1325/)
  - About CAD 51 on Amazon.ca (third-party) — [Amazon.ca](https://www.amazon.ca/Seeed-Studio-XIAO-ESP32S3-Sense/dp/B0C69FFVHH)
  - About $22 at DigiKey — [DigiKey.ca](https://www.digikey.ca/en/products/detail/seeed-technology-co-ltd/113991114/19285530)
  - US$23.99 on Amazon.com (Jun 2026) — [camelcamelcamel](https://camelcamelcamel.com/product/B0C69FFVHH)
- OV5640 module for XIAO (with heat sink): stocked at DigiKey.ca, price not captured — [DigiKey.ca](https://www.digikey.ca/en/products/detail/seeed-technology-co-ltd/114993115/21277047)
- Pi Zero 2 W:
  - CAD 21.95, or 25.95 with header (PiShop.ca) — [PiShop](https://www.pishop.ca/product/raspberry-pi-zero-2-w/); [PiShop](https://www.pishop.ca/product/raspberry-pi-zero-2-w-with-header/)
  - BC Robotics: CAD 28.95, or 32.95 with header — [BC Robotics](https://bc-robotics.com/shop/raspberry-pi-zero-2w/); [BC Robotics](https://bc-robotics.com/shop/raspberry-pi-zero-2w-with-header/)
- Camera Module 3 Wide:
  - CAD 50.95 (PiShop.ca, in stock) — [PiShop](https://www.pishop.ca/product/raspberry-pi-camera-module-3-wide/)
  - $55.52 (DigiKey.ca) — [DigiKey.ca](https://www.digikey.ca/en/product-highlight/r/raspberry-pi/camera-module-3-and-m12-mount-high-quality-camera)
  - $67.95 (BC Robotics, out of stock) — [BC Robotics](https://bc-robotics.com/shop/raspberry-pi-camera-module-3-wide/)
- Pi Zero needs a "Zero" camera cable — [Pakronics](https://pakronics.com.au/products/raspberry-pi-camera-module-3-wide-rpi-sc0874)
- ESP32-P4X-EYE: US$35 (Mouser), US$33.68 (DigiKey) — [Mouser](https://mouser.com/ProductDetail/Espressif-Systems/ESP32-P4X-EYE?qs=Naspt24KZtmIGEWd+wLduw%3D%3D); [DigiKey](https://www.digikey.com/en/products/detail/espressif-systems/esp32-p4-eye/27555429)
- Freenove ESP32-S3 WROOM CAM: about US$46–47 (Newegg US, 16 MB); €27.95 (Bitsandparts) — [Newegg Business](https://www.neweggbusiness.com/p/9B-3C6-03VM-01X10); [Bitsandparts](https://www.bitsandparts.nl/en/ESP32-S3-WROOM-ESP32-CAM-Development-board-WiFi-Buetooth-p1926701)
- Purpose-made flat door-seal cable precedent (thermistor probe) — [Gemini PB-5019-3M](https://www.geminidataloggers.com/probes/thermistor-probes/pb-5019-3m?loc=en)
- ESP32-CAM antenna rework needs fine soldering (0 Ω resistor or solder bridge) — [Random Nerd Tutorials](https://randomnerdtutorials.com/esp32-cam-connect-external-antenna/); [Core Electronics forum](https://forum.core-electronics.com.au/t/2-4ghz-6dbi-antenna-with-u-fl-ipex-connector-fit0505/13903)

### Inferences
**Estimates.** Prices marked "est." are my unsourced planning figures based on general 2024–26 hobby-electronics pricing; verify on Amazon.ca, Universal Solder, PiShop.ca, BC Robotics, Elmwood, Canada Robotix and DigiKey.ca. USD is converted at about 1.38 (an assumption).

**Build A: "Proven and cheap" ESP32-CAM, USB-powered, one camera (fridge)**

| Item | Qty | CAD |
|---|---|---|
| ESP32-CAM + ESP32-CAM-MB programmer | 1 | 14–17 (sourced) |
| OV2640 120–160° wide-angle 24-pin module | 1 | ~19 (US$13.88, sourced) |
| 2.4 GHz u.FL/IPEX antenna + short pigtail (needs the 0 Ω mod) | 1 | est. 8–15 |
| N.O. reed switch + magnet (door sensor style) | 1 | est. 3–10 |
| White LED strip/COB (5 V) + logic-level MOSFET + resistors + diffuser | 1 | est. 5–12 |
| Thin/flat USB cable, 1–2 m | 1 | est. 10–20 |
| 5 V ≥2 A certified USB wall adapter (stays outside the fridge) | 1 | est. 10–15 |
| PETG enclosure (self-printed) or small ABS project box; window; silica gel | 1 | est. 2–20 |
| Wire, heat-shrink, connectors, VHB tape / Command strips | — | est. 10 |
| **Total** | | **≈ CAD 80–140** |

**Build B: "Better image, battery-capable" XIAO ESP32S3 Sense + OV5640 AF, one camera**

| Item | Qty | CAD |
|---|---|---|
| XIAO ESP32S3 Sense | 1 | ~30–51 (sourced range) |
| OV5640 AF camera for XIAO (with heat sink) | 1 | est. 15–30 (stocked at DigiKey.ca; price not captured) |
| Reed switch, LEDs + MOSFET, enclosure, misc | — | est. 20–50 |
| *If battery:* protected 18650 + holder (charge outside the fridge), *or* 2× Energizer Ultimate Lithium AA + holder and a 3.3 V buck-boost; plus a load-switch/latch for power-gating | — | est. 15–35 |
| *Or USB power:* flat cable + adapter | — | est. 20–35 |
| **Total** | | **≈ CAD 85–165** |

**Build C: "Best image" Pi Zero 2 W + Camera Module 3 Wide, USB-powered, one camera**

| Item | Qty | CAD |
|---|---|---|
| Pi Zero 2 W (with header) | 1 | 25.95 (PiShop; 21.95 without header) |
| Camera Module 3 Wide | 1 | 50.95 (PiShop) |
| Pi Zero camera cable (length to suit) | 1 | est. 5–10 |
| microSD 32 GB (high-endurance) | 1 | est. 12–20 |
| 5.1 V 2.5 A micro-USB PSU + thin cable (or put the Pi outside and pass only the camera cable through) | 1 | est. 20–35 |
| Reed switch, LED lighting + MOSFET, enclosure | — | est. 15–40 |
| **Total** | | **≈ CAD 130–185** |

**Two-camera builds**
- **2× Build A** (e.g., main compartment upper and lower zones, or fridge + freezer), sharing one dual-port USB adapter: ≈ **CAD 150–260**.
- **Freezer variant:** add a heated window (a resistor of about 0.25–0.5 W plus a MOSFET, est. 3–5) and wired USB power. Don't use a Li-ion cell; lithium AA primaries are the only battery option.
- **Optional ESP-NOW relay hub** (any USB-powered ESP32 dev board placed beside the fridge): est. 8–20.
- **2× Pi path:** each Pi Zero 2 W has one CSI port, so two cameras need two Pis: ≈ **CAD 260–370**.

**Tools needed**
- Temperature-controlled soldering iron with a fine tip, solder and flux.
- Tweezers and magnification (the ESP32-CAM 0 Ω resistor move).
- A multimeter with a mA/µA range, plus a USB inline power meter (essential for verifying sleep current and battery life).
- Wire strippers and flush cutters.
- Heat-shrink and a heat gun or lighter.
- A USB-serial programmer (the ESP32-CAM-MB covers this for the ESP32-CAM).
- Hot-glue gun.
- Small screwdrivers.
- Isopropyl alcohol and a microfibre cloth.
- A fridge thermometer/hygrometer (to log temperature and RH during fog testing).
- *Optional:* 3D printer (PETG) for custom mounts, a hood and the window bezel.
- *Optional:* hot-air station for SMD rework.
- **Not needed and not recommended:** drilling the fridge cabinet (refrigerant lines run in the walls).

**Safety checklist** (for the report writer to surface):
1. No mains voltage inside the fridge. Use a certified USB adapter outside and only 5 V DC through the gasket.
2. No Li-ion or LiFePO4 charging at or below 0 °C, and none in the fridge at all with simple chargers. Remove batteries to charge at room temperature.
3. Use protected cells in proper holders and keep battery packs in a separate sealed enclosure (as m0nklabs does).
4. Printed enclosures are not food-contact surfaces. Prefer PETG, keep them wipeable, and keep them away from unwrapped food.
5. Check the door seal after routing any cable. Frost or condensation near the cable means a leak, which wastes energy and affects food safety.
6. Camera images of household members are possible with door-open capture. Prefer door-closed capture (no people in frame) and keep images on your own backend.

### Gaps
- No sourced CAD prices for reed switches, u.FL antennas, flat USB cables, USB adapters, LED strips, MOSFETs, 18650 cells and holders, lithium AA cells, load-switch modules, PETG filament or microSD cards. All the "est." figures need verification.
- The M5Stack Timer Camera X / Unit CamS3-5MP and Adafruit OV5640 120°/160° prices in Canada were not found.
- Amazon.ca ESP32-CAM pricing was not found.
- The USD→CAD exchange rate for Oct 2026 was not verified.
- Whether a Pi 5 (two CSI ports) mounted outside the fridge with two long camera cables would be a better two-camera Pi option was not researched.
