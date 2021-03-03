import WebSocket from 'ws';
import * as jsondiffpatch from 'jsondiffpatch';
import { Middleware } from 'redux';

interface Options {
  port?: number;
}

const serialize = (obj: any) => {
  const stringified = JSON.stringify(obj);
  return stringified;
};

const ioMiddleware = (options: Options): Middleware => (store) => (next) => {
  const server = new WebSocket.Server({
    port: options.port || 8081,
  });

  server.on('connection', (client) => {
    const state = store.getState();
    client.send(serialize({
      type: 'setup',
      payload: {
        state,
      },
    }));
    client.onmessage = ({ data }) => {
      const msg = JSON.parse(data.toString());
      switch (msg.type) {
        case 'dispatch': {
          return store.dispatch(msg.payload);
        }
        default: {}
      }
    };
  });

  server.on('error', (err) => {
    console.error('err', err);
  });

  let currentState = store.getState();


  return async (action) => {
    const result = await next(action);
    const nextState = JSON.parse(JSON.stringify(store.getState()));

    const delta = jsondiffpatch.diff(nextState, currentState);

    if (Object.keys(delta || {}).length === 0 && !action.event) {
      return;
    }

    server.clients.forEach((client) => {
      client.send(serialize({
        type: 'update', 
        payload: {
          delta,
          event: action.event,
        },
      }));
    });

    currentState = nextState;
    return result;
  };
};

export default ioMiddleware;
