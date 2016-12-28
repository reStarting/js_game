import * as React from 'react';
import {Dispatch} from 'redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {moveLeft, moveRight, moveDown, transform, drop} from '../actions';

interface AppProps {
  tetris: any;
  actions: any;
}

interface AppState {}

class App extends React.Component<AppProps, AppState> {
  render() {
    const {tetris, actions} = this.props;
    console.log(tetris)
    return (
      <div>
        {tetris.board.map(line => {
          return <div>{line.toString(2)}</div>
        })}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    tetris: state.tetris
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    actions: bindActionCreators({
      moveLeft,
      moveRight,
      moveDown,
      transform,
      drop
    }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
