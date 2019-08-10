class KeyboardTracker { // Disposable
    constructor() {
        window.addEventListener('keydown', this.on_key_press, true);
    }

    on_key_press(e) {
		switch (e.keyCode) {
			case 37: return on_attempted_full_step(DIRECTION.WEST);
			case 38: return on_attempted_full_step(DIRECTION.NORTH);
			case 39: return on_attempted_full_step(DIRECTION.EAST);
			case 40: return on_attempted_full_step(DIRECTION.SOUTH);
			
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