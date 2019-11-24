class PuzzleGenerationConfiguration {
	constructor() {
        var rng = new Math.seedrandom(); // Avoid affecting Math.random() in this method
        if (url_params.width) {
            this.width_in_cells = parseInt(url_params.width);
        } 
        else {
            this.width_in_cells = random_integer_between(4, 8, rng);
            url_params.width = this.width_in_cells;
            addUrlParameter('width', url_params.width);
        }

        if (url_params.height) {
            this.height_in_cells = parseInt(url_params.height);
        }
        else {
            this.height_in_cells = FORCE_SQUARE_PUZZLES ? this.width_in_cells : random_integer_between(3, 7, rng);
            url_params.height = this.height_in_cells;
            addUrlParameter('height', url_params.height);
        }

        var smaller_dimension = Math.min(this.width_in_cells, this.height_in_cells);
        if (smaller_dimension > 8)
        {
            // This equation works better for huge puzzles
            this.min_path_length_generated = smaller_dimension * 5;
        }
        else
        {
            // This equation (~x^2 - 4(x-3)) works pretty well unless the puzzle becomes huge
            this.min_path_length_generated = this.width_in_cells * this.height_in_cells - (smaller_dimension - 3) * 4;
        }

        this.disable_pellets = !stringToBoolean(url_params.pellets, true);
        this.disable_obstacles = !stringToBoolean(url_params.obstacles, true);
        this.disable_colored_squares = !stringToBoolean(url_params.squares, true);
        this.disable_extra_end_nodes = !stringToBoolean(url_params.extraterminals, true);
        
        // Dictates whether the colored squares will be in more than two colors
        var should_disable_bw_mode = smaller_dimension <= 4 ? 0 : random_integer_between(0, 1);
        this.black_white_mode = should_disable_bw_mode == 1 ? false : true;
    }
}
