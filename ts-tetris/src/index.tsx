import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Store} from 'redux';
import {Provider} from 'react-redux';
import App from './app/containers/App';
import configureStore from './app/store/configureStore';

import 'todomvc-app-css/index.css';

const store: Store<any> = configureStore({});

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
