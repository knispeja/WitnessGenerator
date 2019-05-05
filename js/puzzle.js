class Cell {
	constructor() {
		this.cell_type = CELL_TYPE.NORMAL;
		this.cell_color = null;
	}

	has_color_compatible_with(other_cell) {
		if (this.cell_color == null || other_cell.cell_color == null) {
			return true;
		}

		return this.cell_color == other_cell.cell_color;
	}
}

class Edge {
	constructor(node1, node2, is_vertical) {
		this.is_vertical = is_vertical;
		this.edge_type = EDGE_TYPE.NORMAL;
		this.node1 = node1;
		this.node2 = node2;
		this.cell1 = null;
		this.cell2 = null;
	}

	is_traversible() {
		return (this.edge_type != EDGE_TYPE.OBSTACLE && this.edge_type != EDGE_TYPE.BORDER);
	}

	is_at_border() {
		return this.node1 == null || this.node2 == null;
	}

	is_required() {
		return this.edge_type == EDGE_TYPE.PELLET ||
			(!this.is_at_border() && this.cell1.has_color_compatible_with(this.cell2));
	}

	get_other_connecting_node(node) {
		if (!this.connects_to(node)) {
			throw "This edge does not connect to the given node";
		}

		if (this.node1 != node) {
			return this.node1;
		}
		return this.node2;
	}

	connects_to(node) {
		return node == this.node1 || node == this.node2;
	}
}

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
	}

	is_neighbors_with(node) {
		return this.north.connects_to(node) ||
			this.east.connects_to(node) ||
			this.south.connects_to(node) ||
			this.west.connects_to(node);
	}

	is_corner() {
		return (this.north.is_at_border() || this.south.is_at_border())
			&& (this.east.is_at_border() || this.west.is_at_border());
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

class Puzzle {
	constructor(draw_config, cell_count_x, cell_count_y) {
		this.cell_count_x = cell_count_x;
		this.cell_count_y = cell_count_y;
		this.node_count_x = cell_count_x + 1;
		this.node_count_y = cell_count_y + 1;

		this.draw_config = draw_config;
		this.start_node = null;
		this.end_node = null;
		this.cells = [];
		this.nodes = [];

		// Init cells
		for (var x=0; x<this.cell_count_x; x++)
		{
			this.cells[x] = [];
			for (var y=0; y<this.cell_count_y; y++)
			{
				this.cells[x][y] = new Cell();
			}
		}

		// Init nodes
		for (var x=0; x<this.node_count_x; x++)
		{
			this.nodes[x] = [];
			for (var y=0; y<this.node_count_y; y++)
			{
				var node = new Node(x, y);
				if (x != 0) {
					node.add_connection(this.nodes[x-1][y], DIRECTION.WEST);

					// North cell of edge
					if (y > 0) {
						node.west.cell1 = this.cells[x-1][y-1];
					}

					// South cell of edge
					if (y < this.cell_count_y) {
						node.west.cell2 = this.cells[x-1][y];
					}
				}
				if (y != 0) {
					node.add_connection(this.nodes[x][y-1], DIRECTION.NORTH);

					// West cell of edge
					if (x > 0) {
						node.north.cell1 = this.cells[x-1][y-1];
					}

					// East cell of edge
					if (x < this.cell_count_x) {
						node.north.cell2 = this.cells[x][y-1];
					}
				}
				this.nodes[x][y] = node;
			}
		}
	}

	init_random_puzzle() {
		this.start_node = random_value_from_2d_array(this.nodes);
		this.start_node.node_type = NODE_TYPE.START;
		// TODO Generate "whimsical path"
		// TODO Set end node
		// TODO Generate pellets
		// TODO Generate squares
	}
}
