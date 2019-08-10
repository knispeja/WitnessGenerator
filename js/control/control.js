function on_attempted_full_step(direction) {
	if (on_attempted_move(direction)) {
		if (!path_head_is_node) {
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

	if (flip_direction(direction) == last_direction_moved()) {
		move_backwards();
		return true;
	}

	if (path_head_is_node) {
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

	// Move the path in the specified direction
	directions_moved.push(direction);
	path_head_is_node = !path_head_is_node;
	puzzle.set_traversed(new_path_object);

	// Draw path moving forward
	path_display.move_forward_to();

	// Check if the puzzle was completed
	if (path_head_is_node && new_path_object.node_type == NODE_TYPE.END) {
		if (puzzle.is_path_valid()) {
			path_display.on_solve();
			puzzle.on_solve();
		}
	}

	return true;
}

function move_backwards() {
	path_display.move_backwards();
	directions_moved.pop();
	path_head_is_node = !path_head_is_node;
	puzzle.remove_head_of_path();
}

// Begin drawing path
function on_click_start_node(start_node_graphics_object) {
	if (currently_drawing_path) {
		return;
	}

	currently_drawing_path = true;
	path_head_is_node = true;

	path_display = new PathDisplay(start_node_graphics_object);
	puzzle.set_traversed(puzzle.start_node);

	// Add event listeners
	document.body.addEventListener('click', on_stop_drawing, true);
	keyboard_tracker = new KeyboardTracker();
	mouse_tracker = new MouseTracker();
}

// Stop drawing path
function on_stop_drawing() {
	if (!currently_drawing_path) {
		return;
	}

	// Remove event listeners
	document.body.removeEventListener('click', on_stop_drawing, true);
	mouse_tracker.dispose();
	keyboard_tracker.dispose();

	// Stop drawing
	path_display.dispose();

	reset_path();
	puzzle.reset_path();
}

function reset_path() {
	currently_drawing_path = false;
	directions_moved = [];
	path_head_is_node = true; // Always start at the start node
}
reset_path(); // Initialize these variables immediately

function last_direction_moved() {
	if (directions_moved.length == 0) {
		return null;
	}
	return directions_moved[directions_moved.length - 1];
}
