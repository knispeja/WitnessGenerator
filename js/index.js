window.onload = function() {
    const puzzle = new Puzzle();
    puzzle.init_random_puzzle();
    drawPuzzle(puzzle);
}
