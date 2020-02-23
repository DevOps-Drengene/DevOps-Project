FROM python:3.7-alpine

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

EXPOSE 5001

ENTRYPOINT ["/bin/sh", "./test.sh"]
