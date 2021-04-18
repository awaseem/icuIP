FROM node:14-alpine

# Create app directory
WORKDIR /server

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Bundle app source
COPY . /server
RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "./build/src/main.js"]
