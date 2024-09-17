# Create a custom encoder

You can extend TellThem with your own encoder easily.

You will need to create a new class that implements the `Encoder` interface that can be imported directly from `@adaloop/tellthem`.

```ts
export interface Encoder<T extends Serializable> {
  encode(message: ChannelMessage<T>): string
  decode(message: string): Promise<ChannelMessage<T> | null>
}
```

Feel free to check inspirations from the existing encoders to create your own.

## Methods

### encode

This method is used to encode a message. The first argument is the message itself.

### decode

This method is used to decode a message. The first argument is the encoded message itself.
