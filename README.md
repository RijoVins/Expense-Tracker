# 💰 Expense Tracker App

A modern, full-featured expense and investment tracking application built with React, Vite, Firebase, and Tailwind CSS.

## ✨ Features

- 🔐 **User Authentication** - Secure login/signup with Firebase Auth
- 💳 **Expense Tracking** - Add, edit, delete expenses and income
- 📈 **Investment Management** - Track investments with profit/loss
- 📊 **Real-time Dashboard** - Live balance and summary statistics
- 💾 **Data Persistence** - Cloud storage with Firestore + local caching
- 🎨 **Premium UI** - Modern cyan-blue gradient theme
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔄 **Auto-sync** - Real-time data synchronization
- 🚀 **Fast Loading** - Instant load from cache

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State Management:** React Hooks

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account (free tier works!)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd Expense-Tracker
npm install
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable:
   - **Authentication** → Email/Password
   - **Firestore Database** → Start in test mode
4. Get your config from Project Settings

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Setup Firestore Rules

Go to **Firebase Console → Firestore → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /investments/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Click **Publish**.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📚 Usage

### Creating an Account

1. Click **"Create an Account"**
2. Enter email and password (6+ characters)
3. Click **Create Account**
4. You're logged in! ✅

### Adding Transactions

1. Fill in **Description** (e.g., "Salary", "Coffee")
2. Enter **Amount** (numeric value)
3. Select **Type** (Income or Expense)
4. Click **Add Transaction**
5. ✅ Data saves instantly to Firestore + localStorage

### Managing Investments

1. Go to **Investments** tab
2. Enter investment details
3. Add profit/loss amount
4. Click **Add Investment**
5. Edit or delete as needed

### Logout

Click **Logout** button in top-right corner safely logs you out.

## 🔒 Data Protection

Your data is protected with:

- ✅ **Firestore Security Rules** - Only you can access your data
- ✅ **User Authentication** - Secure login required
- ✅ **LocalStorage Caching** - Encrypted in your browser
- ✅ **HTTPS Encryption** - Data in transit is encrypted
- ✅ **User Isolation** - Each user sees only their data

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
npm run build
firebase login
firebase deploy
```

Your app will be live at `https://your-project.web.app` ✅

## 🆘 Troubleshooting

### Data disappearing on refresh?
→ Check [FIRESTORE_TROUBLESHOOTING.md](FIRESTORE_TROUBLESHOOTING.md)

### API Key error on deployment?
→ Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Login not working?
→ Ensure **Email/Password auth** is enabled in Firebase Console

### Data not saving?
→ Check Firestore rules in Firebase Console

## 📁 Project Structure

```
src/
├── components/
│   ├── LoginPage.jsx           # Auth page
│   ├── ui/
│   │   ├── button.jsx          # Button component
│   │   ├── card.jsx            # Card component
│   │   ├── input.jsx           # Input component
│   │   └── select.jsx          # Select component
│   └── FirestoreStatus.jsx     # Status indicator
├── context/
│   └── AuthContext.jsx         # Auth provider
├── lib/
│   └── firebase.js             # Firebase config
├── App.jsx                      # Main app
├── expense_tracker_app.jsx      # Tracker page
└── main.jsx                     # Entry point
```

## 🎨 Features Showcase

### Premium UI Theme
- Modern cyan-blue gradients
- Glass morphism effects
- Smooth animations
- Responsive design

### Real-time Features
- Instant data updates
- Live balance calculation
- Background sync
- Offline support

### Data Management
- Add/Edit/Delete transactions
- Investment tracking
- Balance summary
- Filter by type

## 💡 Tips

- **Offline Mode:** Data works offline with localStorage
- **Auto-save:** Transactions save instantly
- **Multi-device:** Data syncs across all your devices
- **Quick Access:** Logout and login to switch accounts

## 📄 License

MIT License - Feel free to use this project!

## 🤝 Support

For issues, check:
1. Browser console (F12) for errors
2. [FIRESTORE_TROUBLESHOOTING.md](FIRESTORE_TROUBLESHOOTING.md)
3. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 🎉 Built with ❤️

Happy expense tracking! 💰
"ji