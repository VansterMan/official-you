# Official You - Logo Usage Guide

## Files Included

1. **official-you-logo.svg** - Full detail logo for web use
2. **favicon.svg** - Simplified version optimized for small sizes (16x16, 32x32)
3. **Logo.js** - React component for easy integration

---

## How to Use the Logo

### In Your React App

**Option 1: Use the React Component**

1. Copy `Logo.js` to `src/components/Logo.js`
2. Import and use it:

```javascript
import Logo from './components/Logo';

// In your component:
<Logo size={60} />
```

**Option 2: Use SVG Directly**

1. Copy `official-you-logo.svg` to `public/logo.svg`
2. Reference it in your code:

```javascript
<img src="/logo.svg" alt="Official You" width="60" height="60" />
```

---

## Adding Logo to Specific Pages

### Home Page (Header)

Replace the text "Official You" with the logo + text combo:

```javascript
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
  <Logo size={48} />
  <h1 style={{ 
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '48px',
    color: 'white'
  }}>
    Official You
  </h1>
</div>
```

### Dashboard Header

Add logo to the navigation:

```javascript
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <Logo size={32} />
  <h1 style={{ 
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '24px'
  }}>
    Official You
  </h1>
</div>
```

### Favicon Setup

1. Convert `favicon.svg` to PNG (16x16 and 32x32)
   - Use a tool like https://cloudconvert.com/svg-to-png
   - Or use this command if you have ImageMagick:
   ```bash
   convert -background none -resize 32x32 favicon.svg favicon-32.png
   convert -background none -resize 16x16 favicon.svg favicon-16.png
   ```

2. Add to `public/index.html`:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
```

---

## Logo Specifications

### Colors
- Gradient: `#0A9D93` → `#0077B6`
- Background (when needed): Transparent or white

### Sizing Guidelines
- **Minimum size:** 24px (smaller loses detail)
- **Optimal sizes:** 32px, 48px, 64px, 120px
- **Header/Nav:** 32-48px
- **Hero/Landing:** 80-120px
- **Favicon:** 16px, 32px (use simplified version)

### Spacing
- Clear space around logo: minimum 1/4 of logo height
- Don't crowd the logo with other elements

### Don'ts
- ❌ Don't change the colors (use gradient as-is)
- ❌ Don't rotate or skew
- ❌ Don't add effects (shadows, glows, etc.) 
- ❌ Don't use on busy backgrounds (keep it simple)
- ❌ Don't stretch or distort

---

## Logo Variations

### Full Logo (Icon + Wordmark)
Use when you have space - combines the "O" symbol with "Official You" text

### Icon Only
Use in tight spaces:
- Social media profile pictures
- App icons
- Favicon
- Navigation (when space is limited)

### Wordmark Only
Use when brand recognition is established and space allows

---

## Next Steps

1. **Add logo to your app** using Logo.js component
2. **Set up favicon** in public/index.html
3. **Update social media** profiles with the new logo
4. **Create branded materials** (if needed - business cards, etc.)

The logo is scalable (SVG) so it will look crisp on any screen, from mobile to 4K displays!
