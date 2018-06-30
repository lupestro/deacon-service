const express = require('express')
const path = require('path')
const api = require('./api')
const PORT = process.env.PORT || 5000

const app = express();
app.route('/api').all(api());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
