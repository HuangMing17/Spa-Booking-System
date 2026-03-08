#!/bin/bash

# Docker Deployment Script for SPA Bon Lai
# Usage: ./deploy.sh [dev|prod]

set -e

ENVIRONMENT=${1:-dev}

echo "=========================================="
echo "SPA Bon Lai - Docker Deployment"
echo "=========================================="
echo "Environment: ${ENVIRONMENT}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed!"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Warning: .env file not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "Please edit .env file with your actual configuration"
    exit 1
fi

# Pull latest images
echo "Pulling latest images..."
docker-compose pull

# Build images
echo "Building images..."
if [ "$ENVIRONMENT" = "prod" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
else
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
fi

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Start services
echo "Starting services..."
if [ "$ENVIRONMENT" = "prod" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
else
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
fi

# Wait for services to be healthy
echo ""
echo "Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "Service Status:"
docker-compose ps

# Check backend health
echo ""
echo "Checking backend health..."
sleep 5
curl -f http://localhost:8080/actuator/health || echo "Backend health check failed"

echo ""
echo "=========================================="
echo "Deployment completed!"
echo "=========================================="
echo ""
echo "Access the application:"
echo "  Backend API: http://localhost:8080"
echo "  Frontend:    http://localhost:3000"
echo ""
echo "View logs:"
echo "  docker-compose logs -f"
echo ""
echo "Stop services:"
echo "  docker-compose down"
echo "=========================================="
