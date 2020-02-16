# DevOps-Project

## Setup and run
1. Init database:
    ```bash
    $ node minitwit-backend/src/init.js
    ```
2. Build application:
    ```bash
    $ docker-compose build
    ```
3. Run application:
    ```bash
    $ docker-compose up
    ```
4. Following endpoints is opened:
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
3. Deploy to Digital Ocean

   ```bash
   $ vagrant up
   ```

## How to setup and run E2E test
1. Setup and start the application as described in last section.
2. Navigate to the `tests` directory and run the following command to install all required dependencies: `npm install`
4. In the `tests` directory, run the following command to start the E2E test: `npm test`
