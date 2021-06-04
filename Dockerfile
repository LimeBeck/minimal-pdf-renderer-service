FROM node:16-alpine

WORKDIR /server

COPY ./package*.json /server/

RUN npm ci

COPY ./ /server/

RUN npm run build

EXPOSE 4000

CMD npm start
