# Fragments
Fragments - Cloud Computing project from Cloud Computing course at Seneca College.

Medium Article about this project: https://medium.com/@andreibatomunkuev/cloud-computing-79f47c4463fa

Docker Hub repository: https://hub.docker.com/repository/docker/abatomunkuev1/fragments

<img width="1098" alt="image" src="https://user-images.githubusercontent.com/55283735/209460866-d5186ef8-b400-4002-aed6-03ab224dfe0f.png">

## Contents of the page

- [Task](https://github.com/abatomunkuev/fragments#task)
- [System Design](https://github.com/abatomunkuev/fragments#system-design)
- [Tech stack WIP](https://github.com/abatomunkuev/fragments#tech-stack-wip)
- [Development](https://github.com/abatomunkuev/fragments#development)
- [Log](https://github.com/abatomunkuev/fragments#log)

## Task

Develop a new highly-scalable microservice which will help automate the processes of internal systems:

- Collect reports from IoT devices in different text formats (plain-text, csv, json)
- Collect reports from mobile devices in different formats (plain-text, json, markdown, HTML)
- Collect image files from device cameras.

## System Design
<img width="1098" alt="image" src="https://user-images.githubusercontent.com/55283735/209460898-14c33293-b651-47cc-b1d0-59b938070b6d.png">


## Tech Stack

<img width="1098" alt="image" src="https://user-images.githubusercontent.com/55283735/209460911-cbaf3035-ff6b-498c-9f6f-440c50234d4a.png">


| Technologies, Services            | Description                                                                                                                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node JS                           | [Open-source, back-end JavaScript environment](https://nodejs.org/en/about/)                                                                                                               |
| Amazon Web Services (AWS)         | [Amazon Cloud Platform](https://aws.amazon.com) that provides on-demand delivery of IT resources over the Internet                                                                         |
| Amazon Cognito                    | [ Web Services product](https://aws.amazon.com/cognito/) that controls user authentication and access for mobile applications on internet-connected devices.                               |
| Amazon Elastic Compute Cloud EC2  | [Amazon EC2](https://aws.amazon.com/ec2/)                                                                                                                                                  |
| Amazon Elastic Container Registry | [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/) - fully managed Docker container registry                                                                                 |
| Amazon Elastic Container Service  | [Amazon Elastic Container Service](https://aws.amazon.com/ecs/) - fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications |
| Amazon Fargate                    | [Fargate](https://aws.amazon.com/fargate/) - serverless, pay-as-you-go compute engine that lets you focus on building applications without managing servers.                               |
| Amazon S3                         | [Amazon S3](https://aws.amazon.com/s3/) - is an object storage service offering industry-leading scalability, data availability, security, and performance.                                |
| Amazon DynamoDB                   | [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) - is a fully managed, serverless, key-value NoSQL database designed to run high-performance applications at any scale.                 |
| Docker                            | [Docker](https://www.docker.com) is an open platform for developing, shipping, and running applications. See [Docker Overview](https://docs.docker.com/get-started/overview/)              |
| Docker Hub                        | [Docker Hub](https://hub.docker.com) - Docker Container Registry                                                                                                                           |

## Development

### Local Development

- Install the project dependencies

```
npm install
```

| Script                                                 | How to run                           |
| ------------------------------------------------------ | ------------------------------------ |
| Linter                                                 | `npm run lint`                       |
| Start the server                                       | `npm start`                          |
| Start the server in development mode                   | `npm run dev`                        |
| Start the server in debug mode                         | `npm run debug`                      |
| Run unit-tests                                         | `npm test`                           |
| Run integration tests                                  | `npm run test:integration`           |
| Run script to create mock S3 Bucket and DynamoDB table | `./scripts/local-aws-setup.sh`       |
| Run script to create mock DynamoDB table (MinIO)       | `./scripts/local-aws-minio-setup.sh` |

- To debug the source code, use VSCode debugger. See (https://code.visualstudio.com/docs/editor/debugging https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- All configuration information in `.env`

### Docker Containers

- Pull an image from Docker Hub

```
docker pull abatomunkuev1/fragments
```

- Build the Docker Image.

```
docker build -t fragments:latest .
```

- Run the container with environment variables, specifying port 8080

```
docker run --rm --name fragments --env-file .env -p 8080:8080 fragments:latest
```

- Run the container using Basic Auth instead of AWS Cognito

```
docker run --rm --name fragments --env-file env.jest -p 8080:8080 fragments:latest
```

- Run the container; override environment variable

```
docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 fragments:latest
```

- Detaching the container (run the container in the background)

```
docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest
```

- See the logs (replace <id> with id generated by docker)

```
docker logs <id>
```

- Docker follow the logs (keep printing them as they happen)

```
docker logs -f <id>
```

- Build the image targeting the platform (Mac OS M1 Chip)

```
docker buildx build -t abatomunkuev1/fragments:latest --platform=linux/amd64 .
```

- Build and run multiple services using docker-compose

```
docker-compose up
```

- Run service(s) in the background using -d

```
docker-compose up -d
```

- Stop services

```
docker-compose down
```

- Run specific services instead of running all

```
docker-compose up dynamodb-local localstack
```

- Restart specific container without touching other containers

```
docker-compose up --build --no-deps -d fragments
```

- Start docker-compose for local development (MinIO)

```
docker-compose -f docker-compose.local.yml up -d
```

## Log

- 05 Sep 2022 - Started the project, configured package.json, prettier, eslint
- 07 Sep 2022 - Added logger, nodemon, startup scripts
- 08 Sep 2022 - Added VSCode debug launch, updated README
- 13 Sep 2022 - Created repo for Fragments UI Web Application - https://github.com/abatomunkuev/fragments-ui
- 13 Sep 2022 - Added dotenv, passport.js, aws-jwt-verify packages.
- 13 Sep 2022 - Updated project structure, added routes, authorization and authentication code, configured .env,
- 13 Sep 2022 - Connected to AWS Cognito service
- 21 Sep 2022 - Added CI GitHub Actions workflow - ESlint
- 30 Sep 2022 - Created and configured EC2 instance. Installed and ran Microservice (Fragments API) on EC2.
- 04 Oct 2022 - Added In-Memory Database Backend. Implemented database related calls and wrote unit-tests for each call.
- 05 Oct 2022 - Implemented Fragment class to use Data Model and In-Memory Database and wrote unit-tests
- 06 Oct 2022 - Added POST /fragments route with unit-tests using Fragment class
- 06 Oct 2022 - Modified GET /fragments route, added unit-tests. Implemented GET /fragments/:id route with unit-tests
- 06 Oct 2022 - Secured user login (email) via hashing, added unit-tests. Added custom middleware to hash user's email address
- 06 Oct 2022 - Added logs
- 16 Oct 2022 - Dockerized the project. Added Dockerfile.
- 23 Oct 2022 - Optimized Dockerfile. Modified GET /fragments route - now it accepts query parameter `expand` to get expanded fragments metadata. Added unit-tests.
- 06 Nov 2022 - Added Linting Dockerfiles job in CI workflow: hadolint tool that parses a Dockerfile and checks it against set of [rules](https://github.com/hadolint/hadolint#rules)
- 06 Nov 2022 - Added Automatic Build and Push to Dockehub job in CI workflow: the job builds the image and pushes it to the Docker registry (DockerHub). Added secrets in GitHub.
- 06 Nov 2022 - Added a CD Workflow in GitHub Actions. Push the new image to private container repository. Created Amazon Elastic Container Registry private repository.
- 10 Nov 2022 - Modified POST /fragments route, added support for any text/\* format (text/html, text/markdown) and application/json. Modified and added unit-tests. Modified formats method that returns list of supported format to convert the Fragment.
- 10 Nov 2022 - Added GET /fragments/:id/info route with unit-tests. GET /fragments/:id/info returns the Fragment's metadata for the given id
- 12 Nov 2022 - Added GET /fragments/:id.ext support with unit-tests. GET /fragments/:id.ext returns the Fragment's data converted to a supported type
- 20 Nov 2022 - Added integration tests using a tool Hurl.
- 20 Nov 2022 - Added docker-compose to create complex testing environments, and use it to mock AWS services in local development. Offline solutions used: [LocalStack](https://localstack.cloud/), [DynamoDB Local](https://hub.docker.com/r/amazon/dynamodb-local)
- 27 Nov 2022 - Added [Amazon ECS](https://aws.amazon.com/ecs/) - fully managed container orchestration service. Added CD Workflow in GitHub Actions. Auto-deployment to Amazon ECS (deploy image, run and manage containers, monitor containers, scale containers, manage compute resources)
- 27 Nov 2022 - Added [AWS S3](https://aws.amazon.com/s3/). Created S3 Bucket. Connected project using Amazon S3 SDK. Microservice supports adding, reading, and deleting raw data to S3 storage.
- 27 Nov 2022 - Added DELETE route to delete fragment: metadata and raw data from S3. Added integration tests to test S3 connection with our Microservice: writing, reading, and deleting fragments data using Hurl.
- 27 Nov 2022 - Added [MinIO](https://min.io/) - an S3-compatible object store that can be run as a Docker container locally. It's a useful tool for development, or creating private-cloud applications that need S3 object storage.
- 04 Dec 2022 - Added [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) - is a fully managed, serverless, key-value NoSQL database designed to run high-performance applications at any scale. Added integration tests to test DynamoDB connection with our Microservice: writing, reading, and deleting fragments metadata using Hurl.
- 04 Dec 2022 - Created table in [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)
- 04 Dec 2022 - Added Integration Tests job in CI Workflow.
- 05 Dec 2022 - Updated docker-compose.local.yml for local development: Local S3 [MinIO](https://min.io/) and [DynamoDB Local](https://hub.docker.com/r/amazon/dynamodb-local). Added script that initializes fragments table in DynamoDB Local.
- 07 Dec 2022 - Added POST image support. User can create any supported image/_, text/_, application/json fragments.
- 07 Dec 2022 - Added image conversion of all fragment types (text/\*, application/json, image/\*) using [sharp library](https://sharp.pixelplumbing.com)
- 07 Dec 2022 - Modified Dockerfile. Sharp is manually installed due to issues with alpine image versions.
- 09 Dec 2022 - Added PUT /fragments/:id route. PUT /fragments/:id updates (i.e., replaces) the data for their existing fragment with the specified id.
- 11 Dec 2022 - Added and update Unit Tests: DELETE and PUT route. Added Integration Tests: PUT, GET by id, GET converted data
