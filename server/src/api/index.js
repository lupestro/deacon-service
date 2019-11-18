const hydratorModule = require('./hydrator');

/**
 * The API class provides the bodies of all of the operations exported to express by the {App} module. 
 * It validates the passed data, calls Operations to do the work, and calls the Hydrator to turn it into the desired JSON. 
 * 
 * The private validator methods of the API validate only that the passed data parses as the intended type of data. 
 * Any relationship with the database must be validated during the performance of the operation.
 * 
 * This particular API implementation uses database record IDs in its interface. 
 * A new generation of API will operate entirely on natural keys, keeping the implementation details private.
 */
class ApiV1 {
    /**
     * Create an ApiV1 object
     * @param {*} operations The operations object to perform the operations, applying the business rules
     * @param {*} hydrator The object that transforms database row data into nested JSON
     */
    constructor (operations, hydrator) {
        this.operations = operations;
        this.pumpOccasionData = hydrator ? hydrator.pumpOccasionData : hydratorModule.pumpOccasionData;
        this.pumpRoleData = hydrator? hydrator.pumpRoleData : hydratorModule.pumpRoleData;
    }
    /**
     * Validate the form of an id
     * @param {string} value the received id value to validate
     * @param {boolean} optional `true` if the id is optional, `false` if mandatory
     * @private
     */
    _validateId (value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        return (typeof value === 'string') && /^\d+$/.test(value);
    }
    /**
     * Validate the form of an attendance type
     * @param {string} value the received type value to validate
     * @param {boolean} optional `true` if the id is optional, `false` if mandatory
     * @private
     */
    _validateAttendanceType(value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        return (typeof value === 'string') && 
            (value === 'confirmed' || value === 'declined' || value === 'assigned');
    }
    /**
     * Validate the form of a boolean flag
     * @param {string} value the received flag value to validate
     * @param {boolean} optional `true` if the id is optional, `false` if mandatory
     * @private
     */
    _validateFlag(value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        const result1 = (typeof value === 'string' && (value === '0' || value === '1'));
        const result2 = (typeof value === 'number' && (value === 0 || value === 1));
        return result1 || result2;
    }
    /**
     * Validate the form of an attendance list - incomplete
     * @param {string} value the received list value to validate
     * @param {boolean} optional `true` if the id is optional, `false` if mandatory
     * @private
     */
    _validateParticipantList(value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        //TODO: Implement _validateParticipantList
        return typeof value === 'string';
    }
    /**
     * Validate the form of a timestamp - incomplete
     * @param {string} value the received timestamp value to validate
     * @param {boolean} optional `true` if the id is optional, `false` if mandatory
     * @private
     */
    _validateTimestamp(value, optional) {
        if (optional && typeof value === 'undefined') {
            return true;
        }
        //TODO: Implement _validateTimestamp
        return typeof value === 'string';
    }
    /**
     * Get all the participants as a JSON object. The `email` query parameter determines whether to include email addresses. 
     * 
     * The Operations object will ignore this parameter until we have security in place so not just anybody can ask - 
     * and maybe we don't need it.
     * 
     * @param {request} req Node Express router request object
     * @param {response} res Node Express router response object
     */
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
    /**
     * Get all the occasions, with their roles and their roles' attendances, as a JSON object. 
     * 
     * The Operations object currently ignores these parameters as it's much less involved to filter in the client. 
     * Consequently, the validation isn't very thorough.
     * @param {request} req Node Express router request object
     * @param {response} res Node Express router response object
     */
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
    /**
     * Change the type of one participant's attendance in one role for one occasion
     * @param {request} req Node Express router request object
     * @param {response} res Node Express router response object
     */
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
    /**
     * Change the substitute for one participant's attendance in one role for one occasion
     * @param {request} req Node Express router request object
     * @param {response} res Node Express router response object
     */
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

