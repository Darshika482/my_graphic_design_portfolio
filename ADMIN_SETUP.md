# Admin Panel Setup Guide

## ✅ What's Been Set Up

1. **Admin Panel Components** - Full-featured admin interface
2. **Vercel API Endpoint** - GitHub upload functionality
3. **Routing** - Admin routes integrated into your app

## 🔧 Setup Steps

### 1. Environment Variables

Create a `.env.local` file in your project root with:

```env
VITE_ADMIN_PASSWORD=your_admin_password_here
GITHUB_TOKEN=your_github_token_here
```

**Important:** `.env.local` is already in `.gitignore` - it won't be committed to GitHub.

### 2. Vercel Environment Variables

You need to add these to your Vercel project:

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
VITE_ADMIN_PASSWORD = your_admin_password_here
GITHUB_TOKEN = your_github_token_here
```

5. Make sure to select **Production**, **Preview**, and **Development** environments
6. Click **Save**

### 3. Deploy to Vercel

After setting environment variables:

```bash
git add .
git commit -m "Add admin panel"
git push
```

Vercel will automatically deploy. Or deploy manually:

```bash
vercel --prod
```

## 🎯 How to Use

### Access Admin Panel

1. Go to: `https://your-site.vercel.app/#/admin`
2. Enter your admin password
3. You'll see three tabs:
   - **Upload** - Upload new images
   - **Gallery** - View and manage existing images
   - **Settings** - Change password, view stats

### Upload Images

1. Click **Upload** tab
2. Select 1-10 images (drag & drop or click to browse)
3. Choose a category from dropdown
4. Optionally edit image titles
5. Click **Upload to GitHub**
6. Images will be uploaded to the correct `assets/` folder
7. After upload, you may need to:
   - Run `npm run generate-thumbs` locally to create thumbnails
   - Or set up GitHub Actions to auto-generate thumbnails

### Gallery Management

- View all images by category
- Search by title
- Edit image titles (coming soon - full API)
- Delete images (coming soon - full API)

### Settings

- View statistics
- Change password (update Vercel env var)
- Check GitHub connection status

## 📝 Notes

- **Thumbnails**: After uploading, thumbnails need to be generated. You can:
  - Run `npm run generate-thumbs` locally and commit
  - Set up GitHub Actions to auto-generate on file upload
  
- **Constants Update**: Currently, uploaded images won't automatically appear until you update `constants.ts`. This can be automated with GitHub Actions.

- **Password Security**: The password is stored in environment variables. Change it by updating `VITE_ADMIN_PASSWORD` in Vercel.

## 🚀 Next Steps (Optional)

1. **Auto-thumbnail Generation**: Set up GitHub Actions to auto-generate thumbnails
2. **Auto-update Constants**: GitHub Action to update `constants.ts` when images are uploaded
3. **Image Optimization**: Add automatic image compression before upload
4. **Delete Functionality**: Complete the delete API endpoint

## 🔒 Security

- Admin panel is password-protected
- GitHub token is stored securely in environment variables
- Never commit `.env.local` to GitHub (already in `.gitignore`)
