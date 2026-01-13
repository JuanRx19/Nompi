#!/usr/bin/env sh
set -e

echo "�🚀 Aplicando migraciones..."
npx prisma migrate deploy

echo "📦 Insertando productos..."
export PGPASSWORD=1234
psql -h postgres -U postgres -d nompi_db -f /backend-nompi/prisma/init-scripts/init-products.sql || true

echo "🏁 Iniciando aplicación Nest..."
npm run start:prod
