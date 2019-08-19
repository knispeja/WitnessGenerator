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
		var prev_radius = parseInt(path_display.start_node_overlay.getAttributeNS(null, 'r'));
		var new_radius = prev_radius + cfg.start_node_radius/20;
	
		if (new_radius >= cfg.start_node_radius) {
			clearInterval(this.expand_start_node_timer);
			new_radius = cfg.start_node_radius;
		}
	
		this.start_node_overlay.setAttributeNS(null, 'r', new_radius);
	}

	// Assumes path head is an edge
	// Returns boolean: whether or not the pixels send the movement over a step
	move_edge_pixels_forward_if_no_step(pixels, direction) {
		var graphics_head = this.path_objects[this.path_objects.length - 1];
		var dir_is_vertical = is_vertical(direction);
		var length_prop = dir_is_vertical ? 'height' : 'width';
		var edge_path_length_current = parseInt(graphics_head.getAttributeNS(null, length_prop));
		
		var subpixel_sign = (direction == DIRECTION.EAST || direction == DIRECTION.SOUTH) ? 1 : -1;
		var pixel_delta = subpixel_sign * pixels;

		var max_length = cfg.edge_spacing - cfg.edge_thickness;
		var new_length = (edge_path_length_current + pixel_delta) * subpixel_sign;
		
		var overflow = false;
		if (new_length >= max_length || new_length <= 0) {
			overflow = true;
			new_length = max_length;
		}

		this.set_edge_length(graphics_head, direction, new_length);

		return overflow;
	}

	set_edge_length(edge, direction, new_length) {
		var length_prop = is_vertical(direction) ? 'height' : 'width';
		var old_length = parseInt(edge.getAttributeNS(null, length_prop));
		var pixel_delta = new_length - old_length;

		var should_move_origin = (direction == DIRECTION.WEST || direction == DIRECTION.NORTH);
		if (should_move_origin) {
			var origin_prop = is_vertical ? 'y' : 'x';
			var old_origin = parseInt(edge.getAttributeNS(null, origin_prop));
			edge.setAttributeNS(null, origin_prop, old_origin + pixel_delta);
		}
		edge.setAttributeNS(null, length_prop, new_length);
	}

	pixel_step_forward(pixels, direction) {
		var is_direction_vertical = is_vertical(direction);
		if (path_head_is_node && this.direction_moving !== undefined) {
			if (is_vertical(this.direction_moving) != is_direction_vertical) {
				this.x_subpixel = 0;
				this.y_subpixel = 0;
			}
		}

		var subpixel_sign = 1;
		if (flip_direction(direction) == this.direction_moving) {
			subpixel_sign = -1;
		}
		else {
			this.direction_moving = direction;
		}

		var max_length = path_head_is_node ? cfg.edge_thickness : cfg.edge_spacing;
		var pixel_delta = subpixel_sign * pixels;
	
		var rollover = false;
		var props_to_bump = [];
		if (is_direction_vertical) {
			this.y_subpixel += pixel_delta;
			if (this.y_subpixel > max_length) {
				rollover = true;
			}
			else if (this.y_subpixel < 0) {
				this.move_backwards();
			}

			if (direction == DIRECTION.NORTH) {
				props_to_bump.push('y');
			}
			props_to_bump.push('height');
		}
		else {
			this.x_subpixel += pixel_delta;
			if (this.x_subpixel > max_length) {
				rollover = true;
			}
			else if (this.x_subpixel < 0) {
				this.move_backwards();
			}

			if (direction == DIRECTION.WEST) {
				props_to_bump.push('x');
			}
			props_to_bump.push('width');
		}

		var graphics_head = this.graphics_objects[this.graphics_objects.length - 1];
		props_to_bump.foreach((prop) => {
			var prop_old = graphics_head.getAttributeNS(null, prop);
			graphics_head.setAttributeNS(null, prop, prop_old + pixel_delta);
		});

		return false;
	}

	move_forward_to() {
		// Clone graphics object of traversible and paint with path color
		var old_rect = puzzle.get_head_of_path().graphics_object;
		var path_edge = clone_svg_node(old_rect);
		path_edge.setAttributeNS(null, 'fill', cfg.path_color);
		if (!path_head_is_node) {
			var old_path_node = puzzle.path[puzzle.path.length - 2];
			var new_path_edge = puzzle.get_head_of_path();
			var direction = old_path_node.get_direction_of_edge(new_path_edge);
			this.set_edge_length(path_edge, direction, 1);
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
