# Nginx Configuration Verification Checklist

## 🎯 Your Current Issue
- Blank white screen in production
- "Unexpected end of input" error
- Works with force refresh locally

## ✅ Nginx Configuration Audit

### Step 1: Check Current Nginx Config

```bash
# Find your nginx config
cat /etc/nginx/sites-available/default
# OR
cat /etc/nginx/sites-available/admin.fdrpjournals.org
# OR (if using nginx.conf directly)
cat /etc/nginx/nginx.conf
```

### Step 2: Verify GZIP is Enabled

**REQUIRED**: Look for these lines in your server block:

```nginx
gzip on;
gzip_types application/json text/css application/javascript;
```

**If you see ONLY:**
```nginx
gzip on;
gzip_types text/html;  # ❌ WRONG - missing app/javascript
```

**Fix it in your server block:**
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types 
    text/plain 
    text/css 
    text/xml 
    text/javascript 
    application/x-javascript 
    application/xml+rss 
    application/javascript 
    application/json 
    application/xml;
```

### Step 3: Verify SPA Routing

**REQUIRED**: Make sure root location has:

```nginx
location / {
    # Critical for SPA - must redirect /route to /index.html
    try_files $uri $uri/ /index.html;
}
```

❌ Common mistake:
```nginx
location / {
    root /var/www/ems-frontend/dist;
    # Missing: try_files $uri $uri/ /index.html;
    # Result: Direct file not found → 404 → blank page
}
```

### Step 4: Check Cache Headers

**RECOMMENDED** (add to your config):

```nginx
# For files with hash in filename (never change)
location ~* ^/assets/.*\.[a-z0-9]{8}\.(js|css|woff2)$ {
    expires 1y;
    add_header Cache-Control "public,immutable" always;
    access_log off;
}

# For HTML (must always check for updates)
location ~* \.html$ {
    expires 0;
    add_header Cache-Control "public,must-revalidate" always;
    add_header ETag "1" always;
}
```

### Step 5: Remove .gz/.br Files from Dist

⚠️ **CRITICAL**: If you currently have:

```bash
ls dist/assets/*.gz
ls dist/assets/*.br
# If they exist: DELETE THEM
rm -f dist/assets/*.gz dist/assets/*.br
```

These files will cause your exact error if Nginx doesn't recognize them.

### Step 6: Check File Permissions

```bash
# Should be readable by www-data
ls -la /var/www/ems-frontend/dist/

# If not, fix with:
sudo chown -R www-data:www-data /var/www/ems-frontend/dist
sudo chmod -R 755 /var/www/ems-frontend/dist
```

### Step 7: Verify SSL Configuration

```nginx
# MUST have:
listen 443 ssl http2;
ssl_certificate /path/to/cert.crt;
ssl_certificate_key /path/to/key.key;

# SHOULD have (modern browsers):
ssl_protocols TLSv1.2 TLSv1.3;

# Redirect HTTP → HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

### Step 8: Test Nginx Config

```bash
# Check for syntax errors
sudo nginx -t

# Output should be:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 9: Reload Nginx (No Downtime)

```bash
# Graceful reload (connections kept alive)
sudo systemctl reload nginx

# Or restart if needed
sudo systemctl restart nginx
```

### Step 10: Verify with curl

```bash
# Check if Nginx is sending gzip header
curl -I -H "Accept-Encoding: gzip,deflate" https://admin.fdrpjournals.org/assets/index*.js

# Look for:
# ✓ Content-Encoding: gzip
# ✓ HTTP/2 200
# ✗ Should NOT see "Content-Encoding: br" if sending .br file

# Test HTML endpoint
curl -I https://admin.fdrpjournals.org/

# Should get:
# ✓ HTTP/2 200
# ✓ Content-Type: text/html
```

---

## 🧪 Browser Testing Checklist

### Test 1: Fresh Install
1. Open **incognito/private window**
2. Go to `https://admin.fdrpjournals.org`
3. Press **F12** → **Network** tab
4. Perform any action (login, navigation)
5. ✓ Should see NO "Unexpected end of input" error
6. ✓ Should see all assets loading (green 200 status)

### Test 2: Check Response Headers
1. F12 → Network tab
2. Click on `index-xxxxxxxx.js`
3. Check **Response Headers**:
   - ✓ `Content-Encoding: gzip` OR no encoding (if not gzipped)
   - ✓ `Content-Type: application/javascript`
   - ✓ `Cache-Control: public,must-revalidate` (or similar)

### Test 3: Clear Cache Test
1. F12 → Settings
2. Check "Disable cache" (while DevTools open)
3. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. ✓ App should load (not from local browser cache)

### Test 4: Monitor Sizes
In Network tab, check **Gzipped size** (not transfer size):
- ✓ Smaller files = faster loading
- ✓ No file should be > 250 KB gzipped
- ✓ Total JS should be < 250 KB gzipped

---

## 🔍 Common Nginx Mistakes

| Mistake | Result | Fix |
|---------|--------|-----|
| No `try_files $uri /index.html` | 404 errors on routes | Add to location / block |
| `gzip_types` doesn't include JS | Files are not compressed | Add `application/javascript` |
| .gz files in dist/ served as text | "Unexpected end of input" | Delete .gz files, let Nginx gzip |
| Wrong root path | 404 on all files | Verify `root /var/www/...` path |
| Cache headers incorrect | Old version cached forever | Set proper Cache-Control headers |
| No SSL/HTTP2 | Slow performance | Configure SSL & HTTP2 |

---

## 📝 Full Working Example

Here's a **copy-paste ready Nginx config**:

```nginx
server {
    listen 443 ssl http2;
    server_name admin.fdrpjournals.org;

    ssl_certificate /etc/ssl/certs/your-cert.crt;
    ssl_certificate_key /etc/ssl/private/your-key.key;
    ssl_protocols TLSv1.2 TLSv1.3;

    # GZIP compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/json application/xml+rss;
    gzip_min_length 1024;
    gzip_comp_level 6;

    # Set root to dist directory
    root /var/www/ems-frontend/dist;

    # Cache static assets (they have hash in filename)
    location ~* ^/assets/.*\.[a-z0-9]{8}\.(js|css|woff2|png|jpg|svg)$ {
        expires 1y;
        add_header Cache-Control "public,immutable" always;
    }

    # Cache-bust for HTML
    location ~* \.html$ {
        expires 0;
        add_header Cache-Control "public,must-revalidate" always;
    }

    # SPA routing - CRITICAL
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name admin.fdrpjournals.org;
    return 301 https://$server_name$request_uri;
}
```

---

## ✨ Final Steps

1. ✅ Update your Nginx config
2. ✅ Run `sudo nginx -t` to verify
3. ✅ Run `sudo systemctl reload nginx`
4. ✅ Delete any .gz/.br files from dist/
5. ✅ Clear browser cache and test
6. ✅ Check Network tab for gzip Content-Encoding
7. ✅ Monitor production for errors

**After these steps, your app should load perfectly! 🎉**

