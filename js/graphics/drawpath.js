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
		var new_radius = prev_radius + 1;
	
		if (new_radius >= cfg.start_node_radius) {
			clearInterval(this.expand_start_node_timer);
			new_radius = cfg.start_node_radius;
		}
	
		this.start_node_overlay.setAttributeNS(null, 'r', new_radius);
	}

	move_forward_to() {
		// Clone graphics object of traversible and paint with path color
		// TODO: This will need to be interpolated instead of immediately filled
		var old_rect = puzzle.get_head_of_path().graphics_object;
		var path_edge = clone_svg_node(old_rect);
		path_edge.setAttributeNS(null, 'fill', cfg.path_color);
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
