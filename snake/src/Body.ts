import Point from './Point';

export default class Body {

  constructor(private current: Point, private next?: Body) {

  }

  move(point: Point) {
    if(this.next) {
      this.next.move(this.current);
    }
    console.log(`(${this.current.x}, ${this.current.y})=>(${point.x}, ${point.y})`)
    this.current = point;
  }
  setNext(body: Body) {
    this.next = body;
  }
  getNext() {
    return this.next;
  }
  getPoint() {
    return this.current;
  }
}