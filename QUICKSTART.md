# Quick Start Guide

Get the To-Do application running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free)

## Step 1: Supabase Setup (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details and wait for provisioning (~2 minutes)
4. Go to **SQL Editor** → **New Query**
5. Copy and paste the contents of `database/schema.sql`
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Go to **Settings** → **API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

## Step 2: Backend Setup (1 minute)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

✅ Backend running on http://localhost:3001

## Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

✅ Frontend running on http://localhost:3000

## Step 4: Test It Out (1 minute)

1. Open http://localhost:3000 in your browser
2. Click "Sign Up"
3. Enter email and password (min 6 characters)
4. Check your email for confirmation (if email confirmation is enabled)
5. Sign in
6. Create your first task!

## Troubleshooting

### Backend won't start
- Check Node.js version: `node --version` (should be 18+)
- Verify `.env` file exists and has correct values
- Check if port 3001 is already in use

### Frontend won't start
- Check Node.js version: `node --version` (should be 18+)
- Verify `.env.local` file exists
- Try deleting `node_modules` and `package-lock.json`, then `npm install`

### Can't sign up/login
- Verify Supabase keys are correct
- Check Supabase dashboard for errors
- Ensure email confirmation is disabled in Supabase Auth settings (for testing)

### Tasks not showing
- Check browser console for errors
- Verify backend is running on port 3001
- Check network tab for API requests

## Next Steps

- Read [README.md](./README.md) for full documentation
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to production
- Customize the UI and add features!

