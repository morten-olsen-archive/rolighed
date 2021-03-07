import WebSocket from 'ws';
import { Middleware } from 'redux';
import SocketClient from './SocketClient';

interface Options {
  port?: number;
}

const socketMiddleware = (options: Options): Middleware => (store) => (next) => {
  let clients: SocketClient[] = [];

  const server = new WebSocket.Server({
    port: options.port || 8081,
  });

  server.on('connection', (socket) => {
    const client = new SocketClient(socket, store);
    clients.push(client);
    socket.onclose = () => {
      clients = clients.filter(c => c !== client);
    };
  });

  server.on('error', (err) => {
    console.error('err', err);
  });

  return async (action) => {
    const result = await next(action);
    const nextState = JSON.parse(JSON.stringify(store.getState()));


    clients.forEach((client) => client.updateState(action));
    return result;
  };
};

export default socketMiddleware;
