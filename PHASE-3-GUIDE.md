# Phase 3: Social Links & Custom URLs - Implementation Guide

## Overview
Phase 3 adds the core "link in bio" functionality to Official You:
- Social media links (LinkedIn, Facebook, Instagram, TikTok, etc.)
- Custom links with titles
- Link management (add/edit/delete/reorder)
- Display on public profile pages

## What Gets Added

### Dashboard Features:
1. **Social Media Section** - Input fields for 10 social platforms
2. **Custom Links Section** - Add unlimited custom URLs with titles
3. **Link Ordering** - Up/down arrows to reorder custom links
4. **All saves to Firestore** under user document

### Profile Page Features:
1. **Display Social Links** - Show filled-in social media as buttons with icons
2. **Display Custom Links** - Show custom links with generic link icon
3. **Click handling** - Open links in new tab

## Installation Steps

### Step 1: Install Dependencies (if needed)

```powershell
# You should already have lucide-react installed
# If not, run:
npm install lucide-react
```

### Step 2: Replace Files

1. **Dashboard.js** - Complete rewrite with links management
2. **Profile.js** - Updated to display links

### Step 3: Update Firestore Security Rules

Add these fields to your user document permissions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.data.keys().hasAll(['fullName', 'username', 'email'])
                   && (!request.resource.data.keys().hasAny(['socialLinks']) || 
                       request.resource.data.socialLinks.keys().hasAll([
                         'linkedin', 'facebook', 'instagram', 'tiktok', 
                         'lemon8', 'pinterest', 'youtube', 'bluesky', 
                         'twitter', 'mastodon'
                       ]))
                   && (!request.resource.data.keys().hasAny(['customLinks']) ||
                       request.resource.data.customLinks is list);
    }
    
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if false;
    }
    
    match /referralCodes/{code} {
      allow read: if true;
      allow write: if false;
      allow update: if request.auth != null;
    }
    
    match /waitlist/{entry} {
      allow read: if false;
      allow create: if true;
      allow update, delete: if false;
    }
  }
}
```

## Data Structure

### socialLinks Object:
```javascript
socialLinks: {
  linkedin: 'https://linkedin.com/in/username',
  facebook: 'https://facebook.com/username',
  instagram: 'https://instagram.com/username',
  tiktok: 'https://tiktok.com/@username',
  lemon8: 'https://lemon8-app.com/username',
  pinterest: 'https://pinterest.com/username',
  youtube: 'https://youtube.com/@username',
  bluesky: 'https://bsky.app/profile/username',
  twitter: 'https://twitter.com/username',
  mastodon: 'https://mastodon.social/@username'
}
```

### customLinks Array:
```javascript
customLinks: [
  {
    id: 1234567890,
    title: 'My Website',
    url: 'https://example.com'
  },
  {
    id: 1234567891,
    title: 'My Blog',
    url: 'https://blog.example.com'
  }
]
```

## Features Breakdown

### Dashboard - Social Media Section
- 10 input fields for major platforms
- Validates URLs (adds https:// if missing)
- Optional - leave blank if not using that platform
- Icons displayed for visual clarity

### Dashboard - Custom Links Section
- "Add Link" button opens form
- Title + URL inputs
- Add button creates new link
- Each link has:
  - Title display
  - URL display (truncated if long)
  - Delete button (trash icon)
  - Up/Down arrows for reordering
  - Can't move first item up or last item down

### Profile - Display Links
- Social links appear first (only if filled in)
- Custom links appear below
- All links styled as buttons with gradient background
- Icons from lucide-react
- Opens in new tab (`target="_blank"`)

## Testing Checklist

- [ ] Add social media links in dashboard
- [ ] Add custom links in dashboard
- [ ] Reorder custom links (up/down arrows)
- [ ] Delete custom links
- [ ] Save and verify data persists
- [ ] View profile - check social links display
- [ ] View profile - check custom links display
- [ ] Click links - verify they open in new tab
- [ ] Test with empty social fields (should not display)
- [ ] Test with long URLs (should truncate nicely)

## Next Steps After Phase 3

Future enhancements (Phase 4+):
- Drag-and-drop reordering
- Link click analytics
- Custom button colors per link
- Link scheduling (show/hide by date)
- QR code generation for profile
- Themes/customization

---

**Ready to implement? Follow the guide and replace the files!**
