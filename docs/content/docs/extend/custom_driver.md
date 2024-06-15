# Create a custom driver

You can extend TellThen with your own driver easily.

You will need to create a new class that implements the `Driver` interface that can be imported directly from `tellthem`.

```ts
export interface Driver {
  init: () => Promise<void>
  publish: <T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    message: ChannelMessage<T>
  ) => Promise<void>
  subscribe: <T extends Serializable>(
    channel: string,
    encoder: Encoder<T>,
    handler: ChannelMessageSubscribeHandler<T>,
    subscription: Subscription
  ) => Promise<void>
  unsubscribe: (target: string | Subscription) => Promise<void>
  disconnect: () => Promise<void>
  onReconnect: (callback: () => void) => void
}
```

Feel free to check inspirations from the existing drivers to create your own.

## Methods

### init

This method is called internally by TellThem when you use the driver for the first time in your app. It is used to initialize the driver. Usually you will initialize your driver in the constructor of your driver class but in some cases you need asynchronous initialisation.

### publish

This method is used to publish a message to a channel. First argument is the channel name, second is the encoder that will be used to encode the message and the third is the message itself.

### subscribe

This method is used to subscribe to a channel. First argument is the channel name, second is the encoder that will be used to decode the message and the third is the handler that will be called when a message is received.

### unsubscribe

This method is used to unsubscribe from a channel or a subscription. First argument is the target that will be unsubscribed from. If the target is a channel name, the method will unsubscribe from that channel. If the target is a subscription, the method will unsubscribe from that specific subscription.

### disconnect

This method is used to disconnect from the server.

### onReconnect

This method is used to register a callback that will be called when the connection is lost and the driver is trying to reconnect.
