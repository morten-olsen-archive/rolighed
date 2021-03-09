import createStore from '@morten-olsen/rolighed-server';
import { groupActions } from '@morten-olsen/rolighed-common';
import homekit from './index';

const run = async () => {
  const store = await createStore({
    plugins: {
      homekit: {
        pkg: homekit,
        config: {
          username: '17:51:07:F4:BC:8A',
          pincode: '678-90-876',
        },
      },
    },
  });
  store.dispatch(groupActions.setAccessories({
    'Living Room Lights': {
      type: 'lightbulb',
      bind: {
        state: 'livingroom',
        brightness: 'upstairs',
      },
    },
    'Library Lights': {
      type: 'lightbulb',
      bind: {
        state: 'library',
        brightness: 'upstairs',
      },
    },
    'Library Door 1': {
      type: 'door',
      bind: {
        open: 'library_door',
      },
    } as any,
  }));

  store.subscribe(() => console.log(store.getState()));
};

run().catch(console.error);
