# Json (Yup)

Encodes and decodes messages using simple JSON validated with [`Yup`](https://github.com/jquense/yup).

## Installation

```bash
npm install yup
```

## Usage

```ts
import yup from 'yup'
import { yupJsonEncoder } from 'tellthem/encoders/yup'

const encoder = yupJsonEncoder({
  schema: yup.object({
    test: yup.string()
  })
})
```

## Options


| Option   | Description                        |
|----------|------------------------------------|
| `schema` | Schema used to validate your data. |
