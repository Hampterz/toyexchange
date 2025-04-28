# ToyShare - Deployment Guides

This repository includes comprehensive deployment guides for the ToyShare application:

1. [AWS Deployment Guide](#aws-deployment-guide) - For deploying on Amazon Web Services
2. [Hostinger Deployment Guide](./hostinger-instructions.md) - For deploying on Hostinger web hosting

## AWS Deployment Guide

This comprehensive guide provides step-by-step instructions for deploying the ToyShare application on an AWS server, including detailed database setup for storing user accounts, toy listings, and all application data.

## Introduction for Beginners

If you're new to web deployment, don't worry! This guide is designed to walk you through every single step required to get ToyShare running on your own server. Here's what you need to know:

### What is AWS?
AWS (Amazon Web Services) is a cloud platform that provides secure servers where you can host your website. Instead of buying physical hardware, you rent virtual servers from Amazon.

### What are we setting up in this guide?
1. **A web server** - This is where your ToyShare application code will run
2. **A database** - This stores all user accounts, toy listings, and other data
3. **Security settings** - To protect your application and data
4. **Google integration** - For user sign-in and map/location features

### How this guide works:
- We've broken down EVERY step into small, clear instructions
- You can follow along even if you've never set up a server before
- Commands that you need to type are shown in code blocks like `this`
- The entire process might take 2-3 hours, but at the end, you'll have a fully functioning ToyShare platform!

Let's get started with the setup process!

## Table of Contents

1. [AWS Account Setup](#aws-account-setup)
2. [Server Provisioning](#server-provisioning)
3. [Domain and DNS Configuration](#domain-and-dns-configuration)
4. [Server Initial Setup](#server-initial-setup)
5. [Database Installation and Configuration](#database-installation-and-configuration)
6. [Application Deployment](#application-deployment)
7. [Web Server Configuration](#web-server-configuration)
8. [SSL Certificate Setup](#ssl-certificate-setup)
9. [Google API Keys Setup](#google-api-keys-setup)
10. [Environment Variables](#environment-variables)
11. [Securing Your Server](#securing-your-server)
12. [Backup and Recovery](#backup-and-recovery)
13. [Monitoring and Maintenance](#monitoring-and-maintenance)
14. [Troubleshooting](#troubleshooting)

## AWS Account Setup

1. **Create an AWS Account**:
   - Go to [aws.amazon.com](https://aws.amazon.com) and click "Create an AWS Account"
   - Enter your email address and a password
   - Provide your contact information and payment method
   - Complete the identity verification process (phone call or text message)
   - Select the AWS Support Plan (Free tier is sufficient for starting)

2. **Set Up IAM User**:
   - Sign in to the AWS Management Console
   - Navigate to IAM (Identity and Access Management)
   - Click "Users" then "Add users"
   - Enter a username, select "Access key - Programmatic access" and "Password - AWS Management Console access"
   - Click "Next: Permissions"
   - Choose "Attach existing policies directly"
   - Select "AdministratorAccess" (for full access) or more specific permissions if you need limited access
   - Click through the review screen and create the user
   - Save the access key ID and secret access key (download the CSV file)
   - Log out and sign back in with your new IAM user credentials

## Server Provisioning

### EC2 Instance Setup:

1. **Login to AWS Console**:
   - Open your browser and go to [console.aws.amazon.com](https://console.aws.amazon.com)
   - Sign in with your IAM user credentials

2. **Launch EC2 Instance**:
   - Navigate to EC2 Dashboard
   - Click "Launch Instance"
   
3. **Name Your Instance**:
   - Enter "ToyShare-Production" (or appropriate name)
   
4. **Choose AMI (Amazon Machine Image)**:
   - Select "Ubuntu Server 22.04 LTS (HVM), SSD Volume Type"
   - Ensure it says "Free tier eligible" if you're using the free tier
   
5. **Choose Instance Type**:
   - Select "t2.micro" for free tier or basic testing
   - Select "t3.medium" (2 vCPU, 4GB RAM) for production use
   - Click "Next"
   
6. **Configure Instance Details**:
   - Network: Select the default VPC
   - Subnet: Choose "No preference"
   - Auto-assign Public IP: Enable
   - Keep other settings at their defaults
   - Click "Next"
   
7. **Add Storage**:
   - Set size to 20 GB (or more depending on your needs)
   - Volume Type: gp2 (General Purpose SSD)
   - Delete on Termination: Yes
   - Click "Next"
   
8. **Add Tags (Optional)**:
   - Click "Add Tag"
   - Key: "Name", Value: "ToyShare-Production"
   - Click "Next"
   
9. **Configure Security Group**:
   - Create a new security group
   - Name: "ToyShare-SecurityGroup"
   - Description: "Security group for ToyShare application"
   - Add the following rules:
     - SSH (Port 22) - Source: Your IP (for security)
     - HTTP (Port 80) - Source: Anywhere (0.0.0.0/0)
     - HTTPS (Port 443) - Source: Anywhere (0.0.0.0/0)
   - Click "Review and Launch"
   
10. **Review and Launch**:
    - Review all settings
    - Click "Launch"
    
11. **Create Key Pair**:
    - Select "Create a new key pair"
    - Name: "toyshare-key"
    - Download Key Pair (save the .pem file securely)
    - Click "Launch Instances"
    
12. **Access Instance Information**:
    - Click "View Instances" to see your running instance
    - Note the "Public IPv4 address" of your instance

13. **Set Up Elastic IP (Recommended)**:
    - In the EC2 Dashboard sidebar, click "Elastic IPs"
    - Click "Allocate Elastic IP address"
    - Select "Amazon's pool of IPv4 addresses" and click "Allocate"
    - Select the newly allocated Elastic IP
    - Click "Actions" then "Associate Elastic IP address"
    - Select your instance and click "Associate"
    - Note the Elastic IP address (this will be your server's permanent public IP)

## Domain and DNS Configuration

1. **Register a Domain (If You Don't Already Have One)**:
   - Go to a domain registrar like [Route 53](https://console.aws.amazon.com/route53/), Namecheap, or GoDaddy
   - Search for an available domain
   - Complete the registration process

2. **Set Up DNS with Route 53 (AWS's DNS Service)**:
   - In the AWS console, go to Route 53
   - Click "Hosted zones"
   - Click "Create hosted zone"
   - Enter your domain name and click "Create hosted zone"
   - Note the NS (Name Server) records provided by AWS

3. **Update Name Servers at Your Domain Registrar**:
   - Go to your domain registrar's website
   - Find the DNS or nameserver settings for your domain
   - Replace the existing nameservers with the ones provided by Route 53
   - Save the changes (propagation can take up to 48 hours)

4. **Create DNS Records**:
   - In Route 53 hosted zone for your domain
   - Click "Create record"
   - Record name: Leave empty for root domain or enter "www" for subdomain
   - Record type: A
   - Value: Enter your Elastic IP address
   - TTL: 300
   - Click "Create records"
   - Repeat to create another A record for "www" if you haven't already

## Server Initial Setup

1. **Connect to Your EC2 Instance**:
   
   **For Windows Users:**
   - Download PuTTY from [putty.org](https://www.putty.org/)
   - Convert your .pem file to .ppk using PuTTYgen:
     - Open PuTTYgen
     - Click "Load"
     - Select your .pem file
     - Click "Save private key"
     - Save the .ppk file
   - Open PuTTY:
     - Host Name: ubuntu@your-elastic-ip
     - Port: 22
     - Connection > SSH > Auth > Browse to your .ppk file
     - Save the session for future use
     - Click "Open"
   
   **For Mac/Linux Users:**
   - Open Terminal
   - Change permissions for your key file:
     ```bash
     chmod 400 /path/to/toyshare-key.pem
     ```
   - Connect to your instance:
     ```bash
     ssh -i /path/to/toyshare-key.pem ubuntu@your-elastic-ip
     ```

2. **Update System Packages**:
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

3. **Install Basic Utilities**:
   ```bash
   sudo apt install -y build-essential git curl wget unzip htop
   ```

4. **Set Up Swap Space (Recommended)**:
   ```bash
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

5. **Set the Hostname**:
   ```bash
   sudo hostnamectl set-hostname toyshare-production
   echo "127.0.0.1 toyshare-production" | sudo tee -a /etc/hosts
   ```

6. **Set Up the Firewall**:
   ```bash
   sudo apt install -y ufw
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```

7. **Create a Non-Root User (Optional but Recommended)**:
   ```bash
   sudo adduser toyshare
   sudo usermod -aG sudo toyshare
   sudo su - toyshare
   mkdir ~/.ssh
   chmod 700 ~/.ssh
   touch ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   # Add your public key to authorized_keys (same as EC2 key)
   echo "your-public-key" > ~/.ssh/authorized_keys
   ```

## Database Installation and Configuration

### Option 1: Using Amazon RDS (Recommended for Production)

1. **Create a PostgreSQL RDS Instance**:
   - In AWS Console, navigate to RDS
   - Click "Create database"
   - Select "Standard create"
   - Choose "PostgreSQL" as the engine type
   - Version: PostgreSQL 14.x or later
   - Templates: "Free tier" (for testing) or "Production" (for live site)
   - Settings:
     - DB instance identifier: "toyshare-db"
     - Master username: "toyshare"
     - Master password: Create a secure password (save it!)
   - Instance configuration:
     - For testing: db.t3.micro
     - For production: db.t3.small or larger
   - Storage:
     - Allocated storage: 20 GB (or more as needed)
     - Enable storage autoscaling
     - Maximum storage threshold: 100 GB
   - Connectivity:
     - VPC: Default VPC
     - Publicly accessible: No (for security)
     - VPC security group: Create new
       - Name: "toyshare-db-sg"
   - Additional configuration:
     - Initial database name: "toyshare"
     - Backup retention period: 7 days
     - Enable encryption
   - Click "Create database"

2. **Configure Security Group for RDS**:
   - Navigate to EC2 > Security Groups
   - Find the security group created for your RDS instance
   - Click "Edit inbound rules"
   - Add rule:
     - Type: PostgreSQL
     - Protocol: TCP
     - Port Range: 5432
     - Source: Your EC2 security group ID
   - Save rules

3. **Note Your Database Endpoint and Credentials**:
   - RDS Dashboard > Databases > your-db-identifier
   - Note the "Endpoint" (will be used in DATABASE_URL)
   - Save your master username and password

### Option 2: Install PostgreSQL on Your EC2 Instance

1. **Install PostgreSQL**:
   ```bash
   sudo apt update
   sudo apt install -y postgresql postgresql-contrib
   ```

2. **Verify Installation**:
   ```bash
   sudo systemctl status postgresql
   ```

3. **Configure PostgreSQL**:
   ```bash
   # Access PostgreSQL prompt
   sudo -u postgres psql
   
   # Create a dedicated user and database
   CREATE USER toyshare WITH PASSWORD 'your-secure-password';
   CREATE DATABASE toyshare OWNER toyshare;
   GRANT ALL PRIVILEGES ON DATABASE toyshare TO toyshare;
   
   # Exit PostgreSQL prompt
   \q
   ```

4. **Configure PostgreSQL to Accept Remote Connections (If Needed)**:
   ```bash
   # Edit PostgreSQL configuration
   sudo nano /etc/postgresql/14/main/postgresql.conf
   ```
   
   Find and modify:
   ```
   listen_addresses = '*'  # (uncomment this line)
   ```
   
   ```bash
   # Edit client authentication configuration
   sudo nano /etc/postgresql/14/main/pg_hba.conf
   ```
   
   Add at the end:
   ```
   host    all             all             0.0.0.0/0               md5
   ```
   
   ```bash
   # Restart PostgreSQL
   sudo systemctl restart postgresql
   ```

## Application Deployment

### 1. Install Node.js and npm

```bash
# Install Node.js using NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# Reload shell configuration
source ~/.bashrc
# Install Node.js 18 (or your preferred version)
nvm install 18
nvm use 18
nvm alias default 18
# Verify installation
node -v
npm -v
```

### 2. Install PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2
```

### 3. Clone the ToyShare Repository

```bash
# Navigate to home directory
cd ~
# Clone the repository
git clone https://github.com/your-repo/toyshare.git
# Navigate to the project directory
cd toyshare
```

### 4. Install Project Dependencies

```bash
# Install all dependencies
npm install
```

### 5. Create and Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add the required environment variables (see the Environment Variables section).

### 6. Configure the Database

```bash
# Create or update database schema
npx drizzle-kit push:pg
# Or if you have a script in package.json
npm run db:push
```

### 7. Build the Application

```bash
# Build the application for production
npm run build
```

### 8. Start the Application with PM2

```bash
# Start the application
pm2 start npm --name "toyshare" -- run start
# Configure PM2 to start on system boot
pm2 startup
# Save the current process list
pm2 save
# Check the application status
pm2 status
# Check application logs
pm2 logs toyshare
```

## Web Server Configuration

### Install and Configure Nginx

1. **Install Nginx**:
   ```bash
   sudo apt update
   sudo apt install -y nginx
   ```

2. **Verify Nginx Installation**:
   ```bash
   sudo systemctl status nginx
   ```

3. **Configure Nginx for ToyShare**:
   ```bash
   # Create a new Nginx server configuration
   sudo nano /etc/nginx/sites-available/toyshare
   ```
   
   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;  # Adjust port if your app uses a different one
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
       
       # Increase max upload size if needed
       client_max_body_size 10M;
       
       # Add browser caching for static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           proxy_pass http://localhost:3000;
           expires 30d;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```

4. **Enable the Configuration**:
   ```bash
   # Create a symbolic link
   sudo ln -s /etc/nginx/sites-available/toyshare /etc/nginx/sites-enabled/
   # Remove the default configuration
   sudo rm /etc/nginx/sites-enabled/default
   # Test Nginx configuration
   sudo nginx -t
   # Restart Nginx
   sudo systemctl restart nginx
   ```

## SSL Certificate Setup

### Install and Configure Certbot for Let's Encrypt SSL

1. **Install Certbot**:
   ```bash
   sudo apt update
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Obtain SSL Certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```
   
   - Follow the prompts
   - Enter your email address
   - Agree to the terms of service
   - Choose whether to redirect HTTP to HTTPS (recommended)

3. **Verify Auto-Renewal**:
   ```bash
   sudo certbot renew --dry-run
   ```

4. **Check SSL Configuration**:
   - Visit your website using https://
   - Verify the certificate is valid
   - Check SSL grade at [SSL Labs](https://www.ssllabs.com/ssltest/)

## Google API Keys Setup

Before setting up your environment variables, you need to configure Google API services for maps and authentication:

### 1. Set Up Google OAuth 2.0 Credentials (For User Sign-In)

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Click "New Project" at the top right
   - Enter "ToyShare" as Project Name
   - Click "Create"

2. **Configure OAuth Consent Screen**:
   - Select your project
   - In the left menu, go to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type (unless you have a Google Workspace)
   - Click "Create"
   - Fill in the required fields:
     - App name: ToyShare
     - User support email: your email address
     - Developer contact information: your email address
   - Click "Save and Continue"
   - For Scopes, add:
     - ./auth/userinfo.email
     - ./auth/userinfo.profile
   - Click "Save and Continue"
   - Add test users if needed, then click "Save and Continue"
   - Review your settings and click "Back to Dashboard"

3. **Create OAuth Client ID**:
   - In the left menu, go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: Web application
   - Name: ToyShare Web Client
   - Authorized JavaScript origins:
     - Add: `http://localhost:3000` (for local testing)
     - Add: `http://your-ec2-ip-address` (your EC2 server's IP)
     - Add: `https://yourdomain.com` (your production domain)
   - Authorized redirect URIs:
     - Add: `http://localhost:3000/auth` (for local testing)
     - Add: `http://your-ec2-ip-address/auth` (your EC2 server's IP)
     - Add: `https://yourdomain.com/auth` (your production domain)
   - Click "Create"
   - **⚠️ IMPORTANT**: A popup will show your Client ID and Client Secret. Save these values securely. The Client ID will be used as `VITE_GOOGLE_OAUTH_CLIENT_ID` in your .env file.

### 2. Set Up Google Maps API (For Location Services)

1. **Enable Google Maps API**:
   - In the same Google Cloud Project, go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API" and select it
   - Click "Enable"
   - Also enable "Places API" for address autocomplete functionality

2. **Create API Key for Maps**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - A popup will show your new API key
   - **⚠️ IMPORTANT**: Save this API key securely. It will be used as `VITE_GOOGLE_MAPS_API_KEY` in your .env file

3. **Restrict API Key (Recommended for Security)**:
   - After creating the API key, click "Edit API key" (pencil icon)
   - Under "Application restrictions", select "HTTP referrers (websites)"
   - Add your domains:
     - `localhost/*`
     - `*.yourdomain.com/*`
     - `*your-ec2-ip-address/*`
   - Under "API restrictions", select "Restrict key"
   - Select the following APIs:
     - Maps JavaScript API
     - Places API
   - Click "Save"

## Environment Variables

Create a `.env` file in the root of your project with all required configuration:

```bash
# Navigate to your project directory
cd ~/toyshare
# Create or edit .env file
nano .env
```

Add the following environment variables:

```
# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
# For RDS: postgresql://toyshare:your-password@your-rds-endpoint:5432/toyshare
# For local PostgreSQL: postgresql://toyshare:your-password@localhost:5432/toyshare

# Application Settings
NODE_ENV=production
PORT=3000
SESSION_SECRET=generate-a-long-random-string

# Google API Keys (Required for core functionality)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id

# Additional Services (Optional - only if you plan to use these services)
SENDGRID_API_KEY=your_sendgrid_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

To generate a secure random string for SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Securing Your Server

### 1. Enable Automatic Security Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 2. Secure SSH Access

```bash
sudo nano /etc/ssh/sshd_config
```

Make these security-enhancing changes:
```
PermitRootLogin no
PasswordAuthentication no
```

```bash
sudo systemctl restart sshd
```

### 3. Install and Configure Fail2Ban

```bash
sudo apt install -y fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Edit the settings as needed, then:
```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Set Up Automatic Security Auditing

```bash
sudo apt install -y lynis
sudo lynis audit system
```

## Backup and Recovery

### Database Backup

1. **For RDS**:
   - In AWS Console, go to RDS > Databases > your-db
   - Go to "Actions" > "Take snapshot"
   - Provide a snapshot name and create
   - Configure automatic backups in the RDS instance settings

2. **For Self-Hosted PostgreSQL**:
   ```bash
   # Create a backup script
   nano ~/backup-db.sh
   ```
   
   Add this script:
   ```bash
   #!/bin/bash
   TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
   BACKUP_DIR="/home/ubuntu/database_backups"
   mkdir -p $BACKUP_DIR
   
   # Set environment variables
   export PGPASSWORD="your-database-password"
   
   # PostgreSQL backup
   pg_dump -h localhost -U toyshare -d toyshare > $BACKUP_DIR/toyshare_$TIMESTAMP.sql
   
   # Compress the backup
   gzip $BACKUP_DIR/toyshare_$TIMESTAMP.sql
   
   # Remove old backups (keep last 10)
   ls -tp $BACKUP_DIR/*.sql.gz | grep -v '/$' | tail -n +11 | xargs -I {} rm -- {}
   
   # Unset environment variables
   unset PGPASSWORD
   ```
   
   ```bash
   # Make the script executable
   chmod +x ~/backup-db.sh
   
   # Add to crontab for daily backups at 2 AM
   crontab -e
   # Add this line:
   0 2 * * * /home/ubuntu/backup-db.sh
   ```

3. **Back Up Environment Variables and Configuration Files**:
   ```bash
   mkdir -p ~/config_backups
   cp ~/.env ~/config_backups/env_backup_$(date +"%Y%m%d")
   cp /etc/nginx/sites-available/toyshare ~/config_backups/nginx_config_$(date +"%Y%m%d")
   ```

### AWS S3 Backup (Optional but Recommended)

1. **Install AWS CLI**:
   ```bash
   sudo apt install -y awscli
   aws configure  # Enter your AWS credentials
   ```

2. **Create S3 Bucket**:
   - In AWS Console, go to S3
   - Click "Create bucket"
   - Name: "toyshare-backups-yourdomain" (bucket names must be globally unique)
   - Region: Choose the same region as your EC2 instance
   - Block all public access: Enabled
   - Bucket versioning: Enabled
   - Create bucket

3. **Modify Backup Script to Upload to S3**:
   ```bash
   nano ~/backup-db.sh
   ```
   
   Add after the gzip command:
   ```bash
   # Upload to S3
   aws s3 cp $BACKUP_DIR/toyshare_$TIMESTAMP.sql.gz s3://toyshare-backups-yourdomain/database/
   ```

## Monitoring and Maintenance

### Set Up Basic Monitoring

1. **Install Monitoring Tools**:
   ```bash
   sudo apt install -y htop iotop iftop
   ```

2. **Set Up PM2 Monitoring**:
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

### Application Maintenance

1. **Updating the Application**:
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

2. **Checking Application Logs**:
   ```bash
   # View all logs
   pm2 logs toyshare
   
   # View last 200 lines
   pm2 logs toyshare --lines 200
   
   # Monitor logs in real-time
   pm2 logs toyshare --follow
   ```

3. **Nginx Logs**:
   ```bash
   # Access logs
   sudo tail -f /var/log/nginx/access.log
   
   # Error logs
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Database Maintenance**:
   ```bash
   # Connect to database (for self-hosted PostgreSQL)
   psql -U toyshare -d toyshare
   
   # Run VACUUM to reclaim space
   VACUUM FULL;
   
   # Analyze tables for query optimization
   ANALYZE;
   
   # Exit
   \q
   ```

## Troubleshooting

### Application Issues

1. **Check Application Status**:
   ```bash
   pm2 status
   ```

2. **View Application Logs**:
   ```bash
   pm2 logs toyshare
   ```

3. **Restart the Application**:
   ```bash
   pm2 restart toyshare
   ```

4. **Rebuild and Restart**:
   ```bash
   cd ~/toyshare
   npm run build
   pm2 restart toyshare
   ```

### Database Issues

1. **Check Database Connection**:
   ```bash
   # Test PostgreSQL connection
   psql -U toyshare -h localhost -d toyshare
   # For RDS
   psql -U toyshare -h your-rds-endpoint -d toyshare
   ```

2. **Verify Environment Variables**:
   ```bash
   cat ~/toyshare/.env | grep DATABASE_URL
   ```

3. **Check PostgreSQL Service**:
   ```bash
   sudo systemctl status postgresql
   ```

4. **Restart PostgreSQL**:
   ```bash
   sudo systemctl restart postgresql
   ```

### Web Server Issues

1. **Check Nginx Status**:
   ```bash
   sudo systemctl status nginx
   ```

2. **Test Nginx Configuration**:
   ```bash
   sudo nginx -t
   ```

3. **Check Nginx Error Logs**:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

4. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

### Network Issues

1. **Check Firewall Status**:
   ```bash
   sudo ufw status
   ```

2. **Verify Open Ports**:
   ```bash
   sudo netstat -tuln
   ```

3. **Test Connection to Your Website**:
   ```bash
   curl -I http://yourdomain.com
   ```

4. **Test SSL Certificate**:
   ```bash
   curl -I https://yourdomain.com
   ```

---

## Final Check and Testing

After completing all the setup steps:

1. Visit your website in a browser to ensure it loads correctly
2. Test user registration and login
3. Test creating, viewing, and sharing toy listings
4. Test filtering and search functionality
5. Verify all images and assets load properly
6. Test the site on mobile devices
7. Verify all API integrations (Google Maps, OAuth, etc.)

## References and Additional Resources

- [AWS Documentation](https://docs.aws.amazon.com/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)

If you encounter any issues not covered in this guide, please contact the ToyShare development team for assistance.