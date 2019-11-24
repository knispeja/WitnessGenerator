window.onload = async function() {
	url_params = getJsonFromUrl();
	cfg = loadUninitializedPuzzleDrawConfig();

	// Variables for speed test
	if (DEBUG || GENERATION_SPEED_TEST) {
		puzzles_generated = 0;
		max_generation_time = 0;
		problematic_seeds = [];
	}

	// Loop to regenerate puzzles for a visual effect if no seed is passed
	var seeded = url_params.seed !== undefined;
	var regenerations = 0;
	while (true) {
		// Is this the last puzzle to generate?
		var final_puzzle = regenerations++ >= TIMES_TO_REGENERATE || seeded;
		if (GENERATION_SPEED_TEST && !seeded) {
			final_puzzle = false;
		}

		// Don't put the seed in the URL, prevents the same puzzle from regenerating
		prevent_url_seed = !final_puzzle;

		// Generate puzzle, time how long it takes if needed
		var puzzle_gen_config = new PuzzleGenerationConfiguration();
		init_graphics();
		cfg.initialize(puzzle_gen_config);
		
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
		confetti_helper();
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
