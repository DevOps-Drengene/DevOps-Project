FROM node:13-alpine3.10

# Working directory inside container
WORKDIR /app

# Install and cache app dependencies
COPY package*.json /app/
RUN npm install --silent

# Install global dependencies
RUN npm install -g serve

# Copy source code to working directory
COPY . .

# Build application to static asset
RUN npm run build

# Exposed port
EXPOSE 3000

# Serve static build while running
CMD [ "serve", "-s", "-l",  "3000", "build" ]
