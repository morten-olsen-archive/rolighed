import { Reducer } from 'redux';
import { GroupsState, GroupsReducer } from '@morten-olsen/rolighed-common';

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

console.log('foo bar');

const groups = (reducer: GroupsReducer): Reducer<GroupsState> => (state = createDefaultState(), action) => {
  let result = state;
  switch (action.type) {
    case '@@MQTT/msg/groups/settings': {
      const newState = {
        ...state,
        settings: action.payload,
      };
      result = {
        ...newState,
        deviceStates: createDeviceStates(newState),
        accessoryStates: createAccessoryStates(newState),
      };
      break;
    }
    case '@@MQTT/msg/groups/devices': {
      const newState = {
        ...state,
        devices: action.payload,
      };
      result = {
        ...newState,
        deviceStates: createDeviceStates(newState),
      };
      break;
    }
    case '@@MQTT/msg/groups/accessories': {
      console.log('accessories!', action.payload);
      const newState = {
        ...state,
        accessories: action.payload,
      };
      result = {
        ...newState,
        accessoryStates: createAccessoryStates(newState),
      };
      break;
    }
    default: {
      return state;
    }
  };
  return reducer(result, action);
};

export default groups;
