import * as hap from 'hap-nodejs';
import { GroupsState, Middleware } from '@morten-olsen/rolighed-common';
import Accessories from './Accessories';

interface Options {
  name?: string;
  username: string;
  pincode: string;
  port?: number;
  allowInsecureRequest?: boolean;
}

const homekitPlugin: Middleware<Options> = async (options) => (store) => (next) => {
  const bridge = new hap.Bridge(options.name || 'Rolighed', hap.uuid.generate(options.username));
  const accessories = new Accessories(bridge, store);
  let previousState: GroupsState = store.getState();

  bridge.getService(hap.Service.AccessoryInformation)!
    .setCharacteristic(hap.Characteristic.Manufacturer, 'Rolighed')
    .setCharacteristic(hap.Characteristic.Model, 'Rolighed Homekit')
    .setCharacteristic(hap.Characteristic.SerialNumber, options.username)

  bridge.publish({
    username: options.username,
    port: options.port || 51882,
    pincode: options.pincode,
    category: hap.Categories.BRIDGE,
  }, options.allowInsecureRequest);

  return async (action) => {
    const result = await next(action);
    const nextState = store.getState();
    accessories.update(nextState, previousState);
    previousState = nextState;
    return result;
  };
};

export default homekitPlugin;
