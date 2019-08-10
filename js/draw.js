// Prepares the DOM for adding elements to an SVG element
function init_graphics(draw_config) {
	cfg = draw_config;
	svg = append_svg_node(document.body, "svg");
}

// After calling initGraphics(), can be used to add an SVG element and return it
function append_svg_node(parent_node, node_type, property_values) {
	var node = document.createElementNS("http://www.w3.org/2000/svg", node_type);
	for (var property in property_values) {
		node.setAttributeNS(null, property, property_values[property]);
	}
	parent_node.appendChild(node);
	return node;
}

// Completely removes the SVG element to wipe away anything added with appendSvgNode()
// initGraphics() will need to be called again after calling this method
function reset_graphics() {
	svg.parentNode.removeChild(svg);
}

// Clone the given SVG element and add it to the DOM, then return that element
function clone_svg_node(node) {
	var new_node_props = {};
	for (var i=0; i<node.attributes.length; i++) {
		var attr = node.attributes.item(i);
		new_node_props[attr.localName] = attr.value;
	}
	return append_svg_node(svg, node.nodeName, new_node_props);
}
