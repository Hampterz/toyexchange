#!/bin/bash

# ToyShare Deployment Script
# This script automates the deployment process for the ToyShare application

echo "======================================"
echo "ToyShare Deployment Script"
echo "======================================"

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
if ! command_exists docker; then
  echo "Error: Docker is not installed. Please install Docker first."
  echo "For Ubuntu, run: sudo apt update && sudo apt install docker.io docker-compose"
  exit 1
fi

# Check if Docker service is running
if ! docker info >/dev/null 2>&1; then
  echo "Error: Docker service is not running. Please start it with:"
  echo "sudo systemctl start docker"
  exit 1
fi

# Determine environment
ENV=${1:-production}
echo "Deploying ToyShare in $ENV environment..."

# Build and run the application
if [ "$ENV" = "development" ]; then
  echo "Starting development environment with hot-reloading..."
  docker-compose --profile dev up -d toyshare-dev
else
  echo "Starting production environment..."
  docker-compose up -d toyshare
fi

echo "======================================"
echo "Deployment completed successfully!"
echo "The application is now running at: http://localhost:5000"
echo "======================================"