window.onload = function() {
	url_params = getJsonFromUrl();
	init_graphics(new PuzzleDrawConfiguration('#B1F514'));
	puzzle = new Puzzle(new PuzzleGenerationConfiguration());
	puzzle.on_solve_fxn = () => {
		alert("Solved it!");
	}
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
    var url_params = location.search;
    if (url_params.length > 0) {
        url_params += "&";
    }
    else {
        url_params += "?";
    }

    var encoded_value = encodeURIComponent(value);
    url_params += `${key}=${encoded_value}`;

    history.pushState(null, null, window.location.pathname + url_params);
}
   