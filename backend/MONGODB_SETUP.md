# 📦 MongoDB Installation Guide

## Choose Your Installation Method

### 🌟 Recommended: MongoDB Atlas (Cloud - Free)
**Pros:** No installation, free tier, accessible anywhere, automatic backups
**Cons:** Requires internet connection

### 🖥️ Alternative: Local MongoDB
**Pros:** Works offline, no data limits, faster for development
**Cons:** Requires installation and local storage

---

## Option 1: MongoDB Atlas (Cloud - Easiest)

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Sign up with email or Google account

### Step 2: Create Cluster
1. Choose "M0 FREE" tier
2. Select cloud provider (AWS recommended)
3. Choose region closest to you
4. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Configure Access
1. Click "Connect" on your cluster
2. **Whitelist IP Address:**
   - Click "Add a Different IP Address"
   - Enter `0.0.0.0/0` (allows all IPs - for development only)
   - Click "Add IP Address"

3. **Create Database User:**
   - Username: `skillgap_user`
   - Password: Create a strong password
   - Click "Create Database User"

### Step 4: Get Connection String
1. Click "Choose a connection method"
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add to `backend/.env`:

```env
MONGODB_URI=mongodb+srv://skillgap_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/skill-gap-db?retryWrites=true&w=majority
```

### Step 5: Test Connection
```powershell
cd backend
npm run dev
```

Look for: `✅ MongoDB Connected: cluster0-shard...`

---

## Option 2: Local MongoDB Installation

### Windows

#### Method A: MongoDB Installer
1. Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Run the `.msi` installer
3. Choose "Complete" installation
4. Install as a Windows Service (checkbox)
5. Install MongoDB Compass (optional GUI)

#### Method B: Chocolatey (if installed)
```powershell
choco install mongodb
```

#### Start MongoDB
MongoDB should start automatically as a Windows Service.

**To manually start:**
```powershell
net start MongoDB
```

**To check if running:**
```powershell
mongosh
```

#### Configure .env
```env
MONGODB_URI=mongodb://localhost:27017/skill-gap-db
```

### macOS

#### Using Homebrew (Recommended)
```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify installation
mongosh
```

#### Configure .env
```env
MONGODB_URI=mongodb://localhost:27017/skill-gap-db
```

### Linux (Ubuntu/Debian)

```bash
# Import GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

#### Configure .env
```env
MONGODB_URI=mongodb://localhost:27017/skill-gap-db
```

---

## Verify Installation

### 1. Check MongoDB is Running

**MongoDB Atlas:**
- Login to [MongoDB Atlas](https://cloud.mongodb.com/)
- Cluster status should show "Active"

**Local MongoDB:**
```powershell
# Windows/Mac/Linux
mongosh
```

Should connect without errors.

### 2. Test Backend Connection
```powershell
cd backend
npm run dev
```

Look for:
```
✅ MongoDB Connected: localhost
```
or
```
✅ MongoDB Connected: cluster0-shard-00-00...
```

### 3. Seed Database
```powershell
cd backend
npm run seed
```

Should output:
```
✅ Cleared existing job roles
✅ Inserted 7 job roles
🎉 Database seeded successfully!
```

---

## MongoDB GUI Tools (Optional)

### MongoDB Compass (Official)
- Download: [MongoDB Compass](https://www.mongodb.com/products/compass)
- Visual interface for MongoDB
- Great for viewing data and running queries

**Connection String:**
- Atlas: Use the connection string from Atlas
- Local: `mongodb://localhost:27017`

### Studio 3T (Alternative)
- Download: [Studio 3T](https://studio3t.com/)
- More features than Compass
- Free for non-commercial use

---

## Troubleshooting

### MongoDB Atlas

**Can't connect - "connection refused":**
1. Check IP whitelist includes `0.0.0.0/0`
2. Verify password in connection string is URL-encoded
3. Check cluster is active (not paused)

**ailed to authenticate:**
- Double-check username and password
- Password should be URL-encoded (spaces = %20, @ = %40, etc.)

### Local MongoDB

**"mongod" not found:**
- MongoDB not installed correctly
- Add MongoDB to PATH:
  - Windows: `C:\Program Files\MongoDB\Server\7.0\bin`
  - Mac: Usually automatic with Homebrew
  - Linux: Usually automatic with apt

**Connection refused:**
```powershell
# Windows - Start MongoDB service
net start MongoDB

# Mac - Start with Homebrew
brew services start mongodb-community

# Linux - Start with systemctl
sudo systemctl start mongod
```

**Port 27017 already in use:**
```powershell
# Find process using port 27017
# Windows
netstat -ano | findstr :27017

# Mac/Linux
lsof -i :27017

# Kill the process or use different port in .env
```

---

## Quick Reference

### Connection Strings

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Local MongoDB:**
```
mongodb://localhost:27017/database
```

**Local with authentication:**
```
mongodb://username:password@localhost:27017/database
```

### Common Commands

```bash
# Start MongoDB (local)
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use database
use skill-gap-db

# Show collections
show collections

# Query data
db.resumes.find()
```

---

## Security Best Practices

### For Development (Local)
- Use simple password
- Connection string: `mongodb://localhost:27017/skill-gap-db`

### For Production
- Use strong passwords
- Enable authentication
- Whitelist specific IP addresses only
- Use environment variables
- Enable SSL/TLS
- Regular backups

---

## Need Help?

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Atlas Support**: https://www.mongodb.com/cloud/atlas/support
- **Community Forums**: https://www.mongodb.com/community/forums/

---

**Recommended Setup:**
1. MongoDB Atlas for ease of use
2. Local MongoDB for offline development

Both work perfectly with this application!
