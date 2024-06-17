# Introduction

TellThem is an asynchronous communication library for Node.js.

- 🗄️ Support PubSub and Point to Point
- 💡 Simple and easy to use
- 🚀 Many drivers (Redis, In-memory, AMQP, MQTT)
- 🔁 Retry queue
- ✅ Typesafe channels
- 📖 Well documented
- 🧩 Easily extendable with your own encoders and drivers

## Why TellThem ?

I wanted a simple driver based and typesafe library to communicate with my services. Since I'm using [`AdonisJS`](https://adonisjs.com/) for most of my projects, I initially created a library for this framework called [`adonis6-amqp`](https://www.npmjs.com/package/adonis6-amqp/v/latest). But when I wanted to use it in a standalone project, I realized that I needed a more generic library. I found out that there is a perfect library for this purpose called [`@boringnode/bus`](https://www.npmjs.com/package/@boringnode/bus), but it's not typesafe , so I decided to create my own that combine the best of both worlds.

## Features

Below is a list of the main features of TellThem. If you want to know more about a specific feature, you can check the associated documentation page.

### PubSub

TellThem supports PubSub communication.

In a PubSub system, all subscribers are notified when a message is published.

![PubSub](content/docs/pub_sub.webp)

### Point to Point

TellThem supports Point to Point communication, also called Message Queue.

In a Point to Point system, only one subscriber is notified when a message is published, it works like a queue.

![Point to Point](content/docs/point_to_point.webp)

### Lot of drivers

Lot of drivers are available: Redis, In-memory, AMQP, MQTT. (Kafka planned)

If you don't find the driver you need, you can easily [create your own driver](/docs/custom-driver).

### Retry queue

Retry queue is a queue that will retry a message if it fails to be published. For example if your AMQP server is down, the message will be retried.


### Typesafe channels

Channels are typed using the encoder system. You can validate your messages before publishing/receiving them.

## Credits

This library is inspired by [`@boringnode/bus`](https://www.npmjs.com/package/@boringnode/bus).
