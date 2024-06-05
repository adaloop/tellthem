<p align="center">
  <br/>
    TellThem is a driver based communication library (PubSub or Message Queue).
  <br/>
</p>

## Features
- 🗄️ Support PubSub and Message Queue
- 🚀 Simple and easy to use
- 🚀 Many drivers (Redis, In-memory, Kafka, AMQP, MQTT)
- 📦 Retry queue
- 📦 Typesafe channels
- 📖 Well documented
- 🧩 Easily extendable with your own encoders and drivers

## Why TellThem ?
I was searching for a simple and easy to use driver based library to implement typesafe pubsub and message queue channels. Unfortunately, I didn't find any that fit my needs expect [`@boringnode/bus`](https://github.com/boringnode/bus). That is a great library but it doest not implement typesafety in their channels system. So I decided to create my own library.

## Installation
```bash
npm install tellthem
```

## Quick start

The library use a manager you need to use to register buses.
```typescript
import { TellThem } from 'tellthem';
import { memory } from 'tellthem/drivers';

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
import { jsonEncoder } from 'tellthem/encoders';

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

Channels are typed using the encoder you used to create them. For example if you want to validate your messages using Zod, you can use the `zodJsonEncoder` from `tellthem/encoders`.

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

[`Romain Lanz`](https://github.com/RomainLanz) and [`Julien Ripouteau`](https://github.com/Julien-R44) did an amazing job on creating [`@boringnode/bus`](https://github.com/boringnode/bus). I used some of their code to create this library. 
