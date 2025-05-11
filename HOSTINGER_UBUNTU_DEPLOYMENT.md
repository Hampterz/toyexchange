# ToyShare - Hostinger Ubuntu VPS Deployment Guide

This guide provides step-by-step instructions for deploying the ToyShare application on a Hostinger Ubuntu VPS with PostgreSQL.

## Prerequisites

- A Hostinger Ubuntu VPS (or any Ubuntu-based VPS)
- A domain name pointing to your VPS
- SSH access to your VPS

## 1. Initial Server Setup

### Connect to Your Server

```bash
ssh root@your_server_ip
```

### Create a Non-Root User (Optional but Recommended)

```bash
# Create user
adduser toyshare

# Add to sudo group
usermod -aG sudo toyshare

# Switch to the new user
su - toyshare
```

### Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

### Install Basic Utilities

```bash
sudo apt install -y build-essential git curl wget unzip htop nano
```

## 2. Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Verify installation
sudo systemctl status postgresql

# Access PostgreSQL as postgres user
sudo -u postgres psql

# Create database and user
CREATE USER toyshare WITH PASSWORD 'Jell1boi';
CREATE DATABASE toysharedb OWNER toyshare;
GRANT ALL PRIVILEGES ON DATABASE toysharedb TO toyshare;

# Exit PostgreSQL
\q
```

## 3. Install Node.js and PM2

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node -v
npm -v

# Install PM2 globally
npm install -g pm2
```

## 4. Set Up Firewall

```bash
# Install UFW if not already installed
sudo apt install -y ufw

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow http
sudo ufw allow https

# Allow port 3000 (ToyShare's production port)
sudo ufw allow 3000

# Enable UFW
sudo ufw enable

# Check status
sudo ufw status
```

## 5. Clone and Prepare the ToyShare Application

```bash
# Navigate to home directory
cd ~

# Clone repository (replace with your repository URL)
git clone https://github.com/your-repo/toyshare.git

# Navigate to project directory
cd toyshare

# Install dependencies
npm install

# Run the deployment preparation script
node scripts/prepare-deployment.js

# Apply the package.json changes if needed
mv package.json.deploy package.json
```

## 6. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cat > .env << 'EOL'
DATABASE_URL=postgresql://toyshare:Jell1boi@localhost:5432/toysharedb
SESSION_SECRET=Js82K!fd9zqxL$53bj#47WprTz@Lg1me
EMAIL_USER=donotreplymail92@gmail.com
EMAIL_PASS=mcvbyadjmejddraq
PORT=3000
NODE_ENV=production
UPLOADS_DIR=./uploads
EOL
```

## 7. Build the Application

```bash
# Build the application
npm run build

# Create uploads directory
mkdir -p uploads
```

## 8. Setup Database Schema

```bash
# Push database schema
npx drizzle-kit push:pg
# OR
npm run db:push
```

## 9. Start the Application with PM2

```bash
# Start the application
pm2 start npm --name "toyshare" -- run start

# Set up PM2 to start on system boot
pm2 startup
# Follow the instructions printed by the above command

# Save the current process list
pm2 save

# Check the application status
pm2 status

# View logs
pm2 logs toyshare
```

## 10. Install and Configure Nginx as a Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/toyshare
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase max upload size
    client_max_body_size 10M;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Serve uploaded files directly if using the uploads directory
    location /uploads/ {
        alias /home/toyshare/toyshare/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Enable the configuration:

```bash
# Enable configuration
sudo ln -s /etc/nginx/sites-available/toyshare /etc/nginx/sites-enabled/

# Remove default configuration (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## 11. Set Up SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts to complete the SSL setup
# Choose to redirect HTTP to HTTPS

# Verify automatic renewal
sudo certbot renew --dry-run
```

## 12. Testing Your Deployment

- Visit your domain in a browser: `https://yourdomain.com`
- Verify that HTTPS is working correctly
- Test user registration and login
- Test toy listing creation and search
- Test all other application features

## 13. Maintenance and Updates

### Update the Application

```bash
# Navigate to application directory
cd ~/toyshare

# Pull latest changes
git pull

# Install dependencies
npm install --omit=dev

# Build the application
npm run build

# Restart the application
pm2 restart toyshare
```

### Update the System

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y

# Restart the server if necessary
sudo reboot
```

### Database Backup

```bash
# Create backup directory
mkdir -p ~/backups

# Backup the database
pg_dump -U toyshare -d toysharedb -h localhost -F c -f ~/backups/toysharedb_$(date +%Y%m%d).dump

# Restore from backup if needed
pg_restore -U toyshare -d toysharedb -h localhost -c ~/backups/toysharedb_20250511.dump
```

## Troubleshooting

### Application Not Starting

Check the PM2 logs:

```bash
pm2 logs toyshare
```

### Database Connection Issues

Verify your database credentials:

```bash
# Test database connection
psql -U toyshare -d toysharedb -h localhost
# Enter password when prompted
```

### Nginx Issues

Check Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues

Check Certbot logs:

```bash
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

## Security Best Practices

1. Keep your server updated
2. Use strong passwords for all services
3. Regularly backup your database
4. Monitor server logs for suspicious activity
5. Consider implementing rate limiting for API endpoints
6. Regularly audit user permissions and access

## Need Help?

If you encounter any issues during deployment, please refer to:
- [Ubuntu Documentation](https://help.ubuntu.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)