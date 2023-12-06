FROM node:18.16.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM hkleeeee/ubuntu:22.04

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000

RUN chmod -R 741 || true
RUN mkdir -p /usr/src/app/logs/error
RUN mkdir /algoitni
RUN chmod -R 777 /algoitni || true

RUN adduser deploy || true

USER deploy

CMD ["pm2-runtime", "dist/main.js", "-i", "max"]