window.onload = function() {
    init_graphics(new PuzzleDrawConfiguration('#B1F514'));

    var puzzle_width = random_integer_between(3, 8);
    var puzzle_height = random_integer_between(3, 5);
    puzzle = new Puzzle(puzzle_width, puzzle_height);

    var min_path_length_generated = puzzle_width * puzzle_height;
    puzzle.init_random_puzzle(min_path_length_generated);
    puzzle.on_solve_fxn = () => location.reload();
}