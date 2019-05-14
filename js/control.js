function on_click_start_node(start_node) {
	var center_x = start_node.getAttributeNS(null, 'cx');
	var center_y = start_node.getAttributeNS(null, 'cy');
	var radius = start_node.getAttributeNS(null, 'r');

	append_svg_node(svg, 'circle', { cx: center_x, cy: center_y, r: radius, fill: cfg.path_color, onclick: "on_click_start_node(this);" });
}

function expand_start_node_overlay(start_node_overlay) {

}
