const db = require('./db');
const express = require('express');
let router = express.Router();

let db1 = new db;
let _initResult = function() {
    return { success:false, data:[], err: "unimplemented" };
}
router.get('/participants', (req, res) => {
    let email = req.query.email;
    try {
        result = { success: true, data: db1.getParticipants(email)};
    } catch (e) {
        result = { success: false, err: e.message};
    }
    return res.json(result);
});
router.get('/occasions', (req, res) => {
    let result = _initResult();
    // Get the query parameters
    let participants = req.query.participants;
    let subneeded = req.query.subneeded;
    let from = req.query.from;
    try {
        result = { 
            success: true, 
            data: db1.getOccasions(participants, subneeded, from) 
        };
    } catch (e) {
        result = { success: false, err: e.message};
    }
    ;
    return res.json(result);
});

module.exports = router;
