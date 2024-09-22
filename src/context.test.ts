import ContextBuilder from "./context";

describe("ContextBuilder", () => {
  it("should initialize and retrieve various services correctly", () => {
    class MyService {
      constructor(
        private context: {
          settings: {
            something: number;
          };
        }
      ) {}

      getSomething() {
        return this.context.settings.something;
      }
    }

    interface ExampleContext {
      fetch: typeof fetch;
      example: MyService;
      settings: {
        something: 5;
      };
    }

    const builder = new ContextBuilder<ExampleContext>();

    builder.add("fetch", () => fetch);
    builder.add("example", (ctx) => new MyService(ctx));
    builder.add("settings", () => ({ something: 5 }));

    const context = builder.init();

    expect(context.fetch).toBe(fetch);
    expect(context.example).toBeInstanceOf(MyService);
    expect(context.settings.something).toBe(5);

    expect(context.example.getSomething()).toBe(5);
  });

  it("should throw an error when trying to fetch a service that was never added", () => {
    interface ExampleContext {
      fetch: typeof fetch;
      example: any;
    }

    const builder = new ContextBuilder<ExampleContext>();

    builder.add("fetch", () => fetch);

    const context = builder.init();

    expect(() => context.example).toThrow();
  });

  it("should throw an error when trying to add a duplicate token", () => {
    interface ExampleContext {
      fetch: typeof fetch;
    }

    const builder = new ContextBuilder<ExampleContext>();

    builder.add("fetch", () => fetch);

    expect(() => builder.add("fetch", () => fetch)).toThrowError(
      "Cannot overwrite existing token: fetch"
    );
  });
});
