import { Middleware } from 'redux';
import WebSocket from 'isomorphic-ws';

interface Options {
  url: string;
  retryTime?: number;
}

const socketMiddleware = (options: Options): Middleware => (store) => (next) => {
  let socket: WebSocket | undefined;
  const setup = () => {
    socket = new WebSocket(options.url);

    socket.onopen = () => {
      console.log('Connected');
      next({
        type: '@@SOCKET/connected',
      });
    };

    socket.onclose = () => {
      next({
        type: '@@SOCKET/disconnected',
      });
      socket = undefined;
      setTimeout(setup, options.retryTime ?? 1000);
    };

    socket.onmessage = ({ data }) => {
      const { type, payload } = JSON.parse(data as string);
      switch (type) {
        case 'state/partial': {
          return next({
            type: '@@SOCKET/update',
            payload,
          });
        }
        case 'core/setup': {
          return next({
            type: '@@SOCKET/setup',
            payload,
          });
        }
        default: {
          return;
        }
      }
    };

    socket.onerror = (err) => {
      console.log('err');
    };
  };

  setup();

  return (action) => {
    if (action.type === '@@SOCKET/remote') {
      if (!socket) {
        throw new Error('Socket not connected');
      }
      socket.send(JSON.stringify({
        type: 'dispatch',
        payload: action.payload,
      }));
      return;
    }
    return next(action);
  };
};

export {
  Options,
};

export default socketMiddleware;
