FROM node:11-alpine
RUN apk add python gcc g++ make curl

ARG WORKING_DIR=/var/www

RUN mkdir -p $WORKING_DIR
WORKDIR $WORKING_DIR

COPY package.json $WORKING_DIR
RUN npm install

COPY . $WORKING_DIR/
RUN make dist

RUN npm install -g pm2
RUN pm2 install pm2-logrotate

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
