@echo off
echo Building Think Around Blocks for production...

:: Install backend dependencies
echo Installing backend dependencies...
call npm install

:: Install and build frontend
echo Installing and building frontend...
cd frontend
call npm install
call npm run build
cd ..

:: Set environment to production
echo Setting environment to production...
set NODE_ENV=production

echo Build complete! Run 'npm run prod' to start the production server.
