# Backend Nompi

API desarrollada con **NestJS + TypeScript + Prisma**. Provee endpoints para productos, clientes, transacciones y pagos (incluyendo simulación de pago).

## Requisitos

- Node.js (recomendado: 18+)
- npm

Opcional (recomendado):

- Docker + Docker Compose (para levantar Postgres y el backend)

## Instalación

```bash
npm install
```

## Variables de entorno

### Base de datos

La app usa Prisma y requiere `DATABASE_URL`.

Ejemplo (Postgres):

```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/nompi_db?schema=public"
```

### Integración de pagos (gateway)

Dependiendo del flujo que ejecutes, se usan:

```env
NOMPI_API_BASE_URL="https://..."
NOMPI_CHECKOUT_BASE_URL="https://..."
WOMPI_PRIVATE_KEY="..."
```

> Nota: para tests unitarios se mockean las llamadas; para ejecutar el flujo real debes configurar estas variables.

### CORS (frontend)

Por defecto el backend permite origen `http://localhost:5173` (Vite dev server).

Para producción, configura una lista de orígenes permitidos con:

```env
CORS_ORIGINS="https://tu-frontend.com,https://tu-preview.com"
```

## Ejecutar (local)

```bash
npm run start:dev
```

Por defecto escucha en `http://localhost:3000`.

## Ejecutar con Docker Compose (Postgres + backend)

El repo incluye un `docker-compose.yml` listo para levantar Postgres y el backend.

```bash
docker compose up --build
```

Esto expone:

- Backend: `http://localhost:3000`
- Postgres: `localhost:5432`

## Modelo de datos

El modelo de datos principal se compone de cuatro entidades:

- **Product**: catálogo de productos (precio, stock, descripción, borrado lógico).
- **Customer**: información básica del cliente (nombre completo, email, documento).
- **Transaction**: compra realizada por un cliente de un producto, con montos (amount, baseFee, deliveryFee, totalAmount), estado de la transacción e identificador opcional de la transacción en Wompi.
- **Delivery**: datos de envío asociados a una transacción (dirección, ciudad, teléfono, estado del envío).

Diagrama (ERD):

![Modelo de datos]([./modelo-datos.png](https://github.com/JuanRx19/Nompi/blob/main/backend-nompi/modelo_bd.png))

## Prisma (migraciones)

Comandos útiles:

```bash
npx prisma generate
npx prisma migrate dev
```

## Scripts

- `npm run build`: compila el backend
- `npm run start:dev`: desarrollo con watch
- `npm run start:prod`: producción (requiere build previo)

## API (alto nivel)

Los controladores principales están en `src/infrastructure/adapters/rest/` y exponen rutas para:

- Productos
- Clientes
- Transacciones
- Pagos (incluye `simulate`)

> Si necesitas que documentemos rutas exactas (paths + payloads) en este README, dímelo y lo agrego.

## Tests unitarios (Jest)

Ejecutar tests:

```bash
npm run test
```

Ejecutar tests con cobertura:

```bash
npm run test:cov
```

### Umbral mínimo

El umbral mínimo de coverage requerido (global) está configurado en **80%**.

### Resultados de cobertura

Resultados obtenidos el **2026-01-13** ejecutando `npm run test:cov -- --runInBand`:

- Statements: **97.18%**
- Branches: **81.15%**
- Functions: **91.25%**
- Lines: **96.85%**
