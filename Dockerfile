FROM node:20.8.0-slim

ENV NODE_OPTIONS=--max_old_space_size=16384

ENV USER=app

EXPOSE 3000

COPY .npmrc ./

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY ./ .

RUN npm run build

ENV PATH $HOME/${SUBDIR}/node_modules/.bin:$PATH

CMD ["node", "dist/index.js"]