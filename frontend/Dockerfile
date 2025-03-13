# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire project
COPY . .

# Expose frontend port
EXPOSE 5173

# Start the frontend server
CMD ["npm", "run", "dev"]

