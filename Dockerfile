# Docker instructions to create a container image (Docker Image)

#########################################################################################################
# Stage 0: Installing base dependencies

# Specify the base image to use (in our case, we use Node Base Image)
# Specify the version (version on local computer - v16.17.0) using tags ':' - https://docs.docker.com/engine/reference/builder/#from
# We are using a specific node v16.18.0 bullseye slim
# https://github.com/nodejs/docker-node/blob/8edd510a1b2f64330fd7b865afd12d88c3c21679/16/bullseye-slim/Dockerfile

FROM node:16.18.0-bullseye-slim@sha256:fdb39550a46f95d29037114f662a17ce94e0e0f55e2d6569400b4266146b2176  AS dependencies

# Add labels - adding metadata to an Image
# LABEL instructions use key=value pairs - https://docs.docker.com/engine/reference/builder/#label

LABEL maintainer="Andrei Batomunkuev <abatomunkuev@myseneca.com>" \
      description="Fragments Microservice API" \
      title="Fragments API"

# Define environment variables - https://docs.docker.com/engine/reference/builder/#env
# 1. Default port to use: 8080 in our service
# 2. Reduce npm spam when installing within Docker - https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
# 3. Disable colour when run inside Docker - https://docs.npmjs.com/cli/v8/using-npm/config#color
# 4. Set environment to production

# Note that we didn't put secrets in the Dockerfile instructions since 
# the environment variables we define here will persist in any containers
# run using this image. 
# Instead, we will define our secret environment variables at run-time

ENV PORT=8080 \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false \
    NODE_ENV=production


# Define working directory - https://docs.docker.com/engine/reference/builder/#workdir
# Use /app as our working directory

WORKDIR /app

# Copy package.json and package-lock.json into /app - https://docs.docker.com/engine/reference/builder/#copy
# Change the ownership to node

# NOTE: the trailing / on /app/ tells Docker that app is a directory vs. a file

COPY --chown=node:node package*.json /app/

# Install only production dependencies (installs exact versions) defined in package-lock.json - https://docs.docker.com/engine/reference/builder/#run

RUN npm ci --only=production

#########################################################################################################
# Stage 1: Building the microservice server and running it in production

# Specify the base image to use (in our case, we use Node Base Image) in production
# We are using a specific node v16.18.0 alpine 3.15
# https://github.com/nodejs/docker-node/blob/8edd510a1b2f64330fd7b865afd12d88c3c21679/16/alpine3.15/Dockerfile

FROM node:16.18.0-alpine3.15@sha256:9598b4e253236c8003d4e4b1acde80a6ca781fc231a7e670ecc2f3183c94ea5e AS production

# Copy the generated dependencies (node_modules/)
# Change the ownership to node

COPY --chown=node:node --from=dependencies /app/ ./

# Copy server's source code; We can use ./src since all paths can be relative to working directory (/app)
# Change the ownership to node

COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
# Change the ownership to node

COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Install curl for health checks
RUN apk --update --no-cache add curl

# Security (Principle of Least Privilege): Switch the user to node before we run the app

USER node

# Start the container by running our server - https://docs.docker.com/engine/reference/builder/#cmd

CMD ["node", "./src/server.js"]

# We run our service on port 8080
# Using EXPOSE we indicate the server to use 8080 - https://docs.docker.com/engine/reference/builder/#expose

EXPOSE 8080

# Health check

HEALTHCHECK --interval=10s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail localhost:8080 || exit 1
