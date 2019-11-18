const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const Operations = require('../../src/api/operations');
class DummyQueries {
    constructor () {
        this.lists = {count: 0, input: [], result: []};
        this.deeplists = {count: 0, input: [], result: []};
        this.validates = {count: 0, input: [], result: []};
        this.sets = {count: 0, input: [], result: []};
    }
    verifyCounts() {
        expect(this.lists.count).equal(this.lists.input.length,"lists count mismatch");
        expect(this.deeplists.count).equal(this.deeplists.input.length,"deeplists count mismatch");
        expect(this.validates.count).equal(this.validates.input.length,"validates count mismatch");
        expect(this.sets.count).equal(this.sets.input.length, "sets count mismatch");
    }
    async list(table, criteria) {
        try {
            expect(table).equals(this.lists.input[this.lists.count].table);
            expect(criteria).deep.equals(this.lists.input[this.lists.count].criteria);
            const result = this.lists.result[this.lists.count];
            return result;
        } finally {
            this.lists.count++;
        }
    }
    async deeplist(table, criteria) {
        try {
            expect(table).equals(this.deeplists.input[this.deeplists.count].table);
            expect(criteria).deep.equals(this.deeplists.input[this.deeplists.count].criteria);
            const result = this.deeplists.result[this.deeplists.count];
            return result;
        } finally {
            this.deeplists.count++;
        }
    }
    async validate(table, field, criteria) {
        try {
            expect(table).equals(this.validates.input[this.validates.count].table);
            expect(field).equals(this.validates.input[this.validates.count].field);
            expect(criteria).deep.equals(this.validates.input[this.validates.count].criteria);
            const result = this.validates.result[this.validates.count];
            return result;
        } finally {
            this.validates.count++;
        }
    }
    async set(table, keys, values) {
        try {
            expect(table).equals(this.sets.input[this.sets.count].table);
            expect(keys).deep.equals(this.sets.input[this.sets.count].keys);
            expect(values).deep.equals(this.sets.input[this.sets.count].values);
            const result = this.sets.result[this.sets.count];
            return result;
        } finally {
            this.sets.count++;
        }
    }
}

describe('api/operations', function (){
    
    describe('getParticipants', async () => {

        it('should get participants without email even though the email flag is set', async () => {
            const queries = new DummyQueries();
            queries.lists.input.push( { table: 'participants' });
            queries.lists.result.push([
                {
                    id: 10,
                    short_name: 'Fred',
                    type: 'deacon',
                    email: 'fred@fred.org'
                }
            ])
            const operations = new Operations(queries);
            const participants = await operations.getParticipants(true);
            expect(participants.length).to.equal(1);
            expect(participants[0]).deep.equals({
                id: 10,
                short_name: 'Fred',
                type: 'deacon'
            });
            queries.verifyCounts();
        });

        it('should get participants without email', async () => {
            const queries = new DummyQueries();
            queries.lists.input.push({ table: 'participants' });
            queries.lists.result.push([ 
                {
                    id: 10,
                    short_name: 'Fred',
                    type: 'deacon',
                    email: 'fred@fred.org'
                }
            ])
            const operations = new Operations(queries);
            const participants = await operations.getParticipants(false); 
            expect(participants.length).to.equal(1);
            expect(participants[0]).deep.equals({
                id: 10,
                short_name: 'Fred',
                type: 'deacon'
            })
            queries.verifyCounts();
        });

    });

    describe('getOccasions', async () => {

        it('should get occasions', async () => {
            const queries = new DummyQueries();
            queries.deeplists.input.push({
                table: 'occasions',
                criteria: undefined
            });
            queries.deeplists.result.push([]);
            const operations = new Operations(queries);
            const occasions = await operations.getOccasions(); 
            expect(occasions.length).to.equal(0);
            queries.verifyCounts();
        });

    });

    describe('updateAttendance', async () => {

        it('should update attendance', async () => {
            const queries = new DummyQueries();
            queries.sets.input.push({
                table:'attendances',
                keys: { id: 12 },
                values: { type: 'declined' }
            });
            queries.sets.result.push([]);
            queries.deeplists.input.push({
                    table: 'roles',
                    criteria: { id: 12 }
            });
            queries.deeplists.result.push([]);
            const operations = new Operations(queries);
            const roles = await operations.updateAttendance(12, 'declined'); 
            expect(roles.length).to.equal(0);
            queries.verifyCounts();
        });

    });

    describe('updateSubstitution', async () => {

        it('should update substitution ordinarily', async () => {
            const queries = new DummyQueries();
            queries.validates.input.push({
                    table: 'attendances',
                    field: 'substitute',
                    criteria: { id: 12, substitute: 13 }               
            });
            queries.validates.result.push([]);
            queries.sets.input.push({
                table:'attendances',
                keys: { id: 12 },
                values: { substitute: 13 }
            });
            queries.sets.result.push([]);
            queries.deeplists.input.push({
                table: 'roles',
                criteria: { id: 12 }
            });
            queries.deeplists.result.push([]);
            const operations = new Operations(queries);
            const roles = await operations.updateSubstitute(12, 13);
            expect(roles.length).to.equal(0);
            queries.verifyCounts();
        });

        it('should refuse to update substitution when substitute already playing a role in occasion', async () => {
            const queries = new DummyQueries();
            queries.validates.input.push({ // one for each call to validate
                table: 'attendances',
                field: 'substitute',
                criteria: { id: 12, substitute: 13 }               
            })
            queries.validates.result.push([ { id: 16 }]);
            const operations = new Operations(queries);
            const promise = operations.updateSubstitute(12,13);
            await promise.then ( () => {
                expect(promise).to.be.rejected;
            }).catch ( () => {
                expect(promise).to.be.rejected;
            });           
            queries.verifyCounts();
        });

    });

});
