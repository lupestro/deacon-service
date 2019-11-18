const hydratorModule = require('./hydrator');

class ApiV1 {
    constructor (operations, hydrator) {
        this.operations = operations;
        this.pumpOccasionData = hydrator ? hydrator.pumpOccasionData : hydratorModule.pumpOccasionData;
        this.pumpRoleData = hydrator? hydrator.pumpRoleData : hydratorModule.pumpRoleData;
    }
    _validateId (value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        return (typeof value === 'string') && /^\d+$/.test(value);
    }
    _validateAttendanceType(value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        return (typeof value === 'string') && 
            (value === 'confirmed' || value === 'declined' || value === 'assigned');
    }
    _validateFlag(value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        const result1 = (typeof value === 'string' && (value === '0' || value === '1'));
        const result2 = (typeof value === 'number' && (value === 0 || value === 1));
        return result1 || result2;
    }
    _validateParticipantList(value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        //TODO: Implement _validateParticipantList
        return typeof value === 'string';
    }
    _validateTimestamp(value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        //TODO: Implement _validateTimestamp
        return typeof value === 'string';
    }
    async getParticipants(req, res) {
        //Validate the parameters as received
        if (!this._validateFlag(req.query.email, true)) {
            return res.json({ success: false, err: "supplied email flag is invalid"});
        }

        // Get the query parameters
        let email = !!parseInt(req.query.email);
        return this.operations.getParticipants(email).then( data => {
            return res.json({ success: true, data: data });
        })
        .catch (e => {
            return res.json({ success: false, err: e.message});
        });
    }
    async getOccasions(req,res) {
        //Validate the parameters as received
        if (!this._validateParticipantList(req.query.participants, true)){
            return res.json({ success: false, err: "supplied participant list is invalid"});
        }
        if (!this._validateFlag(req.query.subneeded, true)) {
            return res.json({ success: false, err: "supplied subneeded flag is invalid"});
        }
        if (!this._validateTimestamp(req.query.from, true)) {
            return res.json({ success: false, err: "supplied from date is invalid"});
        }

        // Get the query parameters
        let participants = req.query.participants;
        let subneeded = !!parseInt(req.query.subneeded);
        let from = req.query.from;
        return this.operations.getOccasions(participants, subneeded, from).then( data => {
            return res.json({ success: true, data: this.pumpOccasionData(data) });
        })
        .catch (e => {
            return res.json({ success: false, err: e.message});
        });
    }
    async postAttendanceType(req, res) {
        //Validate the parameters as received
        if (!this._validateId(req.params.id, false)) {
            return res.json({ success: false, err: "Attendance ID is invalid"});
        } else if (!this._validateAttendanceType(req.body.type, false)) {
            return res.json({ success: false, err: "Attendance type is invalid"});
        }
        //Get the parameters
        let id = parseInt(req.params.id);
        let type = req.body.type;    
        return this.operations.updateAttendance(id, type).then( data => {
            return res.json({success: true, data: this.pumpRoleData(data)});
        })
        .catch(e => {
            return res.json({ success: false, err: e.message});
        })
    }
    async postAttendanceSubstitution(req, res) {
        //Validate the parameters as received
        if (!this._validateId(req.params.id, false)) {
            return res.json({ success: false, err: "Attendance ID is invalid"});
        }
        if (!this._validateId(req.body.substitute, false)) {
            return res.json({ success: false, err: "Participant ID is invalid"});
        }
        //Get the parameters
        let id = parseInt(req.params.id);
        let participant = parseInt(req.body.substitute);
        return this.operations.updateSubstitute(id, participant).then( data => {
            return res.json({success: true, data: this.pumpRoleData(data)});
        })
        .catch(e => {
            return res.json({ success: false, err: e.message});
        })        
    }
}

module.exports = ApiV1;

