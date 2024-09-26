type ContextProvider<T> = (ctx: T) => T[keyof T];

class Context<T extends Object> {
  constructor(private providers: { [K in keyof T]: ContextProvider<T> }) {}

  create(): T {
    const f = Array.from(Object.entries(this.providers)).reduce((acc, [token, component]) => {
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

export default Context;
