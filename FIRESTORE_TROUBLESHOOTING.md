# 🔧 Firestore Data Loss Troubleshooting

**If your data disappears on refresh/logout, follow these steps:**

## ✅ Step 1: Verify Firestore is Created

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **expence-manager-22019**
3. Click **Build** → **Firestore Database**
4. You should see a database in **test mode**

**If not created:** Click "Create Database" → Start in test mode → Choose location → Enable

---

## ✅ Step 2: Update Firestore Security Rules (CRITICAL!)

**This is the most common issue!**

1. In Firebase Console, go **Firestore Database** → **Rules** tab
2. **Delete the current rules** (the ones with `if false`) and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /transactions/{docId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
    
    match /investments/{docId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click **Publish** (blue button)
4. Wait for it to say "Rules published successfully"

---

## ✅ Step 3: Check Browser Console

1. Open your app in browser: http://localhost:5174
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Add a transaction and look for:
   - ✅ `✅ Transaction saved to Firestore` = GOOD
   - ❌ `❌ Error adding transaction` or `permission-denied` = BAD

---

## ✅ Step 4: Test with Email Authentication

1. Make sure Email/Password is enabled:
   - Firebase Console → **Build** → **Authentication**
   - **Sign-in method** → Make sure **Email/Password** is **Enabled**

2. Create a test account and test:
   - Add transaction → Refresh page → Data should appear ✅
   - Logout → Login again → Same user's data should appear ✅
   - Login with different email → Empty data ✅

---

## 📱 How Data Works Now

```
Add Transaction
    ↓
Save to Firestore (cloud)
    ↓
Also save to localStorage (local backup)
    ↓
Refresh page?
    ↓
Load from localStorage instantly
    ↓
Sync with Firestore in background
```

---

## ❌ If Still Losing Data

Check Firefox/Chrome console (F12):

**`permission-denied` error?**
- Firestore rules are wrong
- Paste the rules from Step 2 exactly

**`auth/operation-not-allowed` error?**
- Email/Password not enabled
- Go to Firebase → Authentication → Enable Email/Password

**No Firestore errors but still losing data?**
- localStorage might be disabled
- Check browser privacy settings

---

## 💾 Data is Safe With:

✅ Firestore (permanent cloud storage)
✅ localStorage (instant loading + offline)
✅ Browser keeps you logged in (Firebase session)

**Even if Firestore is down, your data stays in localStorage!**

---

**Questions? Check the console (F12) for exact error messages!**
