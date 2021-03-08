import { Platform, PlatformApi } from '@morten-olsen/rolighed-common';
import Mqtt from 'mqtt';

class PlatformZigbee2MQTT extends Platform {
  private _client: Mqtt.Client;
  private _topic = 'zigbee2mqtt';

  constructor(api: PlatformApi) {
    super(api);
    this._client = Mqtt.connect('mqtt://localhost');
    this._client.subscribe('zigbee2mqtt/bridge/devices');
    this._client.on('message', this._onMessage);
  }

  private _onMessage = (topic: string, message: string) => {
    const data = JSON.parse(message);
    if (topic === `${this._topic}/bridge/devices`) {
      const topics = Object.values(data).map((device: any) => `${this._topic}/${device.friendlyName}`);
      this._client.subscribe(topics);
    } else {
      const name = topic.substring(this._topic.length + 1);
      this.api.setDevice(name, data);
    }
  };

  setup = async () => {
  };

  onSetDeviceState = async (name: string, state: any) => {
    this._client.publish(`${this._topic}/${name}/set`, JSON.stringify(state));
  };
}

export default PlatformZigbee2MQTT;
