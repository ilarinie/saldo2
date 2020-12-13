FROM node:14.15.1-alpine3.10

ENV USER=app

ENV SUBDIR=appDir
ENV HOME=/home/$USER
WORKDIR $HOME/$SUBDIR

RUN apk add --no-cache make gcc g++ python2
RUN yarn add node-sass react-scripts@4.0.1 -g

EXPOSE 3001

CMD ["node", "server/index.js"]

COPY . $HOME/$SUBDIR/

RUN yarn install

ENV PATH $HOME/${SUBDIR}/node_modules/.bin:$PATH

RUN yarn run build