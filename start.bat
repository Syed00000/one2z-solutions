@echo off
echo ========================================
echo    Starting Technologiya Application
echo ========================================
echo.
echo Starting frontend and backend servers...
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000/api
echo Admin Panel: http://localhost:5173/admin/login
echo.
echo Press Ctrl+C to stop both servers
echo.

cd frontend
npm run dev:full
