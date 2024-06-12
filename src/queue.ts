export class Queue<T> {
  #queue: T[] = []

  enqueue(item: T) {
    this.#queue.push(item)
  }

  dequeue() {
    return this.#queue.shift()
  }

  isEmpty() {
    return this.#queue.length === 0
  }

  size() {
    return this.#queue.length
  }
}
