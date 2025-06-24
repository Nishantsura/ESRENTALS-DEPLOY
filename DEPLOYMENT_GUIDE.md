# 🚀 Deployment Guide - Autoluxe

This guide will walk you through deploying your Autoluxe car rental platform to GitHub and Vercel.

## ✅ Pre-Deployment Checklist

- [x] ✅ Project builds successfully (`npm run build`)
- [x] ✅ All TypeScript errors resolved
- [x] ✅ Git repository initialized and committed
- [x] ✅ README.md updated with comprehensive documentation
- [x] ✅ Environment variables documented

## 📋 Step 1: Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click "New repository"** or the "+" icon in the top right
3. **Repository settings:**
   - **Repository name**: `autoluxe` (or your preferred name)
   - **Description**: "Luxury car rental platform built with Next.js and Supabase"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. **Click "Create repository"**

## 📋 Step 2: Connect Local Repository to GitHub

Run these commands in your terminal:

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/autoluxe.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

## 📋 Step 3: Set Up Vercel Deployment

### Option A: Deploy via Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository:**
   - Select your `autoluxe` repository
   - Vercel will automatically detect it's a Next.js project
4. **Configure project settings:**
   - **Project Name**: `autoluxe` (or your preferred name)
   - **Framework Preset**: Next.js (should be auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `.next` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

## 📋 Step 4: Configure Environment Variables

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

### Required Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

### Optional Variables (for search functionality):
```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_algolia_search_key
ALGOLIA_ADMIN_KEY=your_algolia_admin_key
```

**Important:** Make sure to set these for all environments (Production, Preview, Development).

## 📋 Step 5: Configure Domain (Optional)

1. **In Vercel dashboard**, go to **Settings > Domains**
2. **Add your custom domain** (if you have one)
3. **Follow the DNS configuration instructions**

## 📋 Step 6: Set Up Supabase Production Database

1. **Go to your Supabase dashboard**
2. **Create a new project** (if you haven't already)
3. **Get your production credentials:**
   - Project URL
   - Anon key
   - Service role key
4. **Run migrations:**
   ```bash
   # Set your production Supabase URL
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Push migrations to production
   supabase db push
   ```

## 📋 Step 7: Test Your Deployment

1. **Visit your Vercel URL** (e.g., `https://autoluxe.vercel.app`)
2. **Test key functionality:**
   - [ ] Homepage loads correctly
   - [ ] Car listings display
   - [ ] Search functionality works
   - [ ] Admin login works
   - [ ] Image uploads work
   - [ ] Responsive design on mobile

## 📋 Step 8: Set Up Continuous Deployment

Vercel automatically sets up CD when you connect your GitHub repository:

- **Every push to `main`** → Automatic production deployment
- **Every pull request** → Preview deployment
- **Branch deployments** → Automatic for feature branches

## 🔧 Troubleshooting

### Common Issues:

1. **Build fails:**
   - Check Vercel build logs
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Environment variables not working:**
   - Double-check variable names
   - Ensure they're set for all environments
   - Redeploy after adding variables

3. **Database connection issues:**
   - Verify Supabase credentials
   - Check RLS policies
   - Ensure database is accessible

4. **Images not loading:**
   - Check Supabase Storage configuration
   - Verify storage bucket permissions
   - Check image URLs in database

### Useful Commands:

```bash
# Check build locally
npm run build

# Test production build
npm run start

# Check TypeScript
npx tsc --noEmit

# Lint code
npm run lint
```

## 📊 Monitoring and Analytics

1. **Vercel Analytics** (optional):
   - Enable in Vercel dashboard
   - Track performance and user behavior

2. **Supabase Dashboard:**
   - Monitor database performance
   - Check storage usage
   - Review authentication logs

## 🔒 Security Checklist

- [ ] Environment variables are set in Vercel
- [ ] Supabase RLS policies are configured
- [ ] Admin authentication is working
- [ ] API routes are protected
- [ ] No sensitive data in client-side code

## 📞 Support

If you encounter issues:

1. **Check Vercel deployment logs**
2. **Review Supabase dashboard**
3. **Check browser console for errors**
4. **Verify environment variables**
5. **Test locally with production environment**

## 🎉 Success!

Once deployed, your Autoluxe platform will be live at your Vercel URL. Share it with your team and start managing your luxury car rental business!

---

**Next Steps:**
- Set up monitoring and analytics
- Configure custom domain
- Set up backup strategies
- Plan for scaling 