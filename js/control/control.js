function on_attempted_move(pixels, direction, recursion_safety) {
	if (puzzle.path.length == 0) {
		path_display.stop_drawing();
		return false;
	}

	var path_head = puzzle.get_head_of_path();

	var new_path_object;
	if (flip_direction(direction) == last_direction_moved()) {
		if (path_head_is_node && path_display.move_node_pixels_backward_if_no_step(pixels, direction)) {
			move_backwards();
		}
		else if (path_display.move_edge_pixels_backward_if_no_step(pixels, direction)) {
			move_backwards();
		}

		return true;
	}

	if (path_head_is_node) {
		if (path_head.node_type != NODE_TYPE.START &&
			!path_display.move_node_pixels_forward_if_no_step(pixels, direction))
		{
			return false;
		}

		var new_edge = path_head.get_edge(direction);
		if (!new_edge.is_partially_traversible()) {
			return false;
		}
		new_path_object = new_edge;
	} else {
		if (is_vertical(direction) != path_head.is_vertical) {
			if (INTERPRETIVE_MOVEMENT) {
				return path_display.move_edge_pixels_towards_nearest_node(pixels, recursion_safety);
			}
			return false;
		}

		new_path_object = path_head.get_other_connecting_node(puzzle.path[puzzle.path.length - 2]);
		if (!path_display.move_edge_pixels_forward_if_no_step(pixels, direction, path_head.edge_type == EDGE_TYPE.OBSTACLE)) {
			return !new_path_object.traversed;
		}
		else if (path_head.edge_type == EDGE_TYPE.OBSTACLE || new_path_object.traversed) {
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
			remove_event_listeners();
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

function last_direction_moved() {
	if (directions_moved.length == 0) {
		return null;
	}
	return directions_moved[directions_moved.length - 1];
}

function set_force_solve_enabled(enabled) {
	disable_force_solve = !enabled;
};
set_force_solve_enabled(false);

function force_solve() {
	if (disable_force_solve || path_display != null && path_display.completed) {
		return;
	}

	disable_force_solve = true;

	on_stop_drawing();
	set_give_up_confetti();

	path_display = new PathDisplay(start_node_graphics_object_global);

	puzzle.set_traversed(puzzle.start_node);
	force_solve_recursive(puzzle.start_node);
}

function force_solve_recursive(current_node) {
	if (current_node.node_type == NODE_TYPE.END) {
		if (puzzle.is_path_valid())
		{
			return;
		}
	}

	var next_edge = current_node
		.get_adjacent_edges()
		.filter(edge => edge.part_of_solution && !edge.traversed)
		[0];
	
	var next_direction = current_node.get_direction_of_edge(next_edge);

	var new_node = current_node;
	while (!path_head_is_node || current_node == new_node)
	{
		on_attempted_move(10, next_direction);
		new_node = puzzle.get_head_of_path();
	}
	
	setTimeout(function() { force_solve_recursive(new_node) }, 10);
}

// Begin drawing path
function on_touch_move(event) {
	if (!currently_drawing_path || mouse_tracker == null) {
		return;
	}

	mouse_tracker.on_touch_move(event);
}

function on_click_start_node(start_node_graphics_object) {
	if (currently_drawing_path) {
		return;
	}

	currently_drawing_path = true;
	path_head_is_node = true;

	path_display = new PathDisplay(start_node_graphics_object);
	puzzle.set_traversed(puzzle.start_node);

	document.body.addEventListener('click', on_stop_drawing, true);

	keyboard_tracker = new KeyboardTracker();
	mouse_tracker = new MouseTracker();
}

// Stop drawing path
function on_stop_drawing() {
	if (!currently_drawing_path) {
		return;
	}

	remove_event_listeners();

	// Stop drawing
	path_display.dispose();

	reset_path();
	puzzle.reset_path();
}

function remove_event_listeners() {
	document.body.removeEventListener('click', on_stop_drawing, true);

	if (mouse_tracker != null)
	{
		mouse_tracker.dispose();
	}

	if (keyboard_tracker != null)
	{
		keyboard_tracker.dispose();
	}
}

path_display = null;
mouse_tracker = null;
keyboard_tracker = null;

function reset_path() {
	currently_drawing_path = false;
	directions_moved = [];
	path_head_is_node = true; // Always start at the start node
}
reset_path(); // Initialize these variables immediately
