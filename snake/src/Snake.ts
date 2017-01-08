import Point from './Point';
import Body from './Body';
import Board from './Board';

const enum Direction {
  Left = 37,
  Up,
  Right,
  Down
}

export default class Snake {
  private header: Body;
  private tail: Body;
  private direction: Direction;
  private lastTime = 0;
  constructor(private board: Board) {
    const headerPoint = new Point(1, 0);
    this.tail = new Body(new Point(0, 0), null);
    this.header = new Body(headerPoint, this.tail);
  }
  turn(direction: number) {
    this.direction = direction;
    window.requestAnimationFrame(t => this.move(t))
  }
  move(time: number) {
    const current = this.header.getPoint();
    let next: Point;
    switch(this.direction) {
      case Direction.Left:
        next = new Point(current.x - 1, current.y);
        break;
      case Direction.Up:
        next = new Point(current.x, current.y - 1);
        break;
      case Direction.Right:
        next = new Point(current.x + 1, current.y);
        break;
      case Direction.Down:
        next = new Point(current.x, current.y + 1);
        break;
    }
    if(time - this.lastTime > 1000) {
      this.lastTime = time;
      this.header.move(next);
    }
    window.requestAnimationFrame(time => this.move(time));
  }
  eat() {
    const tail = new Body(new Point(-1, -1), null);
    this.tail.setNext(tail);
    this.tail = tail;
  }
}