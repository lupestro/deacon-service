/**
 * Operations that the API must perform on the database. {DeaconQueries} provides the SQL, specialized to the deacons database. 
 * Operations transforms API-meaningful parameters into the form needed by {DeaconQueries} and returns the row or rows gathered,
 * applying any business rules to the operations performed.
 */
class Operations {

    constructor(queries) {
        this.queries = queries;
    }

    /*-------------------------------------------------------------------*/
    
    /**
     * Get the participants from the database. [ WIP: email parameter should be ignored - no email addresses should be sent until we put access behind a security barrier ]
     * @param {boolean} email Whether to include email addresses
     * @return {object[]} an array of row hashes for the participants with one property for each field in the row
     */
    async getParticipants(email) {
        let result = await this.queries.list('participants');
//        if (email) {
//            return result;
//        } else {
            return result.map( item => {
                let row = Object.assign({}, item);
                delete row['email'];
                return row;
            })
//        }
    }

    /**
     * Get the occasions from the database. [ WIP: parameters are currently ignored - this operation gets all occasions always ]
     * @param {number[]} participants Get occasions for these participants - otherwise for all participants
     * @param {boolean} subneeded Whether to include occasions where participants appear only as substitutes
     * @param {string} from An ISO timestamp specifying the earliest data for which to include occasions
     * @return {object[]} an array of row hashes for the attendences - with role and occasion fields included - with one property for each field in the row
     */
    async getOccasions(/*participants, subneeded, from*/) {
        return await this.queries.deeplist('occasions');
    }

    /**
     * Set a particular participant's attendance in a role of an occasion. Setting an attendance removes any substitutions as a side-effect.
     * @param {number} id The id of the attendance to modify.
     * @param {string} type The type to apply to the attendance: `assigned`, `confirmed`, or `declined`
     */
    async updateAttendance(id, type) {
        await this.queries.set('attendances', {id: id}, {type: type});
        const result = await this.queries.deeplist('roles', {id:id});
        return result;
    }
    /**
     * Provide a substitute for a participant in a role of an occasion. The attendance must already be of type `declined`.
     * @param {number} id The id of the attendance to modify.
     * @param {number} substitute The id of the participant who will be the new substitute.
     */
    async updateSubstitute(id, substitute) {
        let result = await this.queries.validate('attendances', 'substitute', {id: id, substitute: substitute});
        if (result.length > 0) {
            throw ({message: "Participant already has role in occasion"});
        }
        await this.queries.set('attendances', {id: id}, {substitute: substitute});
        result = await this.queries.deeplist('roles', {id:id});
        return result;
    }
}

module.exports = Operations;
