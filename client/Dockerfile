FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY tsconfig.json .
COPY src src
COPY public public
ENV NODE_ENV=production
ARG REACT_APP_AUTH_API_URL
ARG REACT_APP_UPLOAD_API_URL
ARG REACT_APP_STORAGE_API_URL
ENV REACT_APP_AUTH_API_URL $REACT_APP_AUTH_API_URL
ENV REACT_APP_UPLOAD_API_URL $REACT_APP_UPLOAD_API_URL
ENV REACT_APP_STORAGE_API_URL $REACT_APP_STORAGE_API_URL
RUN npm run build

FROM nginx:1.22-alpine AS production
COPY --from=build /app/build /opt/site
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
