const express = require('express');
const path = require('path');
const ApiV1 = require('./api/index');
const bodyParser = require('body-parser');
const db = require('./db/index');
const dbQueries = require('./db/queries');
const operations = require('./api/operations');

const PORT = process.env.PORT || 5000;

let apiv1 = new ApiV1(new operations(new dbQueries(new db(null,true))));

// Web entry points

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

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/api/v1', router);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
