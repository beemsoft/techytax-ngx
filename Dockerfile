FROM node:13.10.1-alpine AS builder

COPY . /app/

WORKDIR /app

RUN npm install

RUN npm run build

FROM nginx:1.18-alpine

COPY --from=builder /app/dist/ /usr/share/nginx/html/

RUN chmod a+rwx /var/cache/nginx /var/run /var/log/nginx                        && \
    sed -i.bak 's/listen\(.*\)80;/listen 8090;/' /etc/nginx/conf.d/default.conf && \
    sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf


EXPOSE 8090

USER nginx

HEALTHCHECK     CMD     [ "service", "nginx", "status" ]
