# Deployment Guide

Deploy the frontend to **Vercel**, backend to **Railway** or **Render**, and use **MongoDB Atlas** for the database.

---

## MongoDB Atlas

1. Create an account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **cluster** (free tier M0).
3. **Database Access** → Add user (username + password).
4. **Network Access** → Add IP (e.g. `0.0.0.0/0` for any IP, or your backend’s IP).
5. **Connect** → Drivers → copy the connection string, e.g.:
   ```txt
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
6. Replace `<password>` and `<dbname>` (e.g. `collab`). Use this as `MONGO_URI` for the API.

---

## Backend → Railway or Render

### Env vars

| Variable     | Description                          |
|-------------|--------------------------------------|
| `MONGO_URI` | MongoDB Atlas connection string      |
| `PORT`      | Port (Railway/Render set this)       |
| `REDIS_URL` | Redis URL (for Socket.io scaling)    |

### Railway

1. [railway.app](https://railway.app) → New Project.
2. **Deploy from GitHub** → select repo.
3. **Settings** → Root Directory: leave default (repo root) or set to repo root.
4. **Settings** → Build:
   - Build Command: `yarn install && yarn workspace api build`
   - Start Command: `node apps/api/dist/main.js`
   - (Or use the repo **Dockerfile** and set Docker as deploy method.)
5. **Variables**: add `MONGO_URI`, `REDIS_URL` (optional; add Redis from Railway or external).
6. Deploy. Copy the public URL (e.g. `https://your-api.up.railway.app`).

### Render

1. [render.com](https://render.com) → New → **Web Service**.
2. Connect repo.
3. **Build & deploy**:
   - Build Command: `yarn install && yarn workspace api build`
   - Start Command: `node apps/api/dist/main.js`
4. **Environment**: add `MONGO_URI`, `REDIS_URL` (optional; use Render Redis or external).
5. Deploy. Copy the service URL (e.g. `https://your-api.onrender.com`).

### Docker (Railway / Render)

You can use the repo **Dockerfile** instead:

- **Build**: Dockerfile (no extra build command).
- **Start**: default CMD runs `node apps/api/dist/main.js`.
- Set `MONGO_URI`, `REDIS_URL`, and `PORT` in the platform’s env.

---

## Frontend → Vercel

1. [vercel.com](https://vercel.com) → Add New Project → import repo.
2. **Configure**:
   - **Root Directory**: `apps/web` (important).
   - Framework: Next.js (auto).
   - Build Command: `yarn build` (runs in `apps/web`; `vercel.json` runs install from repo root).
3. **Environment variables** (Production / Preview):

   | Variable                 | Value                          |
   |--------------------------|---------------------------------|
   | `NEXT_PUBLIC_API_URL`    | Backend API URL (no trailing /)  |
   | `NEXT_PUBLIC_WS_URL`     | Backend URL for WebSockets      |

   Example if backend is `https://your-api.onrender.com`:

   - `NEXT_PUBLIC_API_URL` = `https://your-api.onrender.com`
   - `NEXT_PUBLIC_WS_URL`  = `https://your-api.onrender.com`

4. Deploy. Use the Vercel URL as the app URL.

---

## Checklist

- [ ] MongoDB Atlas cluster + user + connection string → `MONGO_URI`.
- [ ] Backend on Railway or Render with `MONGO_URI`, `PORT`, and optional `REDIS_URL`.
- [ ] Backend URL (HTTPS) copied.
- [ ] Vercel project with Root = `apps/web`, `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` set to backend URL.
- [ ] CORS on the backend allows the Vercel domain (e.g. `https://*.vercel.app` or your custom domain).

---

## CORS (if needed)

If the frontend domain is different from the backend, ensure the NestJS API allows it. In the API, CORS is often enabled in `main.ts` (e.g. `app.enableCors({ origin: process.env.CORS_ORIGIN || '*' })`). For production, set `CORS_ORIGIN` to your Vercel URL or a comma-separated list of allowed origins.
