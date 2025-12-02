#!/bin/sh

# Use PORT environment variable if set, otherwise default to 8080
PORT=${PORT:-8080}

# Update nginx config with the correct port
sed -i "s/listen 8080;/listen $PORT;/" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"
