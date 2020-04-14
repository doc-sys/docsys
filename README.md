![docSys Logo](logo.svg 'docSys Logo')

A document management system written in Node and React, ready for the cloud. It is meant to incorporate the best from existing DMS and add an easy to expand API and the comforts of a modern day React app. For a full feature list see the [features](#features) section below.

<p style="color:red;">STILL A WORK IN PROGRESS!</p>

Be advised that the actual client and the CLI tool for easy deployment locally and to the cloud are located in seperate repositories.

[docSys React Repository](https://github.com/doc-sys/react_client)

[docSys CLI Repository](https://github.com/doc-sys/cli)

## Features

- AWS storage with versioning and encryption
- File sharing and locking
- E-Mail notifications
- multi-file handling

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

For this to run, you will need Node and npm installed as well as a running MongoDB instance either on your local machine or hosted somewhere else. You will also need an AWS account with a S3 bucket already created and an AWS user with permissions to use that bucket. To use the queues for sending mails to your users you will also have to provide credentials for a SMTP host and a Redis URI.

### Installing

A step by step series of examples that tell you how to get a development env running

Install the dependencies

```bash
npm i -y
```

Then add an .env file on the root level and configure it acording to the [configuration](#configuration) section.

Start the server with npm.

```bash
npm start
```

Now you can curl the API and should get a valid JSON response.

```bash
curl localhost:3001
```

## Running the tests

Currently there are no tests. If you want to contribute to this project this would be a great and very much appreciated way to start. See more down at the [contribute](#contributing) section.

## Deployment

docSys is meant to be deployed directly to the cloud using the provided cli or containerized with Docker (not implemented yet). If you want to run it locally or without Docker just make sure you followed all the steps above and use something like [pm2](https://github.com/Unitech/pm2) to keep the Node process running detached. You will need to serve the React frontend seperately tho.

## Configuration

We are using [dotenv](https://github.com/motdotla/dotenv) to load sensitive data into this application. Just set the corresponding environment variables in your .env file and you are good to go.

| Key                   | Comment                                    | Example                                                                |
| --------------------- | ------------------------------------------ | ---------------------------------------------------------------------- |
| HOST                  | The host domain your instance is runnig on | docsys.io                                                              |
| AWS_ACCESS_KEY        | Access key to your AWS user                |
| AWS_SECRET_ACCESS_KEY | Secret access key to your AWS user         |
| AWS_BUCKET_NAME       | S3 bucket to use                           | docSys                                                                 |
| DB_PATH               | MongoDB URI                                | mongodb://docsysusr:docsyspw@docsys.io:27017/docsys                    |
| REDIS_URL             | Redis URI                                  | redis://redis.example.com?db=docsys&password=correcthorsebatterystaple |
| JWT_SECRET            | Secret used to hash your JWT               | random string                                                          |
| JWT_EXPIRES_IN        | Expiration of your JWT in ms               | 36000                                                                  |
| SMTP_HOST             | Host running your SMTP server              | mail.docsys.io                                                         |
| SMTP_PORT             | Port where SMTP is listening               | 587                                                                    |
| SMTP_USER             | User or mail for your SMTP                 | noreply@docsys.io                                                      |
| SMTP_PASSWORD         | User password                              | docsyspwd                                                              |
| SMTP_SECURE           | If to use SSL                              | true                                                                   |

## Built With

- [Express](https://github.com/expressjs/express) - The web framework used
- [Mongoose](https://github.com/Automattic/mongoose) - Database driver
- [AWS SDK](https://github.com/aws/aws-sdk-js) - handling storage
- [multer](https://github.com/expressjs/multer) - File upload
- [BeeQueue](https://github.com/bee-queue/bee-queue) - Message queueing

## Contributing

There are a lot of things to get you into contributing to this project. Some are listed below but please feel free to let your imagination run wild and add cool features.

- **Testing** - We really need tests written for express. I'm very bad at writting these and would greatly appreciate some help
- **Documentation** - Some kind of docs that are documenting the different routes and what they do
- **Storage Engine** - Currently it's only possible to use AWS for file storage but I would love to have other like Azure and GCC onboard as well
- **Security** - Carefully rweworking the API to patch some potential security flaws that I have not yet found
- **CI pipeline** - Create a CI pipeline for testing etc

If you want to help but need guidance on where to start just open an issue and I will come and figure it out with you. Also check the React and CLI repos for some more ways to contribute!

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **Felix Wieland** - _Initial work_ - [felixwie](https://felixwie.com)
- **Mario Reggiori** - _General Assistance_ - [GitHub](https://github.com/marioreggiori)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the GNUv3.0 - see the [LICENSE.md](LICENSE.md) file for details
