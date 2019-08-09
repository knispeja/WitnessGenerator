class PuzzleGenerationConfiguration {
	constructor() {
        if (url_params.width) {
            this.width_in_cells = parseInt(url_params.width);
        } else {
            this.width_in_cells = random_integer_between(3, 8);
            url_params.width = this.width_in_cells;
            addUrlParameter('width', url_params.width);
        }

        if (url_params.height) {
            this.height_in_cells = parseInt(url_params.height);
        } else {
            this.height_in_cells = random_integer_between(3, 5);
            url_params.height = this.height_in_cells;
            addUrlParameter('height', url_params.height);
        }

    	this.min_path_length_generated = this.width_in_cells * this.height_in_cells;

        this.disable_pellets = !string_to_boolean(url_params.pellets, true);
        this.disable_obstacles = !string_to_boolean(url_params.obstacles, true);
        this.disable_colored_squares = !string_to_boolean(url_params.squares, true);
        this.disable_extra_end_nodes = !string_to_boolean(url_params.extraterminals, true);
    }
}

// TODO: put in utils class of some kind
function string_to_boolean(str, default_value) {
    if (str == undefined || str == null) {
        return default_value;
    }

    var normalized = str.toLowerCase().trim();
    if (normalized == 'true' || normalized == '1') {
        return true;
    }
    else if (normalized == 'false' || normalized == '0') {
        return false;
    }
    return default_value;
}
