// Christmas tree leg: replacement for a missing leg (v2)
// Units: mm. Built from photos of a good leg next to a tape measure.
//
// Axes:  x = along the leg (0 = outer face of the T-rail, x = total_length = floor tip)
//        y = across the leg (0 = straight bottom edge, plug_width = top corner of plug)
//        z = thickness (0 = flat face that sits on the print bed)
//
// What v2 changed from v1 (after measuring the photos):
//   * The "T" is a T-shaped RAIL that runs across the whole plug end (about 48.5 mm),
//     not a small 18 mm tab. Seen from the side it is a lip (bar) on a thin neck (stem).
//   * Length 181 (was 190), plug width 50 (was 48), plug thickness 15 (was 12),
//     tip thickness 7.2 (was 5), width at halfway about 27 (was 32).
//   * v2.1: checked against a second, independent read of the photos; T-rail sizes
//     averaged and rounded to the side that slides in more easily.
//   * The outline was traced from the top-view photo, so the curved top edge and the
//     downturned floor tip follow the real leg instead of a straight-line guess.

// ---------------- measured values ----------------
total_length    = 181;    // T-rail outer face to floor tip (two readings: 183 and 180)
plug_width      = 50;     // width of the body at the plug end
plug_thickness  = 15;     // body thickness at the plug end
tip_thickness   = 7.2;    // body thickness at the floor tip

// T-rail on the plug end face (cross-section is a T when you look at the side edge)
rail_width      = 47.5;   // how far the rail runs across the plug
rail_offset     = 0.5;    // rail starts this far in from the straight bottom edge (about 2 mm in from the curved side)
lip_thickness   = 9.6;    // the T's crossbar, measured in the thickness (z) direction (0.64 x body)
lip_length      = 2.0;    // the crossbar's depth along x
neck_thickness  = 3.2;    // the T's stem, in z (0.21 x body)
neck_length     = 4.4;    // the stem's length along x (gap between lip and body).
                          // Read 3.0-4.8 across photos; kept on the long side so the
                          // base's slot wall is sure to fit behind the lip.

// ---------------- fit ----------------
// The T-rail slides into a T-slot in the tree base. These print slightly smaller
// (and the neck slightly longer) so it goes in. Too tight: 0.5. Too loose: 0.15.
clearance       = 0.3;

// ---------------- derived print sizes ----------------
lip_th_p    = lip_thickness  - clearance;
neck_th_p   = neck_thickness - clearance;
lip_len_p   = lip_length     - clearance;
neck_len_p  = neck_length    + clearance;   // longer, so the base's slot wall fits behind the lip
rail_w_p    = rail_width     - clearance;
body_start  = lip_length + neck_length;     // 6.6: the body starts here either way
z_mid       = plug_thickness / 2;           // rail is centred on the plug's thickness
chamfer     = 0.5;                          // eases the rail ends into the slot

// Export: openscad -o christmas-tree-leg.stl christmas-tree-leg.scad
//         openscad -D 'part="fit_test"' -o fit-test-plug-end.stl christmas-tree-leg.scad

// ---------------- outline (top view), traced from the photo ----------------
outline = [
    // straight bottom edge (rests against nothing; runs plug -> tip)
    [body_start, 1.2], [body_start + 0.4, 0.3], [body_start + 1.2, 0],
    [150, 0], [154.5, -0.3], [157.5, -1.0], [160, -2.2], [163, -3.7],
    [166.5, -4.7], [172, -5.0], [178, -4.8], [181.5, -4.5],
    // floor tip: small flat
    [183, -4.2], [183, -3.1],
    // curved top edge, tip -> plug
    [179.6, -1.4], [176, 0.6], [173, 2.4], [169.5, 4.3], [166.3, 6.1],
    [162, 8.3], [159, 9.6],
    [156, 10.9], [152, 11.9], [148, 12.5], [144, 13.2], [140, 14.0], [136, 14.7],
    [132, 15.7], [128, 16.7], [124, 17.6], [120, 18.6], [116, 19.6], [112, 20.5],
    [108, 21.7], [104, 22.8], [100, 24.1], [96, 25.6], [92, 26.8], [88, 28.3],
    [84, 29.8], [80, 31.2], [76, 33.0], [72, 34.6], [68, 36.4], [64, 38.3],
    [60, 39.7], [56, 41.4], [52, 42.6], [48, 43.8], [44, 45.0], [40, 45.8],
    [36, 46.8], [32, 47.5], [28, 48.2], [24, 48.8], [20, 49.3], [16, 49.6],
    [12, 49.8], [body_start + 1.2, plug_width], [body_start + 0.4, plug_width - 0.3],
    [body_start, plug_width - 1.2]
];

// The outline was traced at 183 mm overall; stretch it along x to total_length.
outer_traced = 183;
outline_scaled = [for (p = outline)
    [body_start + (p[0] - body_start) * (total_length - body_start) / (outer_traced - body_start), p[1]]];

// ---------------- parts ----------------
module body() {
    intersection() {
        linear_extrude(height = plug_thickness) polygon(outline_scaled);
        // thickness wedge: full thickness at the plug, thinner at the tip (top face slopes)
        translate([0, 60, 0]) rotate([90, 0, 0])
            linear_extrude(height = 80)
                polygon([[body_start - 1, 0], [total_length + 1, 0],
                         [total_length + 1, tip_thickness],
                         [body_start - 1, plug_thickness]]);
    }
}

// a box along y with chamfered ends (x0..x1, centred in z on z_mid)
module rail_piece(x0, x1, th) {
    y0 = rail_offset + clearance / 2;
    hull() {
        translate([x0, y0 + chamfer, z_mid - th/2]) cube([x1 - x0, rail_w_p - 2*chamfer, th]);
        translate([x0, y0, z_mid - th/2 + chamfer]) cube([x1 - x0, rail_w_p, th - 2*chamfer]);
    }
}

module t_rail() {
    // neck (stem): from the back of the lip into the body (0.5 mm overlap so it fuses)
    rail_piece(lip_len_p, body_start + 0.5, neck_th_p);
    // lip (crossbar): outer face at x = 0, back face where the neck starts
    rail_piece(body_start - neck_len_p - lip_len_p, body_start - neck_len_p, lip_th_p);
}

module leg() { union() { body(); t_rail(); } }

// part = "full": the whole leg.
// part = "fit_test": only the first 15 mm (the T-rail + a bit of body), about 7 g,
//                    to test-fit in the tree base before printing the whole leg.
part = "full";
if (part == "fit_test")
    intersection() { leg(); translate([-1, -10, -1]) cube([16, 80, 30]); }
else
    leg();
