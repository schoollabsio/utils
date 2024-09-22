/** Request Transformers take a set of fetch arguments and
 * transforming them in some manner - such as adding headers.
 */
export interface RequestTransformer {
  match: (url: string, opts: RequestInit) => boolean;
  pre: (
    url: string,
    opts: RequestInit
  ) => Promise<{ url: string; opts: RequestInit }>;
}

export interface FetchContext {
  fetch: typeof fetch;
  transformers: RequestTransformer[];
}

export type Retrieve = (url: string, opts: RequestInit) => Promise<Response>;

// pass in global options to fetch
const ConfigureRetrieve = (context: FetchContext) => {
  return async (url: string, opts: RequestInit) => {
    // find the first transformer that matches the request
    const transformer = context.transformers.find((t) => t.match(url, opts));
    if (transformer) {
      const { url: newUrl, opts: newOpts } = await transformer.pre(url, opts);
      return context.fetch(newUrl, newOpts);
    }
    return context.fetch(url, opts);
  };
};

export default ConfigureRetrieve;
