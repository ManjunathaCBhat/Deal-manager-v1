# crm-frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Expose React dev server port
EXPOSE 3000

# For CRA: "start"
# For Vite: change this to ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
CMD ["npm", "start"]
