FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_PAYPAL_CLIENT_ID
ARG VITE_API_URL

ENV VITE_PAYPAL_CLIENT_ID=$VITE_PAYPAL_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL

RUN echo "PAYPAL=$VITE_PAYPAL_CLIENT_ID"

COPY frontend/package*.json ./
RUN npm ci
COPY frontend/  .
RUN npm run build
FROM nginx:alpine

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]