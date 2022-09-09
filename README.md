# Fragments

Fragments - Cloud Computing project from Cloud Computing course at Seneca College.

## Contents of the page

- [Task](https://github.com/abatomunkuev/Fragments#task)
- [Tech stack WIP](https://github.com/abatomunkuev/Fragments#tech-stack-wip)
- [Development](https://github.com/abatomunkuev/Fragments#development)
- [Log](https://github.com/abatomunkuev/Fragments#log)

## Task

Develop a new highly-scalable microservice which will help automate the processes of internal systems:

- Collect reports from IoT devices in different text formats (plain-text, csv, json)
- Collect reports from mobile devices in different formats (plain-text, json, markdown, HTML)
- Collect image files from device cameras.

## Tech stack WIP

| Technology                | Description                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Node JS                   | [Open-source, back-end JavaScript environment](https://nodejs.org/en/about/)                                       |
| Amazon Web Services (AWS) | [Amazon Cloud Platform](https://aws.amazon.com) that provides on-demand delivery of IT resources over the Internet |

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

## Log

- 05 Sep 2022 - Started the project, configured package.json, prettier, eslint
- 07 Sep 2022 - Added logger, nodemon, startup scripts
- 08 Sep 2022 - Added VSCode debug launch, updated README
