./setup@echo off
echo Setting up Ollama Web UI...

echo Creating directories...
if not exist "data" mkdir data
if not exist "frontend\public" mkdir frontend\public

echo Creating environment files...
echo PORT=5000> .env
echo JWT_SECRET=your_jwt_secret_key_here>> .env
echo OLLAMA_API_URL=http://localhost:11434>> .env

echo REACT_APP_API_URL=http://localhost:5000/api> frontend\.env

echo Cleaning up old dependencies...
if exist "node_modules" rd /s /q node_modules
if exist "frontend\node_modules" rd /s /q frontend\node_modules

echo Installing backend dependencies...
call npm install

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Stopping any running servers...
taskkill /F /IM node.exe /T 2>nul

echo Starting development servers...
start cmd /k "npm run dev"
timeout /t 5
start cmd /k "cd frontend && npm start"

echo Setup complete! The application should open in your default browser shortly.
echo Backend running on: http://localhost:5000
echo Frontend running on: http://localhost:3000

echo.
echo Default admin credentials:
echo Email: admin@example.com
echo Password: admin123
echo.
echo You can log in with these credentials at http://localhost:3000/login
echo.
