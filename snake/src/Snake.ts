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
  private direction = Direction.Right;
  private lastTime = 0;
  constructor(private board: Board) {
  }
  start() {
    const headerPoint = new Point(1, 0);
    this.tail = new Body(new Point(0, 0), null);
    this.header = new Body(headerPoint, this.tail);
    this.direction = Direction.Right;
    this.lastTime = 0;
    window.requestAnimationFrame(t => this.move(t))
  }
  turn(direction: number) {
    if(direction == 82) { //r
      this.start();
    }
    if(
      (direction != Direction.Left && direction != Direction.Up && direction != Direction.Right && direction != Direction.Down) ||
      (direction == Direction.Left && this.direction == Direction.Right) ||
      (direction == Direction.Right && this.direction == Direction.Left) ||
      (direction == Direction.Down && this.direction == Direction.Up) ||
      (direction == Direction.Up && this.direction == Direction.Down)
    ) {
      return;
    }
    this.direction = direction;
    this.eat();
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
    if(time - this.lastTime > 100) {
      this.lastTime = time;
      if(this.check(next)) {
        this.header.move(next);
        this.board.update();
      } else {
        console.log("游戏结束");
        return;
      }
    }
    window.requestAnimationFrame(time => this.move(time));
  }
  eat() {
    const tail = new Body(new Point(-1, -1), null);
    this.tail.setNext(tail);
    this.tail = tail;
  }
  check(point: Point) {
    return !this.isBody(point) && !this.isSide(point);
  }
  isBody(point: Point) {
    let next = this.header;
    while(true) {
      if(next == null) {
        break;
      }
      if(point.equals(next.getPoint())) {
        return true;
      }
      next = next.getNext();
    }
    return false;
  }
  isSide(point: Point) {
    if(point.x >= 0 && point.x < this.board.props.width && point.y >= 0 && point.y < this.board.props.height) {
      return false;
    }
    return true;
  }


}