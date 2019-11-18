const pg = require('pg');
const url = require('url')


class Db {

    constructor(connectionString, logQueries) {
        this.logQueries = !!logQueries;
        const stringToUse = connectionString || process.env.DATABASE_URL || 'postgres://localhost:5432/deacons';
        const params = url.parse(stringToUse);
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

    async query(query) {
        let result;
        if (this.logQueries) {
            console.log ("Db: ", query.text);
        }
        result = await this.pool.query(query);
        return result;
    }

    async transact(queries) {
        const client = await this.pool.connect();
        if (this.logQueries) {
            console.log ("Db: BEGIN");
        }
        await client.query("BEGIN");
        for (let query of queries) {
            try {
                if (this.logQueries) {
                    console.log ("Db: ", query.text);
                }
                await client.query(query);
            } catch (err) {
                try {
                    if (this.logQueries) {
                        console.log ("Db: ROLLBACK");
                    }
                    await client.query("ROLLBACK");
                } catch (rb_error) {
                    console.log ("Rollback also failed: ", err);
                }
                client.release();
                throw err;
            }    
        }
        try {
            if (this.logQueries) {
                console.log ("Db: COMMIT");
            }
            await client.query("COMMIT");
        } catch (err) {
            console.log ("Commit failed: ", err);
            client.release();
            throw err;
        }
        client.release();    
    }

    async fallback(queries) {
        const client = await this.pool.connect();
        if (this.logQueries) {
            console.log ("Db: BEGIN");
        }
        await client.query("BEGIN");
        for (let query of queries) {
            try {
                if (this.logQueries) {
                    console.log ("Db: ", query.text);
                }
                const result = await client.query(query);
                if (result.rowCount !== 0)
                    break;
            } catch (err) {
                try {
                    if (this.logQueries) {
                        console.log ("Db: ROLLBACK");
                    }
                    await client.query("ROLLBACK");
                } catch (rb_error) {
                    console.log ("Rollback also failed: ", err);
                }
                client.release();
                throw err;
            }    
        }
        try {
            if (this.logQueries) {
                console.log ("Db: COMMIT");
            }
            await client.query("COMMIT");
        } catch (err) {
            console.log ("Commit failed:, err");
            throw err;
        }
        client.release();
    }

    shutdown() {
        this.pool.end();
    }
    
}

module.exports = Db;