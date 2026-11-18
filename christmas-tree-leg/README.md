# Christmas tree leg (replacement)

A 3D-printable copy of the leg missing from a small artificial Christmas tree. I measured it from photos of a good
leg next to a tape measure.

![Preview](preview.png)

## Files

| File | What it is |
|---|---|
| `christmas-tree-leg.stl` | **The one to print.** The whole leg. |
| `fit-test-plug-end.stl` | Only the first 15 mm (the T-rail plus a bit of body). About 7 g. Print this first to check the fit in the tree base. |
| `dimensions.png` | Dimensioned drawing: 3D view, top view, side view, T-rail detail, table. |
| `christmas-tree-leg.scad` | OpenSCAD source. Every size is a named number at the top. |

Both STL files were checked: closed (watertight), every edge shared by exactly two triangles, one solid body.

## Measured sizes (mm)

| Size | Value | How it was read |
|---|---|---|
| Total length (T-rail face to floor tip) | 183 | tape along the leg, two photos (±3) |
| Plug width (body at the plug end) | 50 | tape across the plug end, three photos (±1) |
| Width at halfway | about 27 | traced from the top-view photo |
| Thickness at the plug | 15.5 | tape on the side edge, checked against side views (±1) |
| Thickness at the tip | 7.5 | side-edge photo |
| Floor tip | turns down about 5 mm below the straight edge | traced |
| T-rail length (across the plug) | 48.5 | runs nearly the full plug width |
| T-rail lip (bar) thickness | 9.8 | about 0.63 × plug thickness in two photos |
| T-rail lip depth | 2.2 | top-view and edge-view photos |
| T-rail neck (stem) thickness | 3.3 | end-view photos |
| T-rail neck length (gap behind lip) | 4.4 | read 3.0 to 4.8; kept long so the base wall fits |

**The T is a rail, not a tab.** Seen from the side edge, the plug end has a T-shaped profile that runs across the
whole 48.5 mm width. The rail slides into a matching T-slot in the tree base.

Photos and a tape measure get within about 1 mm, not 0.1 mm. That is why the fit test exists.

## Fit (clearance)

`clearance = 0.3` makes the lip and neck 0.3 mm thinner, the lip 0.3 mm shallower, and the neck 0.3 mm longer, so
the rail slides into the slot. The body is printed at its measured size.

- **Too tight** (won't slide in): set `clearance = 0.5` and export again.
- **Too loose** (wobbles or falls out): set `clearance = 0.15`.
- Rail thickness itself wrong: change `lip_thickness` or `neck_thickness`.

Export from the `.scad` file:

```
openscad -o christmas-tree-leg.stl christmas-tree-leg.scad
openscad -D 'part="fit_test"' -o fit-test-plug-end.stl christmas-tree-leg.scad
```

## Print settings (EPL makerspace, Prusa printer, PrusaSlicer)

- **Material:** PLA.
- **Orientation:** flat, with the big flat face down. This is how the STL loads, so don't rotate it.
- **Walls (perimeters):** 4. **Infill:** 40%.
- **Supports: "Support on build plate only".** The T-rail lip sits about 3 mm above the bed, so it needs a small support
  under it. Nothing else needs support. Snap the support off and clean the rail with a knife or sandpaper.
- **Brim:** optional. Helps the narrow tip stay down.
- **Size:** 183 × 55 × 15.5 mm. It fits any of the printers.

## Weight and cost (estimate)

| Part | Weight | Cost at $0.10/g (GST included) |
|---|---|---|
| Full leg | about 43 to 46 g | about $4.30 to $4.60 |
| Fit test | about 7 g | about $0.70 (a $1 minimum may apply) |

The slicer gives the exact weight. The solid volume is 64.5 cm³ (80 g if it were 100% solid).
