# Handoff: Christmas tree leg, 3D print at Edmonton Public Library

Paste this whole file into a new Claude session to pick up where we left off.

---

## Where things stand (as of 2026-11-18)

**Goal:** 3D print a replacement leg for a small artificial Christmas tree (3 legs, one missing) at an Edmonton
Public Library makerspace.

**Done:**
- Measured the good leg from 14 photos with a tape measure, read at full resolution, and traced the outline from
  the top-view photo.
- Built the model in OpenSCAD and exported the STL files. Both were checked: watertight, every edge shared by two
  triangles, one solid body.
- Laid the model outline over the photo of the real leg. It follows the curve and tip closely.
- All files are in the GitHub repo **AlbertanCoder/AlbertanCoder**, branch **`claude/kind-thompson-hr7w3b`**, folder
  **`christmas-tree-leg/`**:
  - `christmas-tree-leg.stl`: the full leg (print this).
  - `fit-test-plug-end.stl`: only the first 15 mm (T-rail + a bit of body), about 7 g, to test the fit first.
  - `christmas-tree-leg.scad`: source. Every size is a named number at the top.
  - `preview.png`: model outline over the photo, plus top, side, 3/4 and T-rail views.
  - `README.md`: sizes, print settings, cost.

**Not done yet:**
- [ ] Take the EPL **3D Printing 101** certification (online, on demand).
- [ ] Book a printer at **Mill Woods** (780-496-1818).
- [ ] Print the fit test, check it in the tree base.
- [ ] Print the full leg.

---

## Key facts about the part

| Size (mm) | Value |
|---|---|
| Total length (T-rail face to floor tip) | 183 |
| Plug width | 50 |
| Width at halfway | about 27 |
| Thickness at plug / tip | 15.5 / 7.5 (flat bottom, top face tapers) |
| Floor tip | turns down about 5 mm below the straight bottom edge |
| T-rail (across plug end) | 48.5 long; lip 9.8 thick × 2.4 deep; neck 3.3 thick × 3.2 long |
| Clearance | 0.3 (lip/neck thinner, lip shallower, neck longer) |

- The "T" is a **T-shaped rail** across the whole plug end that slides into a T-slot in the tree base. It is NOT a
  small tab. An older plan had it as an 18 mm tab, which was wrong.
- Corrected from the older plan: length 190→183, plug width 48→50, plug thickness 12→15.5, tip thickness 5→7.5,
  halfway width 32→27.
- Accuracy from photos is about ±1 mm. That's why there's a fit test.

## Print settings

- PLA. Flat, big face down, exactly as the STL loads (don't rotate).
- 4 walls (perimeters), 40% infill.
- **Supports: "Support on build plate only".** The T-rail lip sits about 3 mm above the bed. Snap the support off and
  clean the rail with a knife or sandpaper.
- Brim optional (helps the narrow tip).
- Estimated full leg: about 43–46 g, about $4.50 at EPL's $0.10/g (GST included). Fit test: about 7 g, under $1.

## If the fit test doesn't fit

Open `christmas-tree-leg.scad`, change one number, export again:
- **Too tight:** `clearance = 0.5`
- **Too loose / wobbly:** `clearance = 0.15`

```
openscad -o christmas-tree-leg.stl christmas-tree-leg.scad
openscad -D 'part="fit_test"' -o fit-test-plug-end.stl christmas-tree-leg.scad
```

Change only what the test showed. Keep everything else the same.

---

## REMINDER: get the course done soon

The leg can't be printed until the **3D Printing 101** certification is finished. It's the only thing in the way.

**Step by step:**
1. Go to **epl.ca/makerspace/3d-printing**.
2. Start the **on-demand (online)** 3D Printing 101 certification. Have your library card number ready.
3. Finish it. (The in-person version is about 2 hours, 6:30–8:30 PM. I couldn't find how long the online one takes.)
4. Phone **Mill Woods (780-496-1818)**:
   - "Is my 3D Printing 101 certification showing on my account?"
   - "Can I print the same day?"
   - "I'd like to book a 3D printer. I have STL files ready."
5. Get the files ready: email both STL files to yourself, or put them on a USB stick.
6. Bring the tree base (and a good leg) to the library.
7. Print `fit-test-plug-end.stl` first, then `christmas-tree-leg.stl` with the settings above.

**EPL facts:** branches with 3D printing are Mill Woods, Stanley A. Milner (downtown), Capilano and
Abbottsfield–Penny McKee. Mill Woods is closest (southeast Edmonton). EPL card needed. Ages 12+. Finished prints can
be sent to a branch of your choice for pickup. PLA colours listed: clear, black, white, red, dark blue, silver,
magenta (no green, so pick black or dark blue to come closest).

---

## Prompt for the next Claude session

> I'm printing a replacement Christmas tree leg at Edmonton Public Library (Mill Woods branch). Everything is in
> GitHub repo AlbertanCoder/AlbertanCoder, branch `claude/kind-thompson-hr7w3b`, folder `christmas-tree-leg/`. Read
> `HANDOFF.md` and `README.md` there first. Status: [course done? / fit test printed? / result: too tight, too
> loose, or good]. If I report a fit result, change only `clearance` in `christmas-tree-leg.scad`, export both STLs
> again, check they're watertight, push to the same branch, and send me the new files. Give me very easy step-by-step
> instructions.
