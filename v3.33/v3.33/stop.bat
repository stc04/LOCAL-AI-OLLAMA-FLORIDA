@echo off
echo Stopping servers...

:: Find and kill the Node.js processes
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "3000"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "5000"') do taskkill /F /PID %%a >nul 2>&1

echo.
echo Servers have been stopped.
pause
