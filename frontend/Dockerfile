# Use a Node.js image to build the frontend
FROM node:20 as builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the frontend
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:latest

# Copy built frontend files from builder stage to Nginx's default HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

