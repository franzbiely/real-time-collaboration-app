# Real-Time Collaborative Notes

Monorepo for a real-time collaborative notes app.

## Structure

- **apps/web** – Next.js (App Router), React, TypeScript, TailwindCSS
- **apps/api** – NestJS, Socket.io, MongoDB (Mongoose)
- **packages/types** – Shared TypeScript types

## Setup

```bash
yarn install
yarn workspace @repo/types build
```

## Run

```bash
# Both apps (run in two terminals)
yarn dev:web   # http://localhost:3000
yarn dev:api   # http://localhost:3001 (API + WebSocket)
```

## Env

- **API**: Copy `apps/api/.env.example` to `apps/api/.env`. Set `MONGODB_URI` (default: `mongodb://localhost:27017/collab-notes`).

## Features (to build)

- Realtime collaborative editing
- Presence indicators
- Autosave
- Multiple notes
- Multiple users per note
