# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: produção
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app ./
EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
