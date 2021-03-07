import createStore, {} from '@morten-olsen/rolighed-server/dist/src/index';
import path from 'path';

const config = {
  broker: {
    url: process.env.BROKER_URL || 'mqtt://localhost',
  },
  configFilePath: path.resolve(process.env.CONFIG_FILE || './config'),
};

const configFile = require(config.configFilePath);

createStore({
  broker: config.broker.url,
  scripts: configFile.scripts || [],
});

