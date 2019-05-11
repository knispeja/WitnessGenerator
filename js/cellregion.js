class CellRegion {
	constructor() {
		this.cells = [];
		this.is_valid = true;
		this.color = null;
	}

	add_cell(cell) {
		cell.region = this;
		this.cells.push(cell);
		if (this.color == null) {
			this.color = cell.color;
		}
		else if (cell.has_color_compatible_with(this.color)) {
			this.is_valid = false;
		}
	}
}
