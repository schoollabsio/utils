class ContextBuilder<T> {
  constructor(private builders: Map<any, any> = new Map()) {}

  add(token: keyof T, component: (ctx: T) => T[keyof T]): ContextBuilder<T> {
    if (this.builders.has(token)) {
      throw new Error(`Cannot overwrite existing token: ${String(token)}`);
    }
    this.builders.set(token, component);
    return this;
  }

  init(): T {
    const f = Array.from(this.builders.entries()).reduce((acc, [token, component]) => {
      Object.defineProperty(acc, token, {
        get: () => component(acc),
        enumerable: true,
        configurable: true,
      });
      return acc;
    }, {} as T);
    return f;
  }
}

export default ContextBuilder;
