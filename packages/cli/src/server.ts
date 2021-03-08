import createStore, {} from '@morten-olsen/rolighed-server/dist/src/index';
import path from 'path';

const config = {
  configFilePath: path.resolve(process.env.CONFIG_FILE || './config'),
};

const configFile = require(config.configFilePath);

createStore({
  ...configFile,
});

