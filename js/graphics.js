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
			draw_edges(svg, puzzle.nodes[x][y]);
		}
	}
}

const spacing = 100;
const edge_width = 24;

function draw_edges(svg, node) {
	// Draw north edge
	if (node.north.edge_type != EDGE_TYPE.BORDER) {
		var x = spacing * node.x;
		var y = spacing * node.y - spacing + edge_width;
		append_svg_node(svg, 'rect', { x: x, y: y, width: edge_width, height: spacing - edge_width, fill: '#B1F514' });
	}

	// Draw west edge and corners
	var west_node = node.get_connected_node(DIRECTION.WEST);
	if (node.west.edge_type != EDGE_TYPE.BORDER) {
		var x = spacing * node.x;
		var y = spacing * node.y;
		var west_corner_x = x - spacing + edge_width;

		// Draw corners
		if (node.is_corner()) {
			if (node.south.edge_type == EDGE_TYPE.BORDER) {
				draw_quarter_circle(svg, x, y, DIRECTION.SOUTH, DIRECTION.EAST);
			}
			else {
				draw_quarter_circle(svg, x, y + edge_width, DIRECTION.NORTH, DIRECTION.EAST);
			}
		}
		if (west_node.is_corner()) {
			if (west_node.south.edge_type == EDGE_TYPE.BORDER) {
				draw_quarter_circle(svg, west_corner_x, y, DIRECTION.SOUTH, DIRECTION.WEST);
			}
			else {
				draw_quarter_circle(svg, west_corner_x, y + edge_width, DIRECTION.NORTH, DIRECTION.WEST);
			}
		}

		// Draw west edge
		append_svg_node(svg, 'rect', { x: west_corner_x, y: y, width: spacing - edge_width, height: edge_width, fill: '#B1F514' });
	}
}

function draw_quarter_circle(svg, corner_join_x, corner_join_y, vertical_direction, horizontal_direction) {
	var arc_dx = horizontal_direction == DIRECTION.WEST ? -edge_width : edge_width;
	var arc_dy = vertical_direction == DIRECTION.NORTH ? -edge_width : edge_width;
	var sweep_flag = horizontal_direction == DIRECTION.WEST ? 0 : 1;
	var post_move = edge_width * (vertical_direction == DIRECTION.NORTH ? 1 : -1);

	var sweep_flag = 0;
	if (horizontal_direction == DIRECTION.EAST && vertical_direction == DIRECTION.SOUTH) {
		sweep_flag = 1;
	} else if (horizontal_direction == DIRECTION.WEST && vertical_direction == DIRECTION.NORTH) {
		sweep_flag = 1;
	}

	var move_to_corner = `M${corner_join_x + arc_dx} ${corner_join_y}`;
	var arc = `a${edge_width} ${edge_width} 0 0 ${sweep_flag} ${-arc_dx} ${arc_dy}`;
	var fill_corner = `l 0 ${post_move} z`;

	append_svg_node(svg, 'path', { d: `${move_to_corner} ${arc} ${fill_corner}`, fill: 'blue'});
}
