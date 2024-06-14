# Json (Zod)

Encodes and decodes messages using simple JSON validated with [`Zod`](https://github.com/colinhacks/zod).

## Installation

```bash
npm install zod
```

## Usage

```ts
import { z } from "zod";
import { zodJsonEncoder } from 'tellthem/encoders/zod'

const encoder = zodJsonEncoder({
  schema: z.object({
    test: z.string()
  })
})
```

## Options


| Option   | Description                        |
|----------|------------------------------------|
| `schema` | Schema used to validate your data. |
