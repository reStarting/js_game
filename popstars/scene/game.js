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
var level, goal = 1000, currentGoal,currentScore, score=0, combo1, combo2, combo3, emitter;


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

		game.load.image('fireworks', 'assets/fireworks.png')
	};
	this.create = function(){
		game.add.image(0, 0, 'mainBg');

 		level = game.add.text(20, 15, "Level 1", gameFont);

 		currentGoal = game.add.text(game.world.centerX, 15, "goal: " + 1000, gameFont);
 		currentGoal.anchor.set(0.5, 0);

 		currentScore = game.add.text(game.world.centerX, 70, score, gameFont);
 		currentScore.anchor.set(0.5, 0);

 		combo1 = game.add.image(0, 120, "combo1");
 		combo1.anchor.set(1, 0);
 		combo2 = game.add.image(0, 120, "combo2");
 		combo2.anchor.set(1, 0);
 		combo3 = game.add.image(0, 120, "combo3");
 		combo3.anchor.set(1, 0);
		//init stars
		init(game);


    emitter = game.add.emitter(0, 0, 100);

    emitter.makeParticles('fireworks');
    emitter.gravity = 200;

	};
	this.update = update;
}

function particleBurst(pointer)
{
	  emitter.x = pointer.x;
    emitter.y = pointer.y;
    emitter.start(true, 1000, null, 10);
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

function clear()
{
	for(var pos in stars)
	{
		var star = stars[pos];
		if(star)
		{
			star.sprite.destroy();
		}
	}
	stars = {};
}

function restart(game)
{
	clear();
	init(game);
}

function random(from, to)
{
	return parseInt(Math.random()*to,10)+from;
}

function onClick(pointer){
	var game = this.sprite.game;
	var HEIGHT = game.world.height;
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
		particleBurst({x:(star.x+0.5) * STAR_SIZE, y: HEIGHT - (star.y+0.5) * STAR_SIZE});
	}
	//update score
	score += len * len * 5;
	showCombo(game, len);
	moveClose(game);

	if(isOver())
	{
		console.log('over')
		if(goal > score)
		{
			goal = 1000;
			score = 0;
		}
		else
		{
			goal += 2000;
		}
		currentGoal.text = goal;
		currentScore.text = score;
		restart(game);
		//判断是否到达目标分数
	}
	else
	{
		console.log('go on')
	}

}

//检查是否结束
function isOver()
{
	for(var pos in stars)
	{
		var star = stars[pos];
		if(star)
		{
			var found = star.findSame(stars);
			if(found.length >= 2) return false;
		}
	}
	return true;
}

function moveClose(game)
{
	var GAME_HEIGHT = game.world.height;
	//纵向
	for(var i=0; i<GAME_RECT; i++)
	{
		var np = nullPos(i)
		while( np != null)
		{
			var up = findUp(i, np);
			if(up != null)
			{
				// console.log(i, up,'->', i, np);
				var temp = stars[i+','+up];
				stars[i+','+up] = stars[i+','+np];
				stars[i+','+np] = temp;
				stars[i+','+np].x = i;
				stars[i+','+np].y = np;
				// game.add.tween(stars[i+','+np].sprite).to({ y: GAME_HEIGHT - np * STAR_SIZE }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
				np = nullPos(i);
			}
			else
			{
				break;
			}
		}
	}
	//横向
	for(var i=0; i<GAME_RECT; i++)
	{
		var nl = nullLine(i);
		while(nl)
		{
			var right = findRight(i);
			if(right != null)
			{
				moveToLeft(right, right - i);
				nl = nullLine(i);
			}
			else
			{
				break;
			}
		}
	}
	//动画
	var delayCnt = 0;
	for(var pos in stars)
	{
		var star = stars[pos];
		if(star)
		{
			delayCnt++;
			game.add.tween(star.sprite).to({x: star.x * STAR_SIZE, y: GAME_HEIGHT - star.y * STAR_SIZE }, 200, Phaser.Easing.Quadratic.InOut, true, 2 * delayCnt);
		}
	}
	console.log(stars)
}
//纵向查找没有星星的位置
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
//查看某列是否没有星星
function nullLine(i)
{
	if(nullPos(i) == 0)
	{
		return true;
	}
	return false;
}
//向上查找存在星星的位置
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
//查找右边存在星星的一列位置
function findRight(x)
{
	var i = x;
	while(!stars[i+',0'])
	{
		i++;
		if(i > 9) return null;
	}
	return i;
}
function moveToLeft(line, step)
{
	for(var x=line; x< GAME_RECT; x++)
	{
		for(var y=0; y< GAME_RECT; y++)
		{
			console.log(x,y,'->',x-step,y)
			var temp = stars[x+','+y];
			stars[x+','+y] = stars[(x-step)+','+y];
			stars[(x-step)+','+y] = temp;
			if(stars[(x-step)+','+y])
			{
				stars[(x-step)+','+y].x = x - step;	
			}
		}
	}
}

function showCombo(game, len)
{
	var combo = combo1;
	if(len > 7)
	{
		combo = combo3;
	}
	else if(len > 3)
	{
		combo = combo2;
	}
	game.add.tween(combo).to({ x: game.world.centerX + combo.width * 0.5 }, 200, Phaser.Easing.Quadratic.InOut, true, 0)
	game.add.tween(combo).to({ x: 0 }, 200, Phaser.Easing.Quadratic.InOut, true, 600)
}

function update()
{
	var current = parseInt(currentScore.text);
	if(score > current)
	{
		current++;
		currentScore.text = current;	
	}
}


module.exports = function(game){
	return new GameState(game);
}
