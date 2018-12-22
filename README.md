# Deacon Service - First Church of Nashua Deacon Dashboard

## Introduction

This service provides a mechanism for the First Church deacons to coordinate availability and negotiate stepping in for one another as needed.

It sports a simple Node Express server and a PostgreSQL database with only four tables. The client is pure EmberJS, written in TypeScript, with mobile phones as the design center. During initial development, it is currently deployed to Heroku at the following location: https://deacon-service.herokuapp.com/

As a summer coding project, this is being implemented in stages, so it can be put down and picked up again.

1. [X] Viewing the schedule of assignments and the current state of availability and substitutions.

2. [X] Confirming or declining availability with a pop-up on the row in the "My Duties" and "Family" views.

3. [X] Volunteering to substitute for someone who can't be there in the "Substitution" view.

4. [ ] Automated email reminders on Tuesday for assignees and volunteering substitutes to check-in for the following Sunday's duties.

5. [ ] Automated email notification of unavailability and when a substitute has volunteered.

6. [ ] Chair mode - authenticated logins for advanced capabilities. Probably won't be mobile friendly.

7. [ ] Chair: Ability to add services to schedule with assignments in various roles.

8. [ ] Chair: Ability to add Deacon of the Day assignments to services.

9. [ ] Chair: Ability to change the roster - adding and removing people and changing their data.

## Preparing for local development

* Install Postgres 10.x, NodeJS current LTS, and the current Yarn release.
* Install Ember-CLI 3.5 globally using either NPM or yarn:
   * `npm install -g ember-cli` (or) 
   * `yarn global add ember-cli`
* Clone the project from the repository, creating a local deacon-service directory.
* Navigate to the directory and perform:
     * `yarn install`
* Create a local postgres database, typically named 'deacons'.
* Create a postgres user who will own the database.

## Running locally

### Server
* Open a command prompt and navigate to the server subdirectory.
*Start it all by performing the following:
    * `DATABASE_URL= postgres://localhost:5432/user@pass:deacons yarn start`
* The server will run at http://localhost:5000 and you can connect to it for 
debugging with [chrome://inspect](chrome://inspect)

### Client
* Open a command prompt and navigate to the client subdirectory.
* Start it all by performing the following:
   	* `yarn start`
* Client will proxy to server at port 5000 for back-end operations.
When both are up, navigate your browser to http://localhost:4200


