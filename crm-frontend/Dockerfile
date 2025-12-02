# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Accept build arguments for Azure SSO
ARG REACT_APP_AZURE_TENANT_ID
ARG REACT_APP_AZURE_CLIENT_ID
ARG REACT_APP_REDIRECT_URI
ARG REACT_APP_API_URL

# Set environment variables for build
ENV REACT_APP_AZURE_TENANT_ID=$REACT_APP_AZURE_TENANT_ID
ENV REACT_APP_AZURE_CLIENT_ID=$REACT_APP_AZURE_CLIENT_ID
ENV REACT_APP_REDIRECT_URI=$REACT_APP_REDIRECT_URI
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port (Cloud Run will use PORT env var)
EXPOSE 8080

# Start nginx with dynamic port
CMD ["/start.sh"]
