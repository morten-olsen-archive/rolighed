import createStore, { Options } from './createStore';
import platforms from './middleware/platforms';
import websocket from './middleware/socket';
import scripts from './middleware/scripts';
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
  platforms,
  websocket,
  scripts,
};

export default createStore;
