# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Adicione o ARG para receber a variável do docker-compose
ARG NEXT_PUBLIC_API_URL

COPY . .
# O Next.js vai ler NEXT_PUBLIC_API_URL do ambiente durante o build
RUN npm run build

# Etapa 2: produção
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app ./
EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
