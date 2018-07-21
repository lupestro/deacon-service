const pg = require('pg');
const url = require('url')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/deacons';


class DeaconsDb {
    constructor() {
        const params = url.parse(connectionString);
        const config = {
            host: params.hostname,
            port: params.port,
            database: params.pathname.split('/')[1],
            ssl: false
        };          
        if (params.auth) {
            const auth = params.auth.split(':');
            config.user = auth[0];
            config.password = auth[1];

        }
        this.pool = new pg.Pool(config);
    }
    getParticipants(email) {
        let queryString = 'SELECT type, short_name, full_name, team, family FROM participants';
        if (email) {
            queryString = 'SELECT type, short_name, full_name, email, team, family FROM participants';
        }
        let result = [];
        return this.pool.connect().then( client => {
            return client.query(queryString)
            .then(res => {
                client.release();
                return res.rows; 
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
        })
    }
    getOccasions(participants, subneeded, from) {
        let queryString = 'SELECT ' + 
        'o.id as occasion, o.type, o.subtype, o.time as when, ' +
        'r.id as role, r.type as roletype, r.count, ' +
        'a.id as attendance, a.type as attype, a.participant, a.substitute_for, a.team ' + 
        'FROM occasions o, roles r, attendances a ' +
        'where o.id = r.occasion and r.id = a.role ';
        let parms = [];
        let result = [];
        return this.pool.connect().then( client => {
            if (from) {
                queryString = queryString  + " and o.time >= $1"
                parms.push (from);
            }
            queryString = queryString + " order by o.time, o.id, r.id, a.type, a.id"
            return client.query(queryString, parms)
            .then(res => {
                client.release();
                return res.rows; 
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
        })
        return [];
    }
}
module.exports = DeaconsDb;
