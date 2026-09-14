// CONCEPT / M0. Dimensions in mm. No fasteners, connector or safety approval.
outer = [[0,0],[80,0],[80,74],[74,80],[0,80]];
inner = [[2,2],[78,2],[78,73.172],[73.172,78],[2,78]];
module chassis() { difference() {
  linear_extrude(24) polygon(outer);
  translate([0,0,2]) linear_extrude(23) polygon(inner);
} }
module cover() { translate([0,0,24]) linear_extrude(1.2) polygon(outer); }
color([0.22,0.25,0.28]) chassis();
color([0.65,0.7,0.75,0.65]) translate([0,0,20]) cover();
