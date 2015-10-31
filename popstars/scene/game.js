var Star = require('../view/star.js');

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
var stars = {};
var level, goal,currentScore, combo;


function GameState(game)
{
	this.preload = function(){
		game.load.image('mainBg', 'assets/bg_mainscene.jpg');
		game.load.image('blue', 'assets/blue.png');
		game.load.image('green', 'assets/green.png');
		game.load.image('orange', 'assets/orange.png');
		game.load.image('purple', 'assets/purple.png');
		game.load.image('red', 'assets/red.png');

		game.load.image('combo1', 'assets/combo_1.png');
		game.load.image('combo2', 'assets/combo_2.png');
		game.load.image('combo3', 'assets/combo_3.png');
	};
	this.create = function(){
		game.add.image(0, 0, 'mainBg');

 		level = game.add.text(20, 15, "Level 1", gameFont);

 		goal = game.add.text(game.world.centerX, 15, "goal: 1000", gameFont);
 		goal.anchor.set(0.5, 0);

 		currentScore = game.add.text(game.world.centerX, 70, "0", gameFont);
 		currentScore.anchor.set(0.5, 0);

 		combo = game.add.image(game.world.centerX, 120, "combo3");
 		combo.anchor.set(0.5, 0);
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
			var sprite = game.add.sprite(j * STAR_SIZE, GAME_HEIGHT - i * STAR_SIZE, randomColor);
			var star = new Star(j, i, randomColor, sprite);
			stars[j+","+i] = star;
			sprite.events.onInputDown.add(onClick, star);
		}
	}
	console.log(stars)
}

function random(from, to)
{
	return parseInt(Math.random()*to,10)+from;
}

function onClick(){
	var game = this.sprite.game;
	var foundStars = this.findSame(stars),len=foundStars.length;
	if(len < 2) return;
	var positions = [];
	for(var i=0; i<len; i++)
	{
		var star = foundStars[i];
		var pos = star.x + "," + star.y;
		star.sprite.destroy();
		// delete stars[pos];
		stars[pos] = null;
		positions.push({x:star.x,y:star.y})
		// game.add.tween(star.sprite).to({ y: 48 }, 100, Phaser.Easing.Quadratic.InOut, true, 0);
	}
	moveClose(game, positions);
}

function moveClose(game, pos)
{
	var GAME_HEIGHT = game.world.height;
	for(var i=0,len=pos.length; i<len; i++)
	{
		var p = pos[i];
		// nullToTop(p);
	}
	// for(var pos in stars)
	// {
	// 	var star = stars[pos];
	// 	if(star)
	// 	{
	// 		var p = pos.split(",");
	// 		var x = parseInt(p[0]);
	// 		var y = parseInt(p[1]);
	// 		var posX = findX(x);
	// 		var posY = findY(x, y);
	// 		if(x != posX || y != posY)
	// 		{
	// 			var temp = stars[posX + ',' + posY];
	// 			stars[posX + ',' + posY] = stars[x+','+y];
	// 			stars[x+','+y] = temp;
	// 			stars[posX + ',' + posY].x = posX;
	// 			stars[posX + ',' + posY].y = posY;
	// 			game.add.tween(star.sprite).to({ y: GAME_HEIGHT - star.y * STAR_SIZE }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
	// 		}
	// 	}
	// }
	console.log(stars)
}

function nullToTop(pos)
{
	var starY = pos.y;
	var x = pos.x;
	var topY = 9;
	for(;starY<topY; starY++)
	{
		var temp = stars[x+','+starY];
		stars[x+','+starY] = stars[x+','+(starY+1)];
		stars[x+','+(starY+1)] = temp;
		console.log(x, starY, '->', x, starY+1, stars[x+','+(starY+1)])
		// if(stars[x + ',' + starY]) stars[x + ',' + starY].y = starY + 1;
		// if(stars[x+','+(starY+1)]) stars[x+','+(starY+1)].y = starY;
	}
}


function findX(x)
{
	var hasLeft = false;
	if(!x) x = 0;
	var leftX = x - 1 < 0 ? 0 : x - 1;
	if(stars[leftX + ',0'])
	{
		hasLeft = true;
	}
	if(hasLeft)
	{
		return x;
	}
	return x - 1;
}

function findY(x, y)
{
	var retY = 0;
	for(var i=0; i<=y; i++)
	{
		retY = i;
		if(!stars[x+','+i]) break;
	}
	return retY;
}

function update()
{
}


module.exports = function(game){
	return new GameState(game);
}
