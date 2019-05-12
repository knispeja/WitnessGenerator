class Node {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		var border_edge_vert = new Edge(this, null, true);
		border_edge_vert.edge_type = EDGE_TYPE.BORDER;
		var border_edge_horz = new Edge(this, null, false);
		border_edge_horz.edge_type = EDGE_TYPE.BORDER;

		this.north = border_edge_vert;
		this.east = border_edge_horz;
		this.south = border_edge_vert;
		this.west = border_edge_horz;

		this.node_type = NODE_TYPE.NORMAL;
		this.traversed = false;
	}

	is_neighbors_with(node) {
		return this.north.connects_to(node) ||
			this.east.connects_to(node) ||
			this.south.connects_to(node) ||
			this.west.connects_to(node);
	}

	is_on_edge() {
		return this.north.is_at_border() || this.south.is_at_border() ||
			this.east.is_at_border() || this.west.is_at_border();
	}

	is_corner() {
		return (this.north.is_at_border() || this.south.is_at_border())
			&& (this.east.is_at_border() || this.west.is_at_border());
	}

	get_adjacent_pathable_edges() {
		return this.get_adjacent_edges().filter(
			edge => edge.edge_type != EDGE_TYPE.BORDER && edge.edge_type != EDGE_TYPE.OBSTACLE
		);
	}

	get_adjacent_edges() {
		return [this.north, this.east, this.south, this.west];
	}

	get_adjacent_required_edges() {
		return this.get_adjacent_edges().filter(edge => edge.is_required());
	}

	get_edge(direction) {
		switch (direction) {
			case DIRECTION.NORTH:
				return this.north;
			case DIRECTION.EAST:
				return this.east;
			case DIRECTION.SOUTH:
				return this.south;
			case DIRECTION.WEST:
				return this.west;
			default:
				throw "Invalid direction passed to get_edge()";
		}
	}

	get_connected_node(direction) {
		var edge = this.get_edge(direction);
		if (edge.edge_type == EDGE_TYPE.BORDER) {
			return null;
		}
		return edge.get_other_connecting_node(this);
	}

	add_connection(node, direction) {
		var is_vertical = direction == DIRECTION.NORTH || direction == DIRECTION.SOUTH;
		var new_edge = new Edge(this, node, is_vertical);
		if (direction == DIRECTION.NORTH) {
			this.north = new_edge;
			node.south = new_edge;
		}
		else if (direction == DIRECTION.SOUTH) {
			node.north = new_edge;
			this.south = new_edge;
		}
		else if (direction == DIRECTION.EAST) {
			this.east = new_edge;
			node.west = new_edge;
		}
		else {
			node.east = new_edge;
			this.west = new_edge;
		}
	}
}
