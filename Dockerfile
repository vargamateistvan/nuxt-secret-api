FROM node:12-alpine

RUN npm install
RUN npm run build

COPY package*.json ./

COPY . .

CMD [ "npm", "run", "dev" ]


