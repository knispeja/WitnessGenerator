class KeyboardTracker { // Disposable
    constructor() {
        window.addEventListener('keydown', this.on_key_press, true);
    }

    on_key_press(e) {
		const move_dist = 9;
		switch (e.keyCode) {
			case 37: return on_attempted_move(move_dist, DIRECTION.WEST);
			case 38: return on_attempted_move(move_dist, DIRECTION.NORTH);
			case 39: return on_attempted_move(move_dist, DIRECTION.EAST);
			case 40: return on_attempted_move(move_dist, DIRECTION.SOUTH);
			
			case 8:  // Backspace
			case 13: // Enter
			case 27: // Escape
			case 36: // Delete
				return on_stop_drawing();
		}
    }
    
    dispose() {
        window.removeEventListener('keydown', this.on_key_press, true);
    }
}
