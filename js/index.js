window.onload = async function() {
	url_params = getJsonFromUrl();
	var regenerations = 0;

	// Variables for speed test
	if (DEBUG || GENERATION_SPEED_TEST) {
		puzzles_generated = 0;
		max_generation_time = 0;
		problematic_seeds = [];
	}

	// Loop to regenerate puzzles for a visual effect if no seed is passed
	var puzzle_color;
	var seeded = url_params.seed !== undefined;
	while (true) {
		// Is this the last puzzle to generate?
		var final_puzzle = regenerations++ >= TIMES_TO_REGENERATE || seeded;
		if (GENERATION_SPEED_TEST && !seeded) {
			final_puzzle = false;
		}

		// Don't put the seed in the URL, prevents the same puzzle from regenerating
		prevent_url_seed = !final_puzzle;

		// Create a puzzle draw configuration 
		if (puzzle_color === undefined) {
			var draw_config = new PuzzleDrawConfiguration();
			puzzle_color = draw_config.color;
			init_graphics(draw_config);
		}
		else {
			init_graphics(new PuzzleDrawConfiguration(puzzle_color));
		}

		var puzzle_gen_config = new PuzzleGenerationConfiguration();

		// Generate puzzle, time how long it takes if needed
		if (GENERATION_SPEED_TEST || DEBUG) {
			var start = window.performance.now();
		}

		puzzle = new Puzzle(puzzle_gen_config);

		if (GENERATION_SPEED_TEST || DEBUG) {
			var end = window.performance.now();
			var delta = end - start;

			puzzles_generated++;
			if (delta > max_generation_time) {
				max_generation_time = delta;
			}

			if (delta > GENERATION_TIME_MAX_MS) {
				problematic_seeds.push(get_current_seed());
			}
		}

		// Either delay and regenerate or stop generating
		if (!final_puzzle) {
			await sleep(25);
			reset_graphics();
			reset_seed();
		}
		else {
			break;
		}
	}

	puzzle.on_solve_fxn = () => {
		alert("Solved it!");
	}
}

window.onbeforeunload = function() {
	if (!DEBUG && !GENERATION_SPEED_TEST) {
		return;
	}

	console.log(`Generated ${puzzles_generated} puzzles. Max time to generate: ${max_generation_time}ms.`);
	console.log(`Seeds that took longer than ${GENERATION_TIME_MAX_MS}ms to generate:`)
	problematic_seeds.forEach((seed) =>
		console.log(seed)
	);
}

function sleep(time_ms) {
	return new Promise((resolve) => setTimeout(resolve, time_ms));
}

function getJsonFromUrl(url) {
	if (!url) {
		url = location.search;
	}
	var query = url.substr(1);
	var result = {};
	query.split("&").forEach(function(part) {
		var item = part.split("=");
		result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}

function addUrlParameter(key, value) {
    var temp_url_params = location.search;
    if (temp_url_params.length > 0) {
        temp_url_params += "&";
    }
    else {
        temp_url_params += "?";
    }

    var encoded_value = encodeURIComponent(value);
	temp_url_params += `${key}=${encoded_value}`;
	
	url_params[key] = encoded_value;
    history.pushState(null, null, window.location.pathname + temp_url_params);
}
   