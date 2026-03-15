# Use official Node.js LTS image as base
FROM node:20-alpine

# Copy package files first (for layer caching)
COPY package.json ./app/
COPy src ./app/

# Set working directory inside the container
WORKDIR /app

# Install dependencies
RUN npm install

# Start the application
CMD ["node", "app.js"]
