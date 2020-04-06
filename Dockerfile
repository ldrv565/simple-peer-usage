FROM node:latest
# create folder and set it as workdir
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# copy package and yarn files to cache deps install
COPY package.json /usr/src/app/
RUN npm install --silent
# copy app itself
COPY . /usr/src/app
# run build if needed
RUN npm run build --if-present
EXPOSE 3000 4000 
CMD ["npm", "start"]