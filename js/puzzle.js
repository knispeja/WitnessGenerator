class Puzzle {
	constructor(draw_config, cell_count_x, cell_count_y) {
		this.cell_count_x = cell_count_x;
		this.cell_count_y = cell_count_y;
		this.node_count_x = cell_count_x + 1;
		this.node_count_y = cell_count_y + 1;

		this.draw_config = draw_config;
		this.start_node = null;
		this.cells = [];
		this.nodes = [];
		this.path = [];

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

	init_random_puzzle(target_path_length) {
		this.start_node = random_value_from_2d_array(this.nodes);
		this.start_node.node_type = NODE_TYPE.START;
		this.generate_whimsical_path(target_path_length);

		this.for_each_step_in_path(undefined, this.generate_pellet);
		this.for_each_edge(this.generate_obstacle);
		// TODO: Generate squares
		this.for_each_node(this.generate_end_node);

		this.for_each_step_in_path(this.untraverse_path, this.untraverse_path);
		this.path = [];
	}

	set_traversed(traversible) {
		traversible.traversed = true;
		this.path.push(traversible);
	}

	generate_whimsical_path(target_path_length) {
		var result = this.generate_path_from_node_recursive(target_path_length, 0, this.start_node, null);
		if (!result) {
			throw "Failed to generate path, something went wrong";
		}
	}

	generate_path_from_node_recursive(target_path_length, current_path_length, current_node, current_edge) {
		if (current_node.traversed) {
			return false;
		}

		this.set_traversed(current_node);

		if (current_path_length >= target_path_length && current_node.is_on_edge()) {
			current_node.node_type = NODE_TYPE.END;
			return true;
		}
		
		var edges = current_node.get_adjacent_edges();
		while (true) {
			if (edges.length <= 0) {
				this.path.pop().traversed = false;
				return false;
			}
			var edge_index = random_array_index(edges);
			var edge = edges.splice(edge_index, 1)[0];

			if (this.generate_path_from_edge_recursive(target_path_length, current_path_length, current_node, edge)) {
				break;
			}
		}

		return true;
	}

	generate_path_from_edge_recursive(target_path_length, current_path_length, current_node, current_edge) {
		if (current_edge.edge_type == EDGE_TYPE.BORDER || current_edge.traversed) {
			return false;
		}

		this.set_traversed(current_edge);
		var new_node = current_edge.get_other_connecting_node(current_node);
		if (!this.generate_path_from_node_recursive(target_path_length, current_path_length + 1, new_node)) {
			this.path.pop().traversed = false;
		}
		return current_edge.traversed;
	}

	for_each_step_in_path(node_fxn = null, edge_fxn = null) {
		if (this.path.length <= 0) {
			throw "Path is not yet generated";
		}

		var is_edge = false;
		this.path.forEach(function(traversible) {
			if (node_fxn != null && !is_edge) {
				node_fxn(traversible);
			}
			if (edge_fxn != null && is_edge) {
				edge_fxn(traversible);
			}
			is_edge = !is_edge;
		});
	}

	for_each_edge(edge_fxn) {
		this.for_each_node(function(node) {
			edge_fxn(node.north);
			edge_fxn(node.west);
		});
	}

	for_each_node(node_fxn) {
		for (var x=0; x<this.nodes.length; x++) {
			for (var y=0; y<this.nodes[x].length; y++) {
				var node = this.nodes[x][y];
				node_fxn(node);
			}
		}
	}

	generate_pellet(edge) {
		if (Math.random() < 0.08) {
			edge.edge_type = EDGE_TYPE.PELLET;
		}
	}

	generate_obstacle(edge) {
		if (edge.edge_type != EDGE_TYPE.NORMAL || edge.traversed) {
			return;
		}
		if (Math.random() < 0.04) {
			edge.edge_type = EDGE_TYPE.OBSTACLE;
			// TODO: Check for islands and revert
		}
	}

	generate_end_node(node) {
		if (node.node_type == NODE_TYPE.NORMAL) {
			node.node_type = NODE_TYPE.END;
		}
	}

	untraverse_path(traversible) {
		traversible.traversed = false;
	}
}
