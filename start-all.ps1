# AI Skill Gap System - Complete Startup Script

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "AI Skill Gap Analysis System" -ForegroundColor Cyan
Write-Host "Complete Startup Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check MongoDB
Write-Host "`nChecking MongoDB..." -ForegroundColor Yellow
$mongo = Get-NetTCPConnection -LocalPort 27017 -State Listen -ErrorAction SilentlyContinue
if ($mongo) {
    Write-Host "✓ MongoDB is running on port 27017" -ForegroundColor Green
} else {
    Write-Host "✗ MongoDB is NOT running!" -ForegroundColor Red
    Write-Host "Please start MongoDB first:" -ForegroundColor Yellow
    Write-Host "  net start MongoDB" -ForegroundColor White
    exit 1
}

# Clean up any existing servers
Write-Host "`nCleaning up existing servers..." -ForegroundColor Yellow

# Kill backend on 5001
$backendPid = (Get-NetTCPConnection -LocalPort 5001 -State Listen -ErrorAction SilentlyContinue).OwningProcess
if ($backendPid) {
    Stop-Process -Id $backendPid -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Stopped existing backend (PID: $backendPid)" -ForegroundColor Green
}

# Kill frontend on 5173-5180
5173..5180 | ForEach-Object {
    $frontendPid = (Get-NetTCPConnection -LocalPort $_ -State Listen -ErrorAction SilentlyContinue).OwningProcess
    if ($frontendPid) {
        Stop-Process -Id $frontendPid -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Stopped existing frontend on port $_ (PID: $frontendPid)" -ForegroundColor Green
    }
}

Start-Sleep -Seconds 2

# Start Backend
Write-Host "`nStarting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; .\start-backend.ps1"
Start-Sleep -Seconds 3

# Verify backend started
$backendRunning = Get-NetTCPConnection -LocalPort 5001 -State Listen -ErrorAction SilentlyContinue
if ($backendRunning) {
    Write-Host "✓ Backend started successfully on port 5001" -ForegroundColor Green
} else {
    Write-Host "✗ Backend failed to start!" -ForegroundColor Red
    exit 1
}

# Start Frontend
Write-Host "`nStarting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"
Start-Sleep -Seconds 3

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host "Servers Started Successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "`nBackend:  http://localhost:5001" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173 (or next available)" -ForegroundColor White
Write-Host "`nMongoDB:  Port 27017" -ForegroundColor White
Write-Host "AI Model: gemini-1.5-pro" -ForegroundColor White
Write-Host "`n=========================================" -ForegroundColor Cyan
