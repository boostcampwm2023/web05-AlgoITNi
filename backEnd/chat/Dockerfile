FROM node:18.16.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

RUN apk add --no-cache python3 \
    && npm install pm2 -g

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm ci --only=production

EXPOSE 3000

CMD ["pm2-runtime", "dist/main.js", "-i", "max"]