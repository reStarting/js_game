
function Board(dom, scoreDom) {
	this.dom = dom;
	this.scoreDom = scoreDom;
	this.flag = '<span class="cube active"></span>';
	this.blank = '<span class="cube blank"></span>';
	this.width = 10;
	this.height = 20;
	this.startX = 4;
	this.startY = 0;
	this.speed = 1;
	this.speeds = [800, 500, 300, 200, 100];
	this.scores = [10, 30, 50, 70];
	this.levelup = [1000, 3000, 6000, 9000, 12000];
	this.restart();
}

Board.prototype.restart = function() {
	this.level = 0;
	this.score = 0;
	this.interval = this.speeds[this.level % this.speeds.length];

	this.prevX = this.startX;
	this.prevY = this.startY;
	this.lastTime = 0;
	this.cells = this.newBoard();
	this.fix = this.newBoard();
	if(!this.active) {
		this.active = {current: null, x: 0, y: 0};
	} else {
		this.active.x = 0;
		this.active.y = 0;
	}
	this.scoreDom.innerHTML = "分数: " + this.score + ", 等级: " + this.level

}

Board.prototype.newBoard = function() {
	var b = [];
	for(var y = 0, len = this.height; y < len; y++) {
		var row = [];
		for(var x = 0, l = this.width; x < l; x++) {
			row.push(this.blank)
		}
		b.push(row);
	}
	return b;
}

Board.prototype.setActive = function(act) {
	this.active = {
		current: act,
		x: this.startX,
		y: this.startY
	};
};

Board.prototype.update = function(time) {
	var tmpY = this.active.y;
	if(time - this.lastTime > this.interval) {
		tmpY = this.active.y + this.speed;
		this.lastTime = time;
	}
	var active = this.active.current;

	var pos = active.getPosBaseOn(this.active.x, tmpY);

	var canMoving = this.check(pos);

	if(!canMoving) {
		var prevPos = active.getPosBaseOn(this.prevX, this.prevY);
		var removeLines = 0;
		for(i=0, len=prevPos.length; i<len; i++) {
			var pp = prevPos[i];
			this.fix[pp.y][pp.x] = this.flag;
			if(this.removeOrNot(pp.y)) {
				removeLines++;
			}
		}
		if(removeLines > 0) {
			this.score += this.scores[removeLines - 1];
			this.scoreDom.innerHTML = "分数: " + this.score + ", 等级: " + this.level
		}
		if(this.score > this.levelup[this.level % this.levelup.length]) {
			this.level += 1;
			this.scoreDom.innerHTML = "分数: " + this.score + ", 等级: " + this.level
		}

		if(this.isOver()) {
			console.log('over')
			this.restart();
		}
		return false;
	}

	this.prevY = this.active.y = tmpY;
	this.prevX = this.active.x;

	for(var i=0, len=this.fix.length; i<len; i++) {
		this.cells[i] = this.fix[i].slice();
	}

	for(i=0, len=pos.length; i<len; i++) {
		var p = pos[i];
		this.cells[p.y][p.x] = this.flag;
	}

	this.draw();
	return true;
};

Board.prototype.removeOrNot = function(y) {
	var index = this.fix[y].indexOf(this.blank);
	if(index != -1) {
		return false;
	}
	this.fix.splice(y, 1);
	var row = [];
	for(var x = 0, l = this.width; x < l; x++) {
		row.push(this.blank)
	}
	this.fix.unshift(row)
	return true;
}

Board.prototype.check = function(pos) {
	for(var i=0, len=pos.length; i<len; i++) {
		var p = pos[i];
		var row = this.fix[p.y];
		if(row == undefined) {
			return false;
		}
		var cell = row[p.x];
		if(cell == this.flag) {
			return false;
		}
	}
	return true;
}
Board.prototype.isOver = function() {
	return this.fix[0][this.startX] == this.flag
		|| this.fix[0][this.startX + 1] == this.flag
		|| this.fix[1][this.startX] == this.flag
		|| this.fix[1][this.startX + 1] == this.flag
}

Board.prototype.draw = function() {
	var out = '';
	for(var i = 0, len = this.cells.length; i < len; i++) {
		out += this.cells[i].join('') + '<br/>';
	}
	dom.innerHTML = out;
};

Board.prototype.left = function() {
	var nextX = this.active.x - 1;
	var pos = this.active.current.getPosBaseOn(nextX, this.active.y);
	for(var i=0, len=pos.length; i<len; i++) {
		if(pos[i].x < 0
			 || this.fix[pos[i].y] == undefined
			 || this.fix[pos[i].y][pos[i].x] == this.flag) {
			return;
		}
	}
	this.active.x = nextX;
}
Board.prototype.right = function() {
	var nextX = this.active.x + 1;
	var pos = this.active.current.getPosBaseOn(nextX, this.active.y);
	for(var i=0, len=pos.length; i<len; i++) {
		if(pos[i].x >= this.width || this.fix[pos[i].y][pos[i].x] == this.flag) {
			return;
		}
	}
	this.active.x = nextX;
}
Board.prototype.rotate = function() {
	var shape = this.active.current.rotate();
	var pos = this.active.current.getPosBaseOn(this.active.x, this.active.y, shape);
	var maxOffsetX = 0;
	var maxOffsetY = 0;
	for(var i=0, len=pos.length; i<len; i++) {
		if(pos[i].x - (this.width - 1) > maxOffsetX) {
			maxOffsetX = pos[i].x - (this.width - 1);
		}
		if(pos[i].y - this.height > maxOffsetY) {
			maxOffsetY = pos[i].y - this.height
		}
	}

	for(i=0, len=pos.length; i<len; i++) {
		var y = pos[i].y - maxOffsetY;
		var x = pos[i].x - maxOffsetX;
		if(this.fix[y] == undefined || this.fix[y][x] == this.flag) {
			return;
		}
	}
	this.active.x -= maxOffsetX;
	this.active.y -=maxOffsetY;
	this.active.current.shape = shape;
}

Board.prototype.speedup = function() {
	this.interval = 10;
}
Board.prototype.speeddown = function() {
	this.interval = this.speeds[this.level % this.speeds.length];
}

function Tetris () {
	this.shapes = [
		[0xcc00],
		[0x4c80, 0xc600],
		[0x8c40, 0x6c00],
		[0xf000, 0x8888],
		[0x88c0, 0xe800, 0xc440, 0x2e00],
		[0x44c0, 0x8e00, 0xc880, 0xe200],
		[0xe400, 0x4c40, 0x4e00, 0x8c80]
	]
	this.random()
}
Tetris.prototype.random = function() {
	this.type = ~~(Math.random() * this.shapes.length);
	this.idx = ~~(Math.random() * this.shapes[this.type].length)
	this.shape = this.change();
}
Tetris.prototype.show = function(dom) {
	var out = '';
	for(var i = 0, len = this.shape.length; i < len; i++) {
		for(var j= 0, l=this.shape[i].length; j<l; j++) {
			if(this.shape[i][j] == 1) {
				out += '<span class="cube active"></span>';
			} else {
				out += '<span class="cube blank"></span>';
			}
		}
		out += '<br/>'
	}
	dom.innerHTML = out;
}
Tetris.prototype.rotate = function() {
	this.idx = (this.idx + 1) % this.shapes[this.type].length;
	return this.change();
}
Tetris.prototype.change = function() {
	var shape16 = this.shapes[this.type][this.idx];
	var shape2 = shape16.toString(2);
	var shapeArr = shape2.split('');
	while(shapeArr.length < 16) {
		shapeArr.unshift(0);
	}
	var shape = [];
	for(var i=0, len=shapeArr.length; i<len; i++) {
		var cell = i%4;
		var row = parseInt(i/4);
		if(cell == 0) {
			shape[row] = [];
		}
		shape[row][cell] = parseInt(shapeArr[i]);
	}
	return shape;
}
Tetris.prototype.getPosBaseOn = function(x, y, shape) {
	var shapes = shape || this.shape;
	var pos = [];
	for(var i=0, len=shapes.length; i<len; i++) {
		var row = shapes[i];
		for(var j=0, l=row.length; j<l; j++) {
			if(row[j] == 1) {
				var newPos = {
					x: j + x,
					y: i + y
				};
				pos.push(newPos)
			}
		}
	}
	return pos;
}


var dom = document.getElementById("game");
var score = document.getElementById("level");
var preview = document.getElementById('preview');
var board = new Board(dom, score);
var active = new Tetris();
var next = new Tetris();
next.show(preview);
board.setActive(active);

function loop(time) {
	var canMoving = board.update(time);
	if(!canMoving) {
		var tmp = next;
		next = active;
		active = tmp;
		next.random();
		next.show(preview);
		board.setActive(active);
	}
	requestAnimationFrame(arguments.callee)
}

function move(e) {
	var code = e.keyCode;
	if(code == 37) { //左移
		board.left();
	} else if(code == 39) { //右移
		board.right();
	} else if(code == 40) {
		board.speedup();
	} else if(code == 38) {
		board.rotate();
	}
}

function down(e) {
	if(e.keyCode == 40) {
		board.speeddown();
	}
}


document.addEventListener('keydown', move, false);
document.addEventListener('keyup', down, false);
requestAnimationFrame(loop);
