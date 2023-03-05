FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY tsconfig.json .
COPY src src
COPY public public
ENV NODE_ENV=production
ENV REACT_APP_SERVER_API_URL="http://localhost:8080/api"
RUN npm run build

FROM nginx:1.22-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /app/build /opt/site
COPY nginx.conf /etc/nginx/nginx.conf
