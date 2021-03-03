import mqtt from 'mqtt';
import { Middleware } from 'redux';

interface Options {
  broker: string;
  topics: string[];
}

const createMqtt = (options: Options): Middleware => (store) => (next) => {
  const client = mqtt.connect(options.broker);

  client.on('connect', () => {
    next({
      type: '@@MQTT/connect',
      payload: {},
    });

    client.subscribe(options.topics);
  });

  client.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      next({
        type: `@@MQTT/msg/${topic}`,
        payload,
        meta: {
          topic,
        },
      });
    } catch (err) {}
  });

  return (action: any) => {
    if (action.type === '@@MQTT/publish') {
      const { payload, meta } = action;
      const { topic, retain } = meta;
      return new Promise<void>((resolve, reject) => {
        client.publish(topic, JSON.stringify(payload), {
          qos: 2,
          retain,
        }, (err) => {
          if (err) {
            console.error(err);
            return reject(err);
          }
          return resolve(next(action));
        });
      });
    }
    return next(action)
  };
};

export default createMqtt;
