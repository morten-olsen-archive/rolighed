import AccessoryConfig from "../types/AccessoryConfig";

export const setGroupSettings = (payload: { [name: string]: any }) => ({
  type: '@@GROUPS/setGroupSettings',
  payload,
});

export const setDeviceGroups = (payload: { [deviceName: string]: string[] }) => ({
  type: '@@GROUPS/setDeviceGroups',
  payload,
});

export const setAccessories = (payload: { [accessoryName: string]: AccessoryConfig }) => ({
  type: '@@GROUPS/setAccessories',
  payload,
});
