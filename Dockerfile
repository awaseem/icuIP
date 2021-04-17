FROM segment/chamber:2 AS chamber
FROM node:14-alpine

# Create app directory
WORKDIR /server

# Fetch latest chamber binary and add to container
COPY --from=chamber /chamber /bin/chamber

# Install dependencies
COPY package.json .
COPY package-lock.json .
COPY .npmrc .
RUN npm install

# Bundle app source
COPY . /server
RUN npm run build

ENV NODE_ENV=production \
  CHAMBER_KMS_KEY_ALIAS="params/webapp"

EXPOSE 80

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["node", "./build/src/main.js"]
