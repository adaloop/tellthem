# Json (VineJS)

Encodes and decodes messages using simple JSON validated with [`VineJS`](https://github.com/vinejs/vine).

## Installation

```bash
npm install @vinejs/vine
```

## Usage

```ts
import vine from '@vinejs/vine'
import { vineJsonEncoder } from 'tellthem/encoders/vine'

const encoder = vineJsonEncoder({
  schema: vine.object({
    test: vine.string()
  })
})
```

## Options


| Option   | Description                        |
|----------|------------------------------------|
| `schema` | Schema used to validate your data. |
