//新的设计方案
// 192, 144, 48, 96

// 11000000
// 11000000


// 1100 
// 1100 
// 0000 
// 0000                 1111


// 0 0001100000 0
// 0 0001100000 0
// 0 0000000000 0
// 0 0000000000 0

// 0 0000110000 0
// 0 0000110000 0
// 0 0000000000 0
// 0 0000000000 0


// 1.制造游戏状态区12位 2进制 表示1 0000000000 1, 左右两边表示边界
// 2.方块使用16进制表示, 转换成16位2进制, 转换成4个元素的数组, 每个元素为10位2进制
// 0xcc00
    
// 1100
// 1100
// 0000
// 0000

// 1100000000
// 1100000000
// 0000000000
// 0000000000

// 3.整体向下移动, 判断是否位置被占用, 如果占用, 停止向下移动, 修改游戏状态区, 重新生成方块, 进入2, 否则3

// 4.左右移位, 保持10位 数组每个元素(10位)和当前行(12位) & 运算 不为0 则表示 将要移动的位置已被占用, 不做移动
var height = 20, 
	line   = 0x801,
	bottom = 0xfff,
	shapes = [
		[0xcc00],
		[0x4c80, 0xc600],
		[0x8c40, 0x6c00],
		[0xf000, 0x8888],
		[0x88c0, 0xe800, 0xc440, 0x2e00],
		[0x44c0, 0x8e00, 0xc880, 0xe200],
		[0xe400, 0x4c40, 0x4e00, 0x8c80]
	],
	active = {shape:[], x: 4, y: 0, type:~~(Math.random()*shapes.length), idx:0},
	board  = [bottom],
	lastTime = 0, speed = 1;

while(board.length <= height) {
	board.unshift(line);
}

//转成12位
function change() {
	var shape = shapes[active.type][active.idx];
	var next = [];
	for(var i=0; i<4; i++) {
		next[i] = (shape>>(12 - i * 4)&15)<<7>>active.x;
		if(next[i]%2 != 0) {
			active.x--;
			return change();
		}
		if(board[active.y + i] == undefined || (board[active.y + i] & next[i]) > 0) {
			return
		}
	}
	active.shape = next;
}

function show() {
	var out = '';
	var showBoard = board.slice();
	for(var j=0; j<4; j++) {
		if(showBoard[active.y + j] != undefined) {
			showBoard[active.y + j] = showBoard[active.y + j] | active.shape[j];
		}
	}
	// [].splice.apply(showBoard, [active.y, active.shape.length].concat(active.shape));
	for(var i = 0,len=showBoard.length-1; i<len; i++) {
		var line = showBoard[i].toString(2);
		while(line.length < 12) {
			line = '0' + line;
		}
		out += line.slice(1, -1) +'<br/>';
	}
	out = out.replace(/1/g, '<span class="cube active"></span>').replace(/0/g, '<span class="cube blank"></span>')
	document.getElementById("game2").innerHTML = out;
}




function loop(time) {
	if((time - lastTime) * speed > 500) {
		lastTime = time;
		update();
	}
	show();
	requestAnimationFrame(arguments.callee);
}

change();
requestAnimationFrame(loop);

function move(step) {
	var next = [];
	for(var i=0; i<4; i++) {
		if(step > 0) {
			next[i] = active.shape[i] >> 1;	
		} else {
			next[i] = active.shape[i] << 1;
		}
		if(board[active.y + i] == undefined || (board[active.y + i] & next[i]) > 0) {
			return
		}
	}
	active.shape = next;
	active.x += step;
}

function update() {
	var next = active.y + 1;
	for(var i=3; i>=0; i--) {
		if((active.shape[i] & board[next + i]) > 0) {//生成新的
			if(active.y == 0) {
				console.log('game over')
				return;
			}
			for(var j=0; j<4; j++) {
				if(active.y + j < board.length - 1 && board[active.y + j] != undefined) {
					board[active.y + j] |= active.shape[j];
					if(board[active.y + j] == bottom) {
						board.splice(active.y + j, 1);
						board.unshift(line);
					}
				}
			}
			active = {shape:[], x: 4, y: 0, type:~~(Math.random()*shapes.length), idx:0};
			change();
			return;
		}
	}
	active.y = next;
}

function action(e) {
	var code = e.keyCode;
	if(code == 37) {//左
		move(-1);
	} else if(code == 39) {//右
		move(1);
	} else if(code == 38) {
		active.idx = (active.idx + 1) % shapes[active.type].length;
		change();
	} else {
		speed = 10;
	}
}

document.addEventListener('keydown', action, false);
document.addEventListener('keyup', function(){speed=1}, false);






















