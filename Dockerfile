FROM node:lts-alpine AS builder

WORKDIR /app

# First copy only the package files for better caching
COPY package*.json ./
RUN npm install

# Copy the rest (this will only run if your code changes)
COPY . /app/

# Execute the build
RUN npm run build

FROM nginx:stable-alpine

# FIX: Specifically copy the contents of the 'browser' folder to the html root
# Replace 'techytax-ngx' with the "name" specified in your package.json
COPY --from=builder /app/dist/techytax-ngx/browser/ /usr/share/nginx/html/

# Nginx configuration adjustments for port 8090 and non-root user
RUN chmod a+rwx /var/cache/nginx /var/run /var/log/nginx && \
    sed -i.bak 's/listen\(.*\)80;/listen 8090;/' /etc/nginx/conf.d/default.conf && \
    sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

# Important for Angular routing (prevents 404 on page refresh)
RUN sed -i '/location \/ {/a \        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

EXPOSE 8090

USER nginx

HEALTHCHECK     CMD     [ "service", "nginx", "status" ]
