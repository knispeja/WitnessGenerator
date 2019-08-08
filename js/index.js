window.onload = function() {
	init_graphics(new PuzzleDrawConfiguration('#B1F514'));
	puzzle = new Puzzle(new PuzzleGenerationConfiguration());
	puzzle.on_solve_fxn = () => {
		alert("Solved it!");
		location.reload();
	}
}

function getJsonFromUrl(url) {
	if(!url) url = location.search;
	var query = url.substr(1);
	var result = {};
	query.split("&").forEach(function(part) {
	  var item = part.split("=");
	  result[item[0]] = decodeURIComponent(item[1]);
	});
	return result;
}