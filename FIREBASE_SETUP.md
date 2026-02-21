# Firebase Setup Guide

This app uses Firebase Firestore for persistent data storage. Follow these steps to set up your free Firebase project.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "expense-tracker")
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Create a Web App

1. In your Firebase project, click the web icon (`</>`) to add a web app
2. Enter a nickname (e.g., "Expense Tracker Web")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the `firebaseConfig` object values

## Step 3: Configure Firestore Database

1. In Firebase Console, go to "Build" > "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location closest to you
5. Click "Enable"

## Step 4: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```

2. Edit `.env` with your Firebase config values:
   ```
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

## Step 5: Configure Firestore Security Rules

⚠️ **Important for User Data Privacy**

After creating your Firestore database, update the security rules in Firebase Console to protect user data:

1. Go to **Firebase Console** → Your Project → **Build** → **Firestore Database**
2. Click the **Rules** tab
3. Replace the default rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
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

4. Click **Publish**

✅ **What these rules do:**
- Users can only read transactions/investments where `userId` matches their `uid`
- Users can only create documents with their own `userId`
- All data is protected from unauthorized access

## Step 6: Run the App

```bash
npm run dev
```

## User Data Isolation

✅ **How your data is protected:**

1. **Each user has a unique ID** - Provided by Firebase Authentication
2. **All documents include userId** - Transactions and investments are tagged with the user who created them
3. **Security rules enforce privacy** - Users can only access their own data
4. **Login/Logout preserves data** - Each user logs in and sees only their past data

Examples:
- User A creates transaction → `transactions[{userId: 'user_a_id', ...}]`
- User B creates transaction → `transactions[{userId: 'user_b_id', ...}]`
- When User A logs in → Only User A's transactions are displayed
- When User B logs in → Only User B's transactions are displayed

## Free Tier Limits (Spark Plan)

Firebase Firestore free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day
- 1 GB total storage

This is sufficient for personal use and development.

## Troubleshooting

### "Firebase: Error (auth/unauthorized)"
- Make sure Firestore is enabled in your Firebase Console
- Check that your security rules allow read/write

### "Firebase: No Firebase App"
- Verify your `.env` file has all required variables
- Restart the dev server after updating `.env`

### Data not persisting
- Check the browser console for Firebase errors
- Verify Firestore is created and rules are set correctly