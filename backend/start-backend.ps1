# AI Skill Gap Backend Startup Script
# This ensures the backend ALWAYS runs on port 5001

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Starting AI Skill Gap Backend" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Step 1: Kill any existing process on port 5001
Write-Host "`n[1/4] Checking for existing backend on port 5001..." -ForegroundColor Yellow
$existingProcess = Get-NetTCPConnection -LocalPort 5001 -State Listen -ErrorAction SilentlyContinue
if ($existingProcess) {
    $pid = $existingProcess.OwningProcess
    Write-Host "      Found existing process (PID: $pid). Stopping it..." -ForegroundColor Yellow
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "      ✓ Stopped" -ForegroundColor Green
} else {
    Write-Host "      ✓ Port 5001 is free" -ForegroundColor Green
}

# Step 2: Verify MongoDB connection
Write-Host "`n[2/4] Verifying MongoDB connection on port 27017..." -ForegroundColor Yellow
$mongoProcess = Get-NetTCPConnection -LocalPort 27017 -State Listen -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "      ✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "      ✗ MongoDB is NOT running! Please start MongoDB first." -ForegroundColor Red
    exit 1
}

# Step 3: Check environment variables
Write-Host "`n[3/4] Checking environment variables..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "      ✓ .env file found" -ForegroundColor Green
} else {
    Write-Host "      ✗ .env file NOT found!" -ForegroundColor Red
    exit 1
}

# Step 4: Start the backend server
Write-Host "`n[4/4] Starting backend server..." -ForegroundColor Yellow
Write-Host "      Port: 5001" -ForegroundColor Cyan
Write-Host "      Model: gemini-1.5-pro" -ForegroundColor Cyan
Write-Host "" 

# Start the server
npm start
