# Queuera

Queuera is a social media scheduling SaaS that lets users connect Facebook Pages, Instagram Business accounts, and LinkedIn profiles, then compose and schedule posts from a single dashboard. The backend handles authentication, encrypted token storage, and scheduled publishing via platform APIs; the frontend is a Next.js app for composing posts, managing accounts, and viewing scheduled and published content.

## Project structure

```
Queuera/
├── backend/     # Express API, MongoDB, Redis/BullMQ job queue
└── frontend/    # Next.js web application
```

Environment files are included and pre-configured:

- `backend/.env` — all backend variables
- `frontend/.env.local` — `NEXT_PUBLIC_API_URL`

No additional accounts or services need to be created before deploying.

## Run locally

**Backend** (port 3000):

```bash
cd backend
npm install
node src/server.js
```

**Frontend** (separate terminal):

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL shown in the terminal (typically `http://localhost:3000` or `http://localhost:3001` per `FRONTEND_URL` in `backend/.env`).

## Deploy to Koyeb

Deploy the backend first, then the frontend, then wire the URLs together.

### 1. Backend service

| Setting | Value |
|--------|--------|
| Type | Node.js |
| Root directory | `backend/` |
| Run command | `node src/server.js` |

In the Koyeb service **Environment variables** tab, add every variable from the included `backend/.env` file (same keys and values).

After deploy, note the public backend URL, e.g. `https://your-backend-name.koyeb.app`.

### 2. Frontend service

| Setting | Value |
|--------|--------|
| Type | Next.js |
| Root directory | `frontend/` |
| Build command | `npm run build` |
| Run command | `npm run build && npm start` |

Set environment variables:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | Backend Koyeb URL (no trailing slash), e.g. `https://your-backend-name.koyeb.app` |

Use the value from `frontend/.env.local` as a reference, replacing `localhost` with your live backend URL.

After deploy, note the public frontend URL, e.g. `https://your-frontend-name.koyeb.app`.

### 3. Link backend to frontend

On the **backend** Koyeb service, update:

| Variable | Value |
|----------|--------|
| `FRONTEND_URL` | Frontend Koyeb URL, e.g. `https://your-frontend-name.koyeb.app` |

Redeploy or restart the backend service so CORS and OAuth redirects use the live frontend URL.

## After deployment

Update OAuth redirect URIs to use the **live backend** URL (not localhost).

**Backend Koyeb environment variables:**

```
META_REDIRECT_URI=https://your-backend-name.koyeb.app/api/v1/auth/facebook/callback
LINKEDIN_REDIRECT_URI=https://your-backend-name.koyeb.app/api/v1/auth/linkedin/callback
```

**Platform developer consoles** (use the same URLs):

- **Meta App Dashboard** — Facebook Login → Valid OAuth Redirect URIs: set `META_REDIRECT_URI`
- **LinkedIn Developer App** — Auth → Redirect URLs: set `LINKEDIN_REDIRECT_URI`

Save changes in Koyeb and in both developer consoles before testing OAuth on production.
