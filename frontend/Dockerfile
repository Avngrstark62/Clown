# Use a Node.js image to build the frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all frontend code
COPY . .

# Build the frontend
RUN npm run build

# Use an Nginx image to serve the built files
FROM nginx:latest

# Copy built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

