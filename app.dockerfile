FROM node:12-alpine
RUN apk add python gcc g++ make curl

ARG WORKING_DIR=/var/www

RUN mkdir -p $WORKING_DIR
WORKDIR $WORKING_DIR

COPY package.json $WORKING_DIR
RUN yarn install --production

COPY . $WORKING_DIR/
RUN make app-dist

RUN yarn global add pm2
RUN pm2 install pm2-logrotate

CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production", "--only", "app"]
