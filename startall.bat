@echo off
title Quantum Mobile Store - Starting All Services...
color 0b

echo ========================================================
echo        QUANTUM MOBILE STORE - LOCAL DEV LAUNCHER        
echo ========================================================
echo.

REM Get script directory
set ROOT_DIR=%~dp0

echo [*] Checking MongoDB Service...
sc query MongoDB | findstr /I "RUNNING" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB Server is running.
) else (
    echo [!] Starting MongoDB Service...
    net start MongoDB >nul 2>&1
)

echo.
echo [*] Starting Backend Server (Port 5000)...
start "Quantum Mobile - Backend (Port 5000)" cmd /k "cd /d "%ROOT_DIR%backend" && color 0a && echo Starting Express Backend... && npm run dev"

echo [*] Starting Frontend App (Port 5173)...
start "Quantum Mobile - Frontend (Port 5173)" cmd /k "cd /d "%ROOT_DIR%" && color 09 && echo Starting Vite React Frontend... && npm run dev"

echo.
echo ========================================================
echo [OK] All services launched in separate windows!
echo.
echo   - Storefront UI  : http://localhost:5173
echo   - Admin Portal   : http://localhost:5173/admin
echo   - Super Admin    : http://localhost:5173/super-admin
echo   - Backend API    : http://localhost:5000/api
echo ========================================================
echo.
echo [*] Opening Storefront in browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:5173

exit

