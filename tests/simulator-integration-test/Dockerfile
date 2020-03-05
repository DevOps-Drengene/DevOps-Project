FROM python:3.7-alpine

## Install bash
RUN apk update && apk upgrade && apk add bash

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

EXPOSE 5001

ENV WAIT_HOSTS=simulator-api:5001

CMD bash -c "/wait && pytest -s minitwit_sim_api_test.py"
