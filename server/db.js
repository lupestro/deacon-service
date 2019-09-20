const pg = require('pg');
const url = require('url')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/deacons';
const PARTICIPANTS_QUERY =
    `SELECT id, type, short_name, full_name, team, family 
     FROM participants order by id`;
const PARTICIPANTS_EMAIL_QUERY =
    `SELECT id, type, short_name, full_name, email, team, family 
     FROM participants ORDER BY id`;
const OCCASIONS_QUERY =
    `SELECT 
        o.id as occasion, o.type, o.subtype, o.time as when, 
        r.id as role, r.type as roletype, r.count, 
        a.id as attendance, a.type as attype, a.participant, a.substitute, a.team
    FROM occasions o, roles r, attendances a
    WHERE o.id = r.occasion and r.id = a.role
    ORDER BY o.time, o.id, r.id, a.type, a.id`;
const OCCASIONS_TIME_QUERY = 
    `SELECT 
        o.id as occasion, o.type, o.subtype, o.time as when, 
        r.id as role, r.type as roletype, r.count, 
        a.id as attendance, a.type as attype, a.participant, a.substitute, a.team
    FROM occasions o, roles r, attendances a 
    WHERE o.id = r.occasion and r.id = a.role and o.time >= $1 
    ORDER BY o.time, o.id, r.id, a.type, a.id`;
const ATTENDANCE_ROLE_QUERY = 
    `SELECT 
        r.id as role, r.type as roletype, r.count, 
        a.id as attendance, a.type as attype, a.participant, a.substitute, a.team 
    FROM roles r, attendances a 
    WHERE r.id = (SELECT role FROM attendances WHERE id=$1) AND a.role=r.id`;
const ATTENDANCE_TYPE_UPDATE = 
    'UPDATE attendances SET type=$2, substitute=NULL WHERE id=$1';
const ATTENDANCE_SUBSTITUTE_VALIDATION = 
    `SELECT id FROM attendances WHERE (
        (participant = $2 AND type != 'declined') OR 
        (substitute = $2 AND id != $1)
     ) AND role in (
        SELECT id FROM roles WHERE occasion = (
            SELECT occasion FROM roles WHERE id = (
                SELECT role FROM attendances WHERE id=$1
            )
        )
     )`;
const ATTENDANCE_SUBSTITUTE_UPDATE = 
    'UPDATE attendances SET substitute=$2 WHERE id=$1';

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
        return this.pool.connect().then( client => {
            return client.query(email ? PARTICIPANTS_EMAIL_QUERY : PARTICIPANTS_QUERY)
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
        return this.pool.connect().then( client => {
            //TODO: Implement filtering on participants and subneeded, currently ignored
            let queryString = from ? OCCASIONS_TIME_QUERY : OCCASIONS_QUERY;
            let parms = from ? [from] : [];
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
    }

    updateAttendance(id, type) {
        return this.pool.connect().then( client => {
            return client.query(ATTENDANCE_TYPE_UPDATE, [id,type] )
            .then( res => {
                return client.query(ATTENDANCE_ROLE_QUERY, [id] );
            })
            .then( res => {
                client.release();
                return res.rows;    
            })
            .catch( e => {
                client.release();
                console.log(e.stack);
            })
        })
    }

    updateSubstitute(id, substitute) {
        return this.pool.connect().then( client => {
            return client.query(ATTENDANCE_SUBSTITUTE_VALIDATION, [id, substitute])
            .then( res => {
                if (res.rows.length > 0) {
                    throw ({message: "Participant already has role in occasion"});
                }
                return client.query(ATTENDANCE_SUBSTITUTE_UPDATE, [id,substitute]);
            })
            .then( res => {
                return client.query(ATTENDANCE_ROLE_QUERY, [id]);
            })    
            .then( res => {
                client.release();
                return res.rows;    
            })
            .catch( e => {
                client.release();
                console.log(e.stack);
            })
        })
    }
}

module.exports = DeaconsDb;
