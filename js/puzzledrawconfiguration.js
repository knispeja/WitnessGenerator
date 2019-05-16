class PuzzleDrawConfiguration {
	constructor(color) {
		this.color = color;
		this.background_color = 'grey';
		this.edge_spacing = 100;
		this.edge_thickness = 24;
		this.obstacle_gap_size = this.edge_spacing / 4;
        this.start_node_radius = this.edge_thickness * 1.2;
        this.path_color = pSBC(0.55, this.color);
		this.pellet_color = 'black';
		this.pellet_side_length = this.edge_thickness/2.08;
		this.colored_square_side_length = 30;
	}
}