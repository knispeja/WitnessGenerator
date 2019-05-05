window.onload = function() {
    const draw_config = new PuzzleDrawConfiguration('#B1F514');
    const puzzle = new Puzzle(draw_config, 4, 3);
    puzzle.init_random_puzzle(8);
    draw_puzzle(puzzle);
}
