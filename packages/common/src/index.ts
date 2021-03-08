import Script from './types/Script';
import createScriptActions from './actions/scripts';
import GroupsState from './types/GroupState';
import GroupsReducer from './types/GroupReducer';
import Platform from './Platform';
import PlatformApi from './types/PlatformApi';
import PlatformConfig from './types/PlatformConfig';
import Middleware from './types/Middleware';
import MiddlewareConfig from './types/MiddlewareConfig';
import ScriptConfig from './types/ScriptConfig';
import * as groupActions from './actions/groups';
import AccessoryConfig from './types/AccessoryConfig';

type ScriptActions = ReturnType<typeof createScriptActions>

interface State {
  groups: GroupsState;
}

const createDefaultState = (): GroupsState => ({
  devices: {},
  accessories: {},
  deviceGroups: {},
  deviceStates: {},
  groupSettings: {},
  accessoryStates: {},
});

export {
  Script,
  ScriptActions,
  GroupsState,
  GroupsReducer,
  createScriptActions,
  State,
  Platform,
  PlatformApi,
  PlatformConfig,
  Middleware,
  MiddlewareConfig,
  ScriptConfig,
  groupActions,
  AccessoryConfig,
  createDefaultState,
};
