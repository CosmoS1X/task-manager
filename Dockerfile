FROM node:23-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

RUN npm run build

CMD ["bash", "-c", "npm start"]
