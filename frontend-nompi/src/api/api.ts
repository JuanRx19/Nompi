export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const tryParseJson = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return undefined;

  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

export const apiRequest = async <T>(url: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { method = 'GET', headers, body } = options;

  const response = await fetch(url, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await tryParseJson(response);

  if (!response.ok) {
    const message =
      isRecord(data) && typeof data.message === 'string'
        ? data.message
        : `Request failed: ${response.status} ${response.statusText}`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
};

export const apiGet = async <T>(url: string, headers?: Record<string, string>): Promise<T> =>
  apiRequest<T>(url, { method: 'GET', headers });

export const apiPost = async <T>(
  url: string,
  body: unknown,
  headers?: Record<string, string>,
): Promise<T> => apiRequest<T>(url, { method: 'POST', body, headers });
