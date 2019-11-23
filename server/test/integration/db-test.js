const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-as-promised'));
const Db = require('../../src/db/index');

describe('db/index', function (){
    let db, db2;
    
    before (() =>{
        db = new Db(null, true);
        db2 = new Db(null, false);
    });
    beforeEach( async ()=> {
        await db2.query({text:"DELETE FROM DBTEST", values:[]});
    });
    afterEach( async ()=> {
        await db2.query({text:"DELETE FROM DBTEST", values:[]});
    });

    after(() =>{
        db2.shutdown();
        db.shutdown();
    });

    describe('query', () => {

        it('should perform a query', async () => {
            const result = await db.query({text:"SELECT * FROM DBTEST", values:[]});
            expect(result.rows).to.be.an('array');
        });

        it('should perform a query without log queries', async () => {
            const result = await db2.query({text:"SELECT * FROM DBTEST", values:[]});
            expect(result.rows).to.be.an('array');
        });

        it('should perform an insertion and a deletion', async () => {
            let result = await db.query({
                text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                values: ['happy','Habbakuk','No matter what happens']
            })
            result = await db.query({text:"SELECT * FROM DBTEST", values:[]});
            expect(result.rows.length).to.equal(1);
            result = await db.query({
                text:"DELETE FROM DBTEST WHERE status=$1 and name=$2", 
                values:['happy','Habbakuk']
            });
            expect(result.rowCount).to.be.a('number').equal(1);
            result = await db.query({text:"SELECT * FROM DBTEST", values:[]});
            expect(result.rows.length).to.equal(0);
        });        

    });

    describe('transact', () => {

        it('should perform a series of successful insertions', async() => {
            let result = await db.transact([
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                    values: ['happy','Jack','Not prevented from being happy']
                },
                {
                    text: "INSERT INTO DBTEST (status, name) VALUES ($1, $2) RETURNING *",
                    values: ['confused','Mr. Magoo']
                },
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1,$2,$3) RETURNING *",
                    values: ['sad','Lisa','Sits by the window']
                }
            ]);
            result = await db.query({text:"SELECT * FROM DBTEST", values:[]});
            expect(result.rows.length).to.equal(3);
        });

        it('should perform a series of successful insertions without logging', async() => {
            let result = await db2.transact([
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                    values: ['happy','Jack','Not prevented from being happy']
                },
                {
                    text: "INSERT INTO DBTEST (status, name) VALUES ($1, $2) RETURNING *",
                    values: ['confused','Mr. Magoo']
                },
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1,$2,$3) RETURNING *",
                    values: ['sad','Lisa','Sits by the window']
                }
            ]);
            result = await db2.query({text:"SELECT * FROM DBTEST", values:[]});
            expect(result.rows.length).to.equal(3);
        });

        it('should not change when an invalid insertion followed by a valid insertion fails', async() => {
            let result;
            let promise = db.transact([
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                    values: ['joyous','Jack','Not prevented from being happy']
                },
                {
                    text: "INSERT INTO DBTEST (status, name) VALUES ($1, $2) RETURNING *",
                    values: ['confused','Mr. Magoo']
                }
            ]);
            result = await promise.catch ( () => {
                expect(promise).to.be.rejected;
            });
            result = await db.query({text:"SELECT * FROM DBTEST", values:[]});
            expect(result.rows.length).to.equal(0);
        });

        it('should not change when a valid insertion followed by an invalid insertion fails', async() => {
            let result;
            let promise = db.transact([
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                    values: ['happy','Jack','Not prevented from being happy']
                },
                {
                    text: "INSERT INTO DBTEST (status, name) VALUES ($1, $2) RETURNING *",
                    values: ['puzzled','Mr. Magoo']
                }
            ]);
            result = await promise.catch ( () => {
                expect(promise).to.be.rejected;
            });
            result = await db.query({text:"SELECT * FROM DBTEST", values:[]});
            expect(result.rows.length).to.equal(0);
        });

    });

    describe('fallback', () => {

        it('should perform a successful update ignoring fallback to an insertion', async() => {
            await db.query({
                text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                values: ['happy','Jack','Not prevented from being happy']
            });
            let result = await db.fallback([
                {
                    text: "UPDATE DBTEST SET description=$3 WHERE status=$1 and name=$2 RETURNING *",
                    values: ['happy','Jack','Smiling forever']
                },
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                    values: ['happy','Jack','Seldom perturbed']
                }
            ]);
            result = await db.query({
                text:"SELECT status, name, description FROM DBTEST WHERE status=$1 and name=$2", 
                values:['happy','Jack']
            });
            expect(result.rows.length).to.equal(1);
            expect(result.rows[0]['description']).to.equal('Smiling forever');
        });

        it('should perform a successful update ignoring fallback to an insertion without logging', async() => {
            await db2.query({
                text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                values: ['happy','Jack','Not prevented from being happy']
            });
            let result = await db2.fallback([
                {
                    text: "UPDATE DBTEST SET description=$3 WHERE status=$1 and name=$2 RETURNING *",
                    values: ['happy','Jack','Smiling forever']
                },
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                    values: ['happy','Jack','Seldom perturbed']
                }
            ]);
            result = await db2.query({
                text:"SELECT status, name, description FROM DBTEST WHERE status=$1 and name=$2", 
                values:['happy','Jack']
            });
            expect(result.rows.length).to.equal(1);
            expect(result.rows[0]['description']).to.equal('Smiling forever');
        });

        it('should perform an empty update and successfully fall back to an insertion', async() => {
            await db.query({text:"DELETE FROM DBTEST", values:[]});
            let result = await db.fallback([
                {
                    text: "UPDATE DBTEST SET description=$3 WHERE status=$1 and name=$2 RETURNING *",
                    values: ['happy','Jack','Smiling forever']
                },
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                    values: ['happy','Jack','Seldom perturbed']
                }
            ]);
            result = await db.query({
                text:"SELECT status, name, description FROM DBTEST WHERE status=$1 and name=$2", 
                values:['happy','Jack']
            });
            expect(result.rows.length).to.equal(1);
            expect(result.rows[0]['description']).to.equal('Seldom perturbed');
        });

        it('should perform an empty update and rollback from a failed insertion', async() => {
            await db.query({text:"DELETE FROM DBTEST", values:[]});
            // Insure insert is bound to fail by giving invalid status
            let promise = db.fallback([
                {
                    text: "UPDATE DBTEST SET description=$3 WHERE status=$1 and name=$2 RETURNING *",
                    values: ['happy','Jack','Smiling forever']
                },
                {
                    text: "INSERT INTO DBTEST (status, name, description) VALUES ($1, $2, $3) RETURNING *",
                    values: ['terrified','Jack','Seldom perturbed']
                }
            ]);
            let result = await promise.catch ( ()  => {
                expect(promise).to.be.rejected;
            });

            result = await db.query({
                text:"SELECT status, name, description FROM DBTEST WHERE status=$1 and name=$2", 
                values:['happy','Jack']
            });
            expect(result.rows.length).to.equal(0);
        });
    });

});
