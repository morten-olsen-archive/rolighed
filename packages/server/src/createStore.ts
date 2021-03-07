import { createStore, applyMiddleware } from 'redux';
import { GroupsState } from '@morten-olsen/rolighed-common';
import reducer from './reducers';
import createMqtt from './middleware/mqtt';
import createScripts from './middleware/scripts';
import createSocket from './middleware/socket';
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
  const socket = createSocket({});

  const store = createStore<GroupsState, any, any, any>(
    reducer(),
    applyMiddleware(
      mqtt,
      scripts,
      socket,
    ),
  );

  return store;
};

export {
  Options,
};

export default create;
