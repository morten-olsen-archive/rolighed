import AccessoryConfig from "../types/AccessoryConfig";
import GroupsState from '../types/GroupState';
import { GROUPS } from '../constants/actionNames';

export const setGroupSettings = (payload: { [name: string]: any }) => ({
  type: GROUPS.SET_GROUP_SETTINGS,
  payload,
});

export const setDeviceGroups = (payload: { [deviceName: string]: string[] }) => ({
  type: GROUPS.SET_DEVICE_GROUPS,
  payload,
});

export const setAccessories = (payload: { [accessoryName: string]: AccessoryConfig }) => ({
  type: GROUPS.SET_ACCESSORIES,
  payload,
});

export const update = (payload: Partial<GroupsState>) => ({
  type: GROUPS.UPDATE,
  payload,
});
