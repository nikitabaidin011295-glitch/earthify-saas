# Earthify — Модульна SaaS платформа

## Деплой на Railway (API)

1. New Project → Deploy from GitHub → вибери репо
2. Клікни на сервіс → **Settings → Root Directory** → `services/api`
3. Додай PostgreSQL і Redis сервіси
4. Variables → додай всі з `.env.example`
5. Перевір що `railway.toml` є в `services/api/`

## Деплой на Vercel (Frontend)

1. New Project → Import GitHub repo
2. **Root Directory** → `apps/web`
3. Environment Variables → `NEXT_PUBLIC_API_URL=https://your-api.up.railway.app`

## API Endpoints

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/guests
GET  /api/hotel/bookings
GET  /api/spa/appointments
GET  /api/pool/memberships
GET  /api/restaurant/orders
GET  /api/inbox
GET  /api/analytics/dashboard
GET  /api/settings
```
