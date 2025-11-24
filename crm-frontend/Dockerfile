# crm/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json /app/

RUN npm install

# Copy rest of the app
COPY . /app/

# Expose Next dev port
EXPOSE 3000

# Use env variables at runtime (NEXT_PUBLIC_AZURE_CLIENT_ID, etc)
# You will pass them via docker-compose or the Azure App Service config

CMD ["npm", "run", "dev", "--", "-p", "3000", "-H", "0.0.0.0"]
