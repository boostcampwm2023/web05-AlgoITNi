export default class Observer {
  observers: Set<() => void>;

  constructor() {
    this.observers = new Set();
  }

  subscribe(func: () => void) {
    this.observers.add(func);
  }

  notify() {
    this.observers.forEach((func) => func());
  }
}
