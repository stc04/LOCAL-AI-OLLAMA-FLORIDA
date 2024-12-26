@echo off
echo Starting Web UI...
echo.

echo Starting backend server...
start cmd /k "npm run server"

echo Starting frontend development server...
cd frontend
start cmd /k "npm start"

echo.
echo Both servers are starting up. Please wait a moment...
echo The frontend will automatically open in your default browser.
