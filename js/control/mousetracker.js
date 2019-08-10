class MouseTracker {
	constructor() {
		this.previous_x;
		this.previous_y;
		this.movement_buffer = [];
		document.onmousemove = this.on_mouse_move;
		document.body.requestPointerLock();
	};

	on_mouse_move() {
		if (mouse_tracker.previous_x != undefined) {
			var delta_x =	event.movementX			||
							event.mozMovementX		||
							event.webkitMovementX	||
							0;
			var delta_y = 	event.movementY 		||
							event.mozMovementY      ||
							event.webkitMovementY   ||
							0;
			var delta_x_mag = Math.abs(delta_x);
			var delta_y_mag = Math.abs(delta_y);

			var direction;
			if (delta_x_mag > delta_y_mag) {
				if (delta_x > 0) {
					direction = DIRECTION.EAST;
				}
				else {
					direction = DIRECTION.WEST;
				}
			}
			else {
				if (delta_y > 0) {
					direction = DIRECTION.SOUTH;
				}
				else {
					direction = DIRECTION.NORTH;
				}
			}

			mouse_tracker.on_mouse_move_toward(direction);
		}

		mouse_tracker.previous_x = event.pageX;
		mouse_tracker.previous_y = event.pageY;
	}

	on_mouse_move_toward(direction) {
		var movement_buffer = mouse_tracker.movement_buffer;
		for (var i=0; i<movement_buffer.length; i++) {
			if (movement_buffer[i] != direction) {
				mouse_tracker.movement_buffer = [];
				return false;
			}
		}

		movement_buffer.push(direction);
		if (movement_buffer.length < 5) {
			return false;
		}
		mouse_tracker.movement_buffer = [];
		return on_attempted_move(direction);
	}

	dispose() {
        document.onmousemove = undefined;
        document.exitPointerLock();
	}
}
