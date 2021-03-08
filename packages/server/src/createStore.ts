import { createStore, applyMiddleware, Store } from 'redux';
import { Middleware, MiddlewareConfig, GroupsState } from '@morten-olsen/rolighed-common';
import scripts from './middleware/scripts';
import socket from './middleware/socket';
import platforms from './middleware/platforms';
import reducer from './reducers';

const buildIn: {[name: string]: Middleware} = {
  scripts,
  platforms,
  socket,
};

interface Options {
  plugins: {
    [name: string]: MiddlewareConfig;
  };
  initialState?: GroupsState;
}

const create = async (options: Options): Promise<Store<GroupsState>> => {
  const middlewares = Object.entries(options.plugins).map(async ([_, config]) => {
    let pkgMiddleware: Middleware;
    if (typeof config.pkg === 'string' && buildIn[config.pkg]) {
      pkgMiddleware = buildIn[config.pkg];
    } else if (typeof config.pkg === 'string') {
      const pkg = require(config.pkg);
      pkgMiddleware = pkg.default || pkg;
    } else {
      pkgMiddleware = config.pkg;
    }
    const instance = await pkgMiddleware(config.config);
    return instance;
  });

  const store = createStore<GroupsState, any, any, any>(
    reducer(),
    options.initialState,
    applyMiddleware(
      ...await Promise.all(middlewares),
    ),
  );

  return store;
};

export {
  Options,
};

export default create;
