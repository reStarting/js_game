var GameState = require('./game.js');
function WelcomeState(game)
{
	this.preload = function(){
		game.load.image('bg', 'assets/bg_menuscene.jpg');
		game.load.image('start', 'assets/menu_start.png');
	};
	this.create = function(){
		game.add.sprite(0, 0, 'bg');
		var start = game.add.button(game.world.centerX,game.world.centerY, 'start');
		start.anchor.set(0.5);
		start.onInputDown.add(startGame, this);
	};
}

function startGame()
{
	var game = this.game;
	var gameState = GameState(game);
	game.state.add('game', gameState);
	game.state.start('game')
}



module.exports = function (game)
{
	return new WelcomeState(game);
}
