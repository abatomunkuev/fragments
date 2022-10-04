# Fragments

Fragments - Cloud Computing project from Cloud Computing course at Seneca College.

## Contents of the page

- [Task](https://github.com/abatomunkuev/fragments#task)
- [Tech stack WIP](https://github.com/abatomunkuev/fragments#tech-stack-wip)
- [Development](https://github.com/abatomunkuev/fragments#development)
- [Log](https://github.com/abatomunkuev/fragments#log)

## Task

Develop a new highly-scalable microservice which will help automate the processes of internal systems:

- Collect reports from IoT devices in different text formats (plain-text, csv, json)
- Collect reports from mobile devices in different formats (plain-text, json, markdown, HTML)
- Collect image files from device cameras.

## Tech stack WIP

| Technologies, Services    | Description                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Node JS                   | [Open-source, back-end JavaScript environment](https://nodejs.org/en/about/)                                                                                 |
| Amazon Web Services (AWS) | [Amazon Cloud Platform](https://aws.amazon.com) that provides on-demand delivery of IT resources over the Internet                                           |
| Amazon Cognito            | [ Web Services product](https://aws.amazon.com/cognito/) that controls user authentication and access for mobile applications on internet-connected devices. |

## Development

- Install the project dependencies

```
npm install
```

| Script                               | How to run      |
| ------------------------------------ | --------------- |
| Linter                               | `npm run lint`  |
| Start the server                     | `npm start`     |
| Start the server in development mode | `npm run dev`   |
| Start the server in debug mode       | `npm run debug` |

- To debug the source code, use VSCode debugger. See (https://code.visualstudio.com/docs/editor/debugging https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- All configuration information in `.env`

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
- 04 Oct 2022 - Added In-Memory Database Backend.
