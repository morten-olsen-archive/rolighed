import createStore, { Options } from './createStore';
import {
  Script,
  GroupsState,
  GroupsReducer,
  createScriptActions,
} from '@morten-olsen/rolighed-common';

type ScriptActions = ReturnType<typeof createScriptActions>

export {
  Script,
  GroupsState,
  GroupsReducer,
  Options,
  createScriptActions,
  ScriptActions,
};

export default createStore;
