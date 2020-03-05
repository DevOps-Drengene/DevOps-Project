FROM node:13-alpine3.10

## Install bash
RUN apk update && apk upgrade && apk add bash

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

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
