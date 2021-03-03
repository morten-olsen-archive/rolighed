import { createStore, applyMiddleware } from 'redux';
import createSocketMiddleware from './middleware/socket';
import socketReducer from './reducers/socket';

const create = () => {
  const socketMiddleware = createSocketMiddleware({
    url: 'ws://localhost:8081',
  });

  const store = createStore(
    socketReducer,
    applyMiddleware(
      socketMiddleware,
    ),
  );

  return store;
};

export default create;
