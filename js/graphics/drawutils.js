// Draw a hexagon at the given center that uses side length defined by the PuzzleDrawConfiguration
function draw_hexagon(center_x, center_y) {
	var half_side_length = cfg.pellet_side_length/2;
	var sine_side_length = half_side_length * Math.sqrt(3);
	
	// Counterclockwise, A is rightmost point (D is leftmost)
	var ax = center_x + cfg.pellet_side_length;
	var ay = center_y;
	var bx = center_x + half_side_length;
	var by = center_y + sine_side_length;
	var cx = center_x - half_side_length;
	var cy = center_y + sine_side_length;
	var dx = center_x - cfg.pellet_side_length;
	var dy = center_y;
	var ex = center_x - half_side_length;
	var ey = center_y - sine_side_length;
	var fx = center_x + half_side_length;
	var fy = center_y - sine_side_length;
	
	var hex_points = `${ax},${ay} ${bx},${by}, ${cx},${cy} ${dx},${dy} ${ex},${ey} ${fx},${fy}`;
	append_svg_node(svg, 'polygon', { class: 'hex', points: hex_points, fill: cfg.pellet_color });
}

function draw_quarter_circle(corner_join_x, corner_join_y, vertical_direction, horizontal_direction) {
	var arc_dx = horizontal_direction == DIRECTION.WEST ? -cfg.edge_thickness : cfg.edge_thickness;
	var arc_dy = vertical_direction == DIRECTION.NORTH ? -cfg.edge_thickness : cfg.edge_thickness;
	var sweep_flag = horizontal_direction == DIRECTION.WEST ? 0 : 1;
	var post_move = cfg.edge_thickness * (vertical_direction == DIRECTION.NORTH ? 1 : -1);

	var sweep_flag = 0;
	if (horizontal_direction == DIRECTION.EAST && vertical_direction == DIRECTION.SOUTH) {
		sweep_flag = 1;
	} else if (horizontal_direction == DIRECTION.WEST && vertical_direction == DIRECTION.NORTH) {
		sweep_flag = 1;
	}

	var move_to_corner = `M${corner_join_x + arc_dx} ${corner_join_y}`;
	var arc = `a${cfg.edge_thickness} ${cfg.edge_thickness} 0 0 ${sweep_flag} ${-arc_dx} ${arc_dy}`;
	var fill_corner = `l 0 ${post_move} z`;

	return append_svg_node(svg, 'path', { d: `${move_to_corner} ${arc} ${fill_corner}`, fill: cfg.color});
}
