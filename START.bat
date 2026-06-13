@echo off
echo ==========================================
echo  BetPro Setup - SDK 54
echo ==========================================
echo.

echo [1/3] Clearing old install...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo [2/3] Installing dependencies...
call npm install --legacy-peer-deps

echo.
echo ==========================================
echo [3/3] Starting BetPro...
echo ==========================================
call npx expo start

pause
