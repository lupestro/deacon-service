const FOREIGN_KEY_TABLES = {
    participant: 'participants', 
    occasion: 'occasions', 
    role: 'roles', 
    attendance: 'attendances'
};
const TABLE_ROLES = {
    participants : {
        singular: 'participant',
        fields: ['id',' type', 'short_name', 'full_name', 'team', 'family', 'email'],
        natural: ['short_name'], 
        foreign: [], 
        required: ['type', 'full_name']
    },
    occasions : {
        singular: 'occasion',
        fields: ['id', 'type', 'subtype', 'time'],
        natural: ['type','time'], 
        foreign: [], 
        required: []
    },
    roles: {
        singular: 'role',
        fields: ['id', 'type', 'count', 'occasion'],
        natural: ['type', 'occasion'],
        foreign: ['occasion'], 
        required: []},
    attendances: {
        singular: 'attendance',
        fields: ['id', 'type', 'role', 'participant', 'substitute', 'team'],
        natural:['participant','role'], 
        foreign:['participant','role','substitute'], 
        required: ['type']},
};

const TABLE_DELETIONS = {
    participants : [
        'DELETE FROM attendances WHERE participant=$1',
        'UPDATE attendances WHERE substitute=$1 SET substitute=NULL',
        'DELETE FROM participants WHERE id=$1'
    ],
    occasions: [
        'DELETE FROM attendances WHERE role IN (SELECT id FROM roles WHERE occasion=$1)',
        'DELETE FROM roles WHERE occasion=$1',
        'DELETE FROM occasions WHERE id=$1'
    ],
    roles: [
        'DELETE FROM attendances WHERE role=$1',
        'DELETE FROM roles WHERE id=$1'
    ],
    attendances : [
        'DELETE FROM attendances WHERE id=$1'
    ]
}

const TABLE_DEEPLISTS = {
    occasions: 
        ['SELECT o.id as occasion, o.type, o.subtype, o.time as when, r.id as role, r.type as roletype, r.count, a.id as attendance, a.type as attype, a.participant, a.substitute, a.team ' + 
        'FROM occasions o, roles r, attendances a where o.id = r.occasion and r.id = a.role order by o.time, o.id, r.id, a.type, a.id'],
    occasions_time: 
        ['SELECT o.id as occasion, o.type, o.subtype, o.time as when, r.id as role, r.type as roletype, r.count, a.id as attendance, a.type as attype, a.participant, a.substitute, a.team ' + 
        'FROM occasions o, roles r, attendances a where o.id = r.occasion and r.id = a.role and o.time >= $1 order by o.time, o.id, r.id, a.type, a.id','time'],
    roles: 
        ['SELECT r.id as role, r.type as roletype, r.count, a.id as attendance, a.type as attype, a.participant, a.substitute, a.team ' + 
        'FROM roles r, attendances a WHERE r.id = (SELECT role FROM attendances WHERE id=$1) AND a.role=r.id','id']
}

const TABLE_FIELD_VALIDATIONS = {
    attendances_substitution: [ //needed parameters: [attendance id, substitution id]
        "SELECT id FROM attendances WHERE ((participant = $2 AND type != 'declined') OR (substitute=$2 AND id!=$1)) AND role in (SELECT id FROM roles WHERE occasion = " +
        "(SELECT occasion FROM roles WHERE id=(SELECT role FROM attendances WHERE id=$1 )))", 'id','participant'
    ]
}

/**
 * The FieldTree is a hash of field name/value pairs. Foreign key field values are themselves FieldTree hashes that contain 
 * either a database id or the set of natural keys that identify the record in the other table. 
 * This treatment of foreign keys applies recursively.
 * @typedef {object} FieldTree
 */
/* The following functions build the text and parameters of the queries from the supplied data.*/

/**
 * Build the predicate that goes in a WHERE clause of a query based on a set of field values.
 * @param {FieldTree} fields The fields to use in the predicate.
 * @private
 */
function buildPredicate(fields) {
    var clauses = [];
    var values = [];
    Object.keys(fields).filter(key => {  // enumerable properties of fields
        return Object.prototype.hasOwnProperty.call(fields, key);
    }).forEach( (key,index) => {   // own enumerable properties of fields
        clauses.push(`${key}=$${index+1}`);
        if (typeof fields[key] === 'object') {
            values.push(fields[key].id);
        } else {
            values.push(fields[key]);
        }
});
    return [ clauses.join(" AND "), values ];
}

/**
 * Build the string of fields to change in the SET clause of an UPDATE query, indexed from the startIndex.
 * (The UPDATE will typically dedicate the first one or more parameters to its predicate.)
 * @param {FieldTree} fields The set of fields to change
 * @param {number} startIndex The index to specify ("$n") on the first field to change
 * @private
 */
function buildUpdateList(fields, startIndex) {
    var clauses = [];
    var values = [];
    Object.keys(fields).filter(key => {  // enumerable properties of fields
        return Object.prototype.hasOwnProperty.call(fields, key);
    }).forEach( (key,index) => {
        clauses.push(`${key}=$${index+startIndex+1}`),
        values.push(fields[key]);
    });
    return [clauses.join(','), values];
}

/**
 * Build the query for a SELECT statement
 * @param {string} tablename The name of the table
 * @param {string[]} fieldnames The list of fieldnames to deliver
 * @param {FieldTree} criteria The criteria to apply on the selection (as "=" conditions ANDed together)
 * @param {string[]} orderby Array of field names to order by
 * @private
 */
function buildSelection(tablename, fieldnames, criteria, orderby) {
    const members = fieldnames.join(',');
    const [ predicate, selectParms ] = buildPredicate(criteria);
    const clauses = [`SELECT ${members} FROM ${tablename}`];
    if (predicate.length > 0) {
        clauses.push (`WHERE ${predicate}`);
    }
    if (orderby && orderby.length > 0) {
        clauses.push (`ORDER BY ${orderby.join(',')}`)
    }
    return { text: clauses.join(' '), values: selectParms }
}

/**
 * Build an UPDATE query setting the specified values, given the specified keys
 * @param {string} tablename The name of the table
 * @param {FieldTree} keys A hash of the keys and their values (with recursive foreign keys)
 * @param {FieldTree} values A hash of the values to set
 * @private
 */
function buildUpdate(tablename, keys, values) { // ["A=$1,B=$2,C=$3", parms]
    const [ predicate, selectParms ] = buildPredicate(keys);
    const [ updateSettings, updateParms] = buildUpdateList(values, selectParms.length);
    return {
        text: `UPDATE ${tablename} SET ${updateSettings} WHERE ${predicate}`,
        values: selectParms.concat(updateParms)
    };
}

/**
 * Build an INSERT query setting the specified keys and other values.
 * @param {string} tablename Name of the table involved
 * @param {FieldTree} keys The set of natural keys needed to uniquely identify the record
 * @param {FieldTree} values The set of other values to include in the record
 * @private
 */
function buildInsertion(tablename, keys, values) { //[]
    let fields = Object.assign({}, keys);
    fields = Object.assign(fields, values);
    var keynames = [];
    var parameterIndexes = [];
    var parameterValues = [];
    Object.keys(fields).filter(key => {  // enumerable properties of fields
        return Object.prototype.hasOwnProperty.call(fields, key);
    }).forEach( (key,index) => {
        keynames.push(key);
        parameterIndexes.push(`$${index+1}`);
        parameterValues.push(fields[key]);
    });

    return {
        text: `INSERT INTO ${tablename} (${keynames.join(',')}) VALUES (${parameterIndexes.join(',')})`,
        values: parameterValues
    }
}

/**
 * Tests whether the supplied set of keys contains either an id or a full set of natural keys.
 * @param {*} table The name of the table
 * @param {*} keys The set of keys being tested
 * @private
 */
function neededKeysArePresent(table, keys) {
    const trueKeys = Object.keys(keys).filter(key => {  // enumerable properties of fields
        return Object.prototype.hasOwnProperty.call(keys, key) && TABLE_ROLES[table].natural.includes(key);
    });
    if (!Object.prototype.hasOwnProperty.call(keys, 'id') && trueKeys.length !== TABLE_ROLES[table].natural.length) {
        return false;
    }
    return true;
}

/**
 * This class provides all of the primitive database queries for the application. 
 * It should be the only place in the server in which the text of SQL queries appears 
 * or in which the internal organization of the deacon database matters, aside from its constraints (values, foreign keys).
 * 
 * The queries performed are driven by this module's internal formulation of database metadata, with the following exceptions:
 * - The `deeplist` and `validate` methods are driven by a canned set of the important cross-table queries. They are few but vital.
 * - The `delete` method is driven by a table of the queries needed to extricate a single object of each type from the foreign key jungle.
 * 
 * In these cases, it was simply easier to do what was narrowly necessary, 
 * rather than create a deeply complex (and hence hard to verify) generalization.
 */
class DeaconQueries {

    /**
     * Create the DeaconQueries object. The passed db object performs all of the raw communication with the database.
     * @param {*} db 
     */
    constructor (db) {
        this.db = db;
    }

    /* These utility functions identify the records selected by natural keys. 
       The expense of the queries is entirely bypassed when the caller supplies IDs in the data. */

    /**
     * Determine the ID indicated by the set of provided keys, returning the value of the 'id' key if present, 
     * but using natural keys to perform a single-row selection otherwise.
     * @param {string} table The name of the table
     * @param {FieldTree} fields A hash containing the named key fields, with nested natural keys from foreign key 
     * relationships (hence the mutually recursive calls between _resolveIds and _resolveId). 
     * @private
     */
    async _resolveId(table, fields) {
        if (Object.prototype.hasOwnProperty.call(fields, 'id')) {
            return Promise.resolve(fields['id']);
        } else {
            const newFields = await this._resolveIds(table, fields);
            const rawFields = {};
            for (let field in newFields) {
                if (typeof field === 'object') {
                    rawFields[field] = newFields[field]['id'];
                } else {
                    rawFields[field] = newFields[field];
                }
            }
            return await this.getId(table, rawFields);
        }
    }

    /**
     * Starting with a set of natural keys for the table, recursively resolve the ids of each of the keys. 
     * This provides the data necessary to provide the foreign keys needed to do an operation on a record 
     * of the table itself, but does not collect the id of the record, since it may not exist yet.  
     * @param {string} table The name of the table
     * @param {FieldTree} fields A hash containing the named key fields, with nested natural keys from foreign key 
     * relationships.
     * @private
     */
    async _resolveIds(table, fields) {
        const keyFieldsNeedingLookup = Object.keys(fields).filter(key => {  
            return Object.prototype.hasOwnProperty.call(fields, key) && 
                TABLE_ROLES[table].foreign.includes(key) && 
                typeof fields[key] === 'object' &&
                !Object.prototype.hasOwnProperty.call(fields[key],'id');
        });
        const work = keyFieldsNeedingLookup.map( key => { 
            return this._resolveId(FOREIGN_KEY_TABLES[key], fields[key]);
        });
        const ids = await Promise.all(work);
        let news = Object.assign({}, fields);
        ids.forEach ( (id, index) => {
            news[keyFieldsNeedingLookup[index]]['id'] = id;
        });
        return news;
    }

    /**
     * Performs query to get the id of a table, given its natural keys, 
     * one or more of which may be ids for foreign keys of other tables 
     * (i.e. this just does the one query and doesn't do recursive calls to get the foreign keys).
     * @param {string} table Table name
     * @param {FieldTree} keys Array of natural keys on table
     */
    async getId(table, keys) {
        if (!neededKeysArePresent(table, keys)) {
            throw ({message: "Incomplete Natural Keys on get from table " + table, table: table, keys: keys});
        }
        const resolvedKeys = await this._resolveIds(table, keys);
        const result = await this.db.query (buildSelection(table, ["id"], resolvedKeys));
        if (result.rows.length === 1) {
            return result.rows[0]['id'];
        } else {
            throw ({message: "Invalid Natural Key on table " + table, table: table, keys: resolvedKeys});
        }
    }

    /* The rest of the functions in this module are intended for use by the caller */

    /**
     * Perform a cross-table select between the specified table and its children based on the supplied criteria
     * @param {string} table The name of the table
     * @param {FieldTree} criteria Any additional criteria needed
     */
    async deeplist(table, criteria) {
        let criteriaToUse = criteria ? criteria : [];
        const resolvedCriteria = await this._resolveIds(table, criteriaToUse);
        const parms = TABLE_DEEPLISTS[table].slice(1).map (item => {
            return resolvedCriteria[item];
        });
        const result = await this.db.query({ text: TABLE_DEEPLISTS[table][0], values: parms} );
        return result.rows;
    }

    /**
     * Perform validations on the specified table and field, returning the rows involved.
     * @param {string} table The name of the table
     * @param {string} field The name of the field being tested
     * @param {FieldTree} criteria The criteria needed for the validation
     */
    async validate(table, field, criteria) {
        const resolvedCriteria = await this._resolveIds(table, criteria);
        const parms = TABLE_FIELD_VALIDATIONS[`${table}_${field}`].slice(1).map (item => {
            return resolvedCriteria[item];
        });
        const query = TABLE_FIELD_VALIDATIONS[`${table}_${field}`][0];
        const result = await this.db.query ( {text: query, values: parms });
        return result.rows;
    }

    /**
     * List the rows from the specified table identified by the specified criteria
     * @param {string} table The name of the table
     * @param {FieldTree} criteria A hash of the field values to use to narrow the list
     */
    async list(table, criteria) {
        let criteriaToUse = criteria ? criteria : [];
        const resolvedCriteria = await this._resolveIds(table, criteriaToUse);
        const selection = buildSelection(table, TABLE_ROLES[table].fields, resolvedCriteria, ['id'] );
        const result = await this.db.query (selection);
        return result.rows;
    }

    /**
     * Get the row from the specified table identified by the specified keys.
     * @param {string} table The name of the table
     * @param {FieldTree} keys A hash of the keys to identify the record
     */
    async get(table, keys) {
        if (!neededKeysArePresent(table, keys)) {
            throw ({message: "Incomplete Natural Keys on get from table " + table, table: table, keys: keys});
        }
        const resolvedKeys = await this._resolveIds(table, keys);
        const result = await this.db.query (buildSelection(table, TABLE_ROLES[table].fields, resolvedKeys, false));
        if (result.rows.length === 1) {
            return result.rows[0];
        } else {
            throw ({message: "Failed to retrieve single row from table " + table, table: table, keys: resolvedKeys});
        }
    }

    /**
     * Set the contents of a table row, either updating what is there or inserting a new one.
     * 
     * Limitations:
     * * This method won't attempt to change entries in other tables, even if it has all required fields to do so
     * * This method will fail to create a new row if it isn't supplied with values for all non-key non-NULL fields 
     * * This method will fail if natural keys are changed in ways that lead to collisions.
     * 
     * @param {string} table The name of the table
     * @param {FieldTree} keys A hash of the keys to identify the record
     * @param {FieldTree} values A hash of the values to set
     */
    async set(table, keys, values) {
        if (!neededKeysArePresent(table, keys)) {
            throw ({message: "Incomplete Natural Keys on get from table " + table, table: table, keys: keys});
        }
        const resolvedKeys = await this._resolveIds(table, keys);
        const resolvedValues = await this._resolveIds(table, values);

        const insert = buildInsertion(table, resolvedKeys, resolvedValues);
        const update = buildUpdate(table, resolvedKeys, resolvedValues);
        await this.db.fallback([ update, insert ]);

        const result = await this.db.query(buildSelection (table, TABLE_ROLES[table].fields, resolvedKeys));
        if (result.rows.length === 1) {
            return result.rows[0];
        } else {
            throw {message: "Invalid Natural Key on table " + table, table: table, keys: resolvedKeys};
        }    
    }

    /**
     * Delete the row from the table identified by the supplied keys. 
     * This will recursively delete rows from tables dependent upon this one.
     * @param {string} table The name of the table
     * @param {FieldTree} keys The set of keys
     */
    async delete(table, keys) {
        if (!neededKeysArePresent(table, keys)) {
            throw ({message: "Incomplete Natural Keys on get from table " + table, table: table, keys: keys});
        }
        let id = await this._resolveId(table, keys);
        const queries = TABLE_DELETIONS[table].map(deletion => {
            return {text: deletion, values: [id] };
        });
        this.db.transact(queries);
    }

}

module.exports = DeaconQueries;