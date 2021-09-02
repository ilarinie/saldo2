FROM node:14.16.1

ENV USER=app

ENV SUBDIR=appDir
ENV HOME=/home/$USER
WORKDIR $HOME/$SUBDIR

# RUN apk add --no-cache make gcc g++ python2
# RUN npm install -G node-sass react-scripts@4.0.3

EXPOSE 3001
EXPOSE 3033

CMD ["node", "server/index.js"]

COPY package.json ./
RUN npm install

COPY . $HOME/$SUBDIR/

ENV PATH $HOME/${SUBDIR}/node_modules/.bin:$PATH