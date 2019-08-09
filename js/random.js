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

function random_value_from_2d_array(array, rng) {
	return random_value_from_array(random_value_from_array(array, rng), rng);
}

function random_value_from_array(array, rng) {
	return array[random_array_index(array, rng)];
}

function random_array_index(array, rng) {
	return random_integer_between(0, array.length - 1, rng);
}

/* 
RNG parameter is used so we can generate unimportant random values without affecting seeded values. For example, puzzle
color doesn't always need to be generated, so generating it will affect the seed unless we use a different RNG object.
*/
function random_integer_between(min, max, rng) {
	if (min > max) {
		throw "First argument to random_integer_between should be less than the second";
	}

	var random_value;
	if (rng === undefined) {
		ensure_seeded();
		random_value = Math.random();
	}
	else {
		random_value = rng();
	}

	return min + Math.floor(random_value * (max - min + 1));
};
