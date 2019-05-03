// Configuration
const GRID_WIDTH_CELLS = 4;
const GRID_HEIGHT_CELLS = GRID_WIDTH_CELLS;
const GRID_WIDTH_NODES = GRID_WIDTH_CELLS + 1;
const GRID_HEIGHT_NODES = GRID_HEIGHT_CELLS + 1;

// Type enums
const DIRECTION =
{
	'NORTH': 0,
	'EAST': 1,
	'SOUTH': 2,
	'WEST': 3
};

const NODE_TYPE =
{
	'NORMAL': 0,
	'START': 1,
	'END': 2
};

const EDGE_TYPE =
{
	'NORMAL': 0,
	'PELLET': 1,
	'OBSTACLE': 2,
	'BORDER': 3
};

const CELL_TYPE =
{
	'NORMAL': 0,
	'SQUARE': 1
};

const CELL_COLOR = 
[
	'black',
	'white',
	'cyan',
	'magenta',
	'yellow',
	'red',
	'green',
	'blue',
	'orange'
];
