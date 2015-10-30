var STAR_SIZE = 48;
var GAME_RECT = 10;
var colors = ['blue', 'green', 'orange', 'purple', 'red'];
var gameFont = {
  font: '36px gameFont',
  fill: "#ffffff",     
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 8,
  shadowColor: '#000000'
};
var stars = [];
var level;
var goal;


function GameState(game)
{
	this.preload = function(){
		game.load.image('mainBg', 'assets/bg_mainscene.jpg');
		game.load.image('blue', 'assets/blue.png');
		game.load.image('green', 'assets/green.png');
		game.load.image('orange', 'assets/orange.png');
		game.load.image('purple', 'assets/purple.png');
		game.load.image('red', 'assets/red.png');
	};
	this.create = function(){
		game.add.image(0, 0, 'mainBg');

 		level = game.add.text(20, 15, "Level 1", gameFont);

 		goal = game.add.text(game.world.centerX, 15, "goal: 1000", gameFont);
 		goal.anchor.set(0.5, 0);

		//init stars
		init(game);
		
	};
	this.update = update;
}

function init(game)
{
	var GAME_HEIGHT = game.world.height;

	for(var i=0; i<GAME_RECT; i++)
	{
		for(var j=0; j<GAME_RECT; j++)
		{
			var randomColor = colors[random(0, 5)];
			game.add.sprite(j * STAR_SIZE, GAME_HEIGHT - (i+1) * STAR_SIZE, randomColor);
		}
	}
}

function random(from, to)
{
	return parseInt(Math.random()*to,10)+from;
}

function update()
{
}


module.exports = function(game){
	return new GameState(game);
}
