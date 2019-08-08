class PathDisplay {
	constructor() {
		this.currently_drawing_path = false;
		this.start_node_overlay = null;
		this.path_objects = [];
		this.directions_moved = [];
		this.path_head_is_node = true;
		this.mouse_tracker = null;
	}

	last_direction_moved() {
		if (this.directions_moved.length == 0) {
			return null;
		}
		return this.directions_moved[this.directions_moved.length - 1];
	}

	start_drawing(start_node) {
		document.body.addEventListener('click', path_display.stop_drawing, true);
		window.addEventListener('keydown', path_display.handle_key, true);
		this.currently_drawing_path = true;
		this.start_node_overlay = start_node;
		this.mouse_tracker = new MouseTracker();
		this.expand_start_node_timer = setInterval(() => this.expand_start_node(this), 5);
		this.path_head_is_node = true;
		puzzle.set_traversed(puzzle.start_node);
	}

	stop_drawing() {
		if (!path_display.currently_drawing_path) {
			return;
		}

		document.exitPointerLock();
		document.body.removeEventListener('click', path_display.stop_drawing, true);
		window.removeEventListener('keydown', path_display.handle_key, true);
		path_display.mouse_tracker.dispose();

		svg.removeChild(path_display.start_node_overlay);

		path_display.path_objects.forEach((path_object) => {
			svg.removeChild(path_object);
		});

		path_display.start_node_overlay = null;
		path_display.path_objects = [];
		path_display.directions_moved = [];
		puzzle.reset_path();

		path_display.currently_drawing_path = false;
	}

	handle_key(e) {
		switch (e.keyCode) {
			case 37: return on_attempted_full_step(DIRECTION.WEST);
			case 38: return on_attempted_full_step(DIRECTION.NORTH);
			case 39: return on_attempted_full_step(DIRECTION.EAST);
			case 40: return on_attempted_full_step(DIRECTION.SOUTH);
			
			case 8:  // Backspace
			case 13: // Enter
			case 27: // Escape
			case 36: // Delete
				return path_display.stop_drawing();
		}
	}

	move_forward_to(traversible, direction_moved) {
		this.directions_moved.push(direction_moved);
		this.path_head_is_node = !this.path_head_is_node;
		puzzle.set_traversed(traversible);

		var old_rect = puzzle.get_head_of_path().graphics_object;
		var path_edge = clone_svg_node(old_rect);
		path_edge.setAttributeNS(null, 'fill', cfg.path_color);
		this.path_objects.push(path_edge);

		if (this.path_head_is_node && traversible.node_type == NODE_TYPE.END) {
			if (puzzle.is_path_valid()) {
				// Change color of entire path
				this.path_objects.forEach((path_object) => {
					path_object.setAttributeNS(null, 'fill', cfg.solution_color)
				});
				path_display.start_node_overlay.setAttributeNS(null, 'fill', cfg.solution_color);
				puzzle.on_solve();
			}
		}
	}

	move_backwards() {
		this.directions_moved.pop();
		svg.removeChild(this.path_objects.pop());
		this.path_head_is_node = !this.path_head_is_node;
		puzzle.remove_head_of_path();
	}

	expand_start_node() {
		var prev_radius = parseInt(path_display.start_node_overlay.getAttributeNS(null, 'r'));
		var new_radius = prev_radius + 1;
	
		if (new_radius >= cfg.start_node_radius) {
			clearInterval(path_display.expand_start_node_timer);
			new_radius = cfg.start_node_radius;
		}
	
		path_display.start_node_overlay.setAttributeNS(null, 'r', new_radius);
	}
}
var path_display = new PathDisplay();

class MouseTracker {
	constructor() {
		this.previous_x;
		this.previous_y;
		this.movement_buffer = [];
		document.onmousemove = this.on_mouse_move;
		document.body.requestPointerLock();
	};

	on_mouse_move() {
		if (path_display.mouse_tracker.previous_x != undefined) {
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

			path_display.mouse_tracker.on_mouse_move_toward(direction);
		}

		path_display.mouse_tracker.previous_x = event.pageX;
		path_display.mouse_tracker.previous_y = event.pageY;
	}

	on_mouse_move_toward(direction) {
		var movement_buffer = path_display.mouse_tracker.movement_buffer;
		for (var i=0; i<movement_buffer.length; i++) {
			if (movement_buffer[i] != direction) {
				path_display.mouse_tracker.movement_buffer = [];
				return false;
			}
		}

		movement_buffer.push(direction);
		if (movement_buffer.length < 5) {
			return false;
		}
		path_display.mouse_tracker.movement_buffer = [];
		return on_attempted_move(direction);
	}

	dispose() {
		document.onmousemove = undefined;
	}
}

function on_attempted_full_step(direction) {
	if(on_attempted_move(direction)) {
		if (!path_display.path_head_is_node) {
			on_attempted_move(direction);
		}
	}
}

function on_attempted_move(direction) {
	if (puzzle.path.length == 0) {
		path_display.stop_drawing();
		return;
	}

	var path_head = puzzle.get_head_of_path();
	var new_path_object;

	if (flip_direction(direction) == path_display.last_direction_moved()) {
		path_display.move_backwards();
		return true;
	}

	if (path_display.path_head_is_node) {
		var new_edge = path_head.get_edge(direction);
		if (!new_edge.is_traversible()) {
			return false;
		}
		new_path_object = new_edge;
	} else {
		if (is_vertical(direction) != path_head.is_vertical) {
			return false;
		}
		new_path_object = path_head.get_other_connecting_node(puzzle.path[puzzle.path.length - 2]);
		if (new_path_object.traversed) {
			return false;
		}
	}

	path_display.move_forward_to(new_path_object, direction);
	return true;
}

function on_click_start_node(start_node) {
	if (path_display.currently_drawing_path) {
		return;
	}

	var center_x = start_node.getAttributeNS(null, 'cx');
	var center_y = start_node.getAttributeNS(null, 'cy');
	var radius = cfg.start_node_radius/10;

	var start_node_overlay = append_svg_node(svg, 'circle', { cx: center_x, cy: center_y, r: radius, fill: cfg.path_color });

	path_display.start_drawing(start_node_overlay);
}
