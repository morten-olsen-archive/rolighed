import { Script, GroupsState, GroupsReducer } from '@morten-olsen/rolighed-server';

interface Configuration {
  scripts: Script[];
  reducer?: GroupsReducer,
}

export {
  Script,
  GroupsState,
  GroupsReducer,
  Configuration,
};
