function Star(x, y, color, sprite)
{
	this.x = x;
	this.y = y;
	this.color = color;
	this.sprite = sprite;
	sprite.inputEnabled = true;
	sprite.anchor.set(0, 1);
	
}

Star.prototype.findSame = function(all){
	var open = [this];
	var closed = [];
	while(open.length)
	{
		var current = open.shift();
		
		if(current.color == this.color)
		{
			closed.push(current);
			var left = all[(current.x+1)+','+current.y];
			if(left && !open.contains(left) && !closed.contains(left)) open.push(left);
			var down = all[current.x+','+(current.y-1)];
			if(down && !open.contains(down) && !closed.contains(down)) open.push(down);
			var right = all[(current.x-1)+','+current.y];
			if(right && !open.contains(right) && !closed.contains(right)) open.push(right);
			var up = all[current.x+','+(current.y+1)];
			if(up && !open.contains(up) && !closed.contains(up)) open.push(up);
		}
	}
	return closed;
}

Array.prototype.contains = function(item){
	for(var i=0,len=this.length; i<len; i++)
	{
		if(this[i] == item) return true;
	}
	return false;
}


module.exports = Star;