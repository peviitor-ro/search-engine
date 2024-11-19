# Use official Node.js image as the base image for building
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install

# Define build argument for environment
ARG BUILD_ENV=local
