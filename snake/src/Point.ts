export default class Point {
  constructor(public x: number, public y: number) {}
  equals(point: Point) {
    return this.x == point.x && this.y == point.y;
  }
}