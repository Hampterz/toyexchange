# Hosting ToyShare on Hostinger

This guide provides step-by-step instructions for deploying the ToyShare application on Hostinger's web hosting platform.

## Table of Contents

1. [Setting Up Hostinger Account](#setting-up-hostinger-account)
2. [Domain Configuration](#domain-configuration)
3. [Database Setup](#database-setup)
4. [File Upload and Deployment](#file-upload-and-deployment)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Setting Up Hostinger Account

1. **Create a Hostinger Account**:
   - Go to [hostinger.com](https://www.hostinger.com) and click "Web Hosting"
   - Select a hosting plan (Premium or Business recommended for ToyShare)
   - Complete the registration process with your payment information
   - Log in to your Hostinger account

2. **Access Hosting Control Panel**:
   - Log in to your Hostinger account
   - Go to your "Hosting" dashboard
   - Click "Manage" on your hosting package

## Domain Configuration

1. **Register a Domain (If You Don't Have One)**:
   - In Hostinger dashboard, go to "Domains" → "Get a New Domain"
   - Search for an available domain name
   - Complete the domain registration process

2. **Set Up an Existing Domain**:
   - In Hostinger dashboard, go to "Domains" → "Manage"
   - Select your domain
   - Go to "DNS / Nameservers"
   - Set nameservers to Hostinger's:
     - ns1.dns-parking.com
     - ns2.dns-parking.com

3. **Connect Domain to Hosting**:
   - From your hosting dashboard, go to "Domains" → "Manage"
   - Click "Add Website"
   - Select your domain name from the dropdown
   - Set document root to "public_html"
   - Click "Add Website"

## Database Setup

1. **Create a MySQL Database**:
   - In your Hostinger dashboard, go to "Databases" → "New Database"
   - Create a database name (e.g., "toyshare_db")
   - Create a username and strong password
   - Click "Create"
   - Note down your database name, username, password, and host

2. **Configure ToyShare for MySQL**:
   - ToyShare uses PostgreSQL by default, but can be adapted for MySQL
   - In your local development environment, install necessary packages:
     ```bash
     npm install mysql2
     ```
   - Update your database configuration to use MySQL instead of PostgreSQL
   - For Drizzle ORM, update the schema to use MySQL syntax where needed

## File Upload and Deployment

1. **Prepare Your Application**:
   - Build your application locally:
     ```bash
     npm run build
     ```
   - Create a `.env` file with your production environment variables
   - Make sure your application is configured to run on shared hosting

2. **Upload Files via FTP**:
   - Go to "Files" → "File Manager" in your Hostinger dashboard
   - Navigate to the "public_html" directory
   - Upload your application files (you can use the web interface or FTP)
   
3. **Using FTP Client (Recommended for Large Uploads)**:
   - Install an FTP client like FileZilla
   - In Hostinger dashboard, go to "Files" → "FTP Accounts"
   - Create a new FTP account or note the default one
   - Connect to your server using the FTP credentials
   - Upload your application files to "public_html" directory

4. **Set Up Node.js Environment**:
   - Hostinger supports Node.js applications
   - Go to "Advanced" → "Node.js" in your Hostinger dashboard
   - Create a new Node.js application
   - Set the application path (e.g., "public_html")
   - Set the application URL (your domain)
   - Set the Node.js version (14.x, 16.x, or 18.x)
   - Set the application startup file (e.g., "server/index.js")
   - Click "Create"

## Environment Variables Configuration

1. **Set Environment Variables**:
   - In your Hostinger dashboard, go to "Advanced" → "Node.js"
   - Select your application
   - Go to the "Environment Variables" tab
   - Add the following variables:
     - `DATABASE_URL`: The connection string for your MySQL database
     - `VITE_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
     - `VITE_GOOGLE_OAUTH_CLIENT_ID`: Your Google OAuth client ID
     - Any other required environment variables

2. **Restart Your Application**:
   - After setting environment variables, click "Restart" to apply changes

## SSL Certificate Setup

1. **Enable SSL Certificate**:
   - In your Hostinger dashboard, go to "SSL"
   - Find your domain and click "Setup"
   - Select "Let's Encrypt" SSL
   - Click "Install"
   - Wait for the SSL certificate to be installed

2. **Force HTTPS**:
   - After installing SSL, go to "Advanced" → ".htaccess Editor"
   - Add the following code to force HTTPS:
     ```
     RewriteEngine On
     RewriteCond %{HTTPS} off
     RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
     ```
   - Click "Save"

## Troubleshooting Common Issues

### Database Connection Issues
- Double-check your database credentials
- Make sure your application is using the correct connection string
- Verify that your database user has the necessary permissions

### Application Not Starting
- Check the Node.js logs in your Hostinger dashboard
- Verify that the startup file path is correct
- Make sure all required dependencies are installed
- Check that your application is configured to run on the port specified by Hostinger

### SSL Certificate Issues
- Make sure your domain's DNS is properly configured
- Wait for DNS propagation (can take up to 48 hours)
- Verify that your application is redirecting to HTTPS

### File Upload Issues
- Check file permissions (files should be 644, directories should be 755)
- Make sure your FTP connection is correct
- For large uploads, try breaking them into smaller batches

## Additional Resources

- [Hostinger Knowledge Base](https://support.hostinger.com/en)
- [Hostinger Node.js Documentation](https://support.hostinger.com/en/articles/4455931-how-to-set-up-node-js)
- [Hostinger MySQL Database Guide](https://support.hostinger.com/en/articles/1583570-how-to-create-a-database-using-mysql)