@echo off
echo ========================================
echo    Technologiya Setup Script
echo ========================================
echo.

echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Initializing admin user...
call npm run init-admin
if %errorlevel% neq 0 (
    echo Warning: Could not initialize admin user. You may need to do this manually.
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the application:
echo 1. Make sure MongoDB is running
echo 2. Run: cd frontend && npm run dev:full
echo.
echo Admin Login:
echo Email: syedimranh59@gmail.com
echo Password: admin@123
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api
echo Admin Panel: http://localhost:5173/admin/login
echo.
pause
