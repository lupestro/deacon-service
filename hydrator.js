
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
                declined: [],
                volunteered: []
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
        switch (row.attype) {
            case 'assigned':
                role.assigned.push ({
                    id: row.attendance,
                    name: row.participant,
                    team: row.team
                });
                break;
            case 'confirmed':
                role.confirmed.push ({
                    id: row.attendance,
                    name: row.participant
                });
                break;
            case 'declined':
                role.declined.push ({
                    id: row.attendance,
                    name: row.participant
                });
                break;
            case 'volunteered':
                role.volunteered.push ({
                    id: row.attendance,
                    name: row.participant,
                    subfor: row.substitute_for
                });
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
