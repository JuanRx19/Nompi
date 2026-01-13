import { getEnv } from './env';

describe('getEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('lee valores desde process.env (modo Jest)', () => {
    process.env.VITE_API_BASE_URL = 'http://localhost:3000';
    expect(getEnv('VITE_API_BASE_URL')).toBe('http://localhost:3000');
  });

  it('retorna undefined si no existe', () => {
    delete process.env.VITE_FRONT_BASE_URL;
    expect(getEnv('VITE_FRONT_BASE_URL')).toBeUndefined();
  });
});
