// Draw the given puzzle using SVG elements
function draw_puzzle(puzzle) {
	for (var x=0; x<puzzle.nodes.length; x++) {
		for (var y=0; y<puzzle.nodes[x].length; y++)
		{
			draw_node(puzzle.nodes[x][y]);
		}
	}

	for (var x=0; x<puzzle.cells.length; x++) {
		for (var y=0; y<puzzle.cells[x].length; y++)
		{
			draw_cell(puzzle.cells[x][y]);
		}
	}

	draw_start_node(puzzle.start_node);
}

// Draw the given cell, handles drawing colored squares
function draw_cell(cell) {
	if (cell.cell_type == CELL_TYPE.SQUARE) {
		var side_length = cfg.colored_square_side_length;
		var coord_mod = cfg.edge_spacing/2 + cfg.edge_thickness/2 - side_length/2;
		var x = cell.x * cfg.edge_spacing + coord_mod;
		var y = cell.y * cfg.edge_spacing + coord_mod;
		append_svg_node(svg, 'rect', { x: x, y: y, rx:4, ry:4, width: side_length, height: side_length, fill: cell.color });
	}
}

// Draw the given node and all the edges associated with it
function draw_node(node) {
	draw_edges(node);
}

// Draw all the edges for the given node
function draw_edges(node) {
	// Draw vertical edge to the north
	if (node.north.edge_type != EDGE_TYPE.BORDER) {
		var x = cfg.edge_spacing * node.x;
		var y = cfg.edge_spacing * node.y - cfg.edge_spacing + cfg.edge_thickness;
		var height = cfg.edge_spacing - cfg.edge_thickness;

		var edge_color = DEBUG && node.north.traversed ? cfg.solution_color : cfg.color;
		node.north.graphics_object = append_svg_node(svg, 'rect', { x: x, y: y, width: cfg.edge_thickness, height: height, fill: edge_color });
		if (node.south.edge_type != EDGE_TYPE.BORDER) {
			node.graphics_object = append_svg_node(svg, 'rect', { x: x, y: y + height, width: cfg.edge_thickness, height: cfg.edge_thickness, fill: edge_color });
		}

		if (node.north.edge_type == EDGE_TYPE.OBSTACLE) {
			append_svg_node(svg, 'rect', { x: x, y: y + cfg.edge_spacing/2 - cfg.obstacle_gap_size/2 - cfg.edge_thickness/2, width: cfg.edge_thickness, height: cfg.obstacle_gap_size, fill: cfg.background_color });
		} else if (node.north.edge_type == EDGE_TYPE.PELLET) {
			draw_hexagon(x + cfg.edge_thickness/2, y + cfg.edge_spacing/2 - cfg.edge_thickness/2);
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
				node.graphics_object = draw_quarter_circle(x, y, cfg.edge_thickness, vertical_direction, DIRECTION.EAST);
			}
			else {
				vertical_direction = DIRECTION.NORTH;
				node.graphics_object = draw_quarter_circle(x, y + cfg.edge_thickness, cfg.edge_thickness, vertical_direction, DIRECTION.EAST);
			}
		
			if (node.node_type == NODE_TYPE.END) {
				draw_end_corner(x + cfg.edge_thickness/2, y + cfg.edge_thickness/2, vertical_direction, DIRECTION.EAST);
			}
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
			draw_end(end_x, end_y, direction_v, direction_h);
		}

		// Draw west corners
		if (west_node.is_corner()) {
			var vertical_direction;
			if (west_node.south.edge_type == EDGE_TYPE.BORDER) {
				vertical_direction = DIRECTION.SOUTH;
				west_node.graphics_object = draw_quarter_circle(west_corner_x, y, cfg.edge_thickness, vertical_direction, DIRECTION.WEST);
			}
			else {
				vertical_direction = DIRECTION.NORTH;
				west_node.graphics_object = draw_quarter_circle(west_corner_x, y + cfg.edge_thickness, cfg.edge_thickness, vertical_direction, DIRECTION.WEST);
			}

			// Draw corner end node
			if (west_node.node_type == NODE_TYPE.END) {
				draw_end_corner(west_corner_x - cfg.edge_thickness/2, y + cfg.edge_thickness/2, vertical_direction, DIRECTION.WEST);
			}
		}
		else if (west_node.node_type == NODE_TYPE.END && west_node.west.edge_type == EDGE_TYPE.BORDER) {
			// Draw west end node
			draw_end(west_corner_x - cfg.edge_thickness, node.y * cfg.edge_spacing + cfg.edge_thickness/2, undefined, DIRECTION.WEST);
		}

		var edge_color = DEBUG && node.west.traversed ? cfg.solution_color : cfg.color;
		
		// Draw horizontal edge to the west
		var west_edge_width = edge_length - cfg.edge_thickness;
		node.west.graphics_object = append_svg_node(svg, 'rect', { x: west_corner_x, y: y, width: west_edge_width, height: cfg.edge_thickness, fill: edge_color });
		
		if (node.east.edge_type != EDGE_TYPE.BORDER && (node.north.edge_type == EDGE_TYPE.BORDER || node.south.edge_type == EDGE_TYPE.BORDER)) {
			node.graphics_object = append_svg_node(svg, 'rect', { x: west_corner_x + west_edge_width, y: y, width: cfg.edge_thickness, height: cfg.edge_thickness, fill: edge_color });
		}

		if (node.west.edge_type == EDGE_TYPE.OBSTACLE) {
			append_svg_node(svg, 'rect', { x: west_corner_x + cfg.edge_spacing/2 - cfg.obstacle_gap_size/2 - cfg.edge_thickness/2, y: y, width: cfg.obstacle_gap_size, height: cfg.edge_thickness, fill: cfg.background_color });
		} else if (node.west.edge_type == EDGE_TYPE.PELLET) {
			draw_hexagon(west_corner_x + cfg.edge_spacing/2 - cfg.edge_thickness/2, y + cfg.edge_thickness/2);
		}
	}
}

// Draw the starting circle at the given node
function draw_start_node(node) {
	var half_edge_thickness = cfg.edge_thickness / 2;
	var x = cfg.edge_spacing * node.x + half_edge_thickness;
	var y = cfg.edge_spacing * node.y + half_edge_thickness;
	var on_click = "on_click_start_node(this);"; // Give the start node an action on click, defined in control.js
	start_node_graphics_object_global = 
		append_svg_node(svg, 'circle', { cx: x, cy: y, r: cfg.start_node_radius, fill: cfg.color, onmousedown: on_click, ontouchstart: on_click, ontouchend: on_click });
}

// Draw the nub sticking out of the end node if it is on a flat edge
function draw_end(center_x, center_y, vertical_direction, horizontal_direction) {
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

// Draw the nub sticking out of the end node if it is on a corner
function draw_end_corner(center_x, center_y, vertical_direction, horizontal_direction) {
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
