class Operations {

    constructor(queries) {
        this.queries = queries;
    }

    /*-------------------------------------------------------------------*/
    
    async getParticipants(email) {
        let result = await this.queries.list('participants');
        if (email) {
            return result;
        } else {
            return result.map( item => {
                let row = Object.assign({}, item);
                delete row['email'];
                return row;
            })
        }
    }

    async getOccasions(/*participants, subneeded, from*/) {
        return await this.queries.deeplist('occasions');
    }

    async updateAttendance(id, type) {
        await this.queries.set('attendances', {id: id}, {type: type});
        const result = await this.queries.deeplist('roles', {id:id});
        return result;
    }

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
