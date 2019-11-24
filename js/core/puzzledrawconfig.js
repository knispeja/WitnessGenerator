class PuzzleDrawConfiguration {
	constructor(color, background_color, path_color, solution_color, pellet_color, cell_color_replace) {
		this.color = color;
		this.background_color = background_color;
		this.path_color = path_color;
		this.solution_color = solution_color;
		this.pellet_color = pellet_color;
		this.cell_color_replace = cell_color_replace;
	}

	initialize(generation_cfg) {
		if (this.color === undefined) {
			this.color = '#34495E';
		}

		if (this.solution_color === undefined) {
			this.solution_color = pSBC(0.30, this.color);
		}

		if (this.path_color === undefined) {
			this.path_color = pSBC(0.55, this.color);
		}

		if (this.pellet_color === undefined) {
			this.pellet_color = 'black';
		}

		// For reference by shapes that need to "erase" others with the background color
		if (this.background_color === undefined) {
			this.background_color = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
		}
		else {
			document.body.style.background = this.background_color;
		}

		// Replace cell square colors with their replacements for the current theme
		if (this.cell_color_replace !== undefined) {
			for (var i=0; i<this.cell_color_replace.length; i++) {
				CELL_COLORS[i] = this.cell_color_replace[i];
			}
		}

		// Get the bounding box of the SVG element to size
		var svgBounds = svg.getBoundingClientRect();

		// Length and thickness of an edge between two nodes
		this.edge_spacing = Math.min(
			svgBounds.height / generation_cfg.height_in_cells,
			svgBounds.width / generation_cfg.width_in_cells
		);
		this.edge_thickness = this.edge_spacing / 4;

		// Size of the gap placed in an edge for an obstacle
		this.obstacle_gap_size = this.edge_spacing / 4;

		// Radius of the starting node of the puzzle
		this.start_node_radius = this.edge_thickness * 1.2;

		// Size of the collectible pellets by side length
		this.pellet_side_length = this.edge_thickness/2.08;

		// Side length of the colored squares placed within cells
		this.colored_square_side_length = 0.3 * this.edge_spacing;
	}
}

function loadUninitializedPuzzleDrawConfig() {
	var today = new Date();
	var is_halloween = false;
	var is_christmas = (today.getMonth() == 11 && today.getDate() == 25);
	if (!is_christmas) {
		is_halloween = (today.getMonth() == 9 && today.getDate() == 31);
	}

	if (is_halloween) {
		return new PuzzleDrawConfiguration(
			'#FF7400', '#1C1C1C', '#EEEB27', 'white', '#902EBB',
			['#63C328', '#902EBB'] // Cell square replace
		);
	}
	else if (is_christmas) {
		return new PuzzleDrawConfiguration(
			'#2F9713', '#146B3A', '#BB0700', 'white', 'white',
			['#F8B229', '#D41210'] // Cell square replace
		);
	}
	else {
		const PUZZLE_CONFIGS = [
			new PuzzleDrawConfiguration('#B1F514', '#8C862D', '#4C5544'),
			new PuzzleDrawConfiguration('#F39C12', '#4169E1', '#F5EB4F'),
			new PuzzleDrawConfiguration('#8378C7', '#44C553', '#40E0D0', '#4769A8'),
			new PuzzleDrawConfiguration('#F1C40F', '#724AA1','#CC4E5C', '#CD607E'),
			new PuzzleDrawConfiguration('#EACE6A', '#3498DB', '#927748', '#8BA8B7'),
			new PuzzleDrawConfiguration('#34495E'),
			new PuzzleDrawConfiguration('#E74C3C', '#8C0000')
		];

		return random_value_from_array(PUZZLE_CONFIGS, new Math.seedrandom());
	}
}
