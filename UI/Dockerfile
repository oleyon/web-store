# Use official Node.js image as base
FROM node:21-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Use Nginx as a lightweight server to serve the React app
FROM nginx:alpine

# Copy build output from the previous stage to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

COPY ./default.conf /etc/nginx/conf.d

# Expose port 80
EXPOSE 5173

# Nginx is the default command, starts automatically
