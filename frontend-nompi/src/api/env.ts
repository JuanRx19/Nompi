type EnvKey = 'VITE_API_BASE_URL' | 'VITE_FRONT_BASE_URL';

export const getEnv = (key: EnvKey): string | undefined => {
  // En runtime (Vite), esto lo inyecta vite.config.ts via `define`.
  // En Jest (Node), esto no existe y caemos a process.env.
  if (typeof __APP_ENV__ !== 'undefined' && typeof __APP_ENV__[key] === 'string') {
    return __APP_ENV__[key];
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }

  return undefined;
};
