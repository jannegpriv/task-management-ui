FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps && \
    npm install --save-dev @babel/plugin-transform-react-jsx

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Use nginx to serve the static files
FROM nginx:alpine

# Copy the built files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Make sure the mime.types file is present
COPY --from=nginx:alpine /etc/nginx/mime.types /etc/nginx/mime.types

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
