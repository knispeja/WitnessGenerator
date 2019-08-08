var seeded = false;
function ensure_seeded() {
	if (seeded) {
		return;
	}

	if (url_params.seed === undefined) {
		// Seed Math.random() and set URL param to that seed
		addUrlParameter("seed", Math.seedrandom());
	}
	else {
		// Use existing URL param
		Math.seedrandom(url_params.seed);
	}
	seeded = true;
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
