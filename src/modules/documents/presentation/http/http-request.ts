export interface HttpRequest<TBody = unknown, TQuery = Record<string, unknown>> {
  body?: TBody;
  query?: TQuery;
  params?: Record<string, string | undefined>;
  headers?: Record<string, string | undefined>;
}
