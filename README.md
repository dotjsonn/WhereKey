# WhereKey

WhereKey tracks shared physical keys. Users can register, log in, borrow available keys, return them, and view their borrowing history.

The backend uses Node.js, Express, PostgreSQL, and node-pg-migrate. Passwords are hashed with bcrypt, and authentication uses a JWT stored in an HTTP-only cookie. Express also serves the React build from `server/public`.

## Local setup

From the project root:

```bash
cd server
npm ci --include=dev
cp .env.example .env
```

Set these values in `server/.env`:

- `DATABASE_URL`: your PostgreSQL connection URL.
- `JWT_SECRET`: a long random secret used to sign tokens.
- `APP_ORIGIN`: `http://localhost:3001` when using the frontend served by Express, or `http://localhost:5173` when using Vite.

Create the tables and start the server:

```bash
npm run db:migrate -- up
npm start
```

Run [server/seeds/keys.sql](server/seeds/keys.sql) against the same database using a PostgreSQL client or Neon's SQL Editor to add eight sample keys.

Open `http://localhost:3001` to use the included frontend build. For deployment, set `NODE_ENV=production` and set `APP_ORIGIN` to the app's exact public HTTPS origin without a trailing slash.

## API endpoints

Send request bodies as JSON. Protected endpoints require the `token` cookie set by login.

| Method | Endpoint | Login required | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Check that the server is running. |
| POST | `/api/auth/register` | No | Create an account. |
| POST | `/api/auth/login` | No | Log in and set the authentication cookie. |
| POST | `/api/auth/logout` | No | Clear the authentication cookie. |
| GET | `/api/auth/me` | Yes | Get the current user's ID and email. |
| GET | `/api/keys` | Yes | List keys with availability and whether the current user borrowed them. |
| POST | `/api/checkouts` | Yes | Borrow an available key. |
| PATCH | `/api/checkouts/:id/return` | Yes | Return a checkout belonging to the current user. |
| GET | `/api/checkouts/me` | Yes | Get the current user's borrowing history, newest first. |

Register and login accept:

```json
{ "email": "user@example.com", "password": "your-password" }
```

Creating a checkout accepts a numeric key ID:

```json
{ "keyId": 1 }
```

The return endpoint uses the **checkout ID**, not the key ID, and requires no request body.

POST and PATCH requests are checked against `APP_ORIGIN` using the `Origin` header, or the `Referer` origin if `Origin` is absent. This applies to registration, login, and logout too.

API handler errors return `{ "error": "message" }`. Common statuses are `400` for invalid input, `401` for missing or expired authentication, `403` for rejected origins or returning another user's checkout, `404` for missing resources, and `409` for duplicate accounts or checkout conflicts.

## Database

- `users`: accounts and password hashes.
- `keys`: key codes, names, and locations.
- `checkouts`: borrowing and return timestamps linked to users and keys.

A partial unique index allows only one checkout with `returned_at IS NULL` per key, preventing two users from borrowing the same key at once.
