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

	start_drawing(start_node_graphics_object) {
		this.currently_drawing_path = true;
		this.path_head_is_node = true;

		// Create shrunken version of the filled start node so we can expand it
		var center_x = start_node_graphics_object.getAttributeNS(null, 'cx');
		var center_y = start_node_graphics_object.getAttributeNS(null, 'cy');
		var radius = cfg.start_node_radius/10;
		this.start_node_overlay = append_svg_node(svg, 'circle', { cx: center_x, cy: center_y, r: radius, fill: cfg.path_color });

		// Expand the start node over an interval
		this.expand_start_node_timer = setInterval(() => this.expand_start_node(this), 5);
	}

	// Creates the visual effect of the start node increasing in radius
	expand_start_node() {
		var prev_radius = parseInt(path_display.start_node_overlay.getAttributeNS(null, 'r'));
		var new_radius = prev_radius + 1;
	
		if (new_radius >= cfg.start_node_radius) {
			clearInterval(path_display.expand_start_node_timer);
			new_radius = cfg.start_node_radius;
		}
	
		path_display.start_node_overlay.setAttributeNS(null, 'r', new_radius);
	}

	stop_drawing() {
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
				return on_stop_drawing();
		}
	}

	move_forward_to(traversible, direction_moved) {
		// Move the path in the specified direction
		this.directions_moved.push(direction_moved);
		this.path_head_is_node = !this.path_head_is_node;
		puzzle.set_traversed(traversible);

		// Clone graphics object of traversible and paint with path color
		// TODO: This will need to be interpolated instead of immediately filled
		var old_rect = puzzle.get_head_of_path().graphics_object;
		var path_edge = clone_svg_node(old_rect);
		path_edge.setAttributeNS(null, 'fill', cfg.path_color);
		this.path_objects.push(path_edge);

		// Check if the puzzle was completed
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
}
var path_display = new PathDisplay();

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

// Begin drawing path
function on_click_start_node(start_node_graphics_object) {
	if (path_display.currently_drawing_path) {
		return;
	}

	path_display.start_drawing(start_node_graphics_object)
	puzzle.set_traversed(puzzle.start_node);

	// Listen for clicks and keypresses anywhere
	document.body.addEventListener('click', on_stop_drawing, true);
	window.addEventListener('keydown', path_display.handle_key, true);

	// Begin tracking the mouse for movement through the puzzle
	mouse_tracker = new MouseTracker();
}

// Stop drawing path
function on_stop_drawing() {
	if (!path_display.currently_drawing_path) {
		return;
	}

	// Remove event listeners
	document.body.removeEventListener('click', on_stop_drawing, true);
	window.removeEventListener('keydown', path_display.handle_key, true);
	mouse_tracker.dispose();

	// Tell the path draw to stop drawing
	path_display.stop_drawing();
}
