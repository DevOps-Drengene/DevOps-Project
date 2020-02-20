FROM node:13-alpine3.10

# Working directory inside container
WORKDIR /app

RUN apk --no-cache add --virtual builds-deps build-base python

# Install and cache app dependencies
COPY package*.json ./
RUN npm install --silent

# Copy source code to working directory
COPY src ./src/

# Exposed port
EXPOSE 5001
