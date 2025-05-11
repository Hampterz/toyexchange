#!/bin/bash

# ToyShare Deployment Script for Hostinger Ubuntu VPS
# This script automates the process of deploying ToyShare to production

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚀 ToyShare Deployment Script"
echo "=============================="

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    echo "❌ Error: Node.js and npm are required but not installed."
    echo "Please install Node.js 18 or later before continuing."
    exit 1
fi

# Check if we're in the project root directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

echo "📦 Installing production dependencies..."
npm install --omit=dev

echo "🧹 Cleaning previous build..."
rm -rf dist

echo "🔨 Building application..."
npm run build

# Check if the uploads directory exists, if not create it
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️ Warning: .env file not found. Creating a basic one..."
    cat > .env << 'EOL'
DATABASE_URL=postgresql://toyshare:Jell1boi@localhost:5432/toysharedb
SESSION_SECRET=Js82K!fd9zqxL$53bj#47WprTz@Lg1me
EMAIL_USER=donotreplymail92@gmail.com
EMAIL_PASS=mcvbyadjmejddraq
PORT=3000
NODE_ENV=production
UPLOADS_DIR=./uploads
EOL
    echo "⚠️ Please update the .env file with your actual credentials."
fi

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting application with PM2..."
    # Check if the app is already running in PM2
    if pm2 list | grep -q "toyshare"; then
        pm2 restart toyshare
    else
        pm2 start npm --name "toyshare" -- run start
        pm2 save
    fi
else
    echo "⚠️ PM2 is not installed. To run the application in the background, install PM2:"
    echo "npm install -g pm2"
    echo "Then run: pm2 start npm --name \"toyshare\" -- run start"
    echo "For now, you can start the application manually:"
    echo "NODE_ENV=production node dist/index.js"
fi

echo "✅ Deployment complete!"
echo "The application should now be running on port 3000."
echo "If you're using Nginx as a reverse proxy, make sure it's configured correctly."
echo "For more information, refer to HOSTINGER_UBUNTU_DEPLOYMENT.md"