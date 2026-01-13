# Usa una imagen oficial de Node con Debian slim (mejor compatibilidad con Prisma)
FROM node:20.19-slim

WORKDIR /backend-nompi

RUN apt-get update -y && \
    apt-get install -y openssl postgresql-client && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

CMD ["/entrypoint.sh"]
