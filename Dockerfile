FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["nodemon", "src/server.js"]
