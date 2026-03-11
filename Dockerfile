FROM node:20-alpine AS base

WORKDIR /app

# Install deps (root + all workspaces for yarn)
COPY package.json yarn.lock turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN yarn install --frozen-lockfile

# Build API
RUN yarn workspace api build

EXPOSE 3000

CMD ["node", "apps/api/dist/main.js"]
