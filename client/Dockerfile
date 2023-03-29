FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY tsconfig.json .
COPY src src
COPY public public
ENV NODE_ENV=production
ENV AUTH_API_URL="hhttp://localhost:3001"
ENV UPLOAD_API_URL="http://localhost:3002"
RUN npm run build

FROM nginx:1.22-alpine AS production
WORKDIR /usr/src/app
COPY --from=build /app/build /opt/site
COPY nginx.conf /etc/nginx/nginx.conf
