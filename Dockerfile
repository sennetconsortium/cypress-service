FROM node:21

WORKDIR /usr/cypress-service

COPY . .

WORKDIR /usr/cypress-service/app

RUN npm install && \
npm run build

EXPOSE 3001

CMD ["npm", "start"]