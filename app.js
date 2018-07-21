const express = require('express');
const path = require('path');
const apiv1 = require('./api');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const router = express.Router();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'www')));
app.use('/api/v1', apiv1);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
