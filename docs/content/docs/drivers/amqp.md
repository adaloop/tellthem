# AMQP

Type: `Point to Point`

Sends and receives messages using the AMQP protocol.

## Installation

:::codegroup
```sh
// title: npm
npm install amqplib
```

```sh
// title: pnpm
pnpm add amqplib
```

```sh
// title: yarn
yarn add amqplib
```
:::

## Usage

```ts
import { amqp } from 'tellthem/drivers/amqp'
...
buses: {
  amqp: {
    driver: amqp({
      protocol: 'amqp',
      hostname: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
    })
  }
}
...
```

## Options

For more detailed options, feel free to check the [`amqplib`](https://amqp-node.github.io/amqplib/channel_api.html) documentation for more details about the configuration. 

| Option     | Description                                 | Default |
|------------|---------------------------------------------|--------|
| `protocol` | The protocol used to connect.               | amqp   |
| `hostname` | The hostname of the amqp broker.            | N/A    |
| `port`     | The port of the amqp broker.                | 5672   |
| `username` | The username to connect on the amqp broker. | N/A    |
| `password` | The password to connect on the amqp broker. | N/A    |

