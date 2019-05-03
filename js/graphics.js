function appendSvgNode(parent_node, node_type, property_values) {
	var node = document.createElementNS("http://www.w3.org/2000/svg", node_type);
	for (var property in property_values) {
		node.setAttributeNS(null, property, property_values[property]);
	}
	parent_node.appendChild(node);
	return node;
}

function drawPuzzle(puzzle) {
	var svg = appendSvgNode(document.body, "svg");

	for (var x=0; x<puzzle.nodes.length; x++) {
		for (var y=0; y<puzzle.nodes[x].length; y++)
		{
			drawEdges(svg, puzzle.nodes[x][y]);
		}
	}
}

const spacing = 100;
const edge_width = 15;

function drawEdges(svg, node) {
	if (node.north.edge_type != EDGE_TYPE.BORDER) {
		appendSvgNode(svg, 'rect', { x: spacing * node.x, y: spacing * node.y - spacing, width: edge_width, height: spacing + edge_width, fill: '#B1F514' });
	}
	if (node.west.edge_type != EDGE_TYPE.BORDER) {
		appendSvgNode(svg, 'rect', { x: spacing * node.x - spacing, y: spacing * node.y, width: spacing, height: edge_width, fill: '#B1F514' });
	}
}