# Phase 3 Quick Start Guide

## What You're Getting

Phase 3 adds the core "link in bio" functionality to Official You!

**Dashboard Updates:**
- Social media links section (10 platforms)
- Custom links section (unlimited)
- Up/down arrows to reorder custom links
- Delete buttons for custom links

**Profile Page Updates:**
- Displays all active social media links as buttons
- Displays all custom links as buttons
- Links open in new tab
- Gradient button styling

---

## Installation Steps

### Step 1: Replace Files

1. **Dashboard.js** → Replace `src/pages/Dashboard.js` with `Dashboard-Phase3.js`
2. **Profile.js** → Replace `src/pages/Profile.js` with `Profile-Phase3.js`

### Step 2: Test Locally

```powershell
npm start
```

**Test checklist:**
- [ ] Go to Dashboard
- [ ] Add a social media link (e.g., LinkedIn)
- [ ] Add a custom link with title and URL
- [ ] Reorder custom links with up/down arrows
- [ ] Delete a custom link
- [ ] Click "Save All Changes"
- [ ] View your profile at `/yourusername`
- [ ] Check that links display correctly
- [ ] Click a link to verify it opens in new tab

### Step 3: Deploy

```powershell
git add .
git commit -m "Phase 3 - Add social media and custom links"
git push
```

Vercel will auto-deploy!

---

## How It Works

### Dashboard

**Social Media Section:**
- 10 input fields for major platforms
- Leave blank if you don't use that platform
- Icons shown for visual clarity
- URLs saved when you click "Save All Changes"

**Custom Links Section:**
- Add unlimited links with title + URL
- Each link has:
  - Title (e.g., "My Website")
  - URL (e.g., "https://example.com")
  - Delete button (trash icon)
  - Up/down arrows to reorder

**Important:** All changes are saved when you click the "Save All Changes" button at the top of the profile section!

### Profile Page

**What Displays:**
1. Profile header (picture, name, motto, contact info)
2. Social media links (only platforms you filled in)
3. Custom links (in the order you arranged them)
4. All links styled as gradient buttons
5. Opens in new tab when clicked

**If no links:**
- Shows "No Links Yet" message

---

## Data Structure

Your Firestore user document now includes:

```javascript
{
  // ... existing fields ...
  socialLinks: {
    linkedin: 'https://linkedin.com/in/...',
    facebook: '',  // empty = won't display
    instagram: 'https://instagram.com/...',
    // ... etc
  },
  customLinks: [
    {
      id: 1234567890,
      title: 'My Website',
      url: 'https://example.com'
    },
    {
      id: 1234567891,
      title: 'My Store',
      url: 'https://store.example.com'
    }
  ]
}
```

---

## Troubleshooting

**Links not saving:**
- Make sure you clicked "Save All Changes" button
- Check browser console for errors
- Verify Firestore rules allow writes

**Links not displaying on profile:**
- Refresh the profile page
- Make sure URLs are not empty strings
- Check that you saved changes in dashboard

**Custom link won't delete:**
- Click the trash icon
- Then click "Save All Changes"
- Refresh to verify

---

## What's Next?

After Phase 3, you can consider:
- Link click analytics
- Custom colors per link
- Drag-and-drop reordering
- QR code generation
- Themes and customization

But for now, you have a fully functional "link in bio" platform! 🎉
