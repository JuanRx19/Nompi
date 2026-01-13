# Nompi (Frontend + Backend)

Este repositorio contiene una app SPA (frontend) y una API (backend) para un flujo de compra de un producto con proceso de pago, captura de datos del cliente y entrega, actualización de stock y visualización del resultado.

La solución está separada en dos proyectos independientes para facilitar:

- Despliegue independiente (frontend estático vs backend con DB).
- Ciclos de desarrollo aislados (Vite/React vs Nest/Prisma).
- Pruebas y cobertura por proyecto.

## Estructura

- [backend-nompi/](backend-nompi/README.md): API NestJS + Prisma + Postgres.
- [frontend-nompi/](frontend-nompi/README.md): SPA Vite + React + Redux.

## Git flow

En este repositorio también trate de tener un añadido utilizando git flow para simular un flujo de trabajo real, creando los pull request para simularlos.

![Git flow](https://media2.dev.to/dynamic/image/width=1600,height=900,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fsqxc7kepfadqqkg6sgdn.png)

## Flujo de negocio (5 pasos)

1. **Product page**: ver producto y unidades disponibles.
2. **Pago + entrega**: capturar datos de pago (mock) y datos de entrega.
3. **Resumen**: mostrar amount + base fee + delivery fee.
4. **Estado final**: aprobado/declinado.
5. **Volver a producto**: stock actualizado.

## Decisión: dos botones (Pago vs Link)

En la UI se incluyeron **dos caminos** para demostrar el uso de la API de pagos y mantener el onboarding usable incluso cuando el proveedor de pagos en sandbox/terceros no estaba disponible para la cuenta en el momento del desarrollo.

- **Botón “Comprar / Pagar con tarjeta” (simulado)**
  - Permite ejecutar el flujo end-to-end sin dependencia del proveedor externo.
  - Se simula aprobación cuando el número de tarjeta es `4242 4242 4242 4242` (caso contrario: declina).
  - Importante: **no se persiste información sensible** de tarjeta; solo se usa para decidir aprobado/declinado.

- **Botón “Link de pago”**
  - Genera un link/URL de checkout (cuando el gateway externo está configurado).
  - Sirve para demostrar integración real cuando están disponibles llaves/ambiente.

Esta decisión se tomó para cumplir el objetivo del reto (demostrar integración y flujo), evitando quedar bloqueado por tiempos de habilitación/limitaciones externas.

## API / Endpoints

Los endpoints principales del backend están en `src/infrastructure/adapters/rest/`:

- `GET /products` (listar productos)
- `GET /products/:id` (detalle)
- `POST /customers` (crear cliente)
- `POST /transactions` (crear transacción)
- `POST /payments` (generar URL/link de pago)
- `GET /payments/:id` (consultar estado)
- `POST /payments/simulate` (simular pago con tarjeta)

Incluí una colección de Postman lista para importar:

- [postman/nompi.postman_collection.json](postman/nompi.postman_collection.json)

## Tests (Jest) y coverage (>80%)

- Backend: `npm run test:cov` (ver detalle en [backend-nompi/README.md](backend-nompi/README.md))
- Frontend: `npm run test:cov` (ver detalle en [frontend-nompi/README.md](frontend-nompi/README.md))

Ambos proyectos tienen umbral global mínimo de **80%** y reportan sus resultados en sus READMEs.

## Datos y persistencia

- Base de datos recomendada: **Postgres** (con Prisma).
- El repo incluye scripts de inicialización/seed para productos.
- La SPA guarda el progreso del checkout en estado (Redux) y persiste lo necesario en `localStorage` para recuperarse ante refresh.

## Infraestructura

- Backend incluye `Dockerfile` y `docker-compose.yml` (API + Postgres).
- Frontend es estático y puede desplegarse en cualquier hosting de SPA.

## CORS en producción

El backend permite configurar orígenes CORS con `CORS_ORIGINS`.

Ejemplo para permitir el frontend desplegado:

```env
CORS_ORIGINS="https://nompi.vercel.app/"
```

## Asistencia con IA

Durante el desarrollo se utilizó GitHub Copilot como asistente de programación (modelo GPT-5.2) para acelerar iteraciones de código, tests y documentación.
