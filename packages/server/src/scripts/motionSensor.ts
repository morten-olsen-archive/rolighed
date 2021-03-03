import Script from '../types/Script';

interface Options {
  device: string;
  groups: string[];
  timeout?: number;
}

const setup: Script<Options> = (options) => ({ actions }) => {
  let timer: any = undefined;

  const reset = () => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      actions.setGroupSettings(options.groups, {
        state: 'OFF',
      });
    }, options.timeout || 10 * 60 * 1000);
  }

  return async ({ type, payload }: any) => {
    if (
      type === `@@MQTT/msg/zigbee2mqtt/${options.device}`
      && payload.occupancy
    ) {
      await actions.setGroupSettings(options.groups, {
        state: 'ON',
      });
      reset();
    }
  };
};

export default setup;
