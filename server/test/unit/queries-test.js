const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const Queries = require('../../src/db/queries');

//TODO: Augment DummyDb to test for both the text and the _values_ passed to the queries. Use what we did for operations as a pattern.

class DummyDb {
    constructor () {
        this.queries = {count: 0, input: [], result: []};
        this.transacts = {count: 0, input: [], result: []};
        this.fallbacks = {count: 0, input: [], result: []};
    }
    verifyCounts() {
        expect(this.queries.count).equal(this.queries.input.length,"queries count mismatch");
        expect(this.transacts.count).equal(this.transacts.input.length,"transacts count mismatch");
        expect(this.fallbacks.count).equal(this.fallbacks.input.length,"fallbacks count mismatch");
    }
    async query(query) {
        try {
            expect(this.queries.count).lessThan(this.queries.input.length);
            expect(query.text).equal(this.queries.input[this.queries.count].text);
            expect(query.values).deep.equal(this.queries.input[this.queries.count].values);
            const response = this.queries.result[this.queries.count];
            return Promise.resolve(response); 
        } finally {
            this.queries.count++; 
        }
    }
    async transact(queries) {
        try {
            expect(this.transacts.count).lessThan(this.transacts.input.length);
            for (let i = 0; i < queries.length; i++) {
                expect(queries[i].text).equal(this.transacts.input[this.transacts.count][i].text);
                expect(queries[i].values).deep.equal(this.transacts.input[this.transacts.count][i].values);
            }
            const response = this.transacts.result[this.transacts.count];    
            return Promise.resolve(response); 
        } finally {
            this.transacts.count++; 
        }
    }
    async fallback(queries) {
        try {
            expect(this.fallbacks.count).lessThan(this.fallbacks.input.length);
            for (let i = 0; i < queries.length; i++) {
                expect(queries[i].text).equal(this.fallbacks.input[this.fallbacks.count][i].text);
                expect(queries[i].values).deep.equal(this.fallbacks.input[this.fallbacks.count][i].values);
            }
            const response = this.fallbacks.result[this.fallbacks.count];
            return Promise.resolve(response);     
        } finally {
            this.fallbacks.count++; 
        }
    }

}

describe('db/queries', function (){
    
    describe('_resolveId', async () => {

        it('should avoid a query when given an id', async () => {

            let dummyDb = new DummyDb();
            const queries = new Queries (dummyDb);
            const result = await queries._resolveId('participants',{id: 12});
            expect(result).equals(12);
            dummyDb.verifyCounts();
        });

        it('should perform a query when given natural keys', async () => {

            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT id FROM participants WHERE short_name=$1', values: ['Fred'] });
            dummyDb.queries.result.push({ rows:[{id:12, short_name: 'Fred'}]});
            const queries = new Queries (dummyDb);
            const result = await queries._resolveId('participants',{short_name:'Fred'});
            expect(result).equals(12);
            dummyDb.verifyCounts();
        });
    });

    describe('_resolveIds', () => {

        it('should avoid all queries except the top when given ids in sub-levels', async () => {
            let dummyDb = new DummyDb();
            const queries = new Queries (dummyDb);
            const result = await queries._resolveIds('attendances',{
                participant: {id:12},
                role: {id: 13}
            });
            expect(result).deep.equals({ participant: {id:12}, role: {id:13}});
            dummyDb.verifyCounts();
        })

        it('should perform id queries when given natural keys at every level', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT id FROM participants WHERE short_name=$1', values: ['Fred'] });
            dummyDb.queries.result.push({ rows:[{id:12}]});
            dummyDb.queries.input.push({text:'SELECT id FROM occasions WHERE type=$1 AND time=$2', values: ['Communion','2020-01-01T12:30EST'] });
            dummyDb.queries.result.push({ rows:[{id:10}]});
            dummyDb.queries.input.push({text:'SELECT id FROM roles WHERE type=$1 AND occasion=$2', values: ['DoD',10] });
            dummyDb.queries.result.push({ rows:[{id:13}]});

            const queries = new Queries (dummyDb);
            const result = await queries._resolveIds('attendances',{
                participant: {
                    short_name: 'Fred'
                },
                role: {
                    type: 'DoD', 
                    occasion: { 
                        type: 'Communion',
                        time: '2020-01-01T12:30EST'
                    }
                }
            });
            expect(result).deep.equals({ 
                participant: {
                    id: 12,
                    short_name: 'Fred'
                }, 
                role: {
                    id:13,
                    type: 'DoD',
                    occasion: {
                        id: 10,
                        type: 'Communion',
                        time: '2020-01-01T12:30EST'
                    }
                }
            });
            dummyDb.verifyCounts();
        });

    });

    describe('get', () => {

        it('should perform simple get', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT id, type,short_name,full_name,team,family,email FROM participants WHERE short_name=$1', values: ['Fred'] });
            dummyDb.queries.result.push({ 
                rows: [
                    {
                        id:12,
                        type: 'deacon',
                        short_name: 'Fred', 
                        full_name: 'Fred Gamache', 
                        team:1,
                        family: null,
                        email: 'fred@fred.org'
                    }
                ]
            });
            const queries = new Queries (dummyDb);
            const result = await queries.get('participants', {
                short_name: 'Fred'
            });
            expect(result).deep.equals({
                id: 12,
                type: 'deacon',
                short_name: 'Fred', 
                full_name: 'Fred Gamache', 
                team:1,
                family: null,
                email: 'fred@fred.org'
            }); 
            dummyDb.verifyCounts();
        });

        it('should perform deeper get', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT id FROM participants WHERE short_name=$1', values: ['Fred'] });
            dummyDb.queries.result.push({ rows:[{id:12}]});
            dummyDb.queries.input.push({text:'SELECT id FROM occasions WHERE type=$1 AND time=$2', values: ['Communion','2020-01-01T12:30EST'] });
            dummyDb.queries.result.push({ rows:[{id:10}]});
            dummyDb.queries.input.push({text:'SELECT id FROM roles WHERE type=$1 AND occasion=$2', values: ['DoD',10] });
            dummyDb.queries.result.push({ rows:[{id:13}]});
            dummyDb.queries.input.push({text:'SELECT id,type,role,participant,substitute,team FROM attendances WHERE participant=$1 AND role=$2', values: [12,13] });
            dummyDb.queries.result.push({ 
                rows: [
                    {
                        id:12,
                        type: 'assigned',
                        participant: 12, 
                        role: 13, 
                        substitute: 10,
                        team:1
                    }
                ]
            });
            const queries = new Queries (dummyDb);
            const result = await queries.get('attendances', {
                participant: {
                    short_name: 'Fred'
                },
                role: {
                    type: 'DoD', 
                    occasion: { 
                        type: 'Communion',
                        time: '2020-01-01T12:30EST'
                    }
                }
            });
            expect(result).deep.equals({
                id:12,
                type: 'assigned',
                participant: 12, 
                role: 13, 
                substitute: 10,
                team:1
            }); 
            dummyDb.verifyCounts();

        });

    })

    describe('list', () => {

        it('should perform simple list', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT id, type,short_name,full_name,team,family,email FROM participants WHERE team=$1 ORDER BY id', values: [1] });
            dummyDb.queries.result.push({ 
                rows: [
                    {
                        id:12,
                        type: 'deacon',
                        short_name: 'Fred', 
                        full_name: 'Fred Gamache', 
                        team:1,
                        family: null,
                        email: 'fred@fred.org'
                    },
                    {
                        id:13,
                        type: 'deacon',
                        short_name: 'Jane', 
                        full_name: 'Jane Doe', 
                        team:1,
                        family: null,
                        email: 'mystery@doe.org'
                    }            
                ]
            });
            const queries = new Queries (dummyDb);
            const result = await queries.list('participants', {team: 1});
            expect(result).deep.equals([
                {
                    id: 12,
                    type: 'deacon',
                    short_name: 'Fred', 
                    full_name: 'Fred Gamache', 
                    team:1,
                    family: null,
                    email: 'fred@fred.org'
                },
                {
                    id:13,
                    type: 'deacon',
                    short_name: 'Jane', 
                    full_name: 'Jane Doe', 
                    team:1,
                    family: null,
                    email: 'mystery@doe.org'
                }
            ]);
            dummyDb.verifyCounts(); 
        });

        it('should perform list without criteria', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT id, type,short_name,full_name,team,family,email FROM participants ORDER BY id', values: [] });
            dummyDb.queries.result.push({ 
                rows: [
                    {
                        id:12,
                        type: 'deacon',
                        short_name: 'Fred', 
                        full_name: 'Fred Gamache', 
                        team:1,
                        family: null,
                        email: 'fred@fred.org'
                    },
                    {
                        id:13,
                        type: 'deacon',
                        short_name: 'Jane', 
                        full_name: 'Jane Doe', 
                        team:1,
                        family: null,
                        email: 'mystery@doe.org'
                    }            
                ]
            });
            const queries = new Queries (dummyDb);
            const result = await queries.list('participants');
            expect(result).deep.equals([
                {
                    id: 12,
                    type: 'deacon',
                    short_name: 'Fred', 
                    full_name: 'Fred Gamache', 
                    team:1,
                    family: null,
                    email: 'fred@fred.org'
                },
                {
                    id:13,
                    type: 'deacon',
                    short_name: 'Jane', 
                    full_name: 'Jane Doe', 
                    team:1,
                    family: null,
                    email: 'mystery@doe.org'
                }
            ]); 
            dummyDb.verifyCounts();
        })

    });

    describe('set', () => {

        it('should perform simple set', async() => {
            let dummyDb = new DummyDb()
            dummyDb.queries.input.push({text:'SELECT id, type,short_name,full_name,team,family,email FROM participants WHERE short_name=$1', values: ['Fred'] });
            dummyDb.queries.result.push(                    { 
                rows: [
                    {
                        id:12,
                        type: 'deacon',
                        short_name: 'Fred', 
                        full_name: 'Frederica Grant', 
                        team:1,
                        family: null,
                        email: 'frederica@fred.org'
                    }
                ]
            });
            dummyDb.fallbacks.input.push([
                {text:"UPDATE participants SET full_name=$2,email=$3 WHERE short_name=$1", values: ['Fred','Frederica Grant','frederica@fred.org'] },
                {text:'INSERT INTO participants (short_name,full_name,email) VALUES ($1,$2,$3)',values: ['Fred','Frederica Grant','frederica@fred.org'] }            
            ])
            dummyDb.fallbacks.result.push([0]);
            const queries = new Queries (dummyDb);
            const result = await queries.set(
                'participants', 
                {
                    short_name: 'Fred'
                }, 
                {
                    full_name: 'Frederica Grant',
                    email: 'frederica@fred.org'
                }
            );
            expect(result).deep.equals({
                id: 12,
                type: 'deacon',
                short_name: 'Fred', 
                full_name: 'Frederica Grant', 
                team:1,
                family: null,
                email: 'frederica@fred.org'
            }); 
            dummyDb.verifyCounts();
        });

    });

    describe('delete', () => {

        it('should perform simple delete', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT id FROM occasions WHERE type=$1 AND time=$2', values: ['Service','2020-01-01T10:10:10EDT'] });
            dummyDb.queries.result.push({ rows:[{id:10}]});
            dummyDb.queries.input.push({text:'SELECT id FROM participants WHERE short_name=$1', values: ['Fred'] });
            dummyDb.queries.result.push({ rows:[{id:12}]});
            dummyDb.queries.input.push({text:'SELECT id FROM roles WHERE type=$1 AND occasion=$2', values: ['DoD',10] });
            dummyDb.queries.result.push({ rows:[{id:13}]});
            dummyDb.queries.input.push({text:'SELECT id FROM attendances WHERE role=$1 AND participant=$2', values: [13,12] });
            dummyDb.queries.result.push({ rows:[{id:14}]});
            dummyDb.transacts.input.push([
                {text:'DELETE FROM attendances WHERE id=$1', values:[14]}
            ]);
            dummyDb.transacts.result.push([]);
            const queries = new Queries (dummyDb);
            const result = await queries.delete('attendances', {
                role: {
                    type: 'DoD',
                    occasion: {
                        type: 'Service',
                        time: '2020-01-01T10:10:10EDT'
                    }
                },
                participant: {
                    short_name: 'Fred'
                }
            });
            expect(result).is.undefined;             
            dummyDb.verifyCounts();
        });

        it('should perform complex delete', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT id FROM participants WHERE short_name=$1', values: ['Fred'] });
            dummyDb.queries.result.push({ rows:[{id:12}]});
            dummyDb.transacts.input.push([
                {text:'DELETE FROM attendances WHERE participant=$1', values:[12]},
                {text:'UPDATE attendances WHERE substitute=$1 SET substitute=NULL', values:[12]},
                {text:'DELETE FROM participants WHERE id=$1', values: [12]}
            ]);
            dummyDb.transacts.result.push([0]);
            const queries = new Queries (dummyDb);
            const result = await queries.delete('participants', {
                short_name: 'Fred'
            });
            expect(result).is.undefined;             
            dummyDb.verifyCounts();
        });
    });
    describe('deeplist', () => {

        it('should perform occasion deeplist', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT o.id as occasion, o.type, o.subtype, o.time as when, r.id as role, r.type as roletype, r.count, a.id as attendance, a.type as attype, a.participant, a.substitute, a.team FROM occasions o, roles r, attendances a where o.id = r.occasion and r.id = a.role order by o.time, o.id, r.id, a.type, a.id', values: [] });
            dummyDb.queries.result.push({ rows:[{id:12}]});  // Cheating here - we don't need a lot of rows to see if it passes through
            const queries = new Queries (dummyDb);
            const result = await queries.deeplist('occasions', {});
            expect(result).deep.equals([
                {id:12}
            ]);             
            dummyDb.verifyCounts();
        });

        it('should perform occasion deeplist without criteria', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT o.id as occasion, o.type, o.subtype, o.time as when, r.id as role, r.type as roletype, r.count, a.id as attendance, a.type as attype, a.participant, a.substitute, a.team FROM occasions o, roles r, attendances a where o.id = r.occasion and r.id = a.role order by o.time, o.id, r.id, a.type, a.id', values: [] });
            dummyDb.queries.result.push({ rows:[{id:12}]});  // Cheating here - we don't need a lot of rows to see if it passes through
            const queries = new Queries (dummyDb);
            const result = await queries.deeplist('occasions');
            expect(result).deep.equals([
                {id:12}
            ]);             
            dummyDb.verifyCounts();
        });

        it('should perform roles deeplist', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:'SELECT r.id as role, r.type as roletype, r.count, a.id as attendance, a.type as attype, a.participant, a.substitute, a.team FROM roles r, attendances a WHERE r.id = (SELECT role FROM attendances WHERE id=$1) AND a.role=r.id', values: [12] });
            dummyDb.queries.result.push({ rows:[{id:12}]});  // Cheating here - we don't need a lot of rows to see if it passes through
            const queries = new Queries (dummyDb);
            const result = await queries.deeplist('roles', {id: 12});
            expect(result).deep.equals([
                {id:12}
            ]);             
            dummyDb.verifyCounts();
        });


    });
    describe('validate', () => {

        it('should perform attendances substitution validate', async() => {
            let dummyDb = new DummyDb();
            dummyDb.queries.input.push({text:"SELECT id FROM attendances WHERE ((participant = $2 AND type != 'declined') OR (substitute=$2 AND id!=$1)) AND role in (SELECT id FROM roles WHERE occasion = (SELECT occasion FROM roles WHERE id=(SELECT role FROM attendances WHERE id=$1 )))", values: [12,13] });
            dummyDb.queries.result.push({ rows:[{id:12}]});  // Cheating here - we don't need a lot of rows to see if it passes through
            const queries = new Queries (dummyDb);
            const result = await queries.validate('attendances','substitution', { id: 12, participant: 13 });
            expect(result).deep.equals([
                    {id:12}
            ]);             
            dummyDb.verifyCounts();
        });
    });

});
