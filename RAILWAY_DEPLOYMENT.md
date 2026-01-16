# Railway Backend Deployment Guide

This guide provides step-by-step instructions for deploying the To-Do application backend to Railway.

## Prerequisites

- GitHub account with your repository pushed
- Railway account (sign up at [railway.app](https://railway.app))
- Supabase project set up (see [DEPLOYMENT.md](./DEPLOYMENT.md) for Supabase setup)

## Step 1: Prepare Your Repository

1. **Ensure your backend code is committed to GitHub**:

   ```bash
   cd backend
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```
2. **Verify your `package.json` has a start script**:

   - The start script should be: `"start": "node src/server.js"`
   - This is already configured in your project

## Step 2: Create Railway Account and Project

1. **Sign up for Railway**:

   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Sign up with GitHub (recommended) or email
2. **Create a New Project**:

   - Click "New Project" in the Railway dashboard
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub account if prompted
   - Select your repository from the list

## Step 3: Configure the Service

1. **Set the Root Directory**:

   - In your Railway project, click on the service
   - Go to the "Settings" tab
   - Under "Root Directory", set it to: `backend`
   - This tells Railway where your backend code is located
2. **Configure Build Settings** (if needed):

   - Railway auto-detects Node.js projects
   - Build Command: `npm install` (automatic)
   - Start Command: `npm start` (automatic, uses your package.json)

## Step 4: Set Environment Variables

1. **Navigate to Variables Tab**:

   - In your Railway service, click on the "Variables" tab
   - Click "New Variable" to add each environment variable
2. **Add Required Environment Variables**:

   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   ```

   - Get this from your Supabase project: Settings > API > Project URL

   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

   - Get this from Supabase: Settings > API > service_role key (keep this secret!)

   ```
   SUPABASE_ANON_KEY=eyJhbGc...
   ```

   - Get this from Supabase: Settings > API > anon public key

   ```
   FRONTEND_URL=http://localhost:3000
   ```

   - Initially set to localhost, update after frontend deployment
   - Or set to your frontend URL if already deployed

   ```
   NODE_ENV=production
   ```

   - Sets the environment to production

   ```
   PORT=3001
   ```

   - Optional: Railway automatically assigns a PORT, but you can set a default
   - Note: Railway will override this with their own PORT in production
3. **Save Variables**:

   - After adding all variables, Railway will automatically redeploy

## Step 5: Deploy and Monitor

1. **Initial Deployment**:

   - Railway will automatically start building and deploying your service
   - You can watch the deployment logs in the "Deployments" tab
   - Wait for the build to complete (usually 1-3 minutes)
2. **Check Deployment Status**:

   - Look for "Deploy Successful" message
   - Check the logs for any errors
   - Verify you see: `🚀 Server running on port XXXX`
3. **View Logs**:

   - Click on the "Logs" tab to see real-time application logs
   - Useful for debugging and monitoring

## Step 6: Get Your Backend URL

1. **Find Your Service URL**:

   - In the Railway dashboard, click on your service
   - Go to the "Settings" tab
   - Scroll down to "Domains" section
   - Railway automatically generates a domain like: `your-service-name.up.railway.app`
   - Copy this URL (e.g., `https://your-service-name.up.railway.app`)
2. **Test Your Backend**:

   - Visit: `https://your-service-name.up.railway.app/health`
   - You should see: `{"status":"ok","timestamp":"..."}`
   - If you get a response, your backend is working!

## Step 7: Update CORS Configuration

1. **Update FRONTEND_URL**:

   - After deploying your frontend, go back to Railway
   - Navigate to Variables tab
   - Update `FRONTEND_URL` to your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - Railway will automatically redeploy with the new variable
2. **Verify CORS**:

   - Test API calls from your frontend
   - Check browser console for CORS errors
   - If errors occur, verify `FRONTEND_URL` matches exactly (including protocol)

## Step 8: Custom Domain (Optional)

1. **Add Custom Domain**:

   - In Railway service Settings > Domains
   - Click "Generate Domain" or "Add Custom Domain"
   - For custom domain:
     - Add your domain (e.g., `api.yourdomain.com`)
     - Railway will provide DNS records to add
     - Update your DNS provider with the provided records
     - Wait for DNS propagation (can take up to 48 hours)
2. **Update Environment Variables**:

   - If using custom domain, update `FRONTEND_URL` if needed

## Step 9: Configure Production Settings

1. **Enable HTTPS**:

   - Railway automatically provides HTTPS for all domains
   - No additional configuration needed
2. **Set Up Monitoring** (Optional):

   - Railway provides built-in metrics
   - View in the "Metrics" tab
   - Monitor CPU, memory, and network usage
3. **Configure Auto-Deploy**:

   - By default, Railway auto-deploys on push to main branch
   - To change this, go to Settings > Source
   - Configure branch and auto-deploy settings

## Environment Variables Summary

Here's a complete list of environment variables needed:

```env
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...

# Application Configuration
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=3001  # Optional, Railway sets this automatically
```

## Troubleshooting

### Build Fails

- **Issue**: Build command fails
- **Solution**:
  - Check that `package.json` exists in the backend directory
  - Verify Node.js version (Railway uses Node 18+ by default)
  - Check build logs for specific errors

### Application Won't Start

- **Issue**: Service shows as "Deployed" but not responding
- **Solution**:
  - Check logs for errors
  - Verify all environment variables are set
  - Ensure `PORT` is being read correctly (Railway sets `PORT` automatically)
  - Check that your server is listening on `process.env.PORT || 3001`

### CORS Errors

- **Issue**: Frontend can't connect to backend
- **Solution**:
  - Verify `FRONTEND_URL` matches your frontend domain exactly
  - Include protocol (https://) in the URL
  - Check that backend URL is correct in frontend environment variables
  - Review CORS configuration in `server.js`

### Environment Variables Not Working

- **Issue**: Variables not being read
- **Solution**:
  - Ensure variables are set in Railway (not just in local `.env`)
  - Check variable names match exactly (case-sensitive)
  - Redeploy after adding/changing variables
  - Verify variables in Railway dashboard

### Database Connection Issues

- **Issue**: Can't connect to Supabase
- **Solution**:
  - Verify `SUPABASE_URL` is correct
  - Check `SUPABASE_SERVICE_ROLE_KEY` is the service_role key (not anon key)
  - Ensure Supabase project is active
  - Check Supabase dashboard for connection limits

## Railway-Specific Tips

1. **Automatic Deployments**: Railway automatically deploys on every push to your main branch
2. **Free Tier**: Railway offers a free tier with $5 credit per month
3. **Sleep Mode**: Free tier services may sleep after inactivity (wakes on first request)
4. **Logs Retention**: Free tier has limited log retention
5. **Metrics**: Monitor your service usage in the Metrics tab

## Cost Estimation

### Railway Free Tier

- $5 credit per month
- Suitable for development and small projects
- Services may sleep after inactivity

### Railway Pro

- Pay-as-you-go pricing
- No sleep mode
- Better performance
- More resources

## Production Checklist

- [ ] All environment variables set correctly
- [ ] Backend URL obtained and tested
- [ ] Health check endpoint working (`/health`)
- [ ] CORS configured with correct frontend URL
- [ ] HTTPS enabled (automatic on Railway)
- [ ] Monitoring set up
- [ ] Custom domain configured (optional)
- [ ] Auto-deploy configured correctly
- [ ] Error handling working
- [ ] Logs accessible and monitored

## Next Steps

After successfully deploying the backend:

1. Deploy the frontend (see [DEPLOYMENT.md](./DEPLOYMENT.md))
2. Update `FRONTEND_URL` in Railway with your frontend URL
3. Update `NEXT_PUBLIC_API_URL` in frontend with your Railway backend URL
4. Test the complete application
5. Set up monitoring and alerts

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord Community](https://discord.gg/railway)
- [Supabase Documentation](https://supabase.com/docs)
