# 🚀 Deployment Guide - Firebase API Key Error

**Error:** `Firebase: Error (auth/api-key-not-valid)`

This happens because **environment variables aren't set** on your deployment platform.

## 📋 Where You're Deploying?

Choose your platform below:

### **Option 1: Firebase Hosting**

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting in your project:**
   ```bash
   firebase init hosting
   ```

4. **Update `firebase.json`:**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

5. **Build your app:**
   ```bash
   npm run build
   ```

6. **Deploy:**
   ```bash
   firebase deploy
   ```

**DONE!** Firebase knows your credentials automatically.

---

### **Option 2: Vercel**

1. **Push to GitHub** (if not already):
   ```bash
   git push
   ```

2. **Go to [Vercel.com](https://vercel.com)**
3. **Import your GitHub repository**
4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add each variable from your `.env` file:
     ```
     VITE_FIREBASE_API_KEY = AIzaSyDJZSSq2a5kHXwMcfLGzqoHLkhIhz6tk4Y
     VITE_FIREBASE_AUTH_DOMAIN = expence-manager-22019.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID = expence-manager-22019
     VITE_FIREBASE_STORAGE_BUCKET = expence-manager-22019.firebasestorage.app
     VITE_FIREBASE_MESSAGING_SENDER_ID = 1032571557010
     VITE_FIREBASE_APP_ID = 1:1032571557010:web:23a54e217f100e63ab424b
     ```
5. **Deploy** - Vercel automatically redeploys with new env vars

---

### **Option 3: Netlify**

1. **Go to [Netlify.com](https://netlify.com)**
2. **Connect your GitHub repo**
3. **Add Environment Variables:**
   - Site Settings → Build & Deploy → Environment
   - Add all `VITE_*` variables from `.env`
4. **Deploy** - Netlify automatically rebuilds with env vars

---

### **Option 4: GitHub Pages**

⚠️ **Warning:** GitHub Pages is **static only** - won't work with environment variables.

Use **Firebase Hosting**, **Vercel**, or **Netlify** instead.

---

## ✅ Step-by-Step for Most Common Setups

### **Recommended: Use Firebase Hosting (simplest)**

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Build your app
npm run build

# 3. Login and deploy
firebase login
firebase deploy
```

**Done!** Your app is live at `https://your-project-name.web.app`

---

## 🔍 Verify Deployment Works

After deployment:

1. Go to your deployed URL
2. Open **Browser Console** (F12)
3. You should **NOT** see:
   - ❌ `Firebase: Error (auth/api-key-not-valid)`
   - ❌ `auth/configuration-not-found`
4. You should see:
   - ✅ Login page loads
   - ✅ Can create account
   - ✅ Data saves to Firestore

---

## 🆘 Still Getting API Key Error?

1. **Check environment variables are set** in your hosting platform
2. **Verify API key is correct** - copy from Firebase Console
3. **Rebuild and redeploy:**
   ```bash
   npm run build
   firebase deploy  # or redeploy on Vercel/Netlify
   ```
4. **Clear browser cache** (Ctrl+Shift+Delete)
5. **Check browser console** for exact error message

---

**Which platform are you using?** Let me know and I'll help with specific steps!
