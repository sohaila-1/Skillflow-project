# ──────────────────────────────────────────────
# Stage 1: deps — install only production deps
# ──────────────────────────────────────────────
FROM node:20.16.0-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ──────────────────────────────────────────────
# Stage 2: build — compile TypeScript
# ──────────────────────────────────────────────
FROM node:20.16.0-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ──────────────────────────────────────────────
# Stage 3: development — hot reload
# ──────────────────────────────────────────────
FROM node:20.16.0-alpine AS development
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]

# ──────────────────────────────────────────────
# Stage 4: production — minimal final image
# ──────────────────────────────────────────────
FROM node:20.16.0-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Only copy production deps and compiled output
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Non-root user for security
RUN addgroup -S skillflow && adduser -S skillflow -G skillflow
USER skillflow

EXPOSE 3000
CMD ["node", "dist/main"]
