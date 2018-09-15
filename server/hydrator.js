
exports.pumpOccasionData = (data) => {
    let result = [];
    let oid = -1;
    let rid = -1;
    let occasion = null;
    let role = null;
    for (let i = 0; i < data.length; i++) {
        let row = data[i];
        if (row.role != rid) {
            if (role !== null) {
                occasion.roles.push(role);
                role = null;
                rid = -1;
            }
            rid = row.role;
            role = {
                id: row.role,
                type: row.roletype,
                required: row.count,
                assigned: [],
                confirmed: [],
                declined: []
            };
        }
        if (row.occasion !== oid) {
            if (occasion !== null) {
                result.push(occasion);
                occasion = null;
                oid = -1;
            }
            oid = row.occasion;
            occasion = {
                id: row.occasion,
                when: row.when,
                type: row.type,
                subtype: row.subtype,
                roles: []
            };
        }
        let attitem = {
            id: row.attendance,
            who: parseInt(row.participant)
        };
        if (row.team) {
            attitem.team = row.team;
        }
        switch (row.attype) {
            case 'declined':
                if (row.substitute) {
                    attitem.substitute = parseInt(row.substitute);
                }
                role['declined'].push (attitem);
                break;
            case 'assigned': 
            case 'confirmed':
                role[row.attype].push (attitem);
                break;
        }  
    }
    if (occasion !== null) {
        if (role !== null) {
            occasion.roles.push(role);
        }
        result.push(occasion);
    }
    return result;
}

exports.pumpRoleData = (data) => {
    if (data.length === 0) {
        return null;
    }
    let result = {
        id: data[0].role,
        type: data[0].roletype,
        required: data[0].count,
        assigned: [],
        confirmed: [],
        declined: []
    };
    for (let row of data) {
        let item = {
            id: row.attendance,
            who: parseInt(row.participant)
        };
        if (row.team) {
            item.team = row.team;
        }
        switch (row.attype) {
            case 'declined':
                if (row.substitute) {
                    item.substitute = parseInt(row.substitute);
                }
                result['declined'].push (item);
                break;
            case 'assigned': 
            case 'confirmed':
                result[row.attype].push (item);
                break;
        }    
    }
    return result;
}
