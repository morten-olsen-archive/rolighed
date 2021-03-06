import { combineReducers } from 'redux';
import { GroupsReducer } from '@morten-olsen/rolighed-common';
import createGroups from './groups';

const defaultGroupsReducer: GroupsReducer = (a = undefined as any) => a;

const createReducer = (groupsReducer = defaultGroupsReducer) => combineReducers({
  groups: createGroups(groupsReducer),
});

export default createReducer;
