# Dungeon Master AI - Railway Setup Guide

## Status
✅ Database schema designed and migrations generated
✅ Nuxt 4 app configured
⚠️ Pending: Railway service creation and deployment

## Prerequisites
- GitHub repo: `codecavear/dungeon-master-ai` ✅
- Railway project created: `dungeon-master` ✅
- PostgreSQL database needed

---

## Setup Steps

### 1. Add PostgreSQL Database in Railway

1. Go to [Railway Project: dungeon-master](https://railway.app/project/dungeon-master)
2. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
3. Railway will automatically create and configure the database

### 2. Create Nuxt Service

1. In the same project, click **"+ New"** → **"GitHub Repo"**
2. Select repository: `codecavear/dungeon-master-ai`
3. Railway will auto-detect it's a Nuxt app

**Build & Deploy Settings:**
- Build Command: `bun run build` (auto-detected)
- Start Command: `node .output/server/index.mjs` (auto-detected)
- Root Directory: `/` (default)

### 3. Configure Environment Variables

Add these variables to the Nuxt service (not the database):

#### Database Connection
Railway auto-provides these when you link the PostgreSQL service:
- `DATABASE_URL` → Reference from PostgreSQL service

#### Auth & Security
```bash
# Generate with: openssl rand -base64 32
NUXT_SESSION_PASSWORD=<generate-a-secure-32-char-key>
```

#### App Configuration
```bash
NUXT_PUBLIC_APP_URL=https://<your-domain>.up.railway.app
```

*Note: Railway will provide the domain after first deploy. Update this after deployment.*

#### AI Providers (Optional - for later)
```bash
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Link Database to Service

1. In the Nuxt service settings, go to **"Variables"** tab
2. Click **"+ New Variable"** → **"Reference"**
3. Select the PostgreSQL service → `DATABASE_URL`

Railway will automatically inject the connection string.

### 5. Deploy

**DO NOT use `railway up`** ❌

Instead:
1. Push changes to `master` branch on GitHub
2. Railway will auto-deploy on every push ✅

```bash
git add .
git commit -m "feat: Setup database schema and migrations"
git push origin master
```

### 6. Run Migrations

After first deploy, run migrations:

**Option A: Via Railway CLI (if you have access)**
```bash
railway run bun run db:migrate
```

**Option B: Via Nuxt Lifecycle Hook (Recommended)**

Migrations will run automatically on server startup via Nitro plugin.

Check if `server/plugins/migrate.ts` exists. If not, create it:

```typescript
// server/plugins/migrate.ts
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from '../db'

export default defineNitroPlugin(async () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Running database migrations...')
    try {
      await migrate(db, { migrationsFolder: 'server/db/migrations' })
      console.log('✅ Database migrations completed')
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    }
  }
})
```

### 7. Add Custom Domain (Optional)

1. In Railway service settings → **"Settings"** → **"Domains"**
2. Click **"+ Custom Domain"**
3. Enter domain: `dungeon.codecave.ar` (or similar)
4. Add DNS record in Cloudflare:
   - Type: `CNAME`
   - Name: `dungeon`
   - Target: `<railway-provided-domain>.up.railway.app`
   - Proxied: ✅ (orange cloud)

---

## Post-Deployment Checklist

- [ ] Service deployed successfully on Railway
- [ ] PostgreSQL database connected
- [ ] Migrations ran without errors
- [ ] App accessible at Railway URL
- [ ] Health check endpoint working: `/api/health`
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables verified
- [ ] Check logs for any errors

---

## Database Schema Overview

10 tables created:
- `users` - Players and Game Masters
- `campaigns` - Game campaigns/adventures
- `campaign_members` - Links users to campaigns
- `characters` - Player characters and NPCs
- `sessions` - Play sessions with timestamps
- `messages` - AI conversation history
- `world_elements` - Locations, items, monsters, etc.
- `dice_rolls` - Audit log of dice rolls
- `media` - Images, maps, handouts
- `audit_logs` - Change tracking

See `SCHEMA.md` for full documentation.

---

## Expected Railway Services After Setup

```
dungeon-master/
├── postgres (PostgreSQL)
│   └── DATABASE_URL
└── dungeon-master-ai (Nuxt)
    ├── DATABASE_URL (from postgres)
    ├── NUXT_SESSION_PASSWORD
    └── NUXT_PUBLIC_APP_URL
```

---

## Troubleshooting

### Build Fails
- Check Node.js version: Should be 18+ (use `NODE_VERSION=22` in env vars if needed)
- Verify Bun is available or use npm/pnpm fallback

### Migrations Fail
- Check `DATABASE_URL` is correctly set
- Ensure PostgreSQL service is running
- Check logs: `railway logs`

### Connection Issues
- Verify PostgreSQL service is linked
- Check `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
- Use Railway's **internal network** for faster connection (private domain)

---

## Next Steps After Deployment

1. ✅ Mark DUNGEON-MASTER-AI-2 as done in Habito
2. 🎨 Design landing page with 3D D20 dice
3. 🔐 Implement Google OAuth login
4. 🤖 Integrate AI provider (Claude/GPT)
5. 🎲 Build dice roller component
6. 📝 Create character sheet UI

---

**Created:** 2026-02-11 by Forge 🔧
**Issue:** DUNGEON-MASTER-AI-2 (Setup Infraestructura Base)
