# deacon-service Server

## Introduction

This Node Express server hosts the client app. It provides a set of APIs to retrieve the information that the client app displays and make client-specified changes.

## Running / Development

* `yarn start`
* `yarn debug`

Relevant environment variables - set them before starting the server:
* `PORT` - The port the server runs on (default: 5000)
* `DATABASE_URL` - THE URL of the database to use (default: `postgres://localhost:5432/deacons`)

### Running Tests

* `yarn test`
* `yarn coverage`
* `yarn debug:test`

### Linting

* `yarn lint`

### Documentation

* `yarn docs`

### Building

* `yarn build` 
