class PathDisplay {
	constructor() {
		this.currently_drawing_path = false;
		this.start_node_overlay = null;
		this.path_objects = [];
		this.mouse_tracker = null;
	}

	start_drawing(start_node) {
		document.body.addEventListener('click', path_display.stop_drawing, true);
		this.currently_drawing_path = true;
		this.start_node_overlay = start_node;
		this.mouse_tracker = new MouseTracker();
		this.expand_start_node_timer = setInterval(() => this.expand_start_node(this), 5);
		puzzle.set_traversed(puzzle.start_node);
	}

	stop_drawing() {
		path_display.mouse_tracker.dispose();
		path_display.mouse_tracker = null;
		path_display.currently_drawing_path = false;
		document.body.removeEventListener('click', path_display.stop_drawing, true);
		svg.removeChild(path_display.start_node_overlay);

		path_display.path_objects.forEach((path_object) => {
			svg.removeChild(path_object);
		});

		path_display.start_node_overlay = null;
		path_display.path_objects = [];
		puzzle.reset_path();
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
		document.onmousemove = this.on_mouse_move;
	};

	on_mouse_move() {
		if (path_display.mouse_tracker.previous_x != undefined) {
			var delta_x = event.pageX - path_display.mouse_tracker.previous_x;
			var delta_y = event.pageY - path_display.mouse_tracker.previous_y;

			var direction;
			if (delta_x > delta_y) {
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

			on_attempted_move(direction);
		}

		path_display.mouse_tracker.previous_x = event.pageX;
		path_display.mouse_tracker.previous_y = event.pageY;
	}

	dispose() {
		document.onmousemove = undefined;
	}
}

function on_attempted_move(direction) {

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
