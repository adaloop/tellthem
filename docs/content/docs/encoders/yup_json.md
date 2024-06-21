# Json (Yup)

Encodes and decodes messages using simple JSON validated with [`Yup`](https://github.com/jquense/yup).

## Installation

:::codegroup
```sh
// title: npm
npm install yup
```

```sh
// title: pnpm
pnpm add yup
```

```sh
// title: yarn
yarn add yup
```
:::

## Usage

```ts
import yup from 'yup'
import { yupJsonEncoder } from '@tbrul/tellthem/encoders/yup'

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
