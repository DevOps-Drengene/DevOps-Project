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

## How to setup and run E2E test
1. Setup and start the application as described in last section.
2. Navigate to the `tests` directory and run the following command to install all required dependencies: `npm install`
4. In the `tests` directory, run the following command to start the E2E test: `npm test`
