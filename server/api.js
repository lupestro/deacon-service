const db = require('./db');
const express = require('express');
const hydrator = require('./hydrator');
let router = express.Router();

let db1 = new db;

let _initResult = function() {
    return { success:false, data:[], err: "unimplemented" };
}

// Field validations

let _validateId = function(value, optional) {
    if (optional && typeof value === 'undefined') {
        return true;
    }
    return (typeof value === 'string') && /^\d+$/.test(value);
}
let _validateAttendanceType = function(value, optional) {
    if (optional && typeof value === 'undefined') {
        return true;
    }
    return (typeof value === 'string') && 
        (value === 'confirmed' || value === 'declined' || value === 'assigned');
}
let _validateFlag = function(value, optional) {
    if (optional && typeof value === 'undefined') {
        return true;
    }
    result1 = (typeof value === 'string' && (value === '0' || value === '1'));
    result2 = (typeof value === 'numeric' && (value === 0 || value === 1));
    return result1 || result2;
}
let _validateParticipantList = function(value, optional) {
    if (optional && typeof value === 'undefined') {
        return true;
    }
    //TODO: Implement _validateParticipantList
    return typeof value === 'string';
}
let _validateTimestamp = function(value, optional) {
    if (optional && typeof value === 'undefined') {
        return true;
    }
    //TODO: Implement _validateTimestamp
    return typeof value === 'string';
}

// Web entry points

router.get('/participants', (req, res) => {
    //Validate the parameters as received
    if (!_validateFlag(req.query.email, true)) {
        return res.json({ success: false, err: "supplied email flag is invalid"});
    }

    // Get the query parameters
    let email = !!parseInt(req.query.email);
    return db1.getParticipants(email).then( data => {
        return res.json({ success: true, data: data });
    })
    .catch (e => {
        return res.json({ success: false, err: e.message});
    });
});
router.get('/occasions', (req, res) => {
    let result = _initResult();

    //Validate the parameters as received
    if (!_validateParticipantList(req.query.participants, true)){
        return res.json({ success: false, err: "supplied participant list is invalid"});
    }
    if (!_validateFlag(req.query.subneeded, true)) {
        return res.json({ success: false, err: "supplied subneeded flag is invalid"});
    }
    if (!_validateTimestamp(req.query.from, true)) {
        return res.json({ success: false, err: "supplied from date is invalid"});
    }

    // Get the query parameters
    let participants = req.query.participants;
    let subneeded = !!parseInt(req.query.subneeded);
    let from = req.query.from;
    return db1.getOccasions(participants, subneeded, from).then( data => {
        return res.json({ success: true, data: hydrator.pumpOccasionData(data) });
    })
    .catch (e => {
        return res.json({ success: false, err: e.message});
    });
});
router.post('/attendance/:id/type', (req, res) => {
    let result = _initResult();
    //Validate the parameters as received
    if (!_validateId(req.params.id, false)) {
        return res.json({ success: false, err: "Attendance ID is invalid"});
    } else if (!_validateAttendanceType(req.body.type, false)) {
        return res.json({ success: false, err: "Attendance type is invalid"});
    }
    //Get the parameters
    let id = parseInt(req.params.id);
    let type = req.body.type;    
    return db1.updateAttendance(id, type).then( data => {
        return res.json({success: true, data: hydrator.pumpRoleData(data)});
    })
    .catch(e => {
        return res.json({ success: false, err: e.message});
    })
});
router.post('/attendance/:id/substitute', (req, res) => {
    let result = _initResult();
    //Validate the parameters as received
    if (!_validateId(req.params.id, false)) {
        return res.json({ success: false, err: "Attendance ID is invalid"});
    }
    if (!_validateId(req.body.substitute, false)) {
        return res.json({ success: false, err: "Participant ID is invalid"});
    }
    //Get the parameters
    let id = parseInt(req.params.id);
    let participant = parseInt(req.body.substitute);
    return db1.updateSubstitute(id, participant).then( data => {
        return res.json({success: true, data: hydrator.pumpRoleData(data)});
    })
    .catch(e => {
        return res.json({ success: false, err: e.message});
    })
});

module.exports = router;
