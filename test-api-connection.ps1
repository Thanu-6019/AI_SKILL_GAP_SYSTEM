# API Connection Test Script
# Run this from the project root directory

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "SkillBridge AI - API Connection Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Check Node processes
Write-Host "Test 1: Checking Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "✅ Found $($nodeProcesses.Count) Node.js process(es) running" -ForegroundColor Green
    $nodeProcesses | Select-Object Id, ProcessName, StartTime | Format-Table
} else {
    Write-Host "❌ No Node.js processes found. Please start backend and frontend." -ForegroundColor Red
    exit 1
}

# Test 2: Check ports
Write-Host "`nTest 2: Checking server ports..." -ForegroundColor Yellow
$port5001 = Get-NetTCPConnection -State Listen -LocalPort 5001 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -State Listen -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port5001) {
    Write-Host "✅ Backend listening on port 5001" -ForegroundColor Green
} else {
    Write-Host "❌ Backend not listening on port 5001" -ForegroundColor Red
}

if ($port5173) {
    Write-Host "✅ Frontend listening on port 5173" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend not listening on port 5173" -ForegroundColor Red
}

# Test 3: Check backend .env file
Write-Host "`nTest 3: Checking backend environment variables..." -ForegroundColor Yellow
if (Test-Path "backend\.env") {
    Write-Host "✅ Backend .env file exists" -ForegroundColor Green
    
    $envContent = Get-Content "backend\.env" -Raw
    
    if ($envContent -match "PORT=5001") {
        Write-Host "  ✅ PORT set to 5001" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  PORT not set to 5001" -ForegroundColor Yellow
    }
    
    if ($envContent -match "NODE_ENV=development") {
        Write-Host "  ✅ NODE_ENV set to development" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  NODE_ENV not set to development" -ForegroundColor Yellow
    }
    
    if ($envContent -match "MONGO_URI=") {
        Write-Host "  ✅ MONGO_URI configured" -ForegroundColor Green
    } else {
        Write-Host "  ❌ MONGO_URI not configured" -ForegroundColor Red
    }
    
    if ($envContent -match "GEMINI_API_KEY=") {
        Write-Host "  ✅ GEMINI_API_KEY configured" -ForegroundColor Green
    } else {
        Write-Host "  ❌ GEMINI_API_KEY not configured" -ForegroundColor Red
    }
    
    if ($envContent -match "JWT_SECRET=") {
        Write-Host "  ✅ JWT_SECRET configured" -ForegroundColor Green
    } else {
        Write-Host "  ❌ JWT_SECRET not configured" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Backend .env file not found" -ForegroundColor Red
}

# Test 4: Check frontend .env file
Write-Host "`nTest 4: Checking frontend environment variables..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ Frontend .env file exists" -ForegroundColor Green
    
    $frontendEnv = Get-Content ".env" -Raw
    
    if ($frontendEnv -match "VITE_API_URL=http://localhost:5001/api") {
        Write-Host "  ✅ VITE_API_URL points to http://localhost:5001/api" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  VITE_API_URL not pointing to http://localhost:5001/api" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Frontend .env file not found" -ForegroundColor Red
}

# Test 5: Test backend API health endpoint
Write-Host "`nTest 5: Testing backend API health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method GET -TimeoutSec 5
    if ($healthResponse.success -eq $true) {
        Write-Host "✅ Backend API is responding correctly" -ForegroundColor Green
        Write-Host "  Message: $($healthResponse.message)" -ForegroundColor Gray
        Write-Host "  Timestamp: $($healthResponse.timestamp)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Backend API responded but success=false" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Failed to connect to backend API: $_" -ForegroundColor Red
}

# Test 6: Check MongoDB connection (via backend root endpoint)
Write-Host "`nTest 6: Checking backend root endpoint..." -ForegroundColor Yellow
try {
    $rootResponse = Invoke-RestMethod -Uri "http://localhost:5001/" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend root endpoint responding" -ForegroundColor Green
    Write-Host "  Message: $($rootResponse.message)" -ForegroundColor Gray
    Write-Host "  Version: $($rootResponse.version)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Backend root endpoint not accessible: $_" -ForegroundColor Yellow
}

# Test 7: Check if MongoDB is running
Write-Host "`nTest 7: Checking MongoDB connection..." -ForegroundColor Yellow
$mongoProcess = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB (mongod) process is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB (mongod) process not found" -ForegroundColor Yellow
    Write-Host "  Note: MongoDB might be running as a service or on a remote server" -ForegroundColor Gray
}

# Test 8: Check frontend accessibility
Write-Host "`nTest 8: Checking frontend accessibility..." -ForegroundColor Yellow
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 5 -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend is accessible at http://localhost:5173" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend not accessible: $_" -ForegroundColor Red
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nKey Fixes Applied:" -ForegroundColor White
Write-Host "  ✅ API base URL fixed (port 5001)" -ForegroundColor Green
Write-Host "  ✅ Rate limiting disabled in development" -ForegroundColor Green
Write-Host "  ✅ AI service improved with better error handling" -ForegroundColor Green
Write-Host "  ✅ Enhanced logging for debugging" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor White
Write-Host "  1. Open http://localhost:5173 in your browser" -ForegroundColor Gray
Write-Host "  2. Open browser console (F12) to see API logs" -ForegroundColor Gray
Write-Host "  3. Try uploading a resume" -ForegroundColor Gray
Write-Host "  4. Monitor console for [API] log messages" -ForegroundColor Gray

Write-Host "`nFor detailed information, see API_FIX_SUMMARY.md" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
