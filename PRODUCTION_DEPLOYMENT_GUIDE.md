# EMS Frontend - Production Debugging & Deployment Guide

## 🔴 Problem You Experienced
- Blank white screen after deployment
- "Uncaught SyntaxError: Unexpected end of input" in assets/index-[hash].js
- Force refresh (Ctrl+Shift+R) sometimes works
- Works in development

## ✅ Root Cause
**Vite compression plugins creating .gz/.br files + Nginx not configured to serve them with proper headers**
- Browser received gzip-compressed binary data
- Tried to parse binary as JavaScript
- Boom! "Unexpected end of input"

---

## 🔧 Step 1: Rebuild with Fixed Config

```bash
# Clean old build
rm -r dist

# Install dependencies (if needed)
npm install

# Build with new config (has code splitting)
npm run build

# Expected output:
# √ 4 chunks instead of 1 massive chunk
# dist/assets/index*.js, react-vendor*.js, state-management*.js, etc.
```

---

## 📋 Step 2: Verify Build Output

After building, check:

```bash
# Should see individual bundles
ls -lah dist/assets/

# Expected files (example):
# index-[hash].js          (main code)
# react-vendor-[hash].js   (React, React-DOM, Router)
# state-management-[hash].js (Redux)
# ui-components-[hash].js  (UI libraries)
# index-[hash].css         (styles)
# index.html               (entry point)

# NO .gz or .br files should be present
```

---

## 🌐 Step 3: Deploy to Nginx

### Option A: Deploy via SCP/SFTP
```bash
# From your local machine
scp -r dist/* user@admin.fdrpjournals.org:/var/www/ems-frontend/dist/

# Or using rsync (faster for large projects)
rsync -avz dist/ user@admin.fdrpjournals.org:/var/www/ems-frontend/dist/
```

### Option B: Deploy via Git
```bash
# On server
cd /var/www/ems-frontend
git pull origin main
npm ci --production=false && npm run build
```

---

## ⚙️ Step 4: Update Nginx Config

**CRITICAL**: Update your Nginx server block. Use the provided **nginx-config-example.conf**

Key sections to update:

### A. Enable Gzip (Let Nginx compress, not Vite)
```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/json;
gzip_comp_level 6;
gzip_min_length 1000;
```

### B. Set Cache Headers
```nginx
# Assets with hash in name (never change)
location ~* ^/assets/.*\.[a-z0-9]{8}\.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML (always revalidate)
location ~* \.html$ {
    expires 0;
    add_header Cache-Control "public, must-revalidate";
}
```

### C. SPA Routing Fix (IMPORTANT!)
```nginx
location / {
    root /var/www/ems-frontend/dist;
    try_files $uri $uri/ /index.html;  # Fallback to index.html
}
```

### D. Reload Nginx
```bash
# Test config
sudo nginx -t

# Reload (no downtime)
sudo systemctl reload nginx

# Or restart
sudo systemctl restart nginx
```

---

## 🧪 Step 5: Test Deployment

### Browser DevTools - Network Tab
1. Open https://admin.fdrpjournals.org
2. Press F12 → Network tab
3. Check **index.html**:
   - Status: **200 OK** (not 304)
   - Content-Encoding: **gzip** ✓

4. Check **index-[hash].js**:
   - Status: **200 OK**
   - Content-Encoding: **gzip** ✓
   - Size: ~200 KB (compressed)

### Browser Console - Check for Errors
```javascript
// Should be clean (maybe a warning or two, but no red errors)
// Especially no "Unexpected end of input"
```

### Test API Calls
1. Go to dashboard
2. Open Network tab
3. Perform action (login, fetch data, etc.)
4. Check API responses are working

---

## 🐛 Step 6: If Still Broken - Debug Checklist

### Check 1: File permissions
```bash
ls -la /var/www/ems-frontend/dist/
# Should show -rw-r--r-- permissions
# Fix: sudo chown -R www-data:www-data /var/www/ems-frontend/dist
```

### Check 2: Gzip mismatch
```bash
# Nginx should NOT be serving .gz files
ls /var/www/ems-frontend/dist/assets/*.gz
# Should show: No such file (good!)
# If .gz files exist: DELETE THEM
# rm -f /var/www/ems-frontend/dist/assets/*.gz
```

### Check 3: Verify Nginx config is loaded
```bash
sudo nginx -T | grep -A 20 "location /"
```

### Check 4: Check browser network response
```bash
# From server, test locally
curl -I https://admin.fdrpjournals.org/
# Check Content-Encoding header

curl -I https://admin.fdrpjournals.org/assets/index*.js
# Check Content-Encoding: gzip
```

### Check 5: Browser cache is the culprit
```
User's action:
1. Open DevTools (F12)
2. Settings → Network → Disable cache (while DevTools open)
3. Reload page (Ctrl+Shift+R)
4. Close DevTools
5. Full page reload (Ctrl+F5 or Cmd+Shift+R)
```

---

## 📊 Step 7: Monitor Build Size

Before deployment, always check:

```bash
npm run build

# After build completes, check sizes in terminal output:
# dist/assets/index*.js         should be ~120 KB (gzipped)
# dist/assets/react-vendor*.js  should be ~100 KB (gzipped)
# dist/assets/*.css             should be ~30 KB (gzipped)

# If ANY chunk > 300 KB uncompressed, it's a problem!
```

---

## 🚀 Quick Reference: Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Compression mismatch | "Unexpected end of input" | Remove .gz/.br files from dist, update Nginx |
| Large bundle | App loads slowly | Run new build with code splitting |
| Back button broken | Can't navigate | Add `try_files $uri /index.html` to Nginx |
| API endpoints failing | 404/CORS errors | Verify VITE_BASE_API_URL in .env |
| Styles missing | White screen with no CSS | Check Cache-Control headers |
| Old build cached | Still seeing old version | Clear browser cache + Nginx cache |

---

## 📝 Environment Variables to Double-Check

File: **.env**

```env
# Should match your production server
VITE_BASE_API_URL=https://admin.fdrpjournals.org/api
VITE_PUSHER_KEY=596eed13a8d67068de73
```

---

## ✨ Prevention - Best Practices Going Forward

1. **Always test compressed in dev**:
   ```bash
   npm run build
   npm run preview  # Serves dist/ like production
   ```

2. **Use environment-specific configs**:
   - `.env` - dev defaults
   - `.env.production` - prod overrides

3. **Set up CI/CD to auto-test**:
   - Run `npm run build` before deploy
   - Check bundle size hasn't increased

4. **Monitor production**:
   - Set up error tracking (Sentry, Rollbar)
   - Check Google PageSpeed Insights
   - Monitor Core Web Vitals

---

## 🎯 Expected Result After Fix

✅ App loads instantly on first visit  
✅ No blank white screen  
✅ No JavaScript errors  
✅ API calls working  
✅ Styles showing correctly  
✅ Navigation between pages smooth  
✅ Old build removed from cache after 1 hour  

