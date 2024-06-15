# Redis

Type: `PubSub`

Sends and receives messages using Redis.

:::note
This driver is doesn't support unsubscribe on a specific subscription. It will unsubscribe all subscriptions of the channel.
:::

## Installation

:::codegroup
```sh
// title: npm
npm install ioredis
```

```sh
// title: pnpm
pnpm add ioredis
```

```sh
// title: yarn
yarn add ioredis
```
:::

## Usage

```ts
import { redis } from 'tellthem/drivers/redis'
...
buses: {
  redis: {
    driver: redis({
    })
  }
}
...
```

## Options

For more detailed options, feel free to check the [`ioredis`](https://github.com/redis/ioredis?tab=readme-ov-file) documentation for more details about the configuration.

| Option     | Description                       | Default |
|------------|-----------------------------------|--------|
| `host`     | The hostname of the redis server. | N/A    |
| `port`     | The port of the redis server.     | 6379   |
| `username` | The username used to connect.     | N/A    |
| `password` | The password used to connect.     | N/A    |


