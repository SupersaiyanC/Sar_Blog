# Travel & Lifestyle Blog

A beautiful, modern blog built with Next.js and Decap CMS, featuring a warm earthy design perfect for travel and lifestyle content.

## 🌟 Features

- **Beautiful Design**: Warm, earthy color palette with elegant typography
- **Easy Content Management**: Non-technical CMS interface for creating and editing posts
- **Responsive**: Looks great on all devices
- **Fast Performance**: Static site generation for lightning-fast load times
- **Image Galleries**: Built-in gallery support for photo-heavy posts
- **Categories**: Organized by Travel, Baking, and Lifestyle
- **SEO Optimized**: Meta tags and structured data ready

## 🚀 Quick Start for Development

### Prerequisites
- Node.js 18+ installed
- Git installed

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📦 Deployment to Netlify

### Step 1: Prepare Your Repository

1. **Create a GitHub repository:**
   - Go to [github.com](https://github.com) and create a new repository
   - Name it something like "travel-blog"
   - Keep it public (required for free Netlify CMS)

2. **Initialize git and push your code:**
   ```bash
   cd /Users/rayaancheema/Desktop/Sar_Blog
   git init
   git add .
   git commit -m "Initial commit: Travel & Lifestyle Blog"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Deploy to Netlify

1. **Sign up for Netlify:**
   - Go to [netlify.com](https://www.netlify.com/)
   - Sign up using your GitHub account (easiest option)

2. **Create a new site:**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" as your Git provider
   - Authorize Netlify to access your repositories
   - Select your blog repository

3. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Click "Deploy site"

4. **Wait for deployment:**
   - First deployment takes 2-3 minutes
   - You'll get a random URL like `random-name-123.netlify.app`

### Step 3: Enable Netlify Identity (Required for CMS)

1. **Enable Identity:**
   - Go to your site dashboard on Netlify
   - Click "Identity" in the top menu
   - Click "Enable Identity"

2. **Configure Registration:**
   - Under Identity settings, click "Registration" → "Edit settings"
   - Set registration to "Invite only" (important for security!)

3. **Enable Git Gateway:**
   - Scroll down to "Services" → "Git Gateway"
   - Click "Enable Git Gateway"

4. **Invite yourself as a user:**
   - Go to "Identity" tab
   - Click "Invite users"
   - Enter the email address that will manage the blog
   - Check your email and accept the invitation
   - Set a password when prompted

### Step 4: Customize Your Blog

1. **Update site settings:**
   - Go to `https://your-site.netlify.app/admin/`
   - Log in with your email and password
   - Click "Site Settings" in the left sidebar
   - Update the site title, description, author name, and about text
   - Add social media links if desired
   - Click "Publish" → "Publish now"

2. **Optional: Custom domain:**
   - In Netlify dashboard, go to "Domain management"
   - Click "Add custom domain"
   - Follow instructions to connect your domain

## 📝 User Guide: How to Create and Manage Posts

### Accessing the CMS

1. Go to `https://your-site.netlify.app/admin/`
2. Log in with your email and password
3. You'll see the Decap CMS dashboard

### Creating a New Post

1. **Click "Blog Posts" in the left sidebar**
2. **Click "New Blog Posts" button**
3. **Fill in the fields:**
   - **Title**: Your post title (e.g., "My Amazing Trip to Bali")
   - **Publish Date**: Select the date and time
   - **Featured Image**: Click to upload your main post image
   - **Excerpt**: Write a short summary (2-3 sentences) for the post preview
   - **Category**: Choose Travel, Baking, or Lifestyle
   - **Featured Post**: Toggle ON if you want it prominently displayed on homepage
   - **Body**: Write your post content using the rich text editor
   - **Gallery Images** (optional): Add multiple images for a photo gallery
   - **Tags** (optional): Add tags like "italy", "pasta", "recipes"

4. **Preview your post** (optional):
   - Click the eye icon at the top to see how it will look

5. **Publish:**
   - Click "Publish" → "Publish now"
   - Wait 1-2 minutes for the site to rebuild
   - Your post is now live!

### Editing an Existing Post

1. Click "Blog Posts" in the left sidebar
2. Click on the post you want to edit
3. Make your changes
4. Click "Publish" → "Publish now"

### Deleting a Post

1. Open the post you want to delete
2. Click "Delete entry" at the top
3. Confirm the deletion
4. The post will be removed after the next deployment

### Working with Images

**Best practices for images:**
- Use high-quality images (at least 1200px wide for featured images)
- Featured images work best in landscape orientation
- Gallery images should be similar sizes for best appearance
- Compress large images before uploading (use [tinypng.com](https://tinypng.com))

**Uploading images:**
1. Click the image field
2. Choose "Upload" or drag and drop
3. Select your image file
4. Wait for upload to complete
5. Image is now saved in your repository

### Using the Rich Text Editor

The body editor supports:
- **Headings**: Use H2 and H3 for section headers
- **Bold and Italic**: Highlight text and click formatting buttons
- **Links**: Highlight text, click link button, paste URL
- **Lists**: Bulleted or numbered lists
- **Blockquotes**: For pull quotes or important text
- **Images**: Insert images directly in the post content

### Publishing Workflow

When you publish a post:
1. Changes are committed to your GitHub repository
2. Netlify detects the change
3. Site rebuilds automatically (1-2 minutes)
4. Your changes go live

**Important**: Always wait for the previous deployment to finish before publishing another change.

## 🎨 Customization

### Changing Colors

Edit [tailwind.config.js](tailwind.config.js) to customize the color scheme:
```javascript
colors: {
  sand: { /* warm beige tones */ },
  terracotta: { /* earthy orange/red tones */ },
  sage: { /* muted green tones */ }
}
```

### Adding New Categories

Edit [public/admin/config.yml](public/admin/config.yml) and add your category to the options:
```yaml
options: ["Travel", "Baking", "Lifestyle", "Your New Category"]
```

### Changing Site Title and Description

Use the CMS admin panel (easiest) or edit [content/settings/general.json](content/settings/general.json)

## 🛠 Troubleshooting

### "Cannot find posts" error
- Make sure you've committed and pushed the `content/posts` folder
- Check that your markdown files have the correct frontmatter format

### CMS login not working
- Verify Netlify Identity is enabled
- Make sure you've accepted the email invitation
- Clear browser cache and cookies

### Changes not appearing
- Wait 2-3 minutes for Netlify to rebuild
- Check the Netlify deploy log for errors
- Hard refresh your browser (Cmd/Ctrl + Shift + R)

### Images not loading
- Check that images are in `public/images/uploads/`
- Verify the image paths in your markdown files start with `/images/uploads/`

## 📱 Mobile Access

You can create and edit posts from any device:
1. Open `https://your-site.netlify.app/admin/` on your phone or tablet
2. Log in with your credentials
3. Create or edit posts using the mobile-optimized interface

## 🔒 Security Notes

- Keep your Netlify login secure
- Use a strong password
- Never share your admin credentials
- Keep registration set to "Invite only"
- Regularly review Identity users in Netlify dashboard

## 💡 Tips for Success

1. **Consistency**: Post regularly to build an audience
2. **High-quality images**: Invest time in good photography
3. **Engaging excerpts**: Write compelling summaries to entice readers
4. **Use featured posts**: Highlight your best content on the homepage
5. **Tags**: Use relevant tags to organize content
6. **Backup**: Your content is stored in GitHub, which serves as a backup

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Netlify Documentation](https://docs.netlify.com/)
- [Markdown Guide](https://www.markdownguide.org/)

## 🎉 You're Ready!

Your blog is now live and ready to share with the world. Start creating amazing content and sharing your adventures!

If you need any help, the Decap CMS community forum and Netlify support are excellent resources.

Happy blogging! ✨
