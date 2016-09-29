
function Board(dom) {
	this.dom = dom;
	this.flag = '<span class="cube active"></span>';
	this.blank = '<span class="cube blank"></span>';
	this.width = 10;
	this.height = 20;
	this.cells = this.newBoard();
	this.startX = 4;
	this.startY = 0;
	this.prevX = this.startX;
	this.prevY = this.startY;
	this.speed = 1;
	this.active = {current: null, x: 0, y: 0};
	this.fix = this.newBoard();
	this.lastTime = 0;
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
	if(time - this.lastTime > 400) {
		tmpY = this.active.y + this.speed;	
		this.lastTime = time;
	}
	var active = this.active.current;

	var pos = active.getPosBaseOn(this.active.x, tmpY);

	var canMoving = this.check(pos);

	if(!canMoving) {
		var prevPos = active.getPosBaseOn(this.prevX, this.prevY);
		for(i=0, len=prevPos.length; i<len; i++) {
			var pp = prevPos[i];
			this.fix[pp.y][pp.x] = this.flag;
			this.removeOrNot(pp.y);
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
		return;
	}
	this.fix.splice(y, 1);
	var row = [];
	for(var x = 0, l = this.width; x < l; x++) {
		row.push(this.blank)
	}
	this.fix.unshift(row)
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

Board.prototype.draw = function() {
	var out = '';
	for(var i = 0, len = this.cells.length; i < len; i++) {
		out += this.cells[i].join(' ') + '<br/>';
	}
	dom.innerHTML = out;
};

Board.prototype.left = function() {
	var nextX = this.active.x - 1;
	var pos = this.active.current.getPosBaseOn(nextX, this.active.y);
	for(var i=0, len=pos.length; i<len; i++) {
		if(pos[i].x < 0 || this.fix[pos[i].y][pos[i].x] == this.flag) {
			return;
		}
	}
	this.active.x = nextX;
}
Board.prototype.right = function() {
	var nextX = this.active.x + 1;
	var pos = this.active.current.getPosBaseOn(nextX, this.active.y);
	for(var i=0, len=pos.length; i<len; i++) {
		if(pos[i].x >= this.width) {
			return;
		}
	}
	this.active.x = nextX;	
}

function Tetris () {
	this.shapes = [
		[
			[0, 1, 0, 0],
			[1, 1, 0, 0],
			[1, 0, 0, 0],
			[0, 0, 0, 0]
		],
		[
			[1, 1, 0, 0],
			[1, 1, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]	
		],
		[
			[1, 0, 0, 0],
			[1, 0, 0, 0],
			[1, 0, 0, 0],
			[1, 0, 0, 0]
		],
		[
			[1, 1, 0, 0],
			[1, 0, 0, 0],
			[1, 0, 0, 0],
			[0, 0, 0, 0]
		]
	]
	this.random()
}
Tetris.prototype.random = function() {
	var idx = ~~(Math.random() * this.shapes.length);
	this.shape = this.shapes[idx]
}
Tetris.prototype.getPosBaseOn = function(x, y) {
	var pos = [];
	for(var i=0, len=this.shape.length; i<len; i++) {
		var row = this.shape[i];
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
var board = new Board(dom);
var active = new Tetris();
var next = new Tetris();
board.setActive(active);

function loop(time) {
	var canMoving = board.update(time);	
	if(!canMoving) {
		var tmp = next;
		next = active;
		active = tmp;
		next.random();
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
	}
}
document.addEventListener('keydown', move, false);
requestAnimationFrame(loop);



