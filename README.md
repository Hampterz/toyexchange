# ToyShare - AWS Deployment Guide

This guide provides instructions for deploying the ToyShare application on an AWS server, including database setup for storing user accounts, toy listings, and other application data.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Server Setup](#aws-server-setup)
3. [Database Configuration](#database-configuration)
4. [Application Deployment](#application-deployment)
5. [Environment Variables](#environment-variables)
6. [Maintenance and Backup](#maintenance-and-backup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying ToyShare to AWS, ensure you have:

- An AWS account with permission to create resources
- Basic knowledge of AWS services
- A domain name (optional, for setting up HTTPS)
- Access to the ToyShare codebase (this repository)
- SSH key pair for secure access to your EC2 instance

## AWS Server Setup

### 1. Launch an EC2 Instance

1. Log in to the AWS Management Console
2. Navigate to EC2 and click "Launch Instance"
3. Choose an Amazon Machine Image (AMI):
   - Recommended: Amazon Linux 2023 or Ubuntu Server 22.04 LTS
4. Select an instance type:
   - For small to medium deployments: t3.medium (2 vCPU, 4GB RAM)
   - For larger deployments: t3.large (2 vCPU, 8GB RAM)
5. Configure instance details and storage:
   - Add at least 20GB of storage for the application and database
6. Configure security groups:
   - Allow HTTP (port 80), HTTPS (port 443), and SSH (port 22)
   - If using a separate database, allow PostgreSQL (port 5432)
7. Launch your instance with your SSH key pair

### 2. Set Up Domain and DNS (Optional)

1. Register a domain or use an existing one
2. Create an Elastic IP and associate it with your EC2 instance
3. Add DNS records pointing to your instance's Elastic IP
4. Set up HTTPS using AWS Certificate Manager or Let's Encrypt

## Database Configuration

ToyShare uses PostgreSQL to store user accounts, toy listings, and application data. You have two options:

### Option 1: Use Amazon RDS (Recommended for Production)

1. Navigate to RDS in AWS Console
2. Click "Create Database"
3. Select PostgreSQL as the engine type
4. Choose the appropriate DB instance class:
   - For small deployments: db.t3.micro
   - For larger deployments: db.t3.small or higher
5. Configure storage, credentials, and network settings:
   - Set a secure master password
   - Place the database in the same VPC as your EC2 instance
   - Configure appropriate security groups to allow access from your EC2 instance
6. Create the database

### Option 2: Install PostgreSQL on Your EC2 Instance

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install PostgreSQL
sudo yum update -y  # For Amazon Linux
# or
sudo apt update -y  # For Ubuntu

# Install PostgreSQL
sudo amazon-linux-extras install postgresql14  # For Amazon Linux
# or
sudo apt install postgresql postgresql-contrib -y  # For Ubuntu

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set up a database user and password
sudo -u postgres psql
CREATE USER toyshare WITH PASSWORD 'your-secure-password';
CREATE DATABASE toyshare OWNER toyshare;
GRANT ALL PRIVILEGES ON DATABASE toyshare TO toyshare;
\q

# Configure PostgreSQL to accept connections
sudo nano /etc/postgresql/14/main/postgresql.conf
# Update listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Application Deployment

### 1. Install Required Software

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 18
nvm use 18

# Install Git and other dependencies
sudo yum install git -y  # For Amazon Linux
# or
sudo apt install git -y  # For Ubuntu

# Install PM2 for process management
npm install -g pm2
```

### 2. Clone and Configure ToyShare

```bash
# Clone the repository
git clone https://github.com/your-repo/toyshare.git
cd toyshare

# Install dependencies
npm install

# Create .env file
nano .env
```

Add your environment variables to the .env file (see Environment Variables section below).

### 3. Configure Database Schema

ToyShare uses Drizzle ORM for database management. To initialize your database:

```bash
# Push the schema to the database
npm run db:push
```

### 4. Start the Application

```bash
# Build the application
npm run build

# Start with PM2
pm2 start npm --name "toyshare" -- run start
pm2 startup
pm2 save
```

### 5. Set Up Nginx as a Reverse Proxy

```bash
# Install Nginx
sudo yum install nginx -y  # For Amazon Linux
# or
sudo apt install nginx -y  # For Ubuntu

# Configure Nginx
sudo nano /etc/nginx/conf.d/toyshare.conf
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;  # Assuming ToyShare runs on port 3000
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx
```

### 6. Set Up HTTPS with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx -y  # For Amazon Linux
# or
sudo apt install certbot python3-certbot-nginx -y  # For Ubuntu

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

## Environment Variables

Create a `.env` file in your project root with these variables:

```
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:5432/database_name

# Google API Keys
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id

# Other API Keys (if used)
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Firebase Configuration (if used)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Application Configuration
PORT=3000
NODE_ENV=production
SESSION_SECRET=your_secure_session_secret
```

Replace all placeholders with your actual values. Make sure to keep your `.env` file secure and never commit it to version control.

## Maintenance and Backup

### Database Backups

Set up regular backups of your PostgreSQL database:

#### For RDS:

Use automated backups in the RDS console or configure manual snapshots.

#### For Self-Hosted PostgreSQL:

```bash
# Create a backup script
nano ~/backup-db.sh
```

Add the following content:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/ec2-user/database_backups"
mkdir -p $BACKUP_DIR

# PostgreSQL backup
pg_dump -U toyshare toyshare > $BACKUP_DIR/toyshare_$TIMESTAMP.sql

# Compress the backup
gzip $BACKUP_DIR/toyshare_$TIMESTAMP.sql

# Remove backups older than 7 days
find $BACKUP_DIR -type f -name "*.gz" -mtime +7 -delete
```

```bash
# Make the script executable
chmod +x ~/backup-db.sh

# Add to crontab to run daily
crontab -e
# Add: 0 2 * * * /home/ec2-user/backup-db.sh
```

### Application Updates

To update the ToyShare application:

```bash
# Navigate to your application directory
cd ~/toyshare

# Pull the latest changes
git pull

# Install dependencies
npm install

# Build the application
npm run build

# Restart the application
pm2 restart toyshare
```

## Troubleshooting

### Database Connection Issues

If the application can't connect to the database:

1. Verify the DATABASE_URL in your .env file
2. Check if PostgreSQL is running: `sudo systemctl status postgresql`
3. Ensure the security group allows traffic on port 5432
4. Verify the database user has proper permissions

### Application Not Starting

If the application fails to start:

1. Check logs with: `pm2 logs toyshare`
2. Verify all required environment variables are set
3. Ensure Node.js version is compatible (Node.js 18 recommended)
4. Check if required ports are available: `sudo lsof -i :3000`

### Nginx Proxy Issues

If the website doesn't load:

1. Check Nginx status: `sudo systemctl status nginx`
2. Verify Nginx configuration: `sudo nginx -t`
3. Check Nginx error logs: `sudo cat /var/log/nginx/error.log`
4. Ensure the security group allows HTTP/HTTPS traffic

### Performance Issues

If the application is slow:

1. Consider upgrading your EC2 instance type
2. Monitor system resources: `htop` or AWS CloudWatch
3. Optimize database queries or add indexes as needed
4. Consider implementing caching with Redis

---

## Additional Resources

- [AWS Documentation](https://docs.aws.amazon.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Documentation](https://nginx.org/en/docs/)

For further assistance or questions about this deployment guide, please contact the ToyShare development team.