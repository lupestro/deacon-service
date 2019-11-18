const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const Api = require('../../api/index');

// Stub surface area - 
//  External data this class accesses
//   operations.{getParticipants, getOccasions, updateAttendance, updateSubstitute}
//   req.query.{email, participants, subneeded, from}
//   req.params.id
//   req.body.{type,substitute}
//  External methods this class calls
//   res.json()
//   hydrator.{pumpOccasionData, pumpRoleData}

class DummyOperations {
    constructor() {
        this.participants = { count : 0, input: [], result: []};
        this.occasions = { count: 0, input:[], result: []};
        this.type = { count: 0, input: [], result: []};
        this.substitute = { count: 0, input: [], result: []};
    }
    verifyCounts() {
        expect(this.participants.count).equal(this.participants.input.length);
        expect(this.occasions.count).equal(this.occasions.input.length);
        expect(this.type.count).equal(this.type.input.length);
        expect(this.substitute.count).equal(this.substitute.input.length);
    }
    getParticipants(email) {
        try {
            expect(this.participants.count).lessThan(this.participants.input.length);
            expect(email).equal(this.participants.input[this.participants.count].email);
            const result = this.participants.result[this.participants.count];
            return Promise.resolve(result);    
        } finally {
            this.participants.count++;
        }
    }
    getOccasions() {
        try {
            expect(this.occasions.count).lessThan(this.occasions.input.length);
            const result = this.occasions.result[this.occasions.count];
            return Promise.resolve(result);
        } finally {
            this.occasions.count++;
        } 
    }
    updateAttendance(id, type) {
        try {
            expect(this.type.count).lessThan(this.type.input.length);
            expect(id).equal(this.type.input[this.type.count].id);
            expect(type).equal(this.type.input[this.type.count].type);
            const result = this.type.result[this.type.count];
            return Promise.resolve(result);
        } finally {
            this.type.count++;
        }
    }
    updateSubstitute(id, substitute) {
        try {
            expect(this.substitute.count).lessThan(this.substitute.input.length);
            expect(id).equal(this.substitute.input[this.substitute.count].id);
            expect(substitute).equal(this.substitute.input[this.substitute.count].substitute);
            const result = this.substitute.result[this.substitute.count];
            return Promise.resolve(result);    
        } finally {
            this.substitute.count++;
        }
    }
}

// Canned dummy response object that just knows how to stringify JSON for testing
const res = { json(item) { return JSON.stringify(item); } }

describe('api/index', function (){
    
    describe('getParticipants', async () => {

        it('should get participants with email', async () => {
            const req = {query: { email: 1}};
            const dummyOperations = new DummyOperations();
            dummyOperations.participants.input.push({email: true});
            dummyOperations.participants.result.push({id:1, email: 'me@me.org'})
            const dummyHydrator = {};
            const result = await new Api(dummyOperations, dummyHydrator).getParticipants(req, res); 
            expect(result).deep.equal(JSON.stringify({success: true, data: {id:1, email: 'me@me.org'}}));
            dummyOperations.verifyCounts();
        });

        it('should get participants without email', async () => {
            const req = {
                query: { email: 0 },
                params: null,
                body: null
            };
            const dummyOperations = new DummyOperations();
            dummyOperations.participants.input.push({email: false});
            dummyOperations.participants.result.push({ id:1 })
            const dummyHydrator = {};
            const result = await new Api(dummyOperations, dummyHydrator).getParticipants(req, res); 
            expect(result).deep.equal(JSON.stringify({success: true, data: { id:1 }}));
            dummyOperations.verifyCounts();
        });

        it('should give error on invalid email flag', async () => {
            const req = {
                query: { email: "X" },
                params: null,
                body: null
            };
            const dummyOperations = new DummyOperations();
            const dummyHydrator = {};
            const result = await new Api(dummyOperations, dummyHydrator).getParticipants(req, res); 
            expect(result).deep.equal(JSON.stringify({success: false, err: "supplied email flag is invalid"}));
            dummyOperations.verifyCounts();
        });
    });

    describe('getOccasions', async () => {

        it('should get all occasions', async () => {
            const req = {
                query: {},
                params: null,
                body: null
            };
            const dummyOperations = new DummyOperations();
            dummyOperations.occasions.input.push({});
            dummyOperations.occasions.result.push({ id:1 });
            const dummyHydrator = {
                pumpOccasionData(data) {
                    expect(data).deep.equals({ id:1 });
                    return data;
                }
            }
            const result = await new Api(dummyOperations, dummyHydrator).getOccasions(req, res);
            expect(result).deep.equal(JSON.stringify( { success: true, data: {id: 1} }))
            dummyOperations.verifyCounts();
        });

        it('should get occasions with participants, subneeded, and from date', async() => {
            const req = {
                query: {
                    participants: "1,2,3",
                    subneeded: 0,
                    from: "2020-01-01T00:00:00"
                },
                params: null,
                body: null
            };
            const dummyOperations = new DummyOperations();
            dummyOperations.occasions.input.push({
                participants:[1,2,3],
                subneeded:false,
                from: "2020-01-01T00:00:00"
            });
            dummyOperations.occasions.result.push({ id:1 });
            const dummyHydrator = {
                pumpOccasionData(data) {
                    expect(data).deep.equals({ id:1 });
                    return data;
                }
            }
            const result = await new Api(dummyOperations, dummyHydrator).getOccasions(req, res);
            expect(result).deep.equal(JSON.stringify( { success: true, data: {id: 1} }))
            dummyOperations.verifyCounts();
        });

        it('should fail with badly formed participants', async() => {
            const req = {
                query: {
                    participants: 3,
                    subneeded: 0,
                    from: "2020-01-01T00:00:00"
                },
                params: null,
                body: null
            };
            const dummyOperations = new DummyOperations();
            const dummyHydrator = {}
            const result = await new Api(dummyOperations, dummyHydrator).getOccasions(req, res);
            expect(result).deep.equal(JSON.stringify( { success: false, err: 'supplied participant list is invalid' }))
            dummyOperations.verifyCounts();
        });

        it('should fail with badly formed subneeded', async() => {
            const req = {
                query: {
                    participants: "1,2,3",
                    subneeded: "X",
                    from: "2020-01-01T00:00:00"
                },
                params: null,
                body: null
            };
            const dummyOperations = new DummyOperations();
            const dummyHydrator = {}
            const result = await new Api(dummyOperations, dummyHydrator).getOccasions(req, res);
            expect(result).deep.equal(JSON.stringify( { success: false, err: 'supplied subneeded flag is invalid' }))
            dummyOperations.verifyCounts();
        });

        it('should fail with badly formed from-date', async() => {
            const req = {
                query: {
                    participants: "1,2,3",
                    subneeded: "1",
                    from: false
                },
                params: null,
                body: null
            };
            const dummyOperations = new DummyOperations();
            const dummyHydrator = {}
            const result = await new Api(dummyOperations, dummyHydrator).getOccasions(req, res);
            expect(result).deep.equal(JSON.stringify( { success: false, err: 'supplied from date is invalid' }))
            dummyOperations.verifyCounts();
        });

    });

    describe('postAttendanceType', async () => {

        it('should post attendance type', async () => {
            const req = {
                query: null,
                params: {id: "1"},
                body: {type: "declined"}
            };
            const dummyOperations = new DummyOperations();
            dummyOperations.type.input.push({id: 1, type: 'declined'});
            dummyOperations.type.result.push({ id:1 });
            const dummyHydrator = {
                pumpRoleData(data) {
                    expect(data).deep.equals({ id:1 });
                    return data;
                }
            }
            const result = await new Api(dummyOperations, dummyHydrator).postAttendanceType(req, res);
            expect(result).deep.equal(JSON.stringify({ success: true, data: {id: 1} }));
            dummyOperations.verifyCounts();
        });

        it('should fail if id invalid', async () => {
            const req = {
                query: null,
                params: {id: "X"},
                body: {type: "declined"}
            };
            const dummyOperations = new DummyOperations();
            const dummyHydrator = {};
            const result = await new Api(dummyOperations, dummyHydrator).postAttendanceType(req, res);
            expect(result).deep.equal(JSON.stringify({ success: false, err: "Attendance ID is invalid" }));
            dummyOperations.verifyCounts();
        });

        it('should fail if type invalid', async () => {
            const req = {
                query: null,
                params: {id: "1"},
                body: {type: "spaced-it"}
            };
            const dummyOperations = new DummyOperations();
            const dummyHydrator = {};
            const result = await new Api(dummyOperations, dummyHydrator).postAttendanceType(req, res);
            expect(result).deep.equal(JSON.stringify({ success: false, err: "Attendance type is invalid" }));
            dummyOperations.verifyCounts();
        });

    });

    describe('postAttendanceSubstitution', async () => {

        it('should post substitutions', async () => {
            const req = {
                query: null,
                params: {id: "1"},
                body: {substitute: "2"}
            };
            const dummyOperations = new DummyOperations();
            dummyOperations.substitute.input.push({id: 1, substitute: 2});
            dummyOperations.substitute.result.push({ id:1 });
            const dummyHydrator = {
                pumpRoleData(data) {
                    expect(data).deep.equals({ id:1 });
                    return data;
                }
            }
            const result = await new Api(dummyOperations, dummyHydrator).postAttendanceSubstitution(req, res);
            expect(result).deep.equal(JSON.stringify({ success: true, data: {id: 1} }))
            dummyOperations.verifyCounts();
        });


        it('should fail if id invalid before attempting anything', async () => {
            const req = {
                query: null,
                params: {id: "X"},
                body: {substitute: "2"}
            };
            const dummyOperations = new DummyOperations();
            const dummyHydrator = {};
            const result = await new Api(dummyOperations, dummyHydrator).postAttendanceSubstitution(req, res);
            expect(result).deep.equal(JSON.stringify({ success: false, err: "Attendance ID is invalid" }))
            dummyOperations.verifyCounts();
        });

        it('should fail if substitute invalid before attempting anything', async () => {
            const req = {
                query: null,
                params: {id: "1"},
                body: {substitute: "X"}
            };
            const dummyOperations = new DummyOperations();
            const dummyHydrator = {};
            const result = await new Api(dummyOperations, dummyHydrator).postAttendanceSubstitution(req, res);
            expect(result).deep.equal(JSON.stringify({ success: false, err: "Participant ID is invalid" }))
            dummyOperations.verifyCounts();
        });

    });
})
