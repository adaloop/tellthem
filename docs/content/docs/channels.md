# Channels

TellThem is designed to used named channels, but you can also use standalone channels.

Channels are the implementation of the communication between the driver and the encoder.

## Named channels

```ts
import { jsonEncoder } from 'tellthem/encoders/json'

export const channel = tellThem.channel({
  defaultBus: 'memory',
  name: 'channel',
  encoder: jsonEncoder(),
})
```

This way you can use the created channel to publish and subscribe messages.

```ts
await channel.subscribe((message) => {
  console.log(message)
})

await channel.publish('Hello, world!')
```

## Standalone channels

If you don't want to use a named channel, you can use a standalone channel.

```ts
import { jsonEncoder } from 'tellthem/encoders/json'

await tellThem.subscribe('standalone-channel', jsonEncoder(), (message) => {
  console.log(message)
})

await tellThem.publish('standalone-channel', jsonEncoder(), 'Hello, world!')
```

