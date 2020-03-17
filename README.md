# DevOps-Project

![Scheduled server check](https://github.com/DevOps-Drengene/DevOps-Project/workflows/Scheduled%20Check/badge.svg)

## Setup and run
1. Build application:
    ```bash
    $ make d-build-project
    ```
2. Run application:
    ```bash
    $ d-up-project
    ```
3. Following endpoints is opened:
    - Frontend: `localhost:3000`
    - Custom API: `localhost:5000`
    - Simulator API: `localhost:5001`
    - Simulator API Swagger docs: `localhost:5001/api-docs`
    - Prometheus API: `localhost:9090`
    - Grafana: `localhost:3001`

Grafana admin credentials (in non-prod mode):
- Username: `admin`
- Password: `admin`

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
Run the following command: `make run-flag-tool ARGS=<command-line arguments to tool>`

## How to run integration tests for simulator in Docker container:
Run the following command: `make run-sim-integration-test`

## How to setup and run (minified) simulator in Docker container:
Run the following command: `make run-min-sim-test`

## How to setup and run E2E test
1. Setup and start the application as described in 'Setup and run' section.
2. Navigate to the `tests/e2e` directory and run the following command to install all required dependencies: `npm install`
3. In the `tests/e2e` directory, run the following command to start the E2E test: `npm test`
