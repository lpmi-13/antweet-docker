FROM node:8.13.0-alpine

WORKDIR /app

COPY ./package.json /app
RUN npm install
COPY ./app.js /app

RUN addgroup -S app && adduser -S -G app app
USER app

CMD [ "npm", "start" ]
EXPOSE 3001
