import { Reducer } from 'redux';
import { GroupsState } from '@morten-olsen/rolighed-common';

const createDefaultState = (): GroupsState => ({
  devices: {},
  settings: {},
  deviceStates: {},
  accessories: {},
  accessoryStates: {},
});

const createDeviceStates = (state: GroupsState) => {
  const { devices, settings } = state;
  
  const deviceStates = Object.entries(devices).reduce((output, [device, groups]) => {
    const deviceState = groups.reduce((output, group) => ({
      ...output,
      ...(settings[group] || {}),
    }), {});
    return {
      ...output,
      [device]: deviceState,
    };
  }, {});

  return deviceStates;
};

const createAccessoryStates = (state: GroupsState) => {
  const { accessories, settings } = state;

  const accessoryStates = Object.entries(accessories).reduce((output, [name, { bind }]) => {
    const accessoryState = Object.entries(bind).reduce((output, [prop, group]) => ({
      ...output,
      [prop]: (settings[group] || {})[prop],
    }), {});

    return {
      ...output,
      [name]: accessoryState,
    };
  }, {});

  return accessoryStates;
};

const groups: Reducer<GroupsState>  = (state = createDefaultState(), action) => {
  switch (action.type) {
    case '@@MQTT/msg/groups/settings': {
      const newState = {
        ...state,
        settings: action.payload,
      };
      return {
        ...newState,
        deviceStates: createDeviceStates(newState),
        accessoryStates: createAccessoryStates(newState),
      };
    }
    case '@@MQTT/msg/groups/devices': {
      const newState = {
        ...state,
        devices: action.payload,
      };
      return {
        ...newState,
        deviceStates: createDeviceStates(newState),
      };
    }
    case '@@MQTT/msg/groups/accessories': {
      const newState = {
        ...state,
        accessories: action.payload,
      };
      return {
        ...state,
        accessoryStates: createAccessoryStates(newState),
      };
    }
    default: {
      return state;
    }
  };
};

export default groups;
