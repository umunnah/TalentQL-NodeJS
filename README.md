# TalentQL-NodeJS
A RESTful API that supports the posts functionality of Facebook


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them.

```
NPM / Yarn
Code Editor (This app was built on VSCode)
Git
MongoDb
Cloudinary Account
```

**MongoDb**
To create a mongodb database read this documentation and follow the steps [MongoDB-Docs](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/).
After creating the database copy the database uri and update ``DATABASE_URI`` in ``.env`` file

**Cloudinary**

Cloudinary is an end-to-end image- and video-management solution for websites and mobile apps, covering everything from image and video uploads, storage, manipulations, optimizations to delivery.

All images and/or videos uploaded within this app are stored in a cloudinary account. You will need to create your account if you want to properly test this functionality out locally. 

*Setup:* 

1.  Create an account at [Cloudinary](https://cloudinary.com/).

2.  Navigate to your Cloudinary dashboard to find the variables you will later need to add to the ```.env``` file (See How To Use section below)

### Installing

To get this project on your local machine, you first need to clone it using the `git clone` command.

```
git clone https://github.com/umunnah/TalentQL-NodeJS.git
```

Running this on your terminal will ensure you receive the latest version with all it's changes.

Once you've cloned it, install all dependencies using:

```
npm install
```

This should retrieve all the necessary dependencies named in the [package.json](https://github.com/umunnah/TalentQL-NodeJS/blob/main/package.json) file.

### How To Use:

Once dependencies are installed, be sure to include a ```.env``` or update of ```.env.example``` to ```.env``` file with the necessary environment variable:

```
NODE_ENV=development
PORT=5000

DATABASE_URI=<your mongodb cluster database url...>
JWT_SECRET=<any random string you want to use as secret key...>
JWT_EXPIRE=<number of days before token expires eg 30d or 45d...>

SMTP_HOST=<your email provider host...>
SMTP_PORT=<your email provider host...>
SMTP_EMAIL=<your email address...>
SMTP_PASSWORD=<your email password...>
FROM_EMAIL=<your email address...>
FROM_NAME=<the email name to be used eg TalentQl...>

CLOUNDINARY_NAME=<your cloudinary name goes here...>
CLOUNDINARY_API_KEY=<your cloudinary key goes here...>
CLOUNDINARY_API_SECRET= <your cloudinary api secret goes here...>
```

When everything is in place, the application can be run locally using:

```
npm run dev
```

## Running tests 🧪

The testing framework utilized is Mocha. Tests can be run by using the command:

```
npm run test
```

To run tests and see the code coverage. Run using the command:
```
npm run coverage
```

To view api documentation on postman 👉 [click here](https://documenter.getpostman.com/view/8365237/TzJx9GoS). Note  the domain is http://localhost:5000 because it has not be hosted on a server.


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)