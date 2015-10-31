/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var game = new Phaser.Game(480, 800, Phaser.AUTO, 'game');

	var Welcome = __webpack_require__(1)(game);

	game.state.add('welcome', Welcome);

	game.state.start('welcome');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var GameState = __webpack_require__(2);
	function WelcomeState(game) {
		this.preload = function () {
			game.load.image('bg', 'assets/bg_menuscene.jpg');
			game.load.image('start', 'assets/menu_start.png');
		};
		this.create = function () {
			game.add.sprite(0, 0, 'bg');
			var start = game.add.button(game.world.centerX, game.world.centerY, 'start');
			start.anchor.set(0.5);
			start.onInputDown.add(startGame, this);
		};
	}

	function startGame() {
		var game = this.game;
		var gameState = GameState(game);
		game.state.add('game', gameState);
		game.state.start('game');
	}

	module.exports = function (game) {
		return new WelcomeState(game);
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Star = __webpack_require__(3);

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
	var level, goal, currentScore, combo;

	function GameState(game) {
		this.preload = function () {
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
		this.create = function () {
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

	function init(game) {
		var GAME_HEIGHT = game.world.height;

		for (var i = 0; i < GAME_RECT; i++) {
			for (var j = 0; j < GAME_RECT; j++) {
				var randomColor = colors[random(0, 5)];
				var sprite = game.add.sprite(j * STAR_SIZE, GAME_HEIGHT - i * STAR_SIZE, randomColor);
				var star = new Star(j, i, randomColor, sprite);
				stars[j + "," + i] = star;
				sprite.events.onInputDown.add(onClick, star);
			}
		}
		console.log(stars);
	}

	function random(from, to) {
		return parseInt(Math.random() * to, 10) + from;
	}

	function onClick() {
		var game = this.sprite.game;
		var foundStars = this.findSame(stars),
		    len = foundStars.length;
		if (len < 2) return;
		// var positions = [];
		for (var i = 0; i < len; i++) {
			var star = foundStars[i];
			var pos = star.x + "," + star.y;
			star.sprite.destroy();
			// delete stars[pos];
			stars[pos] = null;
		}
		moveClose(game);
	}

	function moveClose(game) {
		var GAME_HEIGHT = game.world.height;
		//纵向
		for (var i = 0; i < GAME_RECT; i++) {
			var np = nullPos(i);
			while (np != null) {
				var up = findUp(i, np);
				if (up != null) {
					// console.log(i, up,'->', i, np);
					var temp = stars[i + ',' + up];
					stars[i + ',' + up] = stars[i + ',' + np];
					stars[i + ',' + np] = temp;
					stars[i + ',' + np].x = i;
					stars[i + ',' + np].y = np;
					// game.add.tween(stars[i+','+np].sprite).to({ y: GAME_HEIGHT - np * STAR_SIZE }, 200, Phaser.Easing.Quadratic.InOut, true, 0);
					np = nullPos(i);
				} else {
					break;
				}
			}
		}
		//横向
		for (var i = 0; i < GAME_RECT; i++) {
			var nl = nullLine(i);
			while (nl) {
				var right = findRight(i);
				if (right != null) {
					moveToLeft(right, right - i);
					nl = nullLine(i);
				} else {
					break;
				}
			}
		}
		//动画
		for (var pos in stars) {
			var star = stars[pos];
			if (star) {
				game.add.tween(star.sprite).to({ x: star.x * STAR_SIZE, y: GAME_HEIGHT - star.y * STAR_SIZE }, 800, Phaser.Easing.Quadratic.InOut, true, 0);
			}
		}
		console.log(stars);
	}

	function nullPos(x) {
		var i = 0;
		while (stars[x + ',' + i]) {
			i++;
			if (i > 9) return null;
		}
		return i;
	}
	function nullLine(i) {
		if (nullPos(i) == 0) {
			return true;
		}
		return false;
	}
	function findUp(x, y) {
		var i = y;
		while (!stars[x + ',' + i]) {
			i++;
			if (i > 9) return null;
		}
		return i;
	}
	function findRight(x) {
		var i = x;
		while (!stars[i + ',0']) {
			i++;
			if (i > 9) return null;
		}
		return i;
	}
	function moveToLeft(line, step) {
		for (var x = line; x < GAME_RECT; x++) {
			for (var y = 0; y < GAME_RECT; y++) {
				console.log(x, y, '->', x - step, y);
				var temp = stars[x + ',' + y];
				stars[x + ',' + y] = stars[x - step + ',' + y];
				stars[x - step + ',' + y] = temp;
				if (stars[x - step + ',' + y]) {
					stars[x - step + ',' + y].x = x - step;
				}
			}
		}
	}

	function update() {}

	module.exports = function (game) {
		return new GameState(game);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	function Star(x, y, color, sprite) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.sprite = sprite;
		sprite.inputEnabled = true;
		sprite.anchor.set(0, 1);
	}

	Star.prototype.findSame = function (all) {
		var open = [this];
		var closed = [];
		while (open.length) {
			var current = open.shift();
			if (current.color == this.color) {
				closed.push(current);
				var left = all[current.x + 1 + ',' + current.y];
				if (left && !open.contains(left) && !closed.contains(left)) open.push(left);
				var down = all[current.x + ',' + (current.y - 1)];
				if (down && !open.contains(down) && !closed.contains(down)) open.push(down);
				var right = all[current.x - 1 + ',' + current.y];
				if (right && !open.contains(right) && !closed.contains(right)) open.push(right);
				var up = all[current.x + ',' + (current.y + 1)];
				if (up && !open.contains(up) && !closed.contains(up)) open.push(up);
			}
		}
		return closed;
	};

	Array.prototype.contains = function (item) {
		for (var i = 0, len = this.length; i < len; i++) {
			if (this[i] == item) return true;
		}
		return false;
	};

	module.exports = Star;

/***/ }
/******/ ]);