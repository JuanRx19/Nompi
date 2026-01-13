import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_ENV__: JSON.stringify({
        VITE_API_BASE_URL: env.VITE_API_BASE_URL,
        VITE_FRONT_BASE_URL: env.VITE_FRONT_BASE_URL,
      }),
    },
  };
});
