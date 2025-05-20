FROM node:23-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE $PORT

RUN npm run build

CMD ["bash", "-c", "npm run migrate && npm start"]
