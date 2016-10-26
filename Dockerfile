# To build and run with Docker:
#
#  $ docker build -t dynamodb-gui .
#  $ docker run -it --rm -p 3020:3000 -p 3021:3001 dynamodb-gui
#
FROM node:latest

RUN mkdir -p /dynamodb-gui /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /dynamodb-gui
COPY package.json typings.json /dynamodb-gui/
RUN npm install --unsafe-perm=true

COPY . /dynamodb-gui
RUN chown -R nodejs:nodejs /dynamodb-gui
USER nodejs

CMD npm start
