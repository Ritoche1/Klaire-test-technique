# Builder stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY nest-cli.json ./

COPY src/ ./src/

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --no-cache && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN mkdir -p /data && \
    chown -R node:node /data

# Utilisateur non-root pour plus de sécurité
USER node

ENV NODE_ENV=production
ENV TYPEORM_CONNECTION=sqlite
ENV TYPEORM_DATABASE=/data/db.sqlite
ENV PORT=8000

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/api || exit 1

LABEL maintainer="Antoine Descamps"
LABEL version="1.0"
LABEL description="API d'Adresses et Risques - Test Technique Klaire"

CMD ["node", "dist/main"]