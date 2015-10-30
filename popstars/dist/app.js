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
/***/ function(module, exports) {

	'use strict';

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

	function GameState(game) {
		this.preload = function () {
			game.load.image('mainBg', 'assets/bg_mainscene.jpg');
			game.load.image('blue', 'assets/blue.png');
			game.load.image('green', 'assets/green.png');
			game.load.image('orange', 'assets/orange.png');
			game.load.image('purple', 'assets/purple.png');
			game.load.image('red', 'assets/red.png');
		};
		this.create = function () {
			game.add.image(0, 0, 'mainBg');

			level = game.add.text(20, 15, "Level 1", gameFont);

			goal = game.add.text(game.world.centerX, 15, "goal: 1000", gameFont);
			goal.anchor.set(0.5, 0);

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
				game.add.sprite(j * STAR_SIZE, GAME_HEIGHT - (i + 1) * STAR_SIZE, randomColor);
			}
		}
	}

	function random(from, to) {
		return parseInt(Math.random() * to, 10) + from;
	}

	function update() {}

	module.exports = function (game) {
		return new GameState(game);
	};

/***/ }
/******/ ]);