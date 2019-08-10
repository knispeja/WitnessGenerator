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

		// Create puzzle configurations
		var puzzle_gen_config = new PuzzleGenerationConfiguration(); 
		if (puzzle_color === undefined) {
			init_graphics();
			var draw_config = new PuzzleDrawConfiguration(puzzle_gen_config);
			puzzle_color = draw_config.color;
			cfg = draw_config;
		}
		else {
			init_graphics();
			cfg = new PuzzleDrawConfiguration(puzzle_gen_config, puzzle_color);
		}

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
