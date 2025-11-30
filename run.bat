@echo off
REM ============================================
REM CRM Application - Single Command Runner
REM Run with: run.bat [dev|docker|stop]
REM ============================================

setlocal enabledelayedexpansion

REM Get the script directory
set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

REM Check command argument
set "CMD=%~1"
if "%CMD%"=="" set "CMD=dev"

if /i "%CMD%"=="dev" goto :dev
if /i "%CMD%"=="docker" goto :docker
if /i "%CMD%"=="stop" goto :stop
if /i "%CMD%"=="install" goto :install
if /i "%CMD%"=="help" goto :help

echo Unknown command: %CMD%
goto :help

:help
echo.
echo CRM Application Runner
echo =======================
echo Usage: run.bat [command]
echo.
echo Commands:
echo   dev      - Run in development mode (default)
echo   docker   - Run with Docker Compose
echo   stop     - Stop all services
echo   install  - Install dependencies
echo   help     - Show this help
echo.
goto :eof

:install
echo.
echo 📦 Installing dependencies...
echo.

echo Installing backend dependencies...
cd "%ROOT_DIR%fastapi_backend"
pip install -r requirements.txt

echo.
echo Installing frontend dependencies...
cd "%ROOT_DIR%crm-frontend"
call npm install

echo.
echo ✅ Dependencies installed!
goto :eof

:dev
echo.
echo 🚀 Starting CRM in Development Mode...
echo.

REM Single .env in root - backend reads from parent, React needs a copy
echo 📝 Loading environment from root .env...
copy "%ROOT_DIR%.env" "%ROOT_DIR%crm-frontend\.env" >nul 2>&1

REM Start backend in background (reads .env from parent directory)
echo 🔧 Starting Backend (FastAPI) on port 8000...
cd /d "%ROOT_DIR%fastapi_backend"
start /b python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend (this will keep the terminal open)
echo 🎨 Starting Frontend (React) on port 3000...
echo.
echo ✅ CRM Application is running!
echo.
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:8000
echo 📍 API Docs: http://localhost:8000/docs
echo.
echo 🛑 Press Ctrl+C to stop all services
echo ============================================
echo.

cd /d "%ROOT_DIR%crm-frontend"
call npm start

REM When npm exits, kill backend
taskkill /f /im python.exe 2>nul
goto :eof

:docker
echo.
echo 🐳 Starting CRM with Docker...
echo.

REM Build and start containers
docker-compose up --build -d

echo.
echo ✅ CRM Application is starting!
echo.
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:8000
echo 📍 API Docs: http://localhost:8000/docs
echo.
echo 📋 To view logs: docker-compose logs -f
echo 🛑 To stop: run.bat stop
echo.
goto :eof

:stop
echo.
echo 🛑 Stopping CRM services...
echo.

REM Stop Docker containers if running
docker-compose down 2>nul

REM Kill any running node/python processes for this project
taskkill /FI "WINDOWTITLE eq CRM-Backend*" /F 2>nul
taskkill /FI "WINDOWTITLE eq CRM-Frontend*" /F 2>nul

echo.
echo ✅ All services stopped!
goto :eof
