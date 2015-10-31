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
	// var positions = [];
	for(var i=0; i<len; i++)
	{
		var star = foundStars[i];
		var pos = star.x + "," + star.y;
		star.sprite.destroy();
		// delete stars[pos];
		stars[pos] = null;
	}
	moveClose(game);
}

function moveClose(game)
{
	var GAME_HEIGHT = game.world.height;
	for(var i=0; i<GAME_RECT; i++)
	{
		var np = nullPos(i)
		while( np != null)
		{
			var up = findUp(i, np);
			if(up != null)
			{
				console.log(i, up,'->', i, np);
				var temp = stars[i+','+up];
				stars[i+','+up] = stars[i+','+np];
				stars[i+','+np] = temp;
				stars[i+','+np].x = i;
				stars[i+','+np].y = np;
				game.add.tween(stars[i+','+np].sprite).to({ y: GAME_HEIGHT - np * STAR_SIZE }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
				np = nullPos(i);
			}
			else
			{
				break;
			}
		}
		var nullLine = nullPos(i);
		if(nullLine == 0)
		{
			moveToLeft(game, i)
		}
	}
	console.log(stars)
}

function nullPos(x)
{
	var i = 0;
	while(stars[x+','+i])
	{
		i++;
		if(i > 9) return null;
	}
	return i;
}
function findUp(x, y)
{
	var i = y;
	while(!stars[x+','+i])
	{
		i++;
		if(i > 9) return null;
	}
	return i;
}
function moveToLeft(game, i)
{
	for(var y=0; y< GAME_RECT; y++)
	{
		for(var x=i+1; x< GAME_RECT; x++)
		{
			console.log(x,y,'->',x-1,y)
			var temp = stars[x+','+y];
			stars[x+','+y] = stars[(x-1)+','+y];
			stars[(x-1)+','+y] = temp;
			if(stars[(x-1)+','+y])
			{
				stars[(x-1)+','+y].x = x - 1;	
				game.add.tween(stars[(x-1)+','+y].sprite).to({ x: (x-1) * STAR_SIZE }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
			}
		}
	}
}


function update()
{
}


module.exports = function(game){
	return new GameState(game);
}
