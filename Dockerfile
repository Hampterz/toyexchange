FROM node:20-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Expose the port
EXPOSE 5000

# Add a startup script to handle ES Module compatibility
RUN echo '#!/bin/sh\nnode --experimental-json-modules --no-warnings dist/index.js' > /app/start.sh
RUN chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]