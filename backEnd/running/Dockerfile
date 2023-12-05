FROM node:18.16.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

RUN apk add --no-cache python3
RUN apk add --no-cache openjdk11
RUN npm install pm2 -g

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

RUN chmod -R 741 || true\
    mkdir /usr/src/app/logs\
    chmod -R 662 /usr/src/app/logs || true\
    mkdir /algoitni\
    chmod -R 777 /algoitni || true

RUN adduser deploy || true

USER deploy

CMD ["pm2-runtime", "dist/main.js", "-i", "max"]