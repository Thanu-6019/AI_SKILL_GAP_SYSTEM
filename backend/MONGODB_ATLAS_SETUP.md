# MongoDB Atlas Deployment Guide

## 🚀 Step-by-Step Setup for Cloud Database

### 1. Access MongoDB Atlas
- Go to [MongoDB Atlas](https://cloud.mongodb.com/)
- Sign in with your account
- Select your project or create a new one

### 2. Configure Network Access (CRITICAL!)
This is the most common reason for connection failures.

**Steps:**
1. In the left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Choose one of these options:
   - **For Development/Testing**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **For Production**: Click "Add Current IP Address" to add your specific IP
4. Click **Confirm**
5. Wait 1-2 minutes for changes to propagate

### 3. Verify Database User Credentials
1. Go to **Database Access** in the left sidebar
2. Verify user `skillgap_admin` exists
3. If password was reset, update it in `.env` file:
   ```
   MONGO_URI=mongodb+srv://skillgap_admin:YOUR_NEW_PASSWORD@cluster0.jx01b6f.mongodb.net/ai_skill_gap?retryWrites=true&w=majority
   ```

### 4. Check Cluster Status
1. Go to **Database** (main dashboard)
2. Verify your cluster (Cluster0) is **Running** and not paused
3. If paused, click **Resume** to restart it

### 5. Get Updated Connection String (Optional)
If you need a fresh connection string:
1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Select **Node.js** driver and latest version
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add `/ai_skill_gap` before the `?` to specify the database

### 6. Test Connection
After completing the above steps, restart your backend:
```powershell
cd backend
node server.js
```

Look for: `✅ MongoDB Connected: cluster0.jx01b6f.mongodb.net`

## 🔒 Security Best Practices

### For Production:
1. **Use Specific IP Addresses**: Never use 0.0.0.0/0 in production
2. **Rotate Credentials**: Change passwords regularly
3. **Use Environment Variables**: Never commit .env files to git
4. **Enable Monitoring**: Set up Atlas alerts for unusual activity

### Connection String Format:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## 🆘 Common Issues

### Issue: "querySrv ECONNREFUSED"
**Solution**: IP address not whitelisted. Add your IP in Network Access.

### Issue: "Authentication failed"
**Solution**: Wrong password. Update credentials in Database Access and .env file.

### Issue: "Cluster not available"
**Solution**: Cluster might be paused. Resume it from the dashboard.

### Issue: "Connection timeout"
**Solution**: 
- Check your internet connection
- Verify firewall isn't blocking MongoDB ports
- Try switching networks (corporate firewalls often block MongoDB)

## 📊 Current Configuration
- **Cluster**: cluster0.jx01b6f.mongodb.net
- **Database**: ai_skill_gap
- **Username**: skillgap_admin
- **Environment File**: backend/.env

## 🔄 Switching Between Local and Cloud

### Use Local MongoDB:
```env
MONGO_URI=mongodb://localhost:27017/ai_skill_gap
```

### Use MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://skillgap_admin:YOUR_PASSWORD@cluster0.jx01b6f.mongodb.net/ai_skill_gap?retryWrites=true&w=majority
```

## 📖 Additional Resources
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)
- [Security Checklist](https://docs.atlas.mongodb.com/security/)
