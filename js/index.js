window.onload = function() {
    const puzzle = new Puzzle(4, 4);
    puzzle.init_random_puzzle(20);
    init_graphics(new PuzzleDrawConfiguration('#B1F514'));
    draw_puzzle(puzzle);
}
