FROM node:alpine
# Create socketApp directory
RUN mkdir -p /usr/src/socketApp
WORKDIR /usr/src/socketApp
# Install socketApp dependencies
COPY package.json /usr/src/socketApp/
RUN npm install
# Bundle socketApp source
COPY . /usr/src/socketApp
EXPOSE 4000
CMD [ "npm", "start" ]