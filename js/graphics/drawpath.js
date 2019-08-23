class PathDisplay { // Disposable
	constructor(start_node_graphics_object) {
		this.path_objects = [];

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
		var prev_radius = parseFloat(path_display.start_node_overlay.getAttributeNS(null, 'r'));
		var new_radius = prev_radius + cfg.start_node_radius/20;
	
		if (new_radius >= cfg.start_node_radius) {
			clearInterval(this.expand_start_node_timer);
			new_radius = cfg.start_node_radius;
		}
	
		this.start_node_overlay.setAttributeNS(null, 'r', new_radius);
	}

	move_edge_pixels_towards_nearest_node(pixels, recursion_safety) {
		if (recursion_safety !== undefined) {
			throw "Infinite recursion caused by move_edge_pixels_towards_nearest_node()";
		}

		var last_direction_is_vertical = is_vertical(last_direction_moved());
		var graphics_head = this.path_objects[this.path_objects.length - 1];
		var length_prop = last_direction_is_vertical ? 'height' : 'width';
		var edge_path_length_current = parseFloat(graphics_head.getAttributeNS(null, length_prop));
		var cutoff_length = (cfg.edge_spacing - cfg.edge_thickness) / 2;

		pixels = INTERPRETED_MOVEMENT_MULTIPLIER * pixels;
		if (edge_path_length_current < cutoff_length) {
			return on_attempted_move(pixels, flip_direction(last_direction_moved()), true);
		}
		else {
			return on_attempted_move(pixels, last_direction_moved(), true);
		}
	}

	move_node_pixels_backward_if_no_step(pixels, direction) {
		return this.move_node_pixels_forward_if_no_step(-pixels, flip_direction(direction));
	}

	move_node_pixels_forward_if_no_step(pixels, direction) {
		if (puzzle.get_head_of_path().is_corner()) {
			return true;
		}

		return this.move_pixels_forward_if_no_step(pixels, direction, false, true);
	}

	move_edge_pixels_backward_if_no_step(pixels, direction) {
		return this.move_edge_pixels_forward_if_no_step(-pixels, flip_direction(direction), false, false);
	}

	move_edge_pixels_forward_if_no_step(pixels, direction, is_obstacle) {
		return this.move_pixels_forward_if_no_step(pixels, direction, is_obstacle, false)
	}

	// Assumes path head is an edge, and we are moving forwards
	// Returns boolean: whether or not the pixels send the movement over a step
	move_pixels_forward_if_no_step(pixels, direction, is_obstacle, is_node) {
		var graphics_head = this.path_objects[this.path_objects.length - 1];
		var dir_is_vertical = is_vertical(direction);
		var length_prop = dir_is_vertical ? 'height' : 'width';
		var edge_path_length_current = parseFloat(graphics_head.getAttributeNS(null, length_prop));

		var max_length;
		if (is_node) {
			max_length = cfg.edge_thickness;
		}
		else {
			max_length = cfg.edge_spacing - cfg.edge_thickness;
			if (is_obstacle) {
				max_length -= cfg.obstacle_gap_size;
				max_length /= 2;
			}
		}

		var new_length = edge_path_length_current + pixels;
		
		var overflow = false;
		if (new_length >= max_length) {
			overflow = true;
			new_length = max_length;
		}
		else if (new_length <= 0) {
			return true;
		}

		this.set_edge_length(graphics_head, direction, new_length);

		return overflow;
	}

	set_edge_length(edge, direction, new_length) {
		var is_direction_vertical = is_vertical(direction);
		var length_prop = is_direction_vertical ? 'height' : 'width';

		var should_move_origin = (direction == DIRECTION.WEST || direction == DIRECTION.NORTH);
		if (should_move_origin) {
			var origin_prop = is_direction_vertical ? 'y' : 'x';
			var old_origin = parseFloat(edge.getAttributeNS(null, origin_prop));
			var old_length = parseFloat(edge.getAttributeNS(null, length_prop));

			edge.setAttributeNS(null, origin_prop, old_origin - (new_length - old_length));
		}
		edge.setAttributeNS(null, length_prop, new_length);
	}

	move_forward_to() {
		// Clone graphics object of traversible and paint with path color
		var path_head = puzzle.get_head_of_path();
		var old_rect = path_head.graphics_object;
		var path_edge = clone_svg_node(old_rect);
		path_edge.setAttributeNS(null, 'fill', cfg.path_color);

		if (!(path_head.node_type != NODE_TYPE.NODE && path_head.is_corner()))
		{
			var old_path_obj = puzzle.path[puzzle.path.length - 2];
			var new_edge_length = 1;
			if (!path_head_is_node) { // New path head
				if (puzzle.path.length > 2) {
					var old_graphics_head = this.path_objects[this.path_objects.length - 1];
					this.set_edge_length(old_graphics_head, directions_moved[directions_moved.length - 2], cfg.edge_thickness);
				}
			}
			else if (old_path_obj.node_type == NODE_TYPE.START) {
				new_edge_length = cfg.start_node_radius - cfg.edge_thickness/2;
			}

			var direction = last_direction_moved();
			this.set_edge_length(path_edge, direction, new_edge_length);
		}

		this.path_objects.push(path_edge);
	}

	move_backwards() {
		svg.removeChild(this.path_objects.pop());
	}

	on_solve() {
		// Change color of entire path
		this.path_objects.forEach((path_object) => {
			path_object.setAttributeNS(null, 'fill', cfg.solution_color)
		});
		this.start_node_overlay.setAttributeNS(null, 'fill', cfg.solution_color);
	}

	dispose() {
		svg.removeChild(this.start_node_overlay);

		this.path_objects.forEach((path_object) => {
			svg.removeChild(path_object);
		});
	}
}
