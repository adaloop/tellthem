# Subscriptions

When you subscribe to a channel, you create a subscription that listens for messages on that channel.

This subscription can be used for different purposes, such as handling errors and unsubscribing from the channel.

## Get the subscription

```ts
const subscription = await channel.subscribe((message) => {
  console.log(message)
})
```

## Unsubscribe

:::warning
Some drivers may not support unsubscribing from a specific subscription.
:::

You can unsubscribe a specific subscription by using the `unsubscribe` method.

```ts
await subscription.unsubscribe()
```

## Error handling

You can handle errors that occur when you receive a message by using the `onFail` method.

The method is called when an error occurs when the encoder failed to decode the message, or during the subscription creation.

```ts
subscription.onFail((error) => {
  console.error(error)
})
```
