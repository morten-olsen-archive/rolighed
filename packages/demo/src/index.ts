import createStore, {
  Options,
  scripts,
  platforms,
} from '@morten-olsen/rolighed-server';
import { groupActions, Script, GroupsState, actionNames } from '@morten-olsen/rolighed-common';
import zigbee2mqtt from '@morten-olsen/rolighed-platform-zigbee2mqtt';
import homekit from '@morten-olsen/rolighed-plugin-homekit';
import * as home from './home';

const doorOpenState: Partial<GroupsState> = {
  accessories: {
    [home.accessories.libraryLights]: {
      type: 'lightbulb',
      bind: {
        state: home.groups.livingroomLights,
        brightness: home.groups.upstairsLights,
      },
    },
    [home.accessories.tvroomLights]: {
      type: 'lightbulb',
      bind: {
        state: home.groups.livingroomLights,
        brightness: home.groups.upstairsLights,
      },
    },
    [home.accessories.libraryDoor]: {
      type: 'door',
      bind: {
        open: home.groups.libraryDoor,
      },
    },
  },
  deviceGroups: {
    [home.devices.tvroomLight1]: [home.groups.upstairsLights, home.groups.livingroomLights],
    [home.devices.libraryLight1]: [home.groups.upstairsLights, home.groups.livingroomLights],
    [home.devices.alrumLight1]: [home.groups.upstairsLights, home.groups.livingroomLights],
  },
};

const doorCloseState: Partial<GroupsState> = {
  accessories: {
    [home.accessories.libraryLights]: {
      type: 'lightbulb',
      bind: {
        state: home.groups.libraryLights,
        brightness: home.groups.libraryLights,
      },
    },
    [home.accessories.tvroomLights]: {
      type: 'lightbulb',
      bind: {
        state: home.groups.livingroomLights,
        brightness: home.groups.upstairsLights,
      },
    },
    [home.accessories.libraryDoor]: {
      type: 'door',
      bind: {
        open: home.groups.libraryDoor,
      },
    },
  },
  deviceGroups: {
    [home.devices.tvroomLight1]: [home.groups.livingroomLights, home.groups.upstairsLights],
    [home.devices.alrumLight1]: [home.groups.livingroomLights, home.groups.upstairsLights],
    [home.devices.libraryLight1]: [home.groups.libraryLights],
  },
};

const doorOpenStateEvening: Partial<GroupsState> = {
  accessories: {
    [home.accessories.libraryLights]: {
      type: 'lightbulb',
      bind: {
        state: home.groups.libraryLights,
        brightness: home.groups.libraryLights,
      },
    },
    [home.accessories.tvroomLights]: {
      type: 'lightbulb',
      bind: {
        state: home.groups.libraryLights,
        brightness: home.groups.libraryLights,
      },
    },
    [home.accessories.libraryDoor]: {
      type: 'door',
      bind: {
        open: home.groups.libraryDoor,
      },
    },
  },
  deviceGroups: {
    [home.devices.tvroomLight1]: [home.groups.libraryLights],
    [home.devices.libraryLight1]: [home.groups.libraryLights],
    [home.devices.alrumLight1]: [home.groups.libraryLights],
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
          [config.group]: {
            state: 'ON',
          },
        }));
        timer = setTimeout(() => {
          dispatch(groupActions.setGroupSettings({
            [config.group]: {
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

const log: Script = (config, { dispatch }) => {
  return async (action) => {
    console.log(action)
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
        log: { pkg: log, config: {} },
        libraryDoor: { pkg: libraryDoor, config: {} },
        doorButton: { pkg: doorButton, config: { device: home.devices.doorSwitch } },
        hallwayMotionSensor: { pkg: motionSensor, config: { device: home.devices.hallwayMotionSensor, group: home.groups.hallwayLights } },
        kitchenMotionSensor: { pkg: motionSensor, config: { device: home.devices.kitchenMotionSensor, group: home.groups.kitchenLights } },
        bathroomMotionSensor: { pkg: motionSensor, config: { device: home.devices.bathroomMotionSensor, group: home.groups.bathroomLights } },
      },
    },
    homekit: {
      pkg: homekit,
      config: {
        username: '17:51:07:F4:AC:4A',
        pincode: '678-90-875',
        port: 41802,
      },
    },
  }
};

const run = async () => {
  console.log('starting');
  const store = await createStore(config);
  let events = 0;
  store.subscribe(() => {
    console.log(new Date().toString(), events++);
  });
  await Promise.resolve(store.dispatch(groupActions.update({
    accessories: {
      [home.accessories.bedroomLights]: {
        type: 'lightbulb',
        bind: {
          state: home.groups.bedroomLights,
          brightness: home.groups.bedroomLights,
        },
      },
      [home.accessories.staircaseLights]: {
        type: 'lightbulb',
        bind: {
          state: home.groups.staircaseLights,
          brightness: home.groups.staircaseLights,
        },
      }
    },
    deviceGroups: {
      [home.devices.kitchenLight2]: [home.groups.upstairsLights, home.groups.kitchenLights],
      [home.devices.kitchenLight3]: [home.groups.upstairsLights, home.groups.kitchenLights],
      [home.devices.bathroomLight1]: [home.groups.upstairsLights, home.groups.bathroomLights],
      [home.devices.bathroomLight2]: [home.groups.upstairsLights, home.groups.bathroomLights],
      [home.devices.hallwayLight1]: [home.groups.upstairsLights, home.groups.hallwayLights],
      [home.devices.staircaseLight1]: [home.groups.staircaseLights],
      [home.devices.staircaseLight2]: [home.groups.staircaseLights],
      [home.devices.bedroomLight1]: [home.groups.bedroomLights],
    },
  })));
  await Promise.resolve(store.dispatch(groupActions.update(doorOpenState)));
};

run().catch(console.error);

