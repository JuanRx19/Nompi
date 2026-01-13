#!/usr/bin/env sh
set -e

echo "🚀 Aplicando migraciones..."
npx prisma migrate deploy

echo "📦 Insertando productos (SQL)..."
psql "$DATABASE_URL" -f /backend-nompi/prisma/init-scripts/init-products.sql || true

echo "🏁 Iniciando aplicación Nest..."
npm run start:prod
