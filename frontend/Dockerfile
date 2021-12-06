# pull the base image
<<<<<<< Updated upstream
FROM node:16.13-alpine
=======
FROM node:alpine
>>>>>>> Stashed changes

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
<<<<<<< Updated upstream
COPY package-lock.json ./
RUN npm i antd
=======

COPY package-lock.json ./

>>>>>>> Stashed changes
RUN npm install

# add app
COPY . ./

# start app
CMD ["npm", "start"]