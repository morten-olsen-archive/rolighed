import { Middleware, Platform, PlatformConfig, PlatformApi, GroupsState } from '@morten-olsen/rolighed-common';

interface Options {
  [name: string]: PlatformConfig;
}

const createApi = (next: any, controller:string): PlatformApi => ({
  removeDevice: (name: string) => Promise.resolve(next({
    type: '@@PLATFORM/removeDevice',
    payload: name,
    meta: {
      name,
      controller,
    },
  })),
  addDevice: (name: string, config: any = {}, state: any = {}) => Promise.resolve(next({
    type: '@@PLATFORM/addDevice',
    payload: {
      state,
      config,
    },
    meta: {
      name,
      controller,
    },
  })),
  setDevice: (name: string, state?: any, config?: any) => Promise.resolve(next({
    type: '@@PLATFORM/setDevice',
    payload: {
      state,
      config,
    },
    meta: {
      name,
      controller,
    },
  })),
});

const createPlatforms: Middleware<Options> = async (options) => (store) => (next) => {
  const platforms = Object.entries(options).reduce((output, [name, definition]) => {
    let PlatformClass: new (api: PlatformApi) => Platform;
    if (typeof definition.pkg === 'string') {
      const pkg = require(definition.pkg);
      PlatformClass = pkg.default || pkg;
    } else {
      PlatformClass = definition.pkg;
    }
    const api = createApi(next, name);
    const instance = new PlatformClass(api);
    return {
      ...output,
      [name]: instance,
    };
  }, {} as {[name: string]: Platform});

  let deviceCache: {[name: string]: any} = {};

  return async (action) => {
    const result = await next(action);
    const state = store.getState() as GroupsState;
    const devices = state.deviceStates;
    const running = Object.entries(devices).map(async ([name, deviceState]) => {
      if (deviceState === deviceCache[name]) return;
      const device = state.devices[name];
      if (!device) return;
      const platform = platforms[device.controller];
      if (!platform) return;
      await platform.onSetDeviceState(name, deviceState);
      deviceCache[name] = deviceState;
    });
    await Promise.all(running);
    return result;
  };
};

export default createPlatforms;
