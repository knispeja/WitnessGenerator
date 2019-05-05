class PuzzleDrawConfiguration {
	constructor(color) {
		this.color = color;
		this.edge_spacing = 100;
		this.edge_thickness = 24;
		this.start_node_radius = this.edge_thickness * 1.2;
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

	draw_start_node(svg, puzzle.draw_config, puzzle.start_node);
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
		edge_color = node.north.edge_type == EDGE_TYPE.PELLET ? 'red' : edge_color;
		append_svg_node(svg, 'rect', { x: x, y: y, width: cfg.edge_thickness, height: height, fill: edge_color });
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
			if (node.south.edge_type == EDGE_TYPE.BORDER) {
				draw_quarter_circle(svg, cfg, x, y, DIRECTION.SOUTH, DIRECTION.EAST);
			}
			else {
				draw_quarter_circle(svg, cfg, x, y + cfg.edge_thickness, DIRECTION.NORTH, DIRECTION.EAST);
			}
		
			edge_length = cfg.edge_spacing - cfg.edge_thickness;
		}

		// Draw west corners
		if (west_node.is_corner()) {
			if (west_node.south.edge_type == EDGE_TYPE.BORDER) {
				draw_quarter_circle(svg, cfg, west_corner_x, y, DIRECTION.SOUTH, DIRECTION.WEST);
			}
			else {
				draw_quarter_circle(svg, cfg, west_corner_x, y + cfg.edge_thickness, DIRECTION.NORTH, DIRECTION.WEST);
			}
		}

		var edge_color = node.west.traversed ? 'blue' : cfg.color;
		edge_color = node.west.edge_type == EDGE_TYPE.PELLET ? 'red' : edge_color;
		// Draw horizontal edge to the west
		append_svg_node(svg, 'rect', { x: west_corner_x, y: y, width: edge_length, height: cfg.edge_thickness, fill: edge_color });
	}
}

function draw_start_node(svg, cfg, node) {
	var half_edge_thickness = cfg.edge_thickness / 2;
	var x = cfg.edge_spacing * node.x + half_edge_thickness;
	var y = cfg.edge_spacing * node.y + half_edge_thickness;
	append_svg_node(svg, 'circle', {cx: x, cy: y, r: cfg.start_node_radius, fill: cfg.color})
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
