# Drivers

Drivers are the way to communicate with the broker. They are responsible for sending and receiving messages.

Currently, we support for two different type of drivers: `PubSub` and `Point to Point`. You can find more information about each driver in their respective sections.

## PubSub

In a PubSub system, all subscribers are notified when a message is published.

![PubSub](content/docs/pub_sub.webp)

## Point to Point

In a Point to Point system, only one subscriber is notified when a message is published, it works like a queue.

![Point to Point](content/docs/point_to_point.webp) 
