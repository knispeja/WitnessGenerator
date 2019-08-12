class PuzzleGenerationConfiguration {
	constructor() {
        var rng = new Math.seedrandom(); // Avoid affecting Math.random() in this method
        if (url_params.width) {
            this.width_in_cells = parseInt(url_params.width);
        } else {
            this.width_in_cells = random_integer_between(3, 7, rng);
            url_params.width = this.width_in_cells;
            addUrlParameter('width', url_params.width);
        }

        if (url_params.height) {
            this.height_in_cells = parseInt(url_params.height);
        }
        else {
            this.height_in_cells = FORCE_SQUARE_PUZZLES ? this.width_in_cells : random_integer_between(3, 5, rng);
            url_params.height = this.height_in_cells;
            addUrlParameter('height', url_params.height);
        }

    	this.min_path_length_generated = this.width_in_cells * this.height_in_cells;

        this.disable_pellets = !stringToBoolean(url_params.pellets, true);
        this.disable_obstacles = !stringToBoolean(url_params.obstacles, true);
        this.disable_colored_squares = !stringToBoolean(url_params.squares, true);
        this.disable_extra_end_nodes = !stringToBoolean(url_params.extraterminals, true);
        
        // Dictates whether the colored squares will be in more than two colors
        this.black_white_mode = true;
    }
}
