# Json (VineJS)

Encodes and decodes messages using simple JSON validated with [`VineJS`](https://github.com/vinejs/vine).

## Installation

:::codegroup
```sh
// title: npm
npm install @vinejs/vine
```

```sh
// title: pnpm
pnpm add @vinejs/vine
```

```sh
// title: yarn
yarn add @vinejs/vine
```
:::

## Usage

```ts
import vine from '@vinejs/vine'
import { vineJsonEncoder } from '@tbrul/tellthem/encoders/vine'

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
