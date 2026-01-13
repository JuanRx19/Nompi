# Frontend Nompi

Aplicación web (Vite + React + TypeScript) para navegar productos y simular un flujo de compra/pago contra el backend.

## Requisitos

- Node.js (recomendado: 18+)
- npm

## Instalación

```bash
npm install
```

## Variables de entorno

Este frontend usa variables con prefijo `VITE_`.

1) Crea un archivo `.env` (o `.env.local`) en la raíz de `frontend-nompi/`.

2) Usa `.env.example` como guía:

```env
VITE_API_BASE_URL=http://localhost:3000

# URL base del frontend (para redirect_url)
VITE_FRONT_BASE_URL=http://localhost:5173
```

**Notas**

- `VITE_API_BASE_URL` debe apuntar al backend (por defecto `http://localhost:3000`).
- `VITE_FRONT_BASE_URL` se usa para construir la `redirect_url` (si no existe, se usa `window.location.origin`).

## Ejecutar en desarrollo

```bash
npm run dev
```

## Build (producción)

```bash
npm run build
```

Para previsualizar el build:

```bash
npm run preview
```

## Calidad (lint)

```bash
npm run lint
```

## Tests unitarios (Jest)

Ejecutar tests:

```bash
npm run test
```

Ejecutar tests en modo watch:

```bash
npm run test:watch
```

Ejecutar tests con cobertura:

```bash
npm run test:cov
```

### Umbral mínimo

El umbral mínimo de coverage requerido (global) está configurado en **80%**.

### Resultados de cobertura

Resultados obtenidos el **2026-01-13** ejecutando `npm run test:cov`:

- Statements: **85.94%**
- Branches: **80.68%**
- Functions: **86.51%**
- Lines: **92.11%**

## Estructura (alto nivel)

- `src/api/`: cliente HTTP, lectura de env y servicios API
- `src/components/`: componentes UI
- `src/features/checkout/`: estado de checkout (Redux Toolkit)
- `src/pages/`: páginas principales del flujo
