var seeded = false;
var current_seed;
prevent_url_seed = false;

function ensure_seeded() {
	if (seeded) {
		return;
	}

	if (url_params.seed === undefined) {
		// Seed Math.random() and set URL param to that seed
		current_seed = Math.seedrandom();
		if (!prevent_url_seed) {
			addUrlParameter("seed", current_seed);
		}
	}
	else {
		// Use existing URL param
		Math.seedrandom(url_params.seed);
	}
	seeded = true;
}

function get_current_seed() {
	return encodeURIComponent(current_seed);
}

function reset_seed() {
	seeded = false;
}

function random_value_from_2d_array(array) {
	return random_value_from_array(random_value_from_array(array));
}

function random_value_from_array(array) {
	return array[random_array_index(array)];
}

function random_array_index(array) {
	return random_integer_between(0, array.length - 1);
}

function random_integer_between(min, max) {
	if (min > max) {
		throw "First argument to random_integer_between should be less than the second";
	}

	ensure_seeded();
	return min + Math.floor(Math.random() * (max - min + 1));
};
