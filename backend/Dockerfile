# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy the rest of your app files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run Prisma migrations (for production)
RUN npx prisma migrate deploy

# Expose the backend port
EXPOSE 8000

# Start the backend server
CMD ["npm", "start"]

