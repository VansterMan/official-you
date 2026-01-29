# Official You - Phase 1 Setup Instructions

## What You Have

I've created all the files for Phase 1 of Official You. Here's what's included:

**Phase 1 Features:**
- ✅ Email/password signup and login
- ✅ Username availability checking (real-time)
- ✅ Profile creation with full name and motto
- ✅ Public profile pages at /username
- ✅ Dashboard to manage profile
- ✅ Clean, Linktree-style design

## Setup Steps

### 1. Create the React Project

```powershell
npx create-react-app official-you
cd official-you
npm install firebase react-router-dom lucide-react
```

### 2. Replace Files

Copy these files from the outputs folder into your project:

- `firebase.js` → `src/firebase.js`
- `App.js` → `src/App.js` (replace existing)
- `App.css` → `src/App.css` (replace existing)

Create a `src/pages/` folder and add:
- `Home.js` → `src/pages/Home.js`
- `Signup.js` → `src/pages/Signup.js`
- `Login.js` → `src/pages/Login.js`
- `Dashboard.js` → `src/pages/Dashboard.js`
- `Profile.js` → `src/pages/Profile.js`

### 3. Configure Firebase

1. Go to firebase.google.com and create a project called "Official You"
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore Database (production mode)
4. Get your Firebase config from Project Settings
5. Open `src/firebase.js` and replace the config object with yours

### 4. Set Up Firestore Security Rules

In Firebase Console → Firestore Database → Rules, paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read any profile
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Username reservations
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if false;
    }
  }
}
```

Click "Publish"

### 5. Test Locally

```powershell
npm start
```

Try:
1. Creating an account at /signup
2. Logging in at /login
3. Editing your profile at /dashboard
4. Viewing your profile at /yourusername

### 6. Deploy to Vercel

```powershell
git init
git add .
git commit -m "Initial commit - Phase 1"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/official-you.git
git push -u origin main
```

Then deploy on Vercel as usual.

## What Works in Phase 1

- ✅ User signup with email/password
- ✅ Real-time username availability checking
- ✅ Login/logout
- ✅ Profile editing (name and motto)
- ✅ Public profile viewing
- ✅ Automatic profile URL (offu.io/username format)

## What's Coming in Phase 2

- Google Sign-in
- Profile picture upload
- Location, email, phone fields
- Social media links

## Troubleshooting

**"Firebase not configured" error:**
- Make sure you replaced the config in `src/firebase.js` with your actual Firebase config

**Username checking not working:**
- Check Firestore security rules are published
- Check browser console for errors

**Can't log in:**
- Make sure Email/Password auth is enabled in Firebase Console

## File Structure

```
official-you/
├── src/
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Signup.js
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   └── Profile.js
│   ├── App.js
│   ├── App.css
│   ├── firebase.js
│   └── index.js
├── public/
└── package.json
```

## Need Help?

Common issues and how to fix them:

1. **Module not found errors** → Run `npm install`
2. **Firebase errors** → Check your config in firebase.js
3. **Auth not working** → Enable Email/Password in Firebase Console
4. **Username already taken** → Try a different username

Let me know when you're ready to start Phase 2!
