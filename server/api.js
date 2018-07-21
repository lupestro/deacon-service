const db = require('./db');
const express = require('express');
const hydrator = require('./hydrator');
let router = express.Router();

let db1 = new db;
let _initResult = function() {
    return { success:false, data:[], err: "unimplemented" };
}
router.get('/participants', (req, res) => {
    let email = req.query.email;
    return db1.getParticipants(email).then( data => {
        return res.json({ success: true, data: data });
    })
    .catch (e => {
        return res.json({ success: false, err: e.message});
    });
});
router.get('/occasions', (req, res) => {
    let result = _initResult();
    // Get the query parameters
    let participants = req.query.participants;
    let subneeded = req.query.subneeded;
    let from = req.query.from;
    return db1.getOccasions(participants, subneeded, from).then( data => {
        return res.json({ success: true, data: hydrator.pumpOccasionData(data) });
    })
    .catch (e => {
        return res.json({ success: false, err: e.message});
    });
});


module.exports = router;
