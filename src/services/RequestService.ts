import { parseAs } from "#/services/JsonService";

type FetchUrl = Exclude<Parameters<typeof fetch>[0], Request>;

// eslint-disable-next-line unicorn/name-replacements
type URLSearchParamsQuery = ConstructorParameters<typeof URLSearchParams>[0];

interface RequestOptions {
  method?: "GET" | "POST";
  url: FetchUrl;
  query?: URLSearchParamsQuery;
  body?: object;
  headers?: HeadersInit;
}

type ResponseProcessor<T> = (response: Response) => Promise<T | undefined>;

interface RequestResponse<T> {
  success: boolean;
  status: number;
  data?: T;
}

async function requestRaw<T>(
  options: RequestOptions,
  processor: ResponseProcessor<T>,
): Promise<RequestResponse<T>> {
  const url = new URL(
    options.url,
    typeof location === "undefined" ? "https://example.com" : location.origin,
  ).href;
  const urlQuery =
    options.query === undefined ? "" : `?${new URLSearchParams(options.query).toString()}`;

  const result = await fetch(url + urlQuery, {
    method: options.method ?? "GET",
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    headers: options.headers,
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
