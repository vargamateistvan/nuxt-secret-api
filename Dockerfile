FROM node:12-alpine

RUN npm install -g nodemon

RUN npm install

COPY package*.json ./

COPY . .

CMD [ "npm", "run", "dev" ]
