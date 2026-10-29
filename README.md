# PortfolioOS

A multi-user portfolio platform. The owner's portfolio is the home page; anyone can request their own,
and once the owner approves, they get an access key to edit it from the browser.

| Page | What it is |
| --- | --- |
| `/` | The owner's portfolio |
| `/demo` | An example portfolio, with a link to request your own |
| `/join` | Request a portfolio |
| `/login` | Log in with email + access key |
| `/studio` | Edit your portfolio (the owner also reviews requests here) |
| `/p/:slug` | A member's public portfolio |

## Tech

- **server/**: Node.js, Express, TypeScript, Prisma 7, PostgreSQL (Neon), JWT, bcrypt, Zod, Helmet, rate limiting
- **client/**: React 19, TypeScript, Vite, React Router

## How access works

1. A visitor submits `/join` with their name, email and page address.
2. The owner opens Studio → **Access** and clicks **Approve**.
3. The server creates the account, copies the example portfolio into it, and returns an access key **once**.
   Only a bcrypt hash of the key is stored.
4. The owner sends the key; the member logs in at `/login` and edits their page.

## Run locally

```bash
# 1. Server
cd server
cp .env.example .env          # fill in DATABASE_URL (Neon), JWT_SECRET, OWNER_EMAIL, OWNER_SLUG
npm install
npm run db:migrate            # creates the tables
npm run db:seed               # creates the owner + demo portfolios, prints the owner access key
npm run dev                   # http://localhost:5000/api/health

# 2. Client (new terminal)
cd client
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # http://localhost:5173
```

Lost the owner key? `cd server && npm run db:seed -- --reset` prints a new one.

## Deploy

- **Server → Render**: root `server`, build `npm install && npm run build`, start `npm start`
  (runs migrations, then the API). Env: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_ORIGIN`.
- **Client → Vercel**: root `client`, env `VITE_API_URL=https://<your-api>.onrender.com/api`.

## API

| Method | Route | Who |
| --- | --- | --- |
| GET | `/api/health` | anyone |
| GET | `/api/portfolio`, `/api/portfolio/:slug` | anyone |
| POST | `/api/portfolio/:slug/contact` | anyone (rate-limited) |
| POST | `/api/access-requests` | anyone (rate-limited) |
| POST | `/api/auth/login`, GET `/api/auth/me` | anyone / logged in |
| GET, PUT | `/api/me/portfolio`, `/api/me/profile`, `/api/me/projects`, `/skills`, `/experiences`, `/certificates` | logged in |
| GET, PATCH, DELETE | `/api/me/messages` | logged in |
| GET, POST, DELETE | `/api/admin/requests`, `/api/admin/members` | owner only |
