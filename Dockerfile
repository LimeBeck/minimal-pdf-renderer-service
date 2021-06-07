FROM node:16-alpine

RUN apk add \
    libstdc++ \
    chromium \
    harfbuzz \
    ca-certificates \
    nss \
    freetype \
    ttf-freefont \
    font-noto-emoji

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /server

RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /server

COPY ./package*.json /server/

RUN npm ci

COPY ./ /server/

RUN npm run build

EXPOSE 4000

USER pptruser

CMD npm start
