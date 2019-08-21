const DEBUG = false;
const GENERATION_SPEED_TEST = false;
const GENERATION_TIME_MAX_MS = 1000;

const FORCE_SQUARE_PUZZLES = true;
const TIMES_TO_REGENERATE = 15; // 0 turns off regeneration effect

// How many inputs in one direction are needed to move in that direction
// Higher values make mouse movement easier, but can cause visual stuttering
const MOUSE_MOVEMENT_BUFFER_SIZE = 1; // 1 turns off mouse movement buffering

// Interpret attempts at invalid movement into valid moves
const INTERPRETIVE_MOVEMENT = true;
const INTERPRETED_MOVEMENT_MULTIPLIER = 0.55;

const DIRECTION =
{
	'NORTH': 0,
	'EAST': 1,
	'SOUTH': 2,
	'WEST': 3
};

const VERTICAL_DIRECTIONS =
[
	DIRECTION.NORTH,
	DIRECTION.SOUTH
];

const HORIZONTAL_DIRECTIONS =
[
	DIRECTION.EAST,
	DIRECTION.WEST
];

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

const CELL_COLORS = 
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

const CELL_COLOR =
{
	'WHITE': 0,
	'BLACK': 1,
	'START_HUES': 2
};

function is_vertical(direction) {
	return VERTICAL_DIRECTIONS.includes(direction);
}

function flip_direction(direction) {
	switch(direction) {
		case DIRECTION.NORTH:
			return DIRECTION.SOUTH;
		case DIRECTION.EAST:
			return DIRECTION.WEST;
		case DIRECTION.SOUTH:
			return DIRECTION.NORTH;
		case DIRECTION.WEST:
			return DIRECTION.EAST;
		default:
			throw "Direction passed to flip_direction was not valid";
	}
}
