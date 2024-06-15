# MQTT

Type: `PubSub`

Sends and receives messages using the mqtt protocol.

:::note
This driver is doesn't support unsubscribe on a specific subscription. It will unsubscribe all subscriptions of the channel.
:::

## Installation

:::codegroup
```sh
// title: npm
npm install mqtt
```

```sh
// title: pnpm
pnpm add mqtt
```

```sh
// title: yarn
yarn add mqtt
```
:::

## Usage

```ts
import { mqtt } from 'tellthem/drivers/mqtt'
...
buses: {
  mqtt: {
    driver: mqtt({
      protocol: 'mqtt',
      host: 'localhost',
      port: 1883,
      options: {}
    })
  }
}
...
```

## Options

For more detailed options, feel free to check the [`mqtt`](https://github.com/mqttjs/MQTT.js) documentation for more details about the configuration.

| Option     | Description                                   | Default |
|------------|-----------------------------------------------|---------|
| `protocol` | The protocol used to connect (mqtt or mqtts). | mqtt    |
| `host`     | The hostname of the mqtt broker.              | N/A     |
| `port`     | The port of the mqtt broker.                  | 1883    |
| `options`  | The options of the mqtt broker.               | N/A     |


