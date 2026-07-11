# Exposure Calculator (iPhone)

A pocket light meter for manual film cameras. Point your phone at the
scene, enter your film's ISO, and it tells you the correct aperture and
shutter speed — either by picking one and solving for the other, or by
showing the full table of equivalent exposures.

## How it works

Your iPhone's camera constantly auto-exposes: it picks an ISO, shutter
speed, and aperture that correctly expose whatever it's pointed at. This
app reads those live values straight from the camera hardware (not a
brightness estimate from the video image) and converts them into the
scene's **Light Value at ISO 100**. From that single number, and the ISO
of the film loaded in your camera, it can solve for any correctly-exposed
aperture/shutter combination.

The math lives in `ExposureCalculator/Models/ExposureMath.swift` — it's
plain, well-commented, and has no dependencies, so it's easy to sanity
check against a known reading (e.g. the Sunny 16 rule).

## Why this can't run in this environment

This project was created by Claude Code running in a Linux container,
which has no Xcode or iOS Simulator. The Swift/SwiftUI source is
complete and ready to build, but it needs to be opened and compiled on a
Mac.

## Setting it up on your Mac (about 5 minutes)

1. Open **Xcode** → **File → New → Project**.
2. Choose **iOS → App**, click Next.
3. Product Name: `ExposureCalculator`. Interface: **SwiftUI**. Language: **Swift**. Click Next, save it anywhere temporary.
4. In the new project's file navigator, **delete** the auto-generated
   `ContentView.swift` (and `ExposureCalculatorApp.swift` if one was made) —
   right-click → Delete → Move to Trash.
5. In Finder, drag the `Models`, `Services`, and `Views` folders, plus
   `ExposureCalculatorApp.swift`, from this repo's
   `ios/ExposureCalculator/ExposureCalculator/` folder into the Xcode
   project navigator. In the dialog, check **"Copy items if needed"** and
   make sure your app target is checked.
6. Select the project in the navigator → your target → **Info** tab →
   add a new key **Privacy - Camera Usage Description** with the value:
   `This app reads your camera's live exposure to calculate the correct
   aperture and shutter speed for your film.`
   (The same key/value is in `ExposureCalculator/Info.plist` in this repo
   if you'd rather swap in that file directly instead of editing the
   auto-generated one.)
7. Plug in your iPhone, select it as the run destination, set your Apple
   ID under **Signing & Capabilities** (Xcode → Settings → Accounts if you
   haven't added one), and hit **Run**.
8. On first launch, allow camera access when prompted.

## Using it

- **FILM ISO** — set this to whatever's printed on your film box (e.g. 400).
- **Set Aperture** tab — scroll to the aperture you want, the app shows the shutter speed to match.
- **Set Shutter** tab — scroll to the shutter speed you want, the app shows the matching aperture.
- **Full Table** tab — every full-stop aperture with its matching shutter speed, all equivalent exposures for the current light.
- The **LV** readout over the camera preview is the raw light reading (ISO 100 basis) — same number a standalone light meter would show.

## Notes / possible follow-ups

- Currently reads the back wide camera only.
- Full-stop increments only (f/1.4, f/2, f/2.8… and 1/125, 1/250…). Half/third-stop steps would be a small change to the arrays in `ExposureMath.swift`.
- No exposure compensation control yet (e.g. +1 stop for backlit scenes) — could be added as a simple stepper that shifts the target EV.
