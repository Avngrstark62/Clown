# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of your app files
COPY . .

# Expose the backend port
EXPOSE 8000

# Start the backend server
CMD ["npm", "start"]

