import Observer from '@/utils/Observer';

export interface StreamObject {
  id: string;
  stream: MediaStream;
}

export class StreamModel extends Observer {
  streams: StreamObject[];

  constructor() {
    super();
    this.streams = [];
  }

  getStream() {
    return [...this.streams];
  }

  addStream(stream: StreamObject) {
    this.streams.push(stream);
    this.notify();
  }

  removeStream(id: string) {
    this.streams = this.streams.filter((stream) => stream.id !== id);
    this.notify();
  }
}

export const streamModel = new StreamModel();
