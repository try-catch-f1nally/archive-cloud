FROM node:18-alpine
WORKDIR app
RUN npm i -g migrate-mongo
COPY migrations migrations
COPY migrate-mongo-config.js migrate-mongo-config.js
CMD migrate-mongo up
