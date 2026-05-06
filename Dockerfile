FROM node:24-trixie-slim

WORKDIR /app

COPY package*.json .

RUN npm ci && npm cache clean --force

COPY . .

EXPOSE $PORT

RUN npm run build

CMD ["bash", "-c", "npm run migrate && npm start"]
