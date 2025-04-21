# ToyShare Ubuntu Setup Guide

This guide provides instructions for setting up and running the ToyShare application on an Ubuntu system.

## System Requirements

- Ubuntu 20.04 LTS or newer
- Node.js 18.x or newer (20.x recommended)
- npm 9.x or newer

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd toyshare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Due to ES module compatibility issues with the Vite configuration, there are two recommended ways to run the application on Ubuntu:

### Option 1: Using Node.js Experimental Features

```bash
# For development mode
NODE_OPTIONS="--experimental-json-modules --no-warnings" npm run dev

# For production mode
npm run build
NODE_OPTIONS="--experimental-json-modules --no-warnings" npm start
```

### Option 2: Using the Ubuntu Compatibility Script

We've included a special script for Ubuntu systems that handles ES module compatibility issues:

```bash
# Make the script executable
chmod +x start-ubuntu.js

# For development mode
NODE_ENV=development node start-ubuntu.js

# For production mode
NODE_ENV=production node start-ubuntu.js
```

## Troubleshooting ES Module Issues

If you encounter the error `ReferenceError: __dirname is not defined in ES module scope`, it's due to the project using ES modules (type: "module" in package.json) while certain files rely on CommonJS-specific variables.

Solutions:

1. Use the provided compatibility scripts mentioned above.

2. For manual fixes, add this code at the top of any file using `__dirname` or `__filename`:
   ```javascript
   import { fileURLToPath } from 'url';
   import { dirname } from 'path';
   
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);
   ```

## Database Setup

The application uses an in-memory database by default. No additional setup is required for basic usage.

## Accessing the Application

Once running, the application will be available at:

- Development mode: http://localhost:5000
- Production mode: http://localhost:5000

## Getting Help

If you encounter any issues not covered in this guide, please contact our support team at donotreplymail92@gmail.com.