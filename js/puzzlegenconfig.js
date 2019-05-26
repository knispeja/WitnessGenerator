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

        this.disable_pellets = !string_to_boolean(urlParams.pellets, true);
        this.disable_obstacles = !string_to_boolean(urlParams.obstacles, true);
        this.disable_colored_squares = !string_to_boolean(urlParams.squares, true);
        this.disable_extra_end_nodes = !string_to_boolean(urlParams.extraterminals, true);
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
