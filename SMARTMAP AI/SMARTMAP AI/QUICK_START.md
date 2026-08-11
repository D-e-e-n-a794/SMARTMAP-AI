# ⚡ QUICK SETUP GUIDE - Windows

## 🚀 Get Started in 5 Minutes!

### Step 1: Extract ZIP
Right-click `smartmap-pro.zip` → Extract All → Choose location

### Step 2: Install Dependencies

**Open PowerShell in the `smartmap-pro` folder:**

```powershell
# Install Backend
cd server
npm install

# Install Frontend (open NEW PowerShell)
cd client
npm install
```

### Step 3: Get MongoDB URL

1. Go to: **https://cloud.mongodb.com**
2. Sign up FREE (no credit card)
3. Create cluster (FREE M0)
4. Get connection string

### Step 4: Configure .env Files

**Backend:**
```powershell
cd server
copy .env.example .env
notepad .env
```

Paste your MongoDB URL:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartmap
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

**Frontend:**
```powershell
cd client
copy .env.example .env
```

### Step 5: Seed Database

```powershell
cd server
npm run seed
```

Should show: ✅ Created 15 places

### Step 6: Run Application

**Terminal 1 - Backend:**
```powershell
cd server
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm start
```

**Browser opens at:** http://localhost:3000

---

## ✅ What You Should See:

- ✅ Beautiful dark theme with golden accents
- ✅ Interactive map with 15 places
- ✅ Working search and filters
- ✅ AI Recommendations tab
- ✅ Analytics dashboard with charts

---

## 🐛 Common Issues

### Port 5000 in use?
```powershell
npx kill-port 5000
```

### MongoDB connection failed?
- Check your password is correct
- Go to MongoDB Atlas → Network Access
- Add IP: 0.0.0.0/0 (Allow from anywhere)

### Frontend blank screen?
- Check backend is running
- Check browser console (F12)
- Verify .env files are configured

---

## 📚 Full Documentation

See **README.md** for complete documentation!

---

**Enjoy SmartMap AI! 🗺️✨**
