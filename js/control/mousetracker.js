class MouseTracker { // Disposable
	constructor() {
		this.previous_x;
		this.previous_y;
		this.movement_buffer = [];
		document.ontouchmove = () => this.on_touch_move(this);
		document.onmousemove = () => this.on_mouse_move(this);
		document.body.requestPointerLock();
	};

	on_touch_move() {
		var current_x = event.originalEvent.touches[0].clientX;
		var current_y = event.originalEvent.touches[0].clientY;

		if (this.previous_x != undefined) {
			this.on_move(current_x - this.previous_x, current_y - this.previous_y);
		}

		this.previous_x = current_x;
		this.previous_y = current_y;
	}

	on_mouse_move() {
		var delta_x =	event.movementX			||
						event.mozMovementX		||
						event.webkitMovementX	||
						0;
		var delta_y = 	event.movementY 		||
						event.mozMovementY      ||
						event.webkitMovementY   ||
						0;

		this.on_move(delta_x, delta_y);
	}

	on_move(delta_x, delta_y) {		
		if (delta_x == 0 && delta_y == 0) {
			return;
		}
		
		var delta_x_mag = Math.abs(delta_x);
		var delta_y_mag = Math.abs(delta_y);

		var pixels;
		var direction;
		if (delta_x_mag > delta_y_mag) {
			pixels = delta_x_mag;
			if (delta_x > 0) {
				direction = DIRECTION.EAST;
			}
			else {
				direction = DIRECTION.WEST;
			}
		}
		else {
			pixels = delta_y_mag;
			if (delta_y > 0) {
				direction = DIRECTION.SOUTH;
			}
			else {
				direction = DIRECTION.NORTH;
			}
		}

		this.on_mouse_move_toward(pixels, direction);
	}

	on_mouse_move_toward(pixels, direction) {
		var movement_buffer = this.movement_buffer;
		for (var i=0; i<movement_buffer.length; i++) {
			if (movement_buffer[i] != direction) {
				this.movement_buffer = [];
				return false;
			}
		}

		movement_buffer.push(direction);
		if (movement_buffer.length < MOUSE_MOVEMENT_BUFFER_SIZE) {
			return false;
		}
		this.movement_buffer = [];
		return on_attempted_move(pixels, direction);
	}

	dispose() {
		document.ontouchmove = undefined;
        document.onmousemove = undefined;
        document.exitPointerLock();
	}
}
