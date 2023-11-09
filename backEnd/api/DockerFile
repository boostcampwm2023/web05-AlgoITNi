FROM node:20.3.1-alpine3.18
WORKDIR /home/app

COPY . .
RUN npm i -g pm2
RUN npm install

EXPOSE 4000

CMD ["pm2-runtime", "dist/main.js", "-i", "max"]