class Edge {
	constructor(node1, node2, is_vertical) {
		this.is_vertical = is_vertical;
		this.edge_type = EDGE_TYPE.NORMAL;
		this.node1 = node1;
		this.node2 = node2;
		this.cell1 = null;
		this.cell2 = null;
		this.traversed = false;
		this.graphics_object = null;
	}

	is_partially_traversible() {
		return this.edge_type != EDGE_TYPE.BORDER && !this.traversed;
	}

	is_traversible() {
		return (this.edge_type != EDGE_TYPE.OBSTACLE && this.edge_type != EDGE_TYPE.BORDER && !this.traversed);
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
			throw "This edge does not connect to the provided node";
		}

		if (this.node1 != node) {
			return this.node1;
		}
		return this.node2;
	}

	get_other_connecting_cell(cell) {
		if (cell == this.cell1) {
			return this.cell2;
		}
		if (cell == this.cell2) {
			return this.cell1;
		}
		throw "This edge does not connect to the provided cell"
	}

	connects_to(node) {
		return node == this.node1 || node == this.node2;
	}
}
