class Batch {
    constructor(batch){
        this.data = batch;
        this.next = null;
        this.prev = null;
    }
}

class Messages {
  constructor() {
      this.head = null;
      this.tail = null;
      this.batchSize = 20;
  }

  prependMessages(olderMessages) {
      const newBatch = new Batch(olderMessages);
      if (!this.head) {
          this.head = newBatch;
          this.tail = newBatch;
      } else {
          newBatch.next = this.head;
          this.head.prev = newBatch;
          this.head = newBatch;
      }
  }

  appendMessages(message) {
      if (!this.tail) {
          this.tail = new Batch([message]);
          this.head = this.tail;
      } else if (this.tail.data.length < this.batchSize) {
          this.tail.data.push(message);
      } else {
          const newBatch = new Batch([message]);
          newBatch.prev = this.tail;
          this.tail.next = newBatch;
          this.tail = newBatch;
      }
  }

  getAllMessages() {
      let messages = [];
      let currentBatch = this.head;
      while (currentBatch) {
          messages = [...messages, ...currentBatch.data];
          currentBatch = currentBatch.next;
      }
      return messages;
  }
}

export default Messages;