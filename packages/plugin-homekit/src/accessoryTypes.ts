import * as hap from 'hap-nodejs';

interface AccessoryType {
  services: {
    type: hap.WithUUID<typeof hap.Service>,
    props: {
      [prop: string]: {
        type: hap.WithUUID<new () => hap.Characteristic>;
        from: (input: any) => hap.CharacteristicValue;
        to: (input: hap.CharacteristicValue) => any;
      }
    }
  }[]
}

const types: {[name: string]: AccessoryType} = {
  lightbulb: {
    services: [{
      type: hap.Service.Lightbulb,
      props: {
        state: {
          type: hap.Characteristic.On,
          from: input => input === 'ON',
          to: input => input ? 'ON' : 'OFF',
        },
        brightness: {
          type: hap.Characteristic.Brightness,
          from: input => (input || 10) / 2.55,
          to: input => Math.max(1, input as number * 2.55),
        },
      }
    }],
  },
  door: {
    services: [{
      type: hap.Service.Outlet,
      props: {
        open: {
          type: hap.Characteristic.On,
          to: a => a,
          from: a => a ?? false,
        },
      },
    }],
  },
};

export default types;

