import * as React from 'react';
import Snake from './Snake';
import Point from './Point';

interface Props {
  width: number;
  height: number;
}

export default class Board extends React.Component<Props, any> {
  snake: Snake;
  constructor(prop: Props) {
    super(prop);
    this.state = {
      move: 0
    }
    this.snake = new Snake(this);
  }
  componentDidMount() {
    this.snake.start();
    document.addEventListener('keydown', e => this.snake.turn(e.keyCode))
  }
  update() {
    this.setState({
      move: this.state + 1
    });
  }
  render() {
    return (
      <div>{this.renderRow()}</div>
    )
  }
  renderRow() {
    let rows = [];
    for(let i=0; i<this.props.height; i++) {
      rows.push(<div className="row" key={"row"+i}>{this.renderCell(i)}</div>)
    }
    return rows;
  }
  renderCell(row: number) {
    let cells = [];
    for(let i=0; i<this.props.width; i++) {
      let className = "cell";
      if(this.snake.isBody(new Point(i, row))) {
        className += " body";
      }
      cells.push(<span className={className} key={"cell"+i}><i></i></span>)
    }
    return cells;
  }
}