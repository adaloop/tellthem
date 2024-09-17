<p align="center">
  <br/>
    <a href="https://tellthem.adaloop.com/">TellThem</a> is an asynchronous communication library for Node.js.
  <br/>
</p>

## Features
- 🗄️ Support PubSub and Point to Point
- 💡 Simple and easy to use
- 🚀 Many drivers (Redis, In-memory, AMQP, MQTT)
- 🔁 Retry queue
- ✅ Typesafe channels
- 📖 Well documented
- 🧩 Easily extendable with your own encoders and drivers

See documentation at [tellthem.adaloop.com](https://tellthem.adaloop.com)

## Why TellThem ?

I wanted a simple driver based and typesafe library to communicate with my services. Since I'm using [`AdonisJS`](https://adonisjs.com/) for most of my projects, I initially created a library for this framework called [`adonis6-amqp`](https://www.npmjs.com/package/adonis6-amqp/v/latest). But when I wanted to use it in a standalone project, I realized that I needed a more generic library. I found out that there is a perfect library for this purpose called [`@boringnode/bus`](https://www.npmjs.com/package/@boringnode/bus), but it's not typesafe , so I decided to create my own that combine the best of both worlds.

## Installation
```bash
npm install @adaloop/tellthem
```

## Quick start

The library use a manager you need to use to register buses.
```typescript
import { TellThem } from '@adaloop/tellthem';
import { memory } from '@adaloop/tellthem/drivers/memory';
import { redis } from '@adaloop/tellthem/drivers/redis';

const tellThem = new TellThem({
  default: 'memory',
  buses: {
    memory: {
      driver: memory()
    },
    redis: {
      driver: redis({
        host: 'localhost',
        port: 6379,
      })
    }
  }
});
```

Once you created your manager, you will use it to create a channel.

```typescript
import { jsonEncoder } from '@adaloop/tellthem/encoders/json';

const channel = tellThem.channel({
  name: 'my-channel',
  defaultBus: 'memory',
  encoder: jsonEncoder()
})
```

Then you can use the created channel to publish and subscribe to messages.

```typescript
channel.publish('hello world');

channel.subscribe((message) => {
  console.log(message);
});
```

### Typesafe channels

Channels are typed using the encoder you used to create them. For example if you want to validate your messages using Zod, you can use the `zodJsonEncoder` from `@adaloop/tellthem/encoders`.

```typescript
const channel = tellThem.channel({
  name: 'my-channel',
  defaultBus: 'memory',
  encoder: zodJsonEncoder({
    schema: z.object({
      myData: z.string(),
    })
  })
})

channel.subscribe((message) => {
  console.log(message.myData); // ✅ Typed
  console.log(message.myOtherData); // ❌ Not typed
});

channel.publish({
  myData: 'hello world', // ✅ Typed
  myOtherData: 'hello world' // ❌ Not typed
})
```

## Credits

This library is inspired by [`@boringnode/bus`](https://www.npmjs.com/package/@boringnode/bus).
