class Cell {
	constructor(x, y) {
		this.cell_type = CELL_TYPE.NORMAL;
		this.color = null;
		this.x = x;
		this.y = y;
		this.region = null;
		this.north_edge = null;
		this.east_edge = null;
		this.south_edge = null;
		this.west_edge = null;
	}

	get_non_null_adjacent_edges() {
		var edges = [this.north_edge, this.east_edge, this.south_edge, this.west_edge];
		return edges.filter(function(edge) {return edge != null});
	}

	has_color_compatible_with_cell(other_cell) {
		return has_color_compatible_with(other_cell.color);
	}

	has_color_compatible_with(cell_color) {
		if (this.color == null || cell_color == null) {
			return true;
		}

		return this.color == cell_color;
	}
}
