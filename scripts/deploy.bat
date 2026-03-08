@echo off
REM Docker Deployment Script for SPA Bon Lai (Windows)
REM Usage: deploy.bat [dev|prod]

setlocal

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=dev

echo ==========================================
echo SPA Bon Lai - Docker Deployment
echo ==========================================
echo Environment: %ENVIRONMENT%
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed!
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose is not installed!
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Warning: .env file not found!
    echo Creating from .env.example...
    copy .env.example .env
    echo Please edit .env file with your actual configuration
    exit /b 1
)

REM Pull latest images
echo Pulling latest images...
docker-compose pull

REM Build images
echo Building images...
if "%ENVIRONMENT%"=="prod" (
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
) else (
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
)

REM Stop existing containers
echo Stopping existing containers...
docker-compose down

REM Start services
echo Starting services...
if "%ENVIRONMENT%"=="prod" (
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
) else (
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
)

REM Wait for services
echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service status
echo.
echo Service Status:
docker-compose ps

echo.
echo ==========================================
echo Deployment completed!
echo ==========================================
echo.
echo Access the application:
echo   Backend API: http://localhost:8080
echo   Frontend:    http://localhost:3000
echo.
echo View logs:
echo   docker-compose logs -f
echo.
echo Stop services:
echo   docker-compose down
echo ==========================================
