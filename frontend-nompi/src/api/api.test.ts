import { ApiError, apiRequest } from './api';

describe('apiRequest', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('hace GET y retorna JSON cuando response ok', async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const fetchMock = jest.fn().mockResolvedValue(response);
    // @ts-expect-error override for test
    global.fetch = fetchMock;

    const result = await apiRequest<{ ok: boolean }>('https://example.test');
    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith('https://example.test',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('envía Content-Type JSON cuando hay body', async () => {
    const response = new Response(JSON.stringify({ id: 1 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const fetchMock = jest.fn().mockResolvedValue(response);
    // @ts-expect-error override for test
    global.fetch = fetchMock;

    await apiRequest<{ id: number }>('https://example.test', {
      method: 'POST',
      body: { a: 1 },
    });

    const [, options] = fetchMock.mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('lanza ApiError usando message del JSON cuando response no ok', async () => {
    const response = new Response(JSON.stringify({ message: 'Bad request' }), {
      status: 400,
      statusText: 'Bad Request',
      headers: { 'Content-Type': 'application/json' },
    });

    const fetchMock = jest.fn().mockResolvedValue(response);
    // @ts-expect-error override for test
    global.fetch = fetchMock;

    await expect(apiRequest('https://example.test')).rejects.toEqual(
      expect.objectContaining({ name: 'ApiError', status: 400, message: 'Bad request' }),
    );
  });

  it('lanza ApiError con mensaje por defecto cuando no hay JSON', async () => {
    const response = new Response('nope', {
      status: 500,
      statusText: 'Internal Server Error',
      headers: { 'Content-Type': 'text/plain' },
    });

    const fetchMock = jest.fn().mockResolvedValue(response);
    // @ts-expect-error override for test
    global.fetch = fetchMock;

    await expect(apiRequest('https://example.test')).rejects.toBeInstanceOf(ApiError);
    await expect(apiRequest('https://example.test')).rejects.toEqual(
      expect.objectContaining({ status: 500 }),
    );
  });
});
