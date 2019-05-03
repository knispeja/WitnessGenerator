function random_value_from_2d_array(array) {
	return random_value_from_array(random_value_from_array(array));
}

function random_value_from_array(array) {
	return array[random_integer_between(0, array.length - 1)];
}

function random_integer_between(min, max) {
	if (min > max) {
		throw "First argument to random_integer_between should be less than the second";
	}

	return min + Math.floor(Math.random() * (max - min + 1));
};
