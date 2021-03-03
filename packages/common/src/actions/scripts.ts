import { MiddlewareAPI } from 'redux';

const create = (store: MiddlewareAPI) => {
  const setDeviceGroups = async (device: string, groups: any) => {
    const state = store.getState();
    const current = state.deviceGroups || {};
    await Promise.resolve(store.dispatch({
      type: '@@MQTT/publish',
      payload: {
        ...current,
        [device]: groups,
      },
      meta: {
        topic: 'groups/devices',
        retain: true,
      },
    }));
  };

  const setGroupSettings = async (groups: string[], settings: any) => {
    const state = store.getState();
    const current = state.groupSettings || {};
    const next = groups.reduce((output, group) => ({
      ...output,
      [group]: settings,
    }), current);
    await Promise.resolve(store.dispatch({
      type: '@@MQTT/publish',
      payload: next,
      meta: {
        topic: 'groups/settings',
        retain: true,
      },
    }));
  };

  return {
    setDeviceGroups,
    setGroupSettings,
  };
};

export default create;
