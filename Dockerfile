FROM node:20-alpine

# Set working directory first
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY src ./src

# Copy test code
COPY tests ./tests

EXPOSE 3000

# Start the application
CMD ["node", "src/app.js"]