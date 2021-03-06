import createStore, {} from '@morten-olsen/rolighed-server/dist/src/index';
import path from 'path';
import fs from 'fs';

const config = {
  broker: {
    url: process.env.BROKER_URL || 'mqtt://localhost',
  },
  configFilePath: path.resolve(process.env.CONFIG_FILE || './config.js'),
};

if (!fs.existsSync(config.configFilePath)) {
  throw new Error('config file not found');
}

const configFile = JSON.parse(fs.readFileSync(config.configFilePath, 'utf-8'));

createStore({
  broker: config.broker.url,
  scripts: configFile.scripts || [],
});

