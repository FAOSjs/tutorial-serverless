🧩 UNDERSTANDING SERVERLESS
<br/>
---

<br/>

### 🗣 Talking about the project
This project was made to understand WHAT IS SERVERLESS and HOW CAN I IMPLEMENT SOMETHING (certificate generator) USING THIS APROACH.
So... What is Serverless? Serverless isn't about doesn't have a server "behind the scenes", is about **doesn't need
a server management** to it. Ie, it has a server, but the management is the provider. That provider is a cloud provider,
so, when you aren't using, you don't pay for it. Here we'll use FaaS => Function as a Service. To finish, this project use
<a href="www.serverless.com">serverless</a> framework.

TEMPLATE_NAME = aws-nodejs-typescript
PROJECT_NAME  = certificate_generator 

### WHAT I DID TO SETUP MY PROJECT
- npm install -g serverless                                         => Installing framework
- serverless create --template TEMPLATE_NAME --path PROJECT_NAME    => Creating a project using serverless
- cd PROJECT_NAME                                                   => Accessing project folder
- yarn                                                              => Installing dependencies
- delete libs folder, tsconfig.paths.json and functions content
- remove extends and ts-node properties from tsconfig.json
- npm install serverless-offline --save-dev                         => It's used to run your app on dev environment
- npm install serverless-dynamodb-local --save-dev
- put the new plugin in the serverless configuration
- npm install esbuild                                               => esbuild is a bundler
- serverless offline                                                => Running app


### 🌐 HOW TO DEPLOY
- Create a IAM user with keys and AdministratorAccess
- Copy both keys
- run => serverless config credentials --provider aws --keys ACCESS_KEY_ID --secret SECRET_ACCESS_KEY
- if you prefer, create scripts to run dynamoDB and to deploy
- serverless configurations:
  - check iamRoleStatements give permission to your services (dynamoDB and S3)
  - in this project, we need to create/change the package propertie to include other files (not only functions)
  including templates to deploy process in the same package:
  => `package: {individually: false, include: ["./src/templates/**"]}`
- yarn deploy

### 🛠 PROJECT TOOLS:
- DynamoDB
- AWS lambda
- S3
