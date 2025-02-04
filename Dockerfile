FROM node:21

WORKDIR /usr/cypress-service-gui

COPY . .

WORKDIR /usr/cypress-service-gui/app

RUN npm install && \
npm run build

EXPOSE 3001

CMD ["npm", "start"]