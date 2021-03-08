import { Reducer } from 'redux';
import { GroupsState } from '@morten-olsen/rolighed-common';

const createDefaultState = (): GroupsState => ({
  devices: {},
  deviceGroups: {},
  groupSettings: {},
  deviceStates: {},
  accessories: {},
  accessoryStates: {},
});

const createDeviceStates = (state: GroupsState) => {
  const { deviceGroups, groupSettings } = state;
  
  const deviceStates = Object.entries(deviceGroups).reduce((output, [device, groups]) => {
    const deviceState = groups.reduce((output, group) => ({
      ...output,
      ...(groupSettings[group] || {}),
    }), {});
    return {
      ...output,
      [device]: deviceState,
    };
  }, {});

  return deviceStates;
};

const createAccessoryStates = (state: GroupsState) => {
  const { accessories, groupSettings } = state;

  const accessoryStates = Object.entries(accessories).reduce((output, [name, { bind }]) => {
    const accessoryState = Object.entries(bind).reduce((output, [prop, group]) => ({
      ...output,
      [prop]: (groupSettings[group] || {})[prop],
    }), {});

    return {
      ...output,
      [name]: accessoryState,
    };
  }, {});

  return accessoryStates;
};

const groups = (): Reducer<GroupsState> => (state = createDefaultState(), action) => {
  switch (action.type) {
    case '@@PLATFORM/addDevice': {
      return {
        ...state,
        devices: {
          ...state.devices,
          [action.meta.name]: {
            ...action.payload,
            controller: action.meta.controller,
          },
        },
      };
    };
    case '@@PLATFORM/setDevice': {
      return {
        ...state,
        devices: {
          ...state.devices,
          [action.meta.name]: {
            ...state.devices[action.meta.name],
            ...action.payload,
            controller: action.meta.controller,
          },
        },
      };
    };
    case '@@PLATFORM/removeDevice': {
      const newState = {
        ...state,
        devices: {
          ...state.devices,
        },
      };

      delete newState.devices[action.payload];

      return newState;
    };
    case '@@GROUPS/setGroupSettings': {
      const newState = {
        ...state,
        groupSettings: {
          ...state.groupSettings,
          ...action.payload,
        },
      };
      return {
        ...newState,
        deviceStates: createDeviceStates(newState),
        accessoryStates: createAccessoryStates(newState),
      };
    }
    case '@@GROUPS/setDeviceGroups': {
      const newState = {
        ...state,
        deviceGroups: {
          ...state.deviceGroups,
          ...action.payload,
        },
      };
      return {
        ...newState,
        deviceStates: createDeviceStates(newState),
      };
    }
    case '@@GROUPS/setAccessories': {
      const newState = {
        ...state,
        accessories: action.payload,
      };
      return {
        ...newState,
        accessoryStates: createAccessoryStates(newState),
      };
    }
    default: {
      return state;
    }
  };
};

export default groups;
