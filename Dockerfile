# Stage 1: Use the official Node image to build the application
FROM node:20 as builder

# Set the working directory
WORKDIR /app

# Copy configuration files and project dependencies
COPY package*.json ./
RUN npm install

# Copy the application source code
COPY . .

# Build the application
RUN npm run build --prod

# Stage 2: Use Nginx to serve the built application
FROM nginx:alpine

# Copy the built application from the 'builder' to the Nginx directory
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
