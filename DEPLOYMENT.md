# Deployment Guide

This guide covers deploying the To-Do application to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project (free tier works)

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a project
2. Wait for the project to be provisioned
3. Go to SQL Editor and run the schema from `database/schema.sql`
4. Go to Settings > API and note:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secret!)

## Step 2: Backend Deployment (Vercel)

### Option A: Vercel Serverless Functions

1. **Prepare the backend**:
   ```bash
   cd backend
   ```

2. **Create `vercel.json`** (already created):
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.js"
       }
     ]
   }
   ```

3. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

4. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `backend` folder as the root directory
   - Add environment variables:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `SUPABASE_ANON_KEY`
     - `FRONTEND_URL` (will be set after frontend deployment)
     - `NODE_ENV=production`
   - Deploy

5. **Note the backend URL**: e.g., `https://your-backend.vercel.app`

### Option B: Alternative Hosting (Railway, Render, etc.)

#### Railway

1. Create account at [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Select your repository
4. Add environment variables
5. Deploy

#### Render

1. Create account at [render.com](https://render.com)
2. New > Web Service
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

## Step 3: Frontend Deployment (Vercel)

1. **Prepare the frontend**:
   ```bash
   cd frontend
   ```

2. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add frontend"
   git push
   ```

3. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_API_URL` (your backend URL from Step 2)
   - Deploy

4. **Note the frontend URL**: e.g., `https://your-frontend.vercel.app`

## Step 4: Update Backend CORS

1. Go back to your backend project in Vercel
2. Go to Settings > Environment Variables
3. Update `FRONTEND_URL` to your frontend URL
4. Redeploy the backend

## Step 5: Verify Deployment

1. Visit your frontend URL
2. Sign up for a new account
3. Create a test task
4. Verify all features work

## Environment Variables Summary

### Backend

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3001  # Optional, Vercel sets this automatically
```

### Frontend

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

## Custom Domain (Optional)

### Frontend

1. Go to Vercel project settings
2. Domains > Add Domain
3. Follow DNS configuration instructions

### Backend

1. Go to Vercel project settings
2. Domains > Add Domain
3. Update `FRONTEND_URL` if needed

## Monitoring

### Vercel Analytics

- Enable in Vercel dashboard
- View performance metrics
- Monitor API usage

### Supabase Dashboard

- Monitor database usage
- View API requests
- Check authentication logs

## Troubleshooting

### Backend Issues

- **502 Bad Gateway**: Check environment variables
- **CORS Errors**: Verify `FRONTEND_URL` matches frontend domain
- **Auth Errors**: Verify Supabase keys are correct

### Frontend Issues

- **Build Fails**: Check Node.js version (18+)
- **API Errors**: Verify `NEXT_PUBLIC_API_URL` is correct
- **Auth Not Working**: Check Supabase URL and keys

### Database Issues

- **RLS Errors**: Ensure RLS policies are enabled
- **Connection Errors**: Check Supabase project status

## Production Checklist

- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] RLS policies enabled
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Error tracking set up (optional)
- [ ] Analytics enabled (optional)
- [ ] Custom domain configured (optional)
- [ ] Database backups enabled (Supabase)
- [ ] API rate limiting considered
- [ ] Monitoring set up

## Cost Estimation

### Free Tier (Suitable for MVP)

- **Vercel**: Free (hobby plan)
- **Supabase**: Free (up to 500MB database, 2GB bandwidth)
- **Total**: $0/month

### Growth Tier

- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **Total**: ~$45/month

## Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use environment variables for all secrets
3. ✅ Enable RLS on all tables
4. ✅ Use HTTPS (automatic on Vercel)
5. ✅ Regularly update dependencies
6. ✅ Monitor for security vulnerabilities
7. ✅ Use strong passwords
8. ✅ Enable 2FA on accounts
9. ✅ Review Supabase logs regularly
10. ✅ Implement rate limiting (production)

