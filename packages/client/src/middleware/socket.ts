import { Middleware } from 'redux';
import WebSocket from 'isomorphic-ws';

interface Options {
  url: string;
  retryTime?: number;
}

const socketMiddleware = (options: Options): Middleware => (store) => (next) => {
  const setup = () => {
    const socket = new WebSocket(options.url);

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
      setTimeout(setup, options.retryTime ?? 1000);
    };

    socket.onmessage = ({ data }) => {
      const { type, payload } = JSON.parse(data as string);
      switch (type) {
        case 'update': {
          return next({
            type: '@@SOCKET/update',
            payload,
          });
        }
        case 'setup': {
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
    return next(action);
  };
};

export {
  Options,
};

export default socketMiddleware;
