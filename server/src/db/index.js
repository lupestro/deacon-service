const pg = require('pg');
const url = require('url')

/**
 * Class providing fundamental database operations. 
 * This is the only class that talks to the database. It knows nothing about the application and should work with any pgsql database that uses `id` for its keys.
 * All other classes in the application make database requests through this one.
 * 
 * Testing this code requires `test.pgsql` be included in the database to provide the table used for the test. 
 * While this should pose no threat, it is not recommended on production servers.
 */
class Db {
    /**
     * The Query combines everything needed to perform a SQL query in a single structure. It is identical to the pgsql-provided Query object.
     * @typedef {object} Query
     * @property {string} text The SQL query to perform with $1, $2, $3 for parameterized data.
     * @property {object[]} values The values to use with the supplied query.
     */

    /**
     * Connect to the database server
     * @param {string} connectionString The connection string to use - overrides `DATABASE_URL`. Default is `postgres://localhost:5432/deacons`.
     * @param {boolean} logQueries True to log the text of the queries to console.log. Useful during testing. Should be `false` for production.
     */
    constructor(connectionString, logQueries) {
        this.logQueries = !!logQueries;
        const stringToUse = connectionString || process.env.DATABASE_URL || 'postgres://localhost:5432/deacons';
        const params = url.parse(stringToUse);
        const config = {
            host: params.hostname,
            port: params.port,
            database: params.pathname.split('/')[1],
            ssl: params.hostname !== localhost
        };          
        if (params.auth) {
            const auth = params.auth.split(':');
            config.user = auth[0];
            config.password = auth[1];

        }
        this.pool = new pg.Pool(config);
    }
    /**
     * Perform a single query
     * @param {Query} query The query object with members `text` for the SQL and `values` for the parameters.
     */
    async query(query) {
        let result;
        if (this.logQueries) {
            console.log ("Db: ", query.text);
        }
        result = await this.pool.query(query);
        return result;
    }
    /**
     * Perform a series of queries as a transaction.
     * @param {Query[]} queries An array of queries to perform in sequence. Each query object has members `text` for the SQL and `values` for the parameters.
     */
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

    /**
     * Perform a series of queries to fall back to in a transaction, abandoning the series as soon as one returns a non-zero list of affected rows. 
     * This method was originally supplied for update-or-insert scenarios, but is generalized to be used for other such situations.
     * @param {Query[]} queries An array of queries to be tried in sequence
     */
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