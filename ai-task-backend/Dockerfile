# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Runtime stage
FROM node:20-alpine
WORKDIR /app
# Prepare non-root user (node is created by default in node images)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN chown -R node:node /app
USER node
EXPOSE 5000
CMD ["node", "server.js"]
