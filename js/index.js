window.onload = async function() {
	url_params = getJsonFromUrl();

	var regenerations = 0;
	if (url_params.seed !== undefined) {
		regenerations = TIMES_TO_REGENERATE;
	}

	while (true) {
		var final_puzzle = regenerations++ >= TIMES_TO_REGENERATE;
		prevent_url_seed = !final_puzzle;

		init_graphics(new PuzzleDrawConfiguration('#B1F514'));
		puzzle = new Puzzle(new PuzzleGenerationConfiguration());
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
   