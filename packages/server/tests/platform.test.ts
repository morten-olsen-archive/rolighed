import createStore, { platforms } from '../src';
import { createDefaultState, Platform, PlatformApi, GroupsState, groupActions } from '@morten-olsen/rolighed-common';

const platformFactory = () => {
  let _api: PlatformApi;
  const setup = jest.fn();
  const onSetDeviceState = jest.fn();

  class TestPlatform extends Platform {
    constructor(api: PlatformApi) {
      super(api);
      _api = api;
    }

    setup = setup;
    onSetDeviceState = onSetDeviceState;
  }

  return {
    setup,
    onSetDeviceState,
    TestPlatform,
    getApi: () => _api,
  };
};

const setup = async (initialState?: GroupsState) => {
  const platform = platformFactory();
  const store = await createStore({
    initialState,
    plugins: {
      platform: {
        pkg: 'platforms',
        config: {
          test: {
            pkg: platform.TestPlatform,
          },
        },
      },
    },
  });

  return {
    platform,
    store,
  };
};

describe('server/platform', () => {
  it('should be able to add a device', async () => {
    const { platform, store } = await setup();
    const api = platform.getApi();
    await api.setDevice('foo', { bar: 'baz' }, {});
    await api.setDevice('a', { b: 10 }, {});
    const devices = store.getState().devices;
    expect(Object.keys(devices)).toEqual(['foo', 'a']);
    expect(devices.foo).toEqual({
      config: {},
      state: { bar: 'baz' },
      controller: 'test',
    });
    expect(devices.a).toEqual({
      config: {},
      state: { b: 10 },
      controller: 'test',
    });
  });

  it('should be able to remove a device', async () => {
    const { platform, store } = await setup();
    const api = platform.getApi();
    await api.setDevice('foo', { bar: 'baz' }, {});
    await api.setDevice('a', { b: 10 }, {});
    await api.removeDevice('foo');
    const devices = store.getState().devices;
    expect(Object.keys(devices)).toEqual(['a']);
    expect(devices.a).toEqual({
      config: {},
      state: { b: 10 },
      controller: 'test',
    });
  });

  it('should be able to update a device', async () => {
    const { platform, store } = await setup();
    const api = platform.getApi();
    await api.setDevice('foo', { bar: 'baz' }, {});
    await api.setDevice('a', { b: 10 }, {});
    await api.setDevice('foo', { a: 'b' }, { baz: 'bar' });
    const devices = store.getState().devices;
    expect(Object.keys(devices)).toEqual(['foo', 'a']);
    expect(devices.foo).toEqual({
      state: { a: 'b' },
      config: { baz: 'bar' },
      controller: 'test',
    });
    expect(devices.a).toEqual({
      config: {},
      state: { b: 10 },
      controller: 'test',
    });
  });

  it('should receive updates', async () => {
    const { platform, store } = await setup({
      ...createDefaultState(),  
      deviceGroups: {
        'Test Device 1': ['upstairs'],
      },
    });
    const api = platform.getApi();
    await api.setDevice('Test Device 1', { bar: 'baz' }, {});
    await Promise.resolve(store.dispatch(groupActions.setGroupSettings({
      upstairs: {
        on: true,
      },
    })));
    expect(platform.onSetDeviceState).toHaveBeenCalledWith("Test Device 1", {
      on: true,
    });
  });
});
