@echo off
title Quantum Mobile Store - Stopping Services...
color 0c

echo ========================================================
echo        QUANTUM MOBILE STORE - SHUTTING DOWN             
echo ========================================================
echo.

echo [*] Stopping processes on Port 5000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo [OK] Killed backend process PID %%a
)

echo [*] Stopping processes on Port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo [OK] Killed frontend process PID %%a
)

echo.
echo ========================================================
echo [OK] All Quantum Mobile dev servers stopped.
echo ========================================================
timeout /t 2 /nobreak >nul
exit

