var STAR_SIZE = 48;
var GAME_RECT = 10;
var colors = ['blue', 'green', 'orange', 'purple', 'red'];
var stars = [];


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

		var GAME_HEIGHT = game.world.height;
		var temp = {};

		for(var i=0; i<GAME_RECT; i++)
		{
			for(var j=0; j<GAME_RECT; j++)
			{
				var randomColor = colors[random(0, 5)];
				game.add.sprite(j * STAR_SIZE, GAME_HEIGHT - (i+1) * STAR_SIZE, randomColor);
			}
		}
		console.log(temp)
	};
	this.update = update;
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
