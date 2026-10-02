# Senior Care Tunisia (v2)

Modern rebuild (v2.1) of the original PHP/MySQL site: **Next.js 15 + TypeScript + Tailwind 4 + Neon Postgres (Drizzle ORM)**, ready for Vercel.

**Everything you need is in [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md)**: deployment, database, admin guide and the maintenance playbook.

## 5-minute summary

```bash
npm install
cp .env.example .env.local     # fill in DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:push                # creates the tables
npm run db:seed                # creates services + your admin account
npm run dev                    # http://localhost:3000   (admin: /admin)
```

Deploy: push to GitHub → import in Vercel → add a Neon database in the **Storage** tab → set `AUTH_SECRET` → deploy.
