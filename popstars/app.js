var game = new Phaser.Game(480, 800, Phaser.AUTO, 'game')

var Welcome = require('./scene/welcome.js')(game);

game.state.add('welcome', Welcome);

game.state.start('welcome');


