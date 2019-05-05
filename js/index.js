window.onload = function() {
    const draw_config = new PuzzleDrawConfiguration('#B1F514', 100, 24);
    const puzzle = new Puzzle(draw_config);
    puzzle.init_random_puzzle();
    draw_puzzle(puzzle);
}
