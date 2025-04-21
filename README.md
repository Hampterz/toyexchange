# ToyShare

A community-driven platform that enables families to share gently-used toys, promoting sustainability and reducing waste through collaborative sharing.

## Features

- Toy exchange system
- User authentication
- Community features (groups, meetups, toy map)
- Sustainability tracking and gamification
- Admin dashboard for moderation
- Safe meetup locations
- Leaderboards

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd toyshare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application:
   Open your browser and go to `http://localhost:5000`

## Default Admin Credentials

- Username: `adminsreyas`
- Password: `Jell1boi!!`

## Project Structure

- `/client`: Frontend React application
  - `/src/components`: Reusable UI components
  - `/src/pages`: Page components
  - `/src/hooks`: Custom React hooks
  - `/src/lib`: Utility functions

- `/server`: Backend Express server
  - `index.ts`: Server entry point
  - `routes.ts`: API routes
  - `storage.ts`: Data storage implementation

- `/shared`: Shared code between frontend and backend
  - `schema.ts`: Data models and schemas

## Running on Ubuntu

### System Requirements
- Ubuntu 20.04 LTS or newer
- Minimum 2GB RAM (4GB recommended)
- At least 10GB of free disk space

### Using Node.js directly

1. Install Node.js and npm if not already installed:
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   
   # Check versions
   node -v   # Should be v16.x.x or higher
   npm -v    # Should be v8.x.x or higher
   ```

2. If you need a newer version of Node.js, use NVM:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   source ~/.bashrc
   nvm install 18
   nvm use 18
   ```

3. Navigate to the project directory and install dependencies:
   ```bash
   cd toyshare
   npm install
   ```

4. Fix ES Module compatibility (required):
   - The project uses ES Modules (`"type": "module"` in package.json), which has different syntax requirements.
   - For local development, you'll need to create a file called `vite.config.mjs` to override the default and import URL libraries:
     ```javascript
     import { fileURLToPath } from 'url';
     import { dirname } from 'path';
     import fs from 'fs';
     
     // Create a wrapper that loads the original vite.config.ts but adds __dirname equivalent
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = dirname(__filename);
     
     // Define this globally so the original config can use it
     global.__dirname = __dirname;
     
     // Use dynamic import to load the original config
     export default (async () => {
       const originalConfig = await import('./vite.config.js');
       return originalConfig.default;
     })();
     ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Using Docker (Alternative)

1. Install Docker if not already installed:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo systemctl enable --now docker
   ```

2. Create a `Dockerfile` in the project root if it doesn't exist:
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm install

   COPY . .

   EXPOSE 5000

   CMD ["npm", "run", "dev"]
   ```

3. Create a `docker-compose.yml` file if it doesn't exist:
   ```yaml
   version: '3'
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       volumes:
         - .:/app
         - /app/node_modules
   ```

4. Build and run with Docker Compose:
   ```bash
   sudo docker-compose up --build
   ```

## Troubleshooting

- **Port conflicts**: If port 5000 is already in use, you can change the port in `server/index.ts`.
- **Module not found errors**: Run `npm install` again to ensure all dependencies are installed.
- **TypeScript errors**: Make sure TypeScript is installed by running `npm install -g typescript`.
- **Connection refused errors**: Ensure the server is running and bound to the correct interface (0.0.0.0 instead of localhost).
- **ES Module errors** (like `__dirname is not defined in ES module scope`): Add `"type": "commonjs"` to your package.json file. This error happens because Node.js treats `.js` files as ES modules when `"type": "module"` is set or by default in newer Node.js versions.
- **Missing dependencies**: If you see errors about missing dependencies, run `npm install <package-name>` to install them.
- **Webpack/Vite configuration errors**: These are usually related to the build process. Make sure your Node.js version is compatible (v16+ recommended).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.