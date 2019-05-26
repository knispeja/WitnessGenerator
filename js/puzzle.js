class Puzzle {
	constructor(cell_count_x, cell_count_y) {
		this.cell_count_x = cell_count_x;
		this.cell_count_y = cell_count_y;
		this.node_count_x = cell_count_x + 1;
		this.node_count_y = cell_count_y + 1;

		this.start_node = null;
		this.cells = [];
		this.nodes = [];
		this.path = [];

		this.regions = null;

		this.on_solve_fxn = null;

		// Init cells
		for (var x=0; x<this.cell_count_x; x++)
		{
			this.cells[x] = [];
			for (var y=0; y<this.cell_count_y; y++)
			{
				this.cells[x][y] = new Cell(x, y);
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
						node.west.cell1.south_edge = node.west;
					}

					// South cell of edge
					if (y < this.cell_count_y) {
						node.west.cell2 = this.cells[x-1][y];
						node.west.cell2.north_edge = node.west;
					}
				}
				if (y != 0) {
					node.add_connection(this.nodes[x][y-1], DIRECTION.NORTH);

					// West cell of edge
					if (x > 0) {
						node.north.cell1 = this.cells[x-1][y-1];
						node.north.cell1.east_edge = node.north;
					}

					// East cell of edge
					if (x < this.cell_count_x) {
						node.north.cell2 = this.cells[x][y-1];
						node.north.cell2.west_edge = node.north;
					}
				}
				this.nodes[x][y] = node;
			}
		}
	}

	on_solve() {
		alert("Puzzle solved!");
		if (this.on_solve_fxn) {
			this.on_solve_fxn();
		}
	}

	init_random_puzzle(target_path_length) {
		this.start_node = random_value_from_2d_array(this.nodes);
		this.start_node.node_type = NODE_TYPE.START;
		this.generate_whimsical_path(target_path_length);
		this.compute_regions();

		this.for_each_step_in_path(undefined, this.generate_pellet);
		this.for_each_edge(this.generate_obstacle);
		this.generate_colored_squares();
		this.for_each_node(this.generate_end_node);

		if (!this.is_path_valid()) {
			throw "Generated path is not valid with the created puzzle elements";
		}

		// Draw before resetting, if we're in debug mode we'll draw the solution
		draw_puzzle(puzzle);

		// Reset variables for pathing
		this.reset_path();
		this.clear_regions();
	}

	set_traversed(traversible) {
		traversible.traversed = true;
		this.path.push(traversible);
	}

	// Does not technically check if path is a continuous line, just that it fulfils the puzzle requirements
	is_path_valid() {
		var path_head = this.get_head_of_path();
		if (!path_head.node_type) {
			return false; // Head of path is an edge, not a node
		}

		if (this.start_node != this.path[0]) {
			return false; // Path does not start at start node
		}

		if (path_head.node_type != NODE_TYPE.END) {
			return false; // Path does not end at an end node
		}

		window.path_is_valid = true;
		this.for_each_edge((edge) => {
			if (edge.edge_type == EDGE_TYPE.PELLET && !edge.traversed) {
				window.path_is_valid = false;
			} 
		});
		if (!window.path_is_valid) {
			return false; // Path does not cross all pellets
		}

		// Keep region check at bottom -- it's the slowest and modifies the regions variable
		if (this.regions.length == 0) {
			this.compute_regions();
		}
		var all_regions_valid = true;
		for (var i=0; i<this.regions.length; i++) {
			if (!this.regions[i].is_valid) {
				all_regions_valid = false; // Region contains colors from multiple colors
			}
		}
		this.regions = []; // Reset regions for the next time we call this method (no need to call clear, compute_regions() does this)

		return all_regions_valid;
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
		if (!current_edge.is_traversible()) {
			return false;
		}

		this.set_traversed(current_edge);
		var new_node = current_edge.get_other_connecting_node(current_node);
		if (!this.generate_path_from_node_recursive(target_path_length, current_path_length + 1, new_node)) {
			this.path.pop().traversed = false;
		}
		return current_edge.traversed;
	}

	compute_regions() {
		this.clear_regions();
		for (var x=0; x<this.cells.length; x++) {
			for (var y=0; y<this.cells[x].length; y++) {
				var cell = this.cells[x][y];
				if (cell.region == null) {
					var region = new CellRegion();
					this.regions.push(region);
					this.compute_region_recursive(cell, region);
				}
			}
		}
	}

	clear_regions() {
		this.regions = [];
		this.for_each_cell((cell) => cell.region = null);
	}

	compute_region_recursive(current_cell, current_region) {
		current_region.add_cell(current_cell);
		current_cell.get_non_null_adjacent_edges().forEach(function(edge) {
			var other_cell = edge.get_other_connecting_cell(current_cell);
			if (other_cell == null || other_cell.region != null || edge.traversed) {
				return;
			}
			this.compute_region_recursive(other_cell, current_region);
		}, this);
	}

	generate_colored_squares() {
		var black_white_mode = true;
		var cell_color = black_white_mode ? CELL_COLOR.WHITE : CELL_COLOR.START_HUES;
		var regions_with_squares = 0;
		this.regions.forEach(function (region) {
			var squares_generated_in_region = 0;
			var last_cell_given_square = null;

			// Don't put squares in the last region if we haven't generated any
			if (regions_with_squares == 0 && region == this.regions[this.regions.length - 1]) {
				return;
			}

			region.cells.forEach(function (cell) {
				var odds_of_square = 0;

				// Avoid having only squares of one color
				var must_create_square = (regions_with_squares == 1 && squares_generated_in_region == 0);

				if (!must_create_square) {
					var existing_squares_in_region_weight = 0.24;
					odds_of_square += existing_squares_in_region_weight/(squares_generated_in_region + 1);

					var untraversible_edge_weight = 0.05;
					odds_of_square += (
						cell.get_non_null_adjacent_edges().filter(function(edge) { return edge.is_traversible(); }).length
						/ (4/untraversible_edge_weight)
					);

					var traversed_edge_weight = 0.15;
					odds_of_square += (
						cell.get_non_null_adjacent_edges().filter(function(edge) { return edge.traversed; }).length
						/ (4/traversed_edge_weight)
					);

					if (last_cell_given_square != null) {
						var distance_to_last_square_weight = 0.32;
						var maximum_manhattan = this.cell_count_x - 1 + this.cell_count_y - 1;
						odds_of_square += (
							cell.manhattan_distance_to(last_cell_given_square)
							/ (maximum_manhattan)
						) * distance_to_last_square_weight;
					}
				}

				if (must_create_square || Math.random() < odds_of_square) {
					if (squares_generated_in_region == 0) {
						regions_with_squares++;
					}

					squares_generated_in_region++;
					last_cell_given_square = cell;
					cell.color = CELL_COLORS[cell_color];
					cell.cell_type = CELL_TYPE.SQUARE;
				}
			}, this);
			if (black_white_mode) {
				cell_color = (cell_color == CELL_COLOR.WHITE) ? CELL_COLOR.BLACK : CELL_COLOR.WHITE;
			}
			else if (++cell_color >= CELL_COLORS.length) {
				return;
			}
		}, this);
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
			if (node.south.get_other_connecting_node(node) == null) {
				edge_fxn(node.south);
			}
			else if (node.west.get_other_connecting_node(node) == null) {
				edge_fxn(node.west);
			}
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

	for_each_cell(cell_fxn) {
		for (var x=0; x<this.cells.length; x++) {
			for (var y=0; y<this.cells[x].length; y++) {
				var cell = this.cells[x][y];
				cell_fxn(cell);
			}
		}
	}

	generate_pellet(edge) {
		if (Math.random() < 0.14) {
			edge.edge_type = EDGE_TYPE.PELLET;
		}
	}

	generate_obstacle(edge) {
		if (edge.edge_type != EDGE_TYPE.NORMAL || edge.traversed) {
			return;
		}
		if (Math.random() < 0.45) {
			edge.edge_type = EDGE_TYPE.OBSTACLE;
			if (edge.node1.get_adjacent_pathable_edges().length < 2 || edge.node2.get_adjacent_pathable_edges().length < 2) {
				edge.edge_type = EDGE_TYPE.NORMAL;
			}
		}
	}

	generate_end_node(node) {
		if (node.node_type == NODE_TYPE.NORMAL && node.is_on_edge() && Math.random() < 0.02) {
			node.node_type = NODE_TYPE.END;
		}
	}

	get_head_of_path() {
		if (this.path.length == 0) {
			throw "Path is empty";
		}

		return this.path[this.path.length - 1];
	}

	remove_head_of_path() {
		this.untraverse_path(this.path.pop());
	}

	reset_path() {
		this.for_each_step_in_path(this.untraverse_path, this.untraverse_path);
		this.path = [];
	}

	untraverse_path(traversible) {
		traversible.traversed = false;
	}
}
