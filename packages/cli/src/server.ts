import createStore, {} from '@morten-olsen/rolighed-server/dist/src/index';
import path from 'path';
import fs from 'fs';

const config = {
  broker: {
    url: process.env.BROKER_URL || 'mqtt://localhost',
  },
  configFilePath: path.resolve(process.env.CONFIG_FILE || './config'),
};

if (!fs.existsSync(config.configFilePath)) {
  throw new Error('config file not found');
}

const configFile = require(config.configFilePath);

createStore({
  broker: config.broker.url,
  scripts: configFile.scripts || [],
});

