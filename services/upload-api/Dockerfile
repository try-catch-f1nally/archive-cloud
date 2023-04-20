FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY tsconfig.json .
COPY src src
RUN npm run build

FROM node:18-alpine AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN apk add --no-cache p7zip
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json .
RUN npm i --omit=dev
EXPOSE 3000
CMD npm start
