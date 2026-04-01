FROM node:24-trixie-slim

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE $PORT

RUN npm run build

CMD ["bash", "-c", "npm run migrate && npm start"]
