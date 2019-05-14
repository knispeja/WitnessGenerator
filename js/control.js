var currently_drawing_path = false;

function on_click_start_node(start_node) {
	if (currently_drawing_path) {
		return;
	}

	var center_x = start_node.getAttributeNS(null, 'cx');
	var center_y = start_node.getAttributeNS(null, 'cy');
	var radius = cfg.start_node_radius/10;

	start_node_overlay = append_svg_node(svg, 'circle', { cx: center_x, cy: center_y, r: radius, fill: cfg.path_color });
	currently_drawing_path = true;

	expand_start_node_timer = setInterval(expand_start_node_overlay, 25);
}

function expand_start_node_overlay() {
	var prev_radius = parseInt(start_node_overlay.getAttributeNS(null, 'r'));
	var new_radius = prev_radius + 2;

	if (new_radius >= cfg.start_node_radius) {
		clearInterval(expand_start_node_timer);
		new_radius = cfg.start_node_radius;
	}

	start_node_overlay.setAttributeNS(null, 'r', new_radius);
}
