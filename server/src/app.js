/**
 * Top-level module for the server application. 
 * All setup for the express server occurs here.
 * 
 * ## APIs
 * 
 * The application provides the following V1 APIs:
 * - Get the list of participants
 *   - URL: GET `/participants`
 *   - query parameters: 
 *     - `email` - Include email address - boolean or 0/1
 * - Get the list of occasions, with roles and attendances nested within them.
 *   - URL: GET `/occasions`
 *   - query parameters: ** support is unimplemented **
 *     - `participants` - a list of participants used to filter the list (number[])
 *     - `subneeded` - whether to include data where the participant is a substitute (boolean)
 *     - `from` - the earliest date for which to include occasions (ISO timestamp)
 * - Change the type of an attendance
 *   - URL: POST `/attendance/{id}/type`
 *   - url parameters: 
 *     - `id`  - attendance id (number)
 *   - body JSON parameters: 
 *     - `type` - attendance type (string)
 * - Change the substitute of an attendance
 *   - URL: POST `/attendance/{id}/substitute`
 *   - url parameters: 
 *     - `id`  - attendance id (number)
 *   - body JSON parameters: 
 *     - `substitute` - participant id of substitute (number)
 * 
 * @module App
 */
const express = require('express');
const path = require('path');
const ApiV1 = require('./api/index');
const bodyParser = require('body-parser');
const db = require('./db/index');
const dbQueries = require('./db/queries');
const operations = require('./api/operations');

const PORT = process.env.PORT || 5000;

// Web API setup

let apiv1 = new ApiV1(new operations(new dbQueries(new db(null,true))));

let router = express.Router();

router.get('/participants', (req, res) => {
    apiv1.getParticipants(req,res);
});
router.get('/occasions', (req, res) => {
    apiv1.getOccasions(req,res);
});
router.post('/attendance/:id/type', (req, res) => {
    apiv1.postAttendanceType(req,res);
});
router.post('/attendance/:id/substitute', (req, res) => {
    apiv1.postAttendanceSubstitution(req, res);
});

// Express server setup

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/api/v1', router);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
