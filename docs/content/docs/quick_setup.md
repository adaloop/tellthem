# Quick Setup

You can install TellThem using your favorite package manager.

:::warning
TellThem is an ESM-only package. You will also need Node.js 18 or higher.
:::

:::codegroup
```sh
// title: npm
npm install @tbrul/tellthem
```

```sh
// title: pnpm
pnpm add @tbrul/tellthem
```

```sh
// title: yarn
yarn add @tbrul/tellthem
```
:::

## Setup

Once installed, you can configure TellThem by creating a manager.

```ts
import { TellThem } from '@tbrul/tellthem'
import { memory } from '@tbrul/tellthem/drivers/memory'

export const tellThem = new TellThem({
  defaultBus: 'memory',
  buses: {
    memory: {
      driver: memory(),
    },
  },
})
```

- Here we're using the `memory` bus, which is a driver that stores all the data in memory.
- We're also using the `defaultBus` option, which is the bus that will be used by default if no bus is specified.

## Next steps

### Create a channel (optional)

In order to use the full power of TellThem, you'll need to create a channel.

```ts
import { jsonEncoder } from '@tbrul/tellthem/encoders/json'

export const channel = tellThem.channel({
  defaultBus: 'memory',
  name: 'channel',
  encoder: jsonEncoder(),
})
```

- Here we're using the `jsonEncoder` to encode the messages.
- We're also using the `defaultBus` option, which is the bus that will be used by default if no bus is specified.
- We're also using the `name` option, which is the name of the channel.

### Subscribe to messages

If you have a channel, you can subscribe to messages directly using the `subscribe` method from the channel.

```ts
await channel.subscribe((message) => {
  console.log(message)
})
```

If you want to subscribe a standalone channel, you can use the `subscribe` method from the manager.

```ts
await tellThem.subscribe('standalone-channel', jsonEncoder(), (message) => {
  console.log(message)
})
```

### Publish messages

If you have a channel, you can publish messages directly using the `publish` method from the channel.

```ts
await channel.publish('Hello, world!')
```

If you want to publish a standalone channel, you can use the `publish` method from the manager.

```ts
await tellThem.publish('standalone-channel', jsonEncoder(), 'Hello, world!')
```
