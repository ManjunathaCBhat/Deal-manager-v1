@echo off
REM Start script for Windows

echo 🚀 Starting CRM Application...

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env with your actual values!
)

REM Build and start containers
echo 🔨 Building Docker containers...
docker-compose build

echo 🏃 Starting containers...
docker-compose up -d

echo.
echo ✅ CRM Application is starting!
echo.
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:8000
echo 📍 API Docs: http://localhost:8000/docs
echo.
echo 📋 To view logs: docker-compose logs -f
echo 🛑 To stop: docker-compose down
