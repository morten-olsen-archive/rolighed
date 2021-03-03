import Script from './types/Script';
import createScriptActions from './actions/scripts';
import GroupsState from './types/GroupState';

type ScriptActions = ReturnType<typeof createScriptActions>

interface State {
  groups: GroupsState;
}

export {
  Script,
  ScriptActions,
  GroupsState,
  createScriptActions,
  State,
};
