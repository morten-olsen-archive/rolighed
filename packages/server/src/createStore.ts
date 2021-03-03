import { createStore, applyMiddleware } from 'redux';
import { State } from '@morten-olsen/rolighed-common';
import reducer from './reducers';
import createMqtt from './middleware/mqtt';
import createScripts from './middleware/scripts';
import createIO from './middleware/io';
import Script from './types/Script';

interface Options {
  scripts: ReturnType<Script>[];
  broker: string;
}

const create = (options: Options) => {
  const mqtt = createMqtt({
    broker: options.broker,
    topics: [
      'zigbee2mqtt/#',
      'groups/#',
    ],
  });
  const scripts = createScripts(options.scripts);
  const io = createIO({});

  const store = createStore<State, any, any, any>(
    reducer,
    applyMiddleware(
      mqtt,
      scripts,
      io,
    ),
  );

  return store;
};

export {
  Options,
};

export default create;
