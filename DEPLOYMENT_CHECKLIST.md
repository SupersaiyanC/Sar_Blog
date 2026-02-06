# 🚀 Deployment Checklist

Quick reference guide for deploying your blog to Netlify.

## Before You Start

- [ ] Node.js 18+ installed
- [ ] GitHub account created
- [ ] Netlify account created (sign up at netlify.com)

## Step 1: Push to GitHub

```bash
cd /Users/rayaancheema/Desktop/Sar_Blog
git init
git add .
git commit -m "Initial commit: Travel & Lifestyle Blog"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

## Step 2: Deploy to Netlify

1. [ ] Log in to Netlify (use GitHub account)
2. [ ] Click "Add new site" → "Import an existing project"
3. [ ] Select GitHub and authorize
4. [ ] Choose your repository
5. [ ] Confirm build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
6. [ ] Click "Deploy site"
7. [ ] Wait for deployment to complete

## Step 3: Enable CMS Authentication

1. [ ] Go to site dashboard → "Identity"
2. [ ] Click "Enable Identity"
3. [ ] Go to Settings → Registration → Set to "Invite only"
4. [ ] Go to Settings → Services → Enable "Git Gateway"
5. [ ] Go to Identity tab → "Invite users"
6. [ ] Enter her email address
7. [ ] She checks email and accepts invitation
8. [ ] She sets her password

## Step 4: Test Everything

1. [ ] Visit `https://your-site.netlify.app` (check homepage loads)
2. [ ] Visit `https://your-site.netlify.app/admin/` (check CMS loads)
3. [ ] Log in with the invited email/password
4. [ ] Click "Site Settings" and update:
   - [ ] Site Title
   - [ ] Site Description
   - [ ] Author Name
   - [ ] About Text
   - [ ] Social Media links
5. [ ] Publish changes and wait for rebuild
6. [ ] Check homepage shows updated info

## Step 5: Create Test Post

1. [ ] In CMS admin, go to "Blog Posts"
2. [ ] Click "New Blog Posts"
3. [ ] Fill in all required fields
4. [ ] Upload a featured image
5. [ ] Write some content in the body
6. [ ] Click "Publish" → "Publish now"
7. [ ] Wait 1-2 minutes
8. [ ] Check homepage shows new post
9. [ ] Click on post to view it

## Step 6: Hand Off to User

Give her:
- [ ] Admin URL: `https://your-site.netlify.app/admin/`
- [ ] Login email address
- [ ] Password (she should change it after first login)
- [ ] USER_GUIDE.md file (print or share digitally)
- [ ] Show her how to create one post together

## Optional: Custom Domain

If you have a custom domain:

1. [ ] In Netlify dashboard → "Domain management"
2. [ ] Click "Add custom domain"
3. [ ] Enter your domain name
4. [ ] Follow DNS configuration instructions
5. [ ] Wait for DNS propagation (can take 24-48 hours)
6. [ ] Enable HTTPS (automatic once DNS is configured)

## Important URLs

After deployment, bookmark these:

- **Live Site**: `https://your-site.netlify.app`
- **CMS Admin**: `https://your-site.netlify.app/admin/`
- **Netlify Dashboard**: `https://app.netlify.com/sites/your-site-name`
- **GitHub Repo**: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

## Troubleshooting

### Build fails on Netlify?
- Check the build log for specific errors
- Common issue: Make sure Node version is 18+ in Netlify settings
- Solution: Site settings → Build & deploy → Build settings → Set Node version to 18

### CMS won't load?
- Make sure Netlify Identity is enabled
- Check that Git Gateway is enabled
- Try clearing browser cache

### Can't log in?
- Verify the invitation email was accepted
- Try password reset
- Check spam folder for invitation email

### Posts not appearing?
- Wait 2-3 minutes after publishing
- Check Netlify deploy status
- Look at deploy log for errors

## Next Steps

Once everything is working:

1. She can start creating posts!
2. Encourage her to create a few posts to get comfortable
3. Remind her to:
   - Use high-quality images
   - Write engaging excerpts
   - Use the featured post toggle strategically
   - Add tags for organization

## Support Resources

- **Blog Issues**: Check README.md
- **User Questions**: Share USER_GUIDE.md
- **Netlify Help**: docs.netlify.com
- **Decap CMS**: decapcms.org/docs

---

**You're Done!** 🎉

The blog is now live and ready for content. Time to start creating beautiful posts!
