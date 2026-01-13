/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_FRONT_BASE_URL?: string;
}

interface ImportMeta {
  readonly env?: ImportMetaEnv;
}

declare const __APP_ENV__: {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_FRONT_BASE_URL?: string;
};
