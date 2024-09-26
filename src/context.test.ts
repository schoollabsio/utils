import Context from "./context";

describe("Context", () => {
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

    const ctx = new Context<ExampleContext>({
      fetch: () => fetch,
      example: (ctx) => new MyService(ctx),
      settings: () => ({ something: 5 }),
    });

    const context = ctx.create();

    expect(context.fetch).toBe(fetch);
    expect(context.example).toBeInstanceOf(MyService);
    expect(context.settings.something).toBe(5);

    expect(context.example.getSomething()).toBe(5);
  });
});
