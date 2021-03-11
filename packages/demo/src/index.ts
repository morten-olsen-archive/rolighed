import createStore, {
  Options,
  scripts,
  platforms,
} from '@morten-olsen/rolighed-server';
import { groupActions, Script, GroupsState, actionNames } from '@morten-olsen/rolighed-common';
import zigbee2mqtt from '@morten-olsen/rolighed-platform-zigbee2mqtt';
import homekit from '@morten-olsen/rolighed-plugin-homekit';

const groupNames = {
  livingroomLights: 'livingroom_lights',
  libraryLights: 'library_lights',
  libraryDoor: 'library_door',
  upstairsLights: 'upstairs_lights',
};

const accessoryNames = {
  tvroomLights: 'Living Room Lights',
  libraryLights: 'Library Lights',
  libraryDoor: 'Library Door',
};

const deviceNames = {
  libraryLight1: 'Library Light 1 a',
  tvroomLight1: 'Living Room Light',
  doorSwitch: '0x5c0272fffe835bc2',
};

const doorOpenState: Partial<GroupsState> = {
  accessories: {
    [accessoryNames.libraryLights]: {
      type: 'lightbulb',
      bind: {
        state: groupNames.livingroomLights,
        brightness: groupNames.upstairsLights,
      },
    },
    [accessoryNames.tvroomLights]: {
      type: 'lightbulb',
      bind: {
        state: groupNames.livingroomLights,
        brightness: groupNames.upstairsLights,
      },
    },
    [accessoryNames.libraryDoor]: {
      type: 'door',
      bind: {
        open: groupNames.libraryDoor,
      },
    },
  },
  deviceGroups: {
    [deviceNames.tvroomLight1]: [groupNames.upstairsLights, groupNames.livingroomLights],
    [deviceNames.libraryLight1]: [groupNames.upstairsLights, groupNames.livingroomLights],
  },
};

const doorCloseState: Partial<GroupsState> = {
  accessories: {
    [accessoryNames.libraryLights]: {
      type: 'lightbulb',
      bind: {
        state: groupNames.libraryLights,
        brightness: groupNames.libraryLights,
      },
    },
    [accessoryNames.tvroomLights]: {
      type: 'lightbulb',
      bind: {
        state: groupNames.livingroomLights,
        brightness: groupNames.upstairsLights,
      },
    },
    [accessoryNames.libraryDoor]: {
      type: 'door',
      bind: {
        open: groupNames.libraryDoor,
      },
    },
  },
  deviceGroups: {
    [deviceNames.tvroomLight1]: [groupNames.livingroomLights, groupNames.upstairsLights],
    [deviceNames.libraryLight1]: [groupNames.libraryLights],
  },
};

const doorOpenStateEvening: Partial<GroupsState> = {
  accessories: {
    [accessoryNames.libraryLights]: {
      type: 'lightbulb',
      bind: {
        state: groupNames.libraryLights,
        brightness: groupNames.libraryLights,
      },
    },
    [accessoryNames.tvroomLights]: {
      type: 'lightbulb',
      bind: {
        state: groupNames.libraryLights,
        brightness: groupNames.libraryLights,
      },
    },
    [accessoryNames.libraryDoor]: {
      type: 'door',
      bind: {
        open: groupNames.libraryDoor,
      },
    },
  },
  deviceGroups: {
    [deviceNames.tvroomLight1]: [groupNames.libraryLights],
    [deviceNames.libraryLight1]: [groupNames.libraryLights],
  },
};

const motionSensor: Script = (config, { dispatch }) => {
  let timer: any;
  return async ({ type, payload, meta }) => {
    if (type === actionNames.PLATFORM.SET_DEVICE && meta?.name === config.device) {
      const occupancy = payload.state.occupancy;
      if (occupancy) {
        clearTimeout(timer);
        dispatch(groupActions.setGroupSettings({
          hallway: {
            state: 'ON',
          },
        }));
        timer = setTimeout(() => {
          dispatch(groupActions.setGroupSettings({
            hallway: {
              state: 'OFF',
            },
          }));
        }, config.timeout || 10  * 60 * 1000);
      }
    }
  }
};

const doorButton: Script = (config, { dispatch }) => {
  return async ({ type, payload, meta }) => {
    if (type === actionNames.PLATFORM.SET_DEVICE && meta?.name === config.device) {
      const action = payload.state.action;
      dispatch(groupActions.setGroupSettings({
        library_door: {
          open: action === 'on',
        },
      }));
    }
  }
};

const libraryDoor: Script = (config, { dispatch }) => {
  return async (action) => {
    if (
      action.type === actionNames.GROUPS.SET_GROUP_SETTINGS
      && typeof action.payload.library_door !== 'undefined'
    ) {
      const state = action.payload.library_door.open;

      if (!state) {
        await Promise.resolve(dispatch(groupActions.update(doorCloseState)));
      } else if (new Date().getHours() < 19) {
        await Promise.resolve(dispatch(groupActions.update(doorOpenState)));
      } else {
        await Promise.resolve(dispatch(groupActions.update(doorOpenStateEvening)));
      }
    }
  };
};

const config: Options = {
  plugins: {
    platforms: {
      pkg: platforms,
      config: {
        zigbee2mqtt: {
          pkg: zigbee2mqtt,
          config: {},
        },
      },
    },
    scripts: {
      pkg: scripts,
      config: {
        libraryDoor: { pkg: libraryDoor, config: {} },
        doorButton: { pkg: doorButton, config: { device: deviceNames.doorSwitch } },
      },
    },
    homekit: {
      pkg: homekit,
      config: {
        username: '17:51:07:F4:AC:8A',
        pincode: '678-90-875',
        port: 41802,
      },
    },
  }
};

const run = async () => {
  const store = await createStore(config);
  store.subscribe(() => {
    console.log('state', store.getState().deviceStates);
  });
  await Promise.resolve(store.dispatch(groupActions.update(doorOpenState)));
};

run().catch(console.error);
