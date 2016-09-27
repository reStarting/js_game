var canvas 				= document.getElementById('canvas');
var ctx 				= canvas.getContext('2d');
var CELL_X 				= 10, 
	CELL_Y 				= 16, 
	CELL_SIZE 			= 25, 
	GAME_X 				= CELL_X * CELL_SIZE,
	GAME_Y 				= CELL_Y * CELL_SIZE,
	START_X 			= CELL_X * 2 + 0.5,
	START_Y 			= START_X,
	BACKGROUND_COLOR 	= 'rgba(0, 0, 0, 0.8)',
	BORDER_COLOR 		= 'rgba(255, 255, 255, 1)',
	PREVIEW_X 			= 4,
	// PREVIEW_Y = PREVIEW_X,
	PREVIEW_SIZE 		= PREVIEW_X * CELL_SIZE,
	PREVIEW_START_X 	= (START_X + GAME_X) + START_X * 2,
	LEVEL_X 			= PREVIEW_START_X,
	LEVEL_Y 			= PREVIEW_SIZE + START_Y * 3,
	SCORE_X 			= LEVEL_X,
	SCORE_Y 			= LEVEL_Y + START_Y * 2,
	COLORS  			= ['#0367bO', '#f1f1f1', '#dd00dd'];


function Tetris() {
	var index = Math.floor(Math.random() * 3);
	this.color = COLORS[index];
}


function drawBackground() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.fillStyle = BACKGROUND_COLOR;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//画主游戏格子
	for(var i = START_X; i<= GAME_X + START_X; i+=CELL_SIZE) {
		ctx.moveTo(i, START_Y);
		ctx.lineTo(i, GAME_Y + START_Y);
	}
	for(var j = START_Y; j <= GAME_Y + START_Y; j += CELL_SIZE) {
		ctx.moveTo(START_X, j);
		ctx.lineTo(GAME_X + START_X, j);
	}
	//画预览格子
	for(var x = PREVIEW_START_X; x <= PREVIEW_SIZE + PREVIEW_START_X; x += CELL_SIZE) {
		ctx.moveTo(x, START_Y);
		ctx.lineTo(x, PREVIEW_SIZE + START_Y);
	}
	for(var y = START_Y; y <= PREVIEW_SIZE + START_Y; y += CELL_SIZE) {
		ctx.moveTo(PREVIEW_START_X, y);
		ctx.lineTo(PREVIEW_START_X + PREVIEW_SIZE, y);
	}
	ctx.font = "1.2em palatino";
	ctx.strokeStyle = BORDER_COLOR;
	ctx.fillStyle = BORDER_COLOR;

	ctx.fillText('Level: 1', LEVEL_X, LEVEL_Y)

	ctx.fillText('Score: 0', SCORE_X, SCORE_Y)
	
	ctx.stroke();
	ctx.restore();
}

function loop(timestamp) {
	drawBackground();
	requestAnimationFrame(arguments.callee);
}

requestAnimationFrame(loop);
