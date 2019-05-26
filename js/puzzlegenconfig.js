class PuzzleGenerationConfiguration {
	constructor() {
        var urlParams = getJsonFromUrl();

        if (urlParams.width) {
            this.width_in_cells = parseInt(urlParams.width);
        } else {
            this.width_in_cells = random_integer_between(3, 8);
        }

        if (urlParams.height) {
            this.height_in_cells = parseInt(urlParams.height);
        } else {
            this.height_in_cells = random_integer_between(3, 5);
        }

    	this.min_path_length_generated = this.width_in_cells * this.height_in_cells;

        this.disable_pellets = false;
        this.disable_obstacles = false;
        this.disable_colored_squares = false;
        this.disable_extra_end_nodes = false;
	}
}
