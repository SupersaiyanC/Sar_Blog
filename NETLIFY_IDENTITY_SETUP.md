# Netlify Identity Setup Guide

## What Was Fixed

The Netlify Identity widget was missing from the site, preventing proper authentication. I've added:

1. **Netlify Identity Widget script** to `/admin/` page
2. **Netlify Identity Widget script** to all pages (needed for password reset flows)
3. **Proper redirect handlers** for login/signup flows

## How Authentication Works Now

### For Users Logging In

1. **Go to**: `https://your-site.netlify.app/admin/`
2. **You'll see**: A Netlify Identity modal popup with:
   - Email and password fields
   - "Forgot password?" link
   - "Don't have an account? Sign up" link
3. **After login**: Automatically redirected to the CMS dashboard

### For Password Reset

1. **User clicks "Forgot password?"** on the login modal
2. **Enters their email** and submits
3. **Receives email** with reset link
4. **Clicks link** in email
5. **Widget appears** on the main site (thanks to the script in layout.tsx)
6. **Enters new password**
7. **Automatically redirected** to `/admin/` and logged in

## Testing the Setup

### After Deployment to Netlify:

1. **Navigate to** `https://your-site.netlify.app/admin/`
2. **You should see**: The Netlify Identity modal popup (not just a basic form)
3. **Try logging in** with your credentials
4. **Test forgot password**:
   - Click "Forgot password?"
   - Enter your email
   - Check email for reset link
   - Click link - should show password reset form
   - Enter new password
   - Should redirect to `/admin/` and log you in

## Netlify Dashboard Settings Required

Make sure these are enabled in your Netlify dashboard:

### 1. Enable Identity
- Go to your site dashboard on Netlify
- Click "Identity" in the top menu
- Click "Enable Identity" if not already enabled

### 2. Registration Settings
- Go to Identity → Settings → Registration
- Set to **"Invite only"** (recommended)
- This prevents random people from creating accounts

### 3. Enable Git Gateway
- Go to Identity → Settings → Services
- Click "Enable Git Gateway"
- This allows the CMS to commit to your GitHub repo

### 4. Email Templates (Optional but Recommended)
- Go to Identity → Settings → Emails
- Customize the email templates:
  - **Invitation**: Welcome message when you invite users
  - **Confirmation**: Email confirmation (if enabled)
  - **Password Recovery**: Reset password instructions
  - **Email Change**: Confirmation for email changes

### 5. External Providers (Optional)
- Go to Identity → Settings → External providers
- Enable GitHub, Google, or GitLab login if desired
- Users can log in with these accounts instead of email/password

## Inviting Users

### To invite your girlfriend (or any user):

1. **Go to Netlify Dashboard** → Your Site → Identity
2. **Click "Invite users"**
3. **Enter her email address**
4. **Click "Send"**
5. **She receives email** with invitation link
6. **She clicks link** and sets her password
7. **She's now able to log in** at `/admin/`

## Troubleshooting

### "No Identity instance detected"
- Make sure Netlify Identity is enabled in your dashboard
- Check that you've deployed the latest code with the widget scripts

### Login modal doesn't appear
- Clear browser cache
- Hard refresh (Cmd/Ctrl + Shift + R)
- Check browser console for JavaScript errors
- Verify the Identity widget script is loading (check Network tab)

### Password reset emails go to wrong URL
- Check your site URL in Netlify → Site settings → General
- Make sure it matches your actual site URL
- Update if you added a custom domain

### "Failed to load settings"
- Check that Git Gateway is enabled
- Verify the user has been invited and confirmed
- Check browser console for specific error messages

### User can't access CMS after login
- Check that the user's email is invited in Identity
- Verify they've confirmed their account
- Check that Git Gateway has proper permissions

## Security Best Practices

1. **Keep registration "Invite only"**: Prevents unauthorized access
2. **Use strong passwords**: Enforce in Identity settings
3. **Regularly review users**: Remove users who no longer need access
4. **Enable 2FA** (if available in your Netlify plan)
5. **Monitor activity**: Check Identity → Usage for suspicious activity

## Files Modified

- `/public/admin/index.html` - Added Identity widget and login handler
- `/app/layout.tsx` - Added Identity widget for password reset flows

## How It Works Technically

### The Identity Widget

The Netlify Identity widget (`https://identity.netlify.com/v1/netlify-identity-widget.js`) provides:
- Modal popup for login/signup
- Password reset flow
- Email confirmation flow
- Session management
- Automatic token handling

### Integration with Decap CMS

1. User logs in via Identity widget
2. Identity widget sets authentication token
3. Decap CMS reads the token
4. CMS uses token with Git Gateway
5. Git Gateway authenticates with GitHub
6. User can now edit and publish posts

### The Redirect Flow

```
User visits /admin/
  ↓
Identity widget loads
  ↓
User not logged in → Show login modal
  ↓
User enters credentials
  ↓
Identity validates → Sets token
  ↓
Redirect to /admin/ (now authenticated)
  ↓
Decap CMS loads with token
  ↓
User can edit posts
```

### Password Reset Flow

```
User clicks "Forgot password?"
  ↓
Enters email → Netlify sends reset email
  ↓
User clicks link in email
  ↓
Link goes to https://your-site.netlify.app/#recovery_token=...
  ↓
Identity widget (loaded on all pages) detects token
  ↓
Shows password reset form
  ↓
User enters new password
  ↓
Identity updates password
  ↓
Redirects to /admin/
  ↓
User is logged in
```

## Next Steps

1. **Commit and push** these changes to GitHub
2. **Wait for Netlify** to rebuild (1-2 minutes)
3. **Test the login** at `/admin/`
4. **Verify password reset** works
5. **Give the login URL** to your girlfriend: `https://your-site.netlify.app/admin/`
6. **Share credentials** securely (use a password manager or Signal)

## Support

If you encounter issues:
- Check [Netlify Identity docs](https://docs.netlify.com/visitor-access/identity/)
- Check [Decap CMS docs](https://decapcms.org/docs/)
- Look at browser console for error messages
- Check Netlify deploy logs for build issues

---

**You're all set!** The authentication should now work perfectly. 🔐✨
