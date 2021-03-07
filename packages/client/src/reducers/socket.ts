import { Reducer } from 'redux';
import { GroupsState } from '@morten-olsen/rolighed-common';
import * as jsondiffpatch from 'jsondiffpatch';


interface State {
  connected: boolean;
  remote: GroupsState;
};

const createDefaults = (): State => ({
  connected: false,
  remote: {
    devices: {},
    settings: {},
    accessories: {},
    deviceStates: {},
    accessoryStates: {},
  },
});

const groupsReducer: Reducer<State> = (state = createDefaults(), action) => {
  switch (action.type) {
    case '@@SOCKET/connected': {
      return {
        ...state,
        connected: true,
      };
    }
    case '@@SOCKET/disconnected': {
      return {
        ...state,
        connected: false,
      };
    }
    case '@@SOCKET/setup': {
      return {
        ...state,
        remote: action.payload.state,
      };
    }
    case '@@SOCKET/update': {
      return {
        ...state,
        remote: jsondiffpatch.patch(state.remote, action.payload.diff),
      };
    }
    default: {
      return state;
    }
  }
};

export {
  State,
};

export default groupsReducer;
