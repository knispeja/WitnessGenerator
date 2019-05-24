window.onload = function() {
    init_graphics(new PuzzleDrawConfiguration('#B1F514'));
    puzzle = new Puzzle(4, 4);
    puzzle.init_random_puzzle(20);
}
