import { parseAs } from "#/services/JsonService";

type FetchUrl = Exclude<Parameters<typeof fetch>[0], Request>;

type URLSearchParamsQuery = ConstructorParameters<typeof URLSearchParams>[0];

export interface RequestOptions extends Omit<RequestInit, "body"> {
  url: FetchUrl;
  query?: URLSearchParamsQuery;
  body?: object;
}

type ResponseProcessor<T> = (response: Response) => Promise<T | undefined>;

export interface RequestResponse<T> {
  success: boolean;
  status: number;
  data?: T;
}

async function requestRaw<T>(
  options: RequestOptions,
  processor: ResponseProcessor<T>,
): Promise<RequestResponse<T>> {
  const { url, query, body, ...initOptions } = options;

  const fetchLocation = typeof location === "undefined" ? "https://example.com" : location.origin;
  const fetchUrl = new URL(url, fetchLocation).href;
  const fetchQuery = query === undefined ? "" : `?${new URLSearchParams(query).toString()}`;

  const result = await fetch(fetchUrl + fetchQuery, {
    method: options.method ?? "GET",
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: options.headers,
    ...initOptions,
  });

  return {
    success: result.ok,
    status: result.status,
    data: await processor(result),
  };
}

async function processorJSON<T>(response: Response) {
  return parseAs<T | undefined>(await response.text());
}

export async function request<T>(options: RequestOptions) {
  return requestRaw<T>(options, processorJSON);
}

async function processorText(response: Response) {
  return response.text();
}

export async function requestText(options: RequestOptions) {
  return requestRaw<string>(options, processorText);
}
