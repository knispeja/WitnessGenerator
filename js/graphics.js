class PuzzleDrawConfiguration {
	constructor(color) {
		this.color = color;
		this.background_color = 'black';
		this.edge_spacing = 100;
		this.edge_thickness = 24;
		this.obstacle_gap_size = this.edge_spacing / 4;
		this.start_node_radius = this.edge_thickness * 1.2;
		this.pellet_color = 'black';
		this.pellet_side_length = this.edge_thickness/2.08;
		this.colored_square_side_length = 30;
	}
}

function append_svg_node(parent_node, node_type, property_values) {
	var node = document.createElementNS("http://www.w3.org/2000/svg", node_type);
	for (var property in property_values) {
		node.setAttributeNS(null, property, property_values[property]);
	}
	parent_node.appendChild(node);
	return node;
}

function draw_puzzle(puzzle) {
	var svg = append_svg_node(document.body, "svg");

	for (var x=0; x<puzzle.nodes.length; x++) {
		for (var y=0; y<puzzle.nodes[x].length; y++)
		{
			draw_node(svg, puzzle.draw_config, puzzle.nodes[x][y]);
		}
	}

	for (var x=0; x<puzzle.cells.length; x++) {
		for (var y=0; y<puzzle.cells[x].length; y++)
		{
			draw_cell(svg, puzzle.draw_config, puzzle.cells[x][y]);
		}
	}

	draw_start_node(svg, puzzle.draw_config, puzzle.start_node);
}

function draw_cell(svg, cfg, cell) {
	if (cell.cell_type != CELL_TYPE.SQUARE) {
		return;
	}
	var side_length = cfg.colored_square_side_length;
	var coord_mod = cfg.edge_spacing/2 + cfg.edge_thickness/2 - side_length/2;
	var x = cell.x * cfg.edge_spacing + coord_mod;
	var y = cell.y * cfg.edge_spacing + coord_mod;
	append_svg_node(svg, 'rect', { x: x, y: y, rx:4, ry:4, width: side_length, height: side_length, fill: cell.color });
}

function draw_node(svg, draw_config, node) {
	draw_edges(svg, draw_config, node);
}

function draw_edges(svg, cfg, node) {
	// Draw vertical edge to the north
	if (node.north.edge_type != EDGE_TYPE.BORDER) {
		var x = cfg.edge_spacing * node.x;
		var y = cfg.edge_spacing * node.y - cfg.edge_spacing + cfg.edge_thickness;
		var height = cfg.edge_spacing;
		if (node.south.edge_type == EDGE_TYPE.BORDER) {
			height -= cfg.edge_thickness;
		}

		var edge_color = node.north.traversed ? 'blue' : cfg.color;
		append_svg_node(svg, 'rect', { x: x, y: y, width: cfg.edge_thickness, height: height, fill: edge_color });
		if (node.north.edge_type == EDGE_TYPE.OBSTACLE) {
			append_svg_node(svg, 'rect', { x: x, y: y + cfg.edge_spacing/2 - cfg.obstacle_gap_size/2 - cfg.edge_thickness/2, width: cfg.edge_thickness, height: cfg.obstacle_gap_size, fill: cfg.background_color });
		} else if (node.north.edge_type == EDGE_TYPE.PELLET) {
			draw_hexagon(svg, x + cfg.edge_thickness/2, y + cfg.edge_spacing/2 - cfg.edge_thickness/2, cfg);
		}
	}

	// Draw west edge and corners
	var west_node = node.get_connected_node(DIRECTION.WEST);
	if (node.west.edge_type != EDGE_TYPE.BORDER) {
		var x = cfg.edge_spacing * node.x;
		var y = cfg.edge_spacing * node.y;
		var west_corner_x = x - cfg.edge_spacing + cfg.edge_thickness;
		var edge_length = cfg.edge_spacing;

		// Draw east corners
		if (node.is_corner()) {
			var vertical_direction;
			if (node.south.edge_type == EDGE_TYPE.BORDER) {
				vertical_direction = DIRECTION.SOUTH;
				draw_quarter_circle(svg, cfg, x, y, vertical_direction, DIRECTION.EAST);
			}
			else {
				vertical_direction = DIRECTION.NORTH;
				draw_quarter_circle(svg, cfg, x, y + cfg.edge_thickness, vertical_direction, DIRECTION.EAST);
			}
		
			if (node.node_type == NODE_TYPE.END) {
				draw_end_corner(svg, cfg, x + cfg.edge_thickness/2, y + cfg.edge_thickness/2, vertical_direction, DIRECTION.EAST);
			}

			edge_length = cfg.edge_spacing - cfg.edge_thickness;
		}
		else if (node.node_type == NODE_TYPE.END) {
			// Draw end nodes
			var direction_v = undefined;
			var direction_h = undefined;
			var end_x = x;
			var end_y = y;
			if (node.north.edge_type == EDGE_TYPE.BORDER) {
				direction_v = DIRECTION.NORTH;
				end_x += cfg.edge_thickness/2;
			}
			else if (node.east.edge_type == EDGE_TYPE.BORDER) {
				direction_h = DIRECTION.EAST;
				end_x += cfg.edge_thickness;
				end_y += cfg.edge_thickness/2;
			}
			else {
				direction_v = DIRECTION.SOUTH;
				end_x += cfg.edge_thickness/2;
				end_y += cfg.edge_thickness;
			}
			draw_end(svg, cfg, end_x, end_y, direction_v, direction_h);
		}

		// Draw west corners
		if (west_node.is_corner()) {
			var vertical_direction;
			if (west_node.south.edge_type == EDGE_TYPE.BORDER) {
				vertical_direction = DIRECTION.SOUTH;
				draw_quarter_circle(svg, cfg, west_corner_x, y, vertical_direction, DIRECTION.WEST);
			}
			else {
				vertical_direction = DIRECTION.NORTH;
				draw_quarter_circle(svg, cfg, west_corner_x, y + cfg.edge_thickness, vertical_direction, DIRECTION.WEST);
			}

			// Draw corner end node
			if (west_node.node_type == NODE_TYPE.END) {
				draw_end_corner(svg, cfg, west_corner_x - cfg.edge_thickness/2, y + cfg.edge_thickness/2, vertical_direction, DIRECTION.WEST);
			}
		}
		else if (west_node.node_type == NODE_TYPE.END && west_node.west.edge_type == EDGE_TYPE.BORDER) {
			// Draw west end node
			draw_end(svg, cfg, west_corner_x - cfg.edge_thickness, node.y * cfg.edge_spacing + cfg.edge_thickness/2, undefined, DIRECTION.WEST);
		}

		var edge_color = node.west.traversed ? 'blue' : cfg.color;
		
		// Draw horizontal edge to the west
		append_svg_node(svg, 'rect', { x: west_corner_x, y: y, width: edge_length, height: cfg.edge_thickness, fill: edge_color });
		
		if (node.west.edge_type == EDGE_TYPE.OBSTACLE) {
			append_svg_node(svg, 'rect', { x: west_corner_x + cfg.edge_spacing/2 - cfg.obstacle_gap_size/2 - cfg.edge_thickness/2, y: y, width: cfg.obstacle_gap_size, height: cfg.edge_thickness, fill: cfg.background_color });
		} else if (node.west.edge_type == EDGE_TYPE.PELLET) {
			draw_hexagon(svg, west_corner_x + cfg.edge_spacing/2 - cfg.edge_thickness/2, y + cfg.edge_thickness/2, cfg);
		}
	}
}

function draw_end(svg, cfg, center_x, center_y, vertical_direction, horizontal_direction) {
	append_svg_node(svg, 'rect', { x: center_x - cfg.edge_thickness/2, y: center_y - cfg.edge_thickness/2, width: cfg.edge_thickness, height: cfg.edge_thickness, fill: cfg.color });
	
	var horizontal_mod = 0;
	if (horizontal_direction == DIRECTION.EAST) {
		horizontal_mod = 1;
	} else if (horizontal_direction == DIRECTION.WEST) {
		horizontal_mod = -1;
	}

	var vertical_mod = 0;
	if (vertical_direction == DIRECTION.SOUTH) {
		vertical_mod = 1;
	} else if (vertical_direction == DIRECTION.NORTH) {
		vertical_mod = -1;
	}

	var circle_x = center_x + horizontal_mod * cfg.edge_thickness/2;
	var circle_y = center_y + vertical_mod * cfg.edge_thickness/2;
	append_svg_node(svg, 'circle', { cx: circle_x, cy: circle_y, r: cfg.edge_thickness/2, fill: cfg.color });
}

function draw_end_corner(svg, cfg, center_x, center_y, vertical_direction, horizontal_direction) {
	var half_side_length = cfg.edge_thickness / 2;
	var center_to_corner = Math.sqrt(2) * half_side_length;

	var p_north = `${center_x},${center_y-center_to_corner}`;
	var p_east = `${center_x+center_to_corner},${center_y}`;
	var p_south = `${center_x},${center_y+center_to_corner}`;
	var p_west = `${center_x-center_to_corner},${center_y}`;
	var points = `${p_north} ${p_east} ${p_south} ${p_west}`;
	append_svg_node(svg, 'polygon', { points: points, fill: cfg.color });

	var circle_x = center_x + (horizontal_direction == DIRECTION.EAST ? 1 : -1) * center_to_corner/2;
	var circle_y = center_y + (vertical_direction == DIRECTION.SOUTH ? 1 : -1) * center_to_corner/2;
	append_svg_node(svg, 'circle', { cx: circle_x, cy: circle_y, r: cfg.edge_thickness/2, fill: cfg.color });
}

function draw_start_node(svg, cfg, node) {
	var half_edge_thickness = cfg.edge_thickness / 2;
	var x = cfg.edge_spacing * node.x + half_edge_thickness;
	var y = cfg.edge_spacing * node.y + half_edge_thickness;
	append_svg_node(svg, 'circle', { cx: x, cy: y, r: cfg.start_node_radius, fill: cfg.color });
}

function draw_quarter_circle(svg, cfg, corner_join_x, corner_join_y, vertical_direction, horizontal_direction) {
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

	append_svg_node(svg, 'path', { d: `${move_to_corner} ${arc} ${fill_corner}`, fill: cfg.color});
}

function draw_hexagon(svg, center_x, center_y, cfg) {
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
