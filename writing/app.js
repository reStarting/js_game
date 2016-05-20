var canvasWidth = Math.min(600, window.screen.width - 20);
var canvasHeight = canvasWidth;

var canvas = document.getElementById("app");
var context = canvas.getContext("2d");

// set canvas width
canvas.height = canvas.width = canvasWidth;

// 绘制米字格
var beginPoint = {x: 3, y: 3}
var topRightPoint = {x: canvasWidth - 3, y: 3}
var bottomRightPoint = {x: canvasWidth - 3, y: canvasHeight - 3}
var bottomLeftPoint = {x: 3, y: canvasHeight - 3}
var gridLineWidth = 6;
function drawGrid() 
{
	context.save();
	//画边框
	context.beginPath();
	context.moveTo(beginPoint.x, beginPoint.y);
	context.lineTo(topRightPoint.x, topRightPoint.y);
	context.lineTo(bottomRightPoint.x, bottomRightPoint.y);
	context.lineTo(bottomLeftPoint.x, bottomLeftPoint.y);
	context.lineWidth = gridLineWidth;
	context.closePath();
	context.stroke();
	//画四条线
	context.lineWidth = gridLineWidth / 3;
	context.lineTo(canvasWidth, canvasHeight)
	context.moveTo(canvasWidth, 0);
	context.lineTo(0, canvasHeight);
	context.moveTo(canvasWidth / 2, 0);
	context.lineTo(canvasWidth / 2, canvasHeight);
	context.moveTo(0, canvasHeight / 2);
	context.lineTo(canvasWidth, canvasHeight / 2);
	context.stroke();
	context.restore();
}

drawGrid()

//绘图交互 

var isWriting = false;
var lastPosition = null;
var lastTime = 0;

function windowToCanvas(x, y)
{
	return {
		x: Math.round(x - canvas.getBoundingClientRect().left),
		y: Math.round(y - canvas.getBoundingClientRect().top)
	}
}
function calcDistance(p1, p2)
{
	return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
function calcLineWidth(v)
{
	if(v < 0.1)
	{
		return 5;
	}
	else if(v > 10)
	{
		return 30;
	}
	else
	{
		return 30 - v * (30 - 1) / (10 - 0.1)
	}
}

function beginWrite(e)
{
	e.preventDefault();
	isWriting = true;
	lastPosition = windowToCanvas(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
	lastTime = +new Date();
}
function endWrite(e)
{
	e.preventDefault();
	isWriting = false;
}
function writing(e)
{
	e.preventDefault();
	if(isWriting)
	{
		var currentPosition = windowToCanvas(e.clientX || e.touches[0].clientX, e.clientY || e.touches[0].clientY);
		var currentTime = +new Date();
		
		var time = currentTime - lastTime;
		var s = calcDistance(currentPosition, lastPosition);
		var v = s / time;
		
		
		context.beginPath();
		context.moveTo(lastPosition.x, lastPosition.y);
		context.lineTo(currentPosition.x, currentPosition.y);
		context.lineCap = "round";
		context.lineJoin = "round";
		context.lineWidth = calcLineWidth(v);
		context.stroke();
		lastPosition = currentPosition;
		lastTime = currentTime;
	}
}

canvas.addEventListener("mousedown", beginWrite);
canvas.addEventListener("mouseup", endWrite);
canvas.addEventListener("mouseout", endWrite);
canvas.addEventListener("mousemove", writing);


// mobile
canvas.addEventListener("touchstart", beginWrite);
canvas.addEventListener("touchend", endWrite);
canvas.addEventListener("touchmove", writing);


var clear = document.getElementById("clear");

clear.addEventListener("click", function() {
	context.clearRect(0, 0, canvasWidth, canvasHeight);
	drawGrid();
});





