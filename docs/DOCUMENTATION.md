# Senior Care Tunisia: Documentation & Maintenance Guide

Version 2.0 · Stack: Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Neon Postgres · Drizzle ORM · Vercel

> **How to use this document.** Part 1 explains what changed. Part 2 gets you live on Vercel. Parts 3 to 5 are your day-to-day manual. Part 6 is the maintenance playbook (monthly checklist, fixes, troubleshooting). Keep it in the repo so it travels with the code.

---

## Contents

1. [What changed and why](#1-what-changed-and-why)
2. [Deploy to Vercel (step by step)](#2-deploy-to-vercel-step-by-step)
3. [The database](#3-the-database)
4. [Using the admin panel](#4-using-the-admin-panel)
5. [How the code is organised](#5-how-the-code-is-organised)
6. [Maintenance playbook](#6-maintenance-playbook)
7. [Security and privacy](#7-security-and-privacy)
8. [Known limitations and roadmap](#8-known-limitations-and-roadmap)
9. [Moving your old MySQL data](#9-moving-your-old-mysql-data)

---

## 1. What changed and why

### Why a rewrite (not just an upload)
Vercel does not run PHP. The old site (`.php` files, `.htaccess` rewrites, MySQL on `localhost`) could not be deployed there as-is. The site was rebuilt in a stack Vercel runs natively, keeping **every page, every form field and all the original text**.

### Problems found in the original code (all fixed)

| # | Problem in the PHP version | Fix in v2 |
|---|---|---|
| 1 | **Admin login was fake**: one hard-coded email and password in the source, no session, and `dashboard.php` was reachable by URL without logging in | Real accounts in the database, bcrypt-hashed passwords, signed httpOnly session cookie, every admin page and action re-checks the session |
| 2 | **Public admin "Register" form** that looked like it created admin accounts | Removed. Admins are created only by you via `npm run db:seed` |
| 3 | Admin pages `dashboard`, `bookings`, `clients`, `financial_reports` were **empty files (0 bytes)** | Fully built (see Part 4) |
| 4 | Contact form posted to `send_contact.php`, **which didn't exist** | Working form, messages saved to the database and shown in admin |
| 5 | Two different `db.php` files with different column names (`first_name`/`location` vs `name`/`governorate`) | One schema, one source of truth (`src/lib/schema.ts`) |
| 6 | DB password empty, user `root`, credentials in source | Connection string in an environment variable only |
| 7 | CIN was the primary key and clients were matched by "email OR phone", so one person typing another's details could clash | Clients have their own ID; CIN is unique; each booking keeps its own contact snapshot |
| 8 | Prices were read from DB but there was no way to edit them | Admin page **Services & prices** |
| 9 | Hard-coded `/seniorcare/` paths and `404.php` that didn't exist | Clean routing and a real 404 page |
| 10 | No spam protection, thin validation | Server-side validation (Zod) + hidden honeypot field |

### Design
A dark "night shift" aurora-and-grid look with glass panels, a heartbeat line as the one signature animation, and a light, calm body for reading. Typefaces: **Sora** (headings) and **Atkinson Hyperlegible Next** (body, made for readability, which suits an audience of seniors and their families). Animations respect the "reduce motion" setting; everything is keyboard-accessible and responsive.

---

## 2. Deploy to Vercel (step by step)

You need: a free [GitHub](https://github.com) account and a free [Vercel](https://vercel.com) account. Node.js 20+ on your computer is only needed for steps 2.3 and 2.4.

### 2.1 Put the code on GitHub
1. Unzip `senior-care-vercel.zip`.
2. On GitHub create a **new private repository** (e.g. `senior-care`).
3. In the unzipped folder:
   ```bash
   git init
   git add .
   git commit -m "Senior Care v2"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/senior-care.git
   git push -u origin main
   ```
   (`.env.local` and `node_modules` are git-ignored, so no secrets are uploaded.)

### 2.2 Import into Vercel and add the database
1. Vercel dashboard → **Add New… → Project** → pick the repo → **Import**. Framework is detected as Next.js. Don't deploy yet, or deploy and expect the first build to work without a database (the public site falls back to built-in services).
2. Open the project → **Storage** tab → **Create Database** → choose **Neon (Postgres)** → pick the **Frankfurt (eu-central-1)** region (closest to Tunisia; `vercel.json` already runs functions in `fra1`) → **Connect Project**, and tick Production, Preview and Development.
3. Vercel injects `DATABASE_URL` (and a few related variables) automatically. Check under **Settings → Environment Variables**.

### 2.3 Add the secret
Settings → Environment Variables → add:

| Name | Value |
|---|---|
| `AUTH_SECRET` | a long random string. Generate with `openssl rand -base64 32` (or any password generator, 32+ chars) |
| `NEXT_PUBLIC_SITE_URL` | your final URL, e.g. `https://senior-care.vercel.app` or your own domain (used for SEO/sitemap) |

Do **not** put `ADMIN_PASSWORD` on Vercel; it's only needed once, locally (next step).

### 2.4 Create the tables and your admin account (one time)
This runs on your computer, against the Neon database:
```bash
npm install
npx vercel login && npx vercel link        # links this folder to your Vercel project
npx vercel env pull .env.local             # downloads DATABASE_URL into .env.local
```
Now add two lines to `.env.local` (this file is never committed):
```
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="a-strong-password-of-12+-characters"
```
Then:
```bash
npm run db:push     # creates the tables in Neon
npm run db:seed     # inserts the 6 services and your admin account
```
> No terminal? Open the Neon SQL Editor (Storage → your DB → *Open in Neon*), paste the contents of `db/schema.sql`, run it, then insert your services from the admin page later. An admin account needs the seed script because the password must be hashed.

### 2.5 Deploy and verify
1. Vercel → **Deployments → Redeploy** (or push any commit).
2. Visit `https://YOUR-SITE/api/health`. You should see `{"ok":true,"db":"up"}`.
3. Visit `/admin` → sign in with the email/password from step 2.4.
4. Go to **Services & prices** and **set your real prices** (the seeded ones are placeholders).
5. Make a test booking from `/booking`, find it in **Bookings**, then set it to *cancelled*.

### 2.5b Custom domain
Project → **Settings → Domains** → add your domain and follow the DNS instructions. Then update `NEXT_PUBLIC_SITE_URL` and redeploy.

### Every future update
Edit code → `git push` → Vercel builds and deploys automatically. Every branch/pull request also gets its own preview URL.

---

## 3. The database

Hosted on **Neon** (serverless Postgres). The code talks to it over HTTPS through Drizzle ORM, which suits Vercel's serverless functions. The structure is defined in `src/lib/schema.ts` (and mirrored in `db/schema.sql`).

### Tables

```
services ──┐                     clients
 id         │                     id (uuid)
 slug  (unique)                   cin (unique)       ← national ID, sensitive
 name                             full_name, email, phone
 description                      governorate, address
 price_tnd                        created_at
 duration_minutes                     │
 active, sort_order                   │
            │                         │
            └────────► bookings ◄─────┘
                        id (uuid)
                        reference (unique, e.g. SC-7K2M9Q)
                        client_id → clients, service_id → services
                        price_tnd          ← price frozen at booking time
                        booking_date, booking_time
                        status: pending | confirmed | completed | cancelled
                        notes, governorate, address
                        contact_phone, contact_email   ← snapshot for that booking
                        created_at, updated_at

contact_messages: id, name, email, phone, message, handled, created_at
admin_users:      id, email (unique), name, password_hash (bcrypt), created_at
```

### Design decisions worth knowing
- **Price is copied onto each booking.** Raising a price tomorrow never changes last month's revenue report.
- **Contact details are copied onto each booking.** A public form can't be used to overwrite an existing client's profile by typing their CIN.
- **Services are hidden, not deleted** (untick *Visible*). Old bookings keep pointing to them.
- **Status values** are a fixed list in the database, so typos are impossible.

### Changing the database structure later
1. Edit `src/lib/schema.ts` (e.g. add `age` to `clients`).
2. Run `npm run db:push`. Drizzle compares and applies the change.
3. Update the code that uses the field, `git push`.

> Always make a **Neon branch** (a free instant copy) before structural changes: Neon console → Branches → *Create branch*. If something goes wrong, point `DATABASE_URL` back at the original.
> `db:push` is perfect for a project of this size. If you later have several developers, switch to `drizzle-kit generate` + `migrate` for versioned migration files.

### Backups
Neon keeps a point-in-time history window that depends on your Neon plan (check the current limits in the Neon console). Independently of that, use **Bookings → Export CSV** regularly (see the checklist in Part 6). It's your off-platform backup.

---

## 4. Using the admin panel

Go to `/admin` (it is not linked from the public site on purpose).

| Page | What it does |
|---|---|
| **Dashboard** | Pending requests, upcoming confirmed visits, revenue (completed), pipeline (pending + confirmed), clients, unhandled messages, latest 6 bookings |
| **Bookings** | Search by reference, name, phone or CIN; filter by status; call or email the client with one tap; **change status**; **Export CSV** (opens in Excel) |
| **Clients** | Everyone who has booked, with number of bookings and amount paid |
| **Financial reports** | Revenue by month (last 12), by service, by governorate. Only **completed** bookings count |
| **Messages** | Contact-form messages; mark as handled |
| **Services & prices** | Edit price (TND), duration, and visibility of each service. Changes appear on the public site within about a minute |

### Recommended daily workflow
1. Open **Dashboard** → *Pending requests*.
2. In **Bookings** (filter: pending), call the client, then set the status to **confirmed**.
3. After the visit, set it to **completed**. That's what feeds the financial reports.
4. Cancelled requests: set to **cancelled**. Nothing is ever deleted, so history stays intact.
5. Check **Messages** and mark them handled once answered.

---

## 5. How the code is organised

```
senior-care/
├── db/schema.sql              SQL version of the schema (manual alternative to db:push)
├── docs/DOCUMENTATION.md      this file
├── public/images/             photos (hero, about, admin login)
├── scripts/seed.ts            creates services + admin (npm run db:seed)
├── src/
│   ├── middleware.ts          redirects /admin/* to login if there is no valid session
│   ├── app/
│   │   ├── layout.tsx         fonts, site-wide metadata/SEO
│   │   ├── globals.css        THE DESIGN: colours, aurora, glass, animations
│   │   ├── (site)/            public pages: page.tsx (home), about, services, booking, contact
│   │   ├── admin/
│   │   │   ├── login/         sign-in page
│   │   │   ├── (panel)/       dashboard, bookings, clients, reports, messages, services
│   │   │   └── actions.ts     server actions: login, logout, change status, edit service…
│   │   └── api/
│   │       ├── bookings/      POST: saves a booking
│   │       ├── contact/       POST: saves a message
│   │       ├── health/        GET: uptime check
│   │       └── admin/export/  GET: CSV (admin only)
│   ├── components/            header, footer, forms, cards, admin UI pieces
│   └── lib/
│       ├── schema.ts          ★ database structure
│       ├── db.ts              database connection
│       ├── queries.ts         all reading queries (dashboard, reports…)
│       ├── validation.ts      rules for form fields (Zod)
│       ├── auth.ts / session.ts   login sessions
│       └── constants.ts       governorates + default services
└── .env.example               list of environment variables
```

### Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | Vercel (auto) + `.env.local` | Neon connection string |
| `AUTH_SECRET` | Vercel + `.env.local` | Signs admin session cookies (32+ chars). Changing it logs everyone out |
| `NEXT_PUBLIC_SITE_URL` | Vercel | Public URL for sitemap/SEO |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | `.env.local` only | Used only by `npm run db:seed` |

### Resilience
If the database is down or not yet connected, the **public pages still load** with built-in service descriptions; only booking/contact submissions and the admin panel need the DB. Submissions then show a friendly error rather than crashing.

---

## 6. Maintenance playbook

### 6.1 Routine schedule

**Weekly (5 min)**
- Open `/api/health` → must say `"db":"up"`.
- Clear *Pending* bookings and *Unhandled* messages.

**Monthly (20 min)**
- **Bookings → Export CSV**, save it somewhere outside Vercel (Drive, external disk).
- Vercel → project → **Deployments**: any failed build? **Logs**: any repeated errors?
- Neon console: storage and compute usage still inside your plan?
- Run updates (6.3) and check that the site still builds.

**Every 6 to 12 months**
- Change `AUTH_SECRET` (everyone must sign in again) and admin passwords.
- Review who has admin access (6.4).

### 6.2 Common edits (where to change things)

| I want to… | Edit |
|---|---|
| Change a **service's price/visibility/duration** | Admin → Services & prices (no code) |
| Change a **service's name or description** | `src/lib/constants.ts` (`DEFAULT_SERVICES`) then `npm run db:seed` (text refreshes, prices are kept), or edit the row in Neon |
| Add a **new service** | Add an entry to `DEFAULT_SERVICES` (+ an icon in `src/components/service-icon.tsx`, optional) and run `npm run db:seed` |
| Change **homepage text** | `src/app/(site)/page.tsx` |
| Change **About text/values** | `src/app/(site)/about/page.tsx` |
| Change **colours** | `src/app/globals.css`, block `@theme { … }` at the top (e.g. `--color-pulse` is the aqua accent) |
| Change **photos** | Replace files in `public/images/` (keep the names, or update the `src=` in the pages) |
| Change footer / menu | `src/components/site-footer.tsx`, `site-header.tsx` |
| Add a **governorate / form field** | `src/lib/constants.ts`, `validation.ts`, `components/booking-form.tsx`, `schema.ts` (+ `npm run db:push`) and `app/api/bookings/route.ts` |
| Add a **new page** (e.g. FAQ) | Create `src/app/(site)/faq/page.tsx`, add a link in `site-header.tsx` and `sitemap.ts` |

After any edit: `git add . && git commit -m "what I changed" && git push` and Vercel deploys.
Test locally first with `npm run dev`.

### 6.3 Updating dependencies safely
```bash
npm outdated                 # see what's old
npm update                   # safe updates inside current major versions
npm run lint                 # TypeScript check
npm run build                # must succeed
```
Commit and push; Vercel gives you a **preview URL** for branches, so use a branch (`git checkout -b update-deps`) and open the preview before merging to `main`. Do **major** upgrades (e.g. Next 15 → 16) one at a time, reading the framework's upgrade guide. Run `npm audit` occasionally, and don't use `--force` blindly.

If a deployment breaks the site: Vercel → **Deployments** → open the last good one → **⋯ → Promote to Production** (instant rollback).

### 6.4 Admin accounts
- **Add or reset an admin password:** put the new `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local` and run `npm run db:seed`. An existing email gets its password replaced; a new email creates a new admin.
- **Remove an admin:** Neon SQL Editor → `DELETE FROM admin_users WHERE email = 'x@y.com';` (their current session still works until it expires, within 8h, or you rotate `AUTH_SECRET`).
- **Forgot everything:** run the seed again with a new password.

### 6.5 Troubleshooting

| Symptom | Likely cause → fix |
|---|---|
| `/api/health` says `"db":"down"` | `DATABASE_URL` missing/wrong in Vercel, or Neon project suspended/over quota. Check Settings → Environment Variables and the Neon console |
| Can't sign in: "database is unreachable" | Same as above |
| Can't sign in: "incorrect email or password" | Run `npm run db:seed` again with the right values. Emails are lower-cased |
| Redirected to login again and again | `AUTH_SECRET` missing or changed; set it in Vercel and redeploy. Check the browser accepts cookies |
| Booking form says "couldn't save your booking" | Tables not created (run `npm run db:push`) or services not seeded (`npm run db:seed`). Vercel → Logs shows `[POST /api/bookings]` with the real error |
| "Please choose another service" | The service is hidden or missing in the DB: Admin → Services & prices |
| Price change not visible on the site | Public pages refresh within ~60 s; hard-refresh the browser |
| Build fails on Vercel | Read the build log; run `npm run lint` and `npm run build` locally to reproduce |
| `db:push` can't connect | `.env.local` missing `DATABASE_URL`: run `npx vercel env pull .env.local` |
| Build log shows a warning about `CompressionStream` in `jose` | Harmless. It comes from a library module for encrypted tokens that this site doesn't use (it only signs them). Ignore it |
| Dates look off by a day | Dates are stored as plain dates; "today" is computed in the Africa/Tunis timezone |

Where to look: **Vercel → project → Logs** (runtime errors, filter by `/api/bookings`) and **Deployments** (build logs). Neon console → **Monitoring** and **SQL Editor** for data.

### 6.6 Working with an AI assistant on this project
When you ask for changes, give the assistant: this file, `src/lib/schema.ts`, and the file you want changed. Ask it to run `npm run lint` and `npm run build` before you deploy. Make changes on a git **branch** and check the Vercel preview before merging.

---

## 7. Security and privacy

**Already in place:** hashed passwords (bcrypt) · signed, httpOnly, secure, SameSite cookies, 8-hour sessions · defence in depth (middleware + a check in every admin page and action) · parameterised queries (no SQL injection) · server-side validation of every field · honeypot anti-bot field · no-store and noindex headers on `/admin` · security headers (nosniff, frame denial, referrer policy) · CSV export neutralises spreadsheet-formula injection · login response doesn't reveal whether an email exists.

**You should still do:**
1. **Rate-limit the login and forms.** In Vercel → project → **Firewall**, add a rate-limiting rule for `/admin/login` and `/api/*` (check current plan limits on Vercel's pricing page). This is the single most valuable extra protection against password guessing and spam.
2. Use a **long unique admin password** and don't share one account; create one per person.
3. **CIN is personal data.** It is collected to identify clients, so: only give admin access to people who need it; don't paste exports into chat tools or email; delete data you no longer need. Tunisia has a personal-data protection law (Law 63-2004, overseen by the INPDP), and a health-adjacent service should state what it collects and why. Consider adding a short privacy notice and a consent checkbox to the booking form, and take legal advice for your situation. This documentation is not legal advice.
4. Keep the GitHub repo **private**.
5. Never commit `.env.local` (it's git-ignored).

---

## 8. Known limitations and roadmap

Things deliberately **not** included, in suggested priority order:

1. **Email/SMS notifications.** Right now you learn about bookings by opening the admin. Easiest next step: add [Resend](https://resend.com) and send an email to staff and a confirmation to the client from `api/bookings/route.ts`.
2. **Real prices.** The seeded prices (30 to 80 TND) are *placeholders*; set yours in the admin before relying on any report. Prices are not shown publicly.
3. **No double-booking / caregiver scheduling.** Every request is just a request that you confirm by phone.
4. **Arabic and French.** Next.js supports internationalised routing; a natural addition for Tunisia.
5. **Client self-service** (look up a booking by reference number).
6. **Fine-grained admin roles** (read-only staff vs owner).
7. **Audit log** of who changed what.
8. **Automated tests** (Playwright for the booking flow).

---

## 9. Moving your old MySQL data

The original zip contained **no `.sql` file**, so the old table structure was inferred from the PHP code. If you have real data in the old MySQL database:

1. In phpMyAdmin export `clients`, `services` and `bookings` as **CSV**.
2. Mapping from old → new:

| Old (MySQL) | New (Postgres) |
|---|---|
| `clients.cin, email, tel, name + last_name, governorate, address` | `clients.cin, email, phone, full_name, governorate, address` |
| `services.service_name, price` | `services.name, price_tnd` (+ `slug`) |
| `bookings.cin → client`, `service_id`, `price`, `booking_date`, `booking_time`, `notes`, `governorate`, `address` | `bookings.client_id` (look up by CIN), `service_id`, `price_tnd`, same date/time/notes/governorate/address, plus a generated `reference`, `contact_phone`, `contact_email`, `status` (use `completed` for past ones) |
| `admin` | **Don't migrate.** Create admins with `npm run db:seed` |

3. Import with the Neon SQL Editor or ask your assistant to write a one-off import script (give it your CSV headers). Do it on a **Neon branch** first.

---

*End of document. Keep it updated: when you change how something works, change this file in the same commit.*
