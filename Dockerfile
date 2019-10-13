FROM node:10

ARG MONGO_URL
ENV MONGO_URL ${MONGO_URL:-mongodb://127.0.0.1:16006/admin}

ARG PORT
ENV PORT ${PORT:-3000}

ARG JWT_SECRET
ENV JWT_SECRET ${JWT_SECRET:-supersecretaclave}

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE ${PORT}

CMD [ "node", "index.js" ]