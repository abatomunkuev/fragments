# Docker instructions to create a container image (Docker Image)

# Specify the base image to use (in our case, we use Node Base Image)
# Specify the version (version on local computer - v16.17.0) using tags ':'
# https://docs.docker.com/engine/reference/builder/#from
FROM node:16.17.0

# Add labels - adding metadata to an Image
# LABEL instructions use key=value pairs
# https://docs.docker.com/engine/reference/builder/#label
LABEL maintainer="Andrei Batomunkuev <abatomunkuev@myseneca.com>" \
      description="Fragments Microservice API" \
      title="Fragments API"

# Define environment variables
# https://docs.docker.com/engine/reference/builder/#env
# 1. Default port to use: 8080 in our service
# 2. Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
# 3. Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false
# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
# Note that we didn't put secrets in the Dockerfile instructions since 
# the environment variables we define here will persist in any containers
# run using this image. 
# Instead, we will define our secret environment variables at run-time

# Define working directory
# https://docs.docker.com/engine/reference/builder/#workdir
# Use /app as our working directory
WORKDIR /app

# Copy package.json and package-lock.json into /app
# https://docs.docker.com/engine/reference/builder/#copy
COPY package*.json /app/
# NOTE: the trailing / on /app/ tells Docker that app is a directory vs. a file

# Install node dependencies defined in package-lock.json
# https://docs.docker.com/engine/reference/builder/#run
RUN npm install

# Copy server's source code; We can use ./src since all paths can be relative to working directory (/app)
COPY ./src ./src
# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
# https://docs.docker.com/engine/reference/builder/#cmd
CMD npm start

# We run our service on port 8080
# Using EXPOSE we indicate the server to use 8080
# https://docs.docker.com/engine/reference/builder/#expose
EXPOSE 8080
