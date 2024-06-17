# Type Safety

The type safety is a key feature of TellThem. It ensures that the messages are correctly typed and can be used in a type-safe way.

Type safety is achieved through the use of encoders.

We use validation libraries to ensure that the messages are correctly typed before they are sent or received. Currently, we support for the following validation libraries: [`zod`](https://github.com/colinhacks/zod), [`vinejs`](https://github.com/vinejs/vine), [`yup`](https://github.com/jquense/yup).

## Example

```ts
import { z } from 'zod'
import { zodJsonEncoder } from 'tellthem/encoders/zod'

export const channel = tellThem.channel({
  defaultBus: 'memory',
  name: 'channel',
  encoder: zodJsonEncoder({
    schema: z.object({
      name: z.string(),
    }),
  }),
})

await channel.subscribe((message) => {
  console.log(message.name) // Typed
})

await channel.publish({
  name: 'John', // Typed
})
```
