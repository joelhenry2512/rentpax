# RentPax (MVP+) 

All-in-one property value, rent estimate, mortgage (PITI), break-even rent, cash flow, and affordability (DTI) analysis.

## Quick start
```bash
pnpm install   # or npm / yarn
cp .env.example .env.local
# add your RENTCAST_API_KEY and a local Postgres DATABASE_URL
pnpm prisma migrate dev --name init
pnpm dev
```

If `RENTCAST_API_KEY` is not set, the API returns mocked data so you can see the UI immediately.

## Environment
```
RENTCAST_API_KEY=your_key_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rentpax
NEXTAUTH_SECRET=devsecret_change_me
NEXTAUTH_URL=http://localhost:3000
```

## What’s new
- **Settings drawer**: sliders for Vacancy, Maintenance, Management
- **Scenario Compare**: quick 10%+PMI vs 20% vs Buydown snapshot
- **Auth scaffold (Credentials)** with Prisma + Postgres
- **Profile API** to save income to your account

## Scripts
- `pnpm prisma migrate dev` – sets up DB.
- `pnpm dev` – run app.

## Notes
- For production, replace Credentials with email magic link or OAuth and harden password policies.
- Finance math lives in `src/lib/finance.ts`.
- NextAuth route: `src/app/api/auth/[...nextauth]/route.ts`.
- Register route: `src/app/api/register/route.ts`.
- Profile save/get: `src/app/api/profile/route.ts`.
