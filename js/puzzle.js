class Cell {
	constructor() {
		this.cell_type = CELL_TYPE.NORMAL;
		this.cell_color = null;
	}
}

class Edge {
	constructor(node1, node2) {
		this.edge_type = EDGE_TYPE.NORMAL;
		this.node1 = node1;
		this.node2 = node2;
		this.cell1 = null;
		this.cell2 = null;
	}

	connects_to(node) {
		return node == this.node1 || node == this.node2;
	}
}

class Node {
	constructor() {
		this.north = null;
		this.east = null;
		this.south = null;
		this.west = null;

		this.node_type = NODE_TYPE.NORMAL;
	}

	is_neighbors_with(node) {
		return this.north.connects_to(node) ||
			this.east.connects_to(node) ||
			this.south.connects_to(node) ||
			this.west.connects_to(node);
	}

	set_north(node) {
		this.north = new Edge(this, node);
		node.south = this.north;
	}

	set_east(node) {
		this.east = new Edge(this, node);
		node.west = this.east;
	}

	set_south(node) {
		this.south = new Edge(this, node);
		node.north = this.south;
	}

	set_west(node) {
		this.west = new Edge(this, node);
		node.east = this.west;
	}
}

class Puzzle {
	constructor() {
		// Init cells
		this.cells = [];
		for (var x=0; x<GRID_WIDTH_CELLS; x++)
		{
			this.cells[x] = [];
			for (var y=0; y<GRID_HEIGHT_CELLS; y++)
			{
				this.cells[x][y] = new Cell();
			}
		}

		// Init nodes
		this.nodes = [];
		for (var x=0; x<GRID_WIDTH_NODES; x++)
		{
			this.nodes[x] = [];
			for (var y=0; y<GRID_HEIGHT_NODES; y++)
			{
				var node = new Node();
				if (x != 0) {
					node.set_west(this.nodes[x-1][y]);

					// North cell of edge
					if (y > 0) {
						node.west.cell1 = this.cells[x-1][y-1];
					}

					// South cell of edge
					if (y < GRID_HEIGHT_CELLS) {
						node.west.cell2 = this.cells[x-1][y];
					}
				}
				if (y != 0) {
					node.set_north(this.nodes[x][y-1]);

					// West cell of edge
					if (x > 0) {
						node.north.cell1 = this.cells[x-1][y-1];
					}

					// East cell of edge
					if (x < GRID_WIDTH_CELLS) {
						node.north.cell2 = this.cells[x][y-1];
					}
				}
				this.nodes[x][y] = node;
			}
		}
	}
}
