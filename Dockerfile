# Stage 1: Build the Vite project
FROM node:lts-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vite project
RUN npm run build

# Stage 2: Serve the Vite project
FROM nginx:alpine

# Copy the build output from the previous stage to the nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a default nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port on which the server will run
EXPOSE 8081

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
