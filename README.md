# DevOps-Project

![Scheduled server check](https://github.com/DevOps-Drengene/DevOps-Project/workflows/Scheduled%20Check/badge.svg)

## Setup and run
1. Build application:
    ```bash
    $ docker-compose build
    ```
2. Run application:
    ```bash
    $ docker-compose up
    ```
3. Following endpoints is opened:
    - Frontend: `localhost:3000`
    - Custom API: `localhost:5000`
    - Simulator API: `localhost:5001`

## Deploy and run with Vagrant on Digital Ocean
1. Add `SSH_KEY_NAME` and `DIGITAL_OCEAN_TOKEN` to your environment.
   ```bash
   $ nano ~/.bashrc #(or whatever shell you use)
   ```
   You get your `SSH_KEY_NAME` and `DIGITAL_OCEAN_TOKEN` from the settings on cloud.digitalocean.com
   ```bash
   export SSH_KEY_NAME="My Computer SSH"
   export DIGITAL_OCEAN_TOKEN="My Secret Key"
   ```
2. Reload shell configuration after last install:
   ```bash
   $ source ~/.bashrc
   ```
3. Install Digital Ocean plugin for Vagrant
   ```bash
   $ vagrant plugin install vagrant-digitalocean
   ```
4. Deploy to Digital Ocean
   ```bash
   $ vagrant up
   ```

## How to run flag tool
1. Bring up the application as described in the 'Setup and run' section.
2. Run `docker build -t minitwit-flagtool -f ./backend/Dockerfile-flagtool ./backend` to build the Docker image with the flag tool.
3. Run `docker run --network=minitwit-network minitwit-flagtool (args...)` to run the flag tool.

## How to run integration tests for simulator in Docker container:
1. Run `docker-compose build` to build all application images.
2. Run `docker build -t minitwit-simulator-integration-test ./tests/simulator-integration-test -f ./tests/simulator-integration-test/Dockerfile` to build Docker image with simulator integration tests.
3. Run `docker-compose up -d --force-recreate` to run application in detached mode.
4. Run `docker run --network=minitwit-network minitwit-simulator-integration-test` to execute simulator integration test.

## How to setup and run (minified) simulator in Docker container:
1. Run `docker-compose build` to build all application images.
2. Run `docker build -t minitwit-simulator ./tests/simulator -f ./tests/simulator/Dockerfile` to build Docker image with simulator test.
3. Run `docker-compose up -d --force-recreate` to run application in detached mode.
4. Run `docker run --network=minitwit-network minitwit-simulator` to execute simulator test.

## How to setup and run E2E test
1. Setup and start the application as described in 'Setup and run' section.
2. Navigate to the `tests/e2e` directory and run the following command to install all required dependencies: `npm install`
3. In the `tests/e2e` directory, run the following command to start the E2E test: `npm test`
