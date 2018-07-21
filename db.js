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
            ssl: true
        };          
        if (params.auth) {
            const auth = params.auth.split(':');
            config.user = auth[0];
            config.password = auth[1];

        }
        this.pool = new pg.Pool(config);
    }
    getParticipants(email) {
        return [];
    }
    getOccasions(participants, subneeded, from) {
        return [];
    }
}
module.exports = DeaconsDb;
