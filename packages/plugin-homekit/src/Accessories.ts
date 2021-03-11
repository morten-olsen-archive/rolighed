import * as hap from 'hap-nodejs';
import { MiddlewareAPI } from 'redux';
import { GroupsState, groupActions } from '@morten-olsen/rolighed-common';
import types from './accessoryTypes';

class Accessories {
  private _bridge: hap.Bridge;
  private _accessories: { [name: string]: hap.Accessory } = {};
  private _store: MiddlewareAPI<any, GroupsState>

  constructor(bridge: hap.Bridge, store: MiddlewareAPI<any, GroupsState>) {
    this._bridge = bridge;
    this._store = store;
  }

  private _setupAccessory = (
    name: string,
  ) => {
    if (this._accessories[name]) {
      return;
    }
    const definition = this._store.getState().accessories[name];
    const type = types[definition.type];
    const newAccessory = new hap.Accessory(name, hap.uuid.generate(name));
    this._bridge.addBridgedAccessory(newAccessory);
    this._accessories[name] = newAccessory;
    type.services.forEach((serviceType) => {
      const service = new serviceType.type(name, hap.uuid.generate(name));
      Object.entries(serviceType.props).map(([prop, propDefinition]) => {
        if (!definition.bind[prop]) return;
        const charactaristic = service.getCharacteristic(propDefinition.type);
        charactaristic.on(hap.CharacteristicEventTypes.SET, (value, callback) => {
          const definition = this._store.getState().accessories[name];
          const group = definition.bind[prop];
          const rolighedValue = propDefinition.to(value);
          this._store.dispatch(groupActions.setGroupSettings({
            [group]: {
              [prop]: rolighedValue,
            }
          }));
          callback();
        });
        charactaristic.on(hap.CharacteristicEventTypes.GET, (callback) => {
          const state = this._store.getState();
          const current = state.accessoryStates[name][prop];
          const homekitValue = propDefinition.from(current);
          callback(undefined, homekitValue);
        });
      });
      newAccessory.addService(service);
    });
  };

  private _updateAccessory = (
    name: string,
    next: GroupsState['accessoryStates'][0] = {},
    previous: GroupsState['accessoryStates'][0] = {},
  ) => {
    this._setupAccessory(name);
    const definition = this._store.getState().accessories[name];
    const accessory = this._accessories[name];
    const type = types[definition.type];

    type.services.forEach((serviceType) => {
      const service = accessory.getService(serviceType.type)!;
      Object.entries(serviceType.props).map(([prop, propDefinition]) => {
        if (!definition.bind[prop]) return;
        if (next[prop] === previous[prop]) return;
        const homekitValue = propDefinition.from(next[prop]);
        service.setCharacteristic(propDefinition.type, homekitValue);
      });
    });
  }

  public update = (next: GroupsState, previous: GroupsState) => {
    const previousAccessoryStates = previous.accessoryStates;
    const nextAccessoryStates = next.accessoryStates;
    Object.entries(nextAccessoryStates).forEach(([name, next]) => {
      const previous = previousAccessoryStates[name];
      this._updateAccessory(name, next, previous);
    });

  }
}

export default Accessories;
