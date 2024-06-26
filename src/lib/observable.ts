export class ObservableEvent<T = any> {
  constructor(public name: string, public data: T) {}
}
export type Observer<T> = (data: T) => unknown;

export class Observable<T> {
  constructor(private observers: Map<string, Set<Observer<T>>> = new Map()) {}

  subscribe(eventName: string, listener: Observer<T>) {
    if (!this.observers.has(eventName)) {
      this.observers.set(eventName, new Set());
    }
    (this.observers.get(eventName) as Set<Observer<T>>).add(listener);
    return () => {
      this.unsubscribe(eventName, listener);
    };
  }

  unsubscribe(eventName?: string, listener?: Observer<T>) {
    if (eventName) {
      if (listener) {
        this.observers.get(eventName)?.delete(listener);
      } else {
        this.observers.delete(eventName);
      }
    } else {
      this.observers.clear();
    }
  }

  notify(eventName: string, data: T) {
    if (this.observers.has(eventName))
      [...(this.observers.get(eventName) as Set<Observer<T>>)].forEach(
        (observer) => observer(data)
      );
  }
}
