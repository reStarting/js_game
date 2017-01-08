import Snake from './Snake';

export default class Board {
  snake: Snake;
  constructor(public width: number, public height: number) {
    this.snake = new Snake(this);
    document.addEventListener('keydown', e => this.snake.turn(e.keyCode))
  }
  isOver() {
    
  }
}