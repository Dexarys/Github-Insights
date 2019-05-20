FROM node:8.16.0-alpine

COPY . /tmp

WORKDIR /tmp
CMD ["/bin/sh", "/tmp/start.sh"]