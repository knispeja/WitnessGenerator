class PathDisplay {
	constructor() {
		this.currently_drawing_path = false;
		this.start_node_overlay = null;
		this.path_objects = [];
	}

	start_drawing(start_node) {
		document.body.addEventListener('click', path_display.stop_drawing, true);
		this.currently_drawing_path = true;
		this.start_node_overlay = start_node;
		this.expand_start_node_timer = setInterval(() => this.expand_start_node(this), 5);
	}

	stop_drawing() {
		path_display.currently_drawing_path = false;
		document.body.removeEventListener('click', path_display.stop_drawing, true);
		svg.removeChild(path_display.start_node_overlay);
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
