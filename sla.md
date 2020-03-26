# SLA

The following document describes the service-level agreement (SLA) for the [simulator API](http://157.245.27.128:5001/).

### Monthly Uptime Percentage

We strive to deliver a monthly **99,99% uptime**, meaning that the API is able to serve valid responses to its client in this timeframe.

### Mean Time To Recover

In case of outage, the recovery time is expected to be around **12 hours**.

### Average Response Times

The expected average response time on API calls on the following API routes:
- GET `/latest`: **100ms**
- POST `/msgs/{username}`: **100ms**
- GET `/fllws/{username}`: **100ms**
- POST `/fllws/{username}`: **150ms**
- GET `/msgs`: **5s**
- GET `/msgs/{username}`: **700ms**

This is targeted clients located in Europe only, and is measured on a monthly basis.

### Error Rates

The average monthly number of valid requests from client that results in response with HTTP status code >= 500 is **0,1%**.
