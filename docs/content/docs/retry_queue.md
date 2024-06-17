# Retry Queue

The retry queue is a mechanism that allows you to retry a message that has failed to be published.

When a message fails to be published, it is added to the retry queue.

The retry queue is a FIFO queue, which means that the message that was added first will be the first to be retried.

To use the retry queue, you just need to configure it on each driver you need it on the manager.

```ts
const tellThem = new TellThem({
  buses: {
    memory: {
      driver: memory(),
      retryQueue: {
        enabled: true,
        maxSize: 20,
        retryInterval: '100ms'
      }
    },
  },
})
```

## Options

| Option          | Description                    | Default |
|-----------------|--------------------------------|---------|
| `enabled`       | Is the retry queue enabled.    | false   |
| `maxSize`       | The maximum size of the queue. | N/A     |
| `retryInterval` | The interval between retries.  | 1s      |
