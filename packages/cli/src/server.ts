import createStore, {} from '@morten-olsen/rolighed-server/dist/src/index';
import convict from 'convict';

const config = convict({
  brokerUrl: {
    doc: 'Url for MQTT broker',
    env: 'BROKER_URL',
  },
  configLocation: {
    doc: 'Configuration file path',
    env: 'CONFIG_PATH',
  },
});

createStore({
  broker: config.get('brokerUrl'),
  scripts: [],
});

