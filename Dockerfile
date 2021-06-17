FROM node:12-alpine

RUN npm install
RUN npm run build

WORKDIR /app/

COPY . /app/

COPY package*.json ./

COPY . .

CMD [ "npm", "run", "dev" ]
