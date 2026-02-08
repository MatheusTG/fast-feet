# syntax=docker/dockerfile:1.18-labs

# -------- Production Builder --------
FROM node:24-alpine AS builder

RUN corepack enable pnpm && corepack install -g pnpm@10.28.2

WORKDIR /fast-feet

# Copy manifests 
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/
COPY --parents packages/*/package.json ./

# Install workspace deps
RUN pnpm install --frozen-lockfile

# Copy in only what the API needs
COPY apps/api apps/api
COPY packages packages

# Build the api (outputs to apps/api/dist)
RUN pnpm turbo run build --filter=@fast-feet/api

# Prune to runtime-only (dist + prod deps)
RUN pnpm -F @fast-feet/api deploy --prod /out



# -------- Production --------
FROM node:24-alpine AS prod 

WORKDIR /fast-feet

RUN apk add --no-cache curl

COPY --from=builder /out ./

CMD ["node", "dist/main"]



# -------- Dev (with hot reload) --------
FROM node:24-alpine AS dev

RUN apk add --no-cache curl

RUN corepack enable pnpm && corepack install -g pnpm@10.28.2

WORKDIR /fast-feet

CMD ["pnpm", "turbo", "run", "start:dev", "--filter=@fast-feet/api"]
