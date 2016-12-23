import {createStore} from 'redux';
import rootReducer from '../reducers/index';

declare var module: any;
export default function configureStore(initialState: any) {
  const store = createStore(rootReducer, initialState);
  if (module.hot) {
    // enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = rootReducer;
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
