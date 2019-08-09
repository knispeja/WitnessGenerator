// Check for special dates on load
var today = new Date();
var is_halloween = false;
var is_christmas = (today.getMonth() == 11 && today.getDate() == 25);
if (!is_christmas) {
	is_halloween = (today.getMonth() == 9 && today.getDate() == 31);
}

var is_holiday = is_christmas || is_halloween;

class PuzzleDrawConfiguration {
	constructor(color) {
		if (!is_holiday && color === undefined) {
			var rng = new Math.seedrandom(); // Avoid affecting Math.random()
			color = random_value_from_array(PUZZLE_COLORS, rng);
		}

		if (is_christmas) {
			this.color = '#2F9713';
			document.body.style.background = '#146B3A';
			CELL_COLORS[0] = '#F8B229';
			CELL_COLORS[1] = '#D41210';

			this.solution_color = 'white';
			this.path_color = '#BB0700';
			this.pellet_color = 'white';
		}
		else if (is_halloween) {
			this.color = '#FF7400';
			document.body.style.background = '#1C1C1C';
			CELL_COLORS[0] = '#63C328';
			CELL_COLORS[1] = '#902EBB';

			this.solution_color = 'white';
			this.path_color = '#EEEB27';
			this.pellet_color = '#902EBB';
		}
		else {
			this.color = color;
			this.solution_color = pSBC(0.30, this.color);
			this.path_color = pSBC(0.55, this.color);
			this.pellet_color = 'black';
		}

		this.background_color = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
		this.edge_spacing = 100;
		this.edge_thickness = this.edge_spacing / 4;
		this.obstacle_gap_size = this.edge_spacing / 4;
		this.start_node_radius = this.edge_thickness * 1.2;
		this.pellet_side_length = this.edge_thickness/2.08;
		this.colored_square_side_length = 0.3 * this.edge_spacing;
	}
}
