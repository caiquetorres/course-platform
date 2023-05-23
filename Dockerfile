FROM node:hydrogen-alpine as dev

WORKDIR /usr/src/app
COPY yarn*.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:hydrogen-alpine as prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY yarn*.lock ./

RUN yarn --production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
