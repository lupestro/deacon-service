
class ImportCandidate {
    constructor() {
        this.participants = {}; //key: `${short_name}`
                                //value: {part_id?, short_name, type, full_name, email, team, family}
        this.occasions = {};    //key: `${occ_type},${timestamp}`
                                //value: {occ_id?, timestamp, type, subtype}
        this.roles = {};        //key: `${occ_type},${timestamp},${role_type}`, 
                                //value: {role_id?, occ_id?, occ_type, timestamp, role_type, count}
        this.attendances = {};  //key: `${occ_type},${timestamp},${role_type},${short_name}`, 
                                //value: {att_id?, occ_id?, role_id?, part_id?, sub_id?, 
                                //        occ_type, timestamp, role_type, att_type, part_name, sub_name?, team? } 
    }
    loadFromWorkbook(workbook) {
        this.loadParticipants(workbook);
        this.loadOccasions(workbook);
    }
    loadParticipants(workbook) {
        for (const deacon of workbook.rosterSheet.deacons) {
            this.participants[deacon.short_name] = { 
                short_name: deacon.short_name, 
                type: "deacon", 
                full_name: deacon.full_name,
                email: deacon.email,
                team: deacon.team,
                family: deacon.family
            }
        }
        for (const alternate of workbook.rosterSheet.alternates) { 
            this.participants[alternate.short_name] = { 
                short_name: alternate.short_name, 
                type: "alternate", 
                full_name: alternate.full_name,
                email: alternate.email,
                family: alternate.family
            }
        }
    }
    loadOccasions(workbook) {
        const from = workbook.rosterSheet.fromDate;
        const until = workbook.rosterSheet.untilDate;
        for (const service of workbook.servicesSheet.services) {
            if (this._inDateRange(service.date, from, until)) {
                const schedule = this._findTeamScheduleByDate(service.date);
                // Early service (if there is one)
                if (service.early) {
                    const timestamp = this._buildTimestamp(service.date, service.early);
                    this._loadService(service, timestamp);
                    if (service.type.toLowerCase() === 'communion') {
                        this._loadEarlyCommunionRoles(workbook, schedule, timestamp);
                    }
                }
                //Primary service
                const timestamp = this._buildTimestamp(service.date, service.primary);
                this._loadService(service, timestamp);
                if (service.type.toLowerCase() === 'baptism' ) {
                    this._loadBaptismRoles(workbook, schedule, timestamp);
                } else if (service.type.toLowerCase() === 'communion') {
                    this._loadPrimaryCommunionRoles(workbook, schedule, timestamp);
                }
            }
        }
    }

    _loadService(service, timestamp) {
        this.occasions[`${timestamp},service`] = {
            type: "service",
            subtype: service.type ? service.type : undefined,
            time: timestamp
        };
        this.roles[`${timestamp},service,dod`] = {
            occasion_type: 'service', 
            time: timestamp, 
            type: 'dod', 
            count: 1
        };
        this.attendances[`${timestamp},service,dod,${service.dod}`] = {
            occasion_type: 'service',
            time: timestamp,
            role_type: 'dod',
            type: 'assigned',
            participant_name: service.dod
        };
    }

    _loadEarlyCommunionRoles(workbook, schedule, timestamp) {
        this.roles[`${timestamp},service,dom`] = {
            occasion_type: 'service', 
            time: timestamp, 
            type: 'dom', 
            count: 2    
        };
        for (const dom of this._findDeaconsOnTeam(workbook, schedule.doms)) {
            this.attendances[`${timestamp},service,dom,${dom}`] = {
                occasion_type: 'service',
                time: timestamp,
                role_type: 'dom',
                type: 'assigned',
                participant_name: dom
            };    
        }
        this.roles[`$timestamp},service,downstairs`] = {
            occasion_type: 'service', 
            time: timestamp, 
            type: 'downstairs', 
            count: 4    
        }
        for (const team of schedule.upstairs) {
            for (const deacon of this._findDeaconsOnTeam(workbook, team)) {
                this.attendances[`${timestamp},service,downstairs,${deacon}`] = {
                    occasion_type: 'service',
                    time: timestamp,
                    role_type: 'downstairs',
                    type: 'assigned',
                    short_name: deacon
                }
            }        
        }
    }
    
    _loadPrimaryCommunionRoles(workbook, schedule, timestamp) {
        this.roles[`${timestamp},service,dom`] = {
            occasion_type: 'service', 
            time: timestamp, 
            type: 'dom', 
            count: 2
        }
        for (const dom of this._findDeaconsOnTeam(workbook, schedule.doms)) {
            this.attendances[`${timestamp},service,dom,${dom}`] = {
                occasion_type: 'service',
                time: timestamp,
                role_type: 'dom',
                type: 'assigned',
                participant_name: dom
            };    
        }
        this.roles[`${timestamp},service,downstairs`] = {
            occasion_type: 'service', 
            time: timestamp, 
            type: 'dom', 
            count: 6
        }
        for (const team of schedule.downstairs) {
            for (const deacon of this._findDeaconsOnTeam(workbook, team)) {
                this.attendances[`${timestamp},service,downstairs,${deacon}`] = {
                    occasion_type: 'service',
                    time: timestamp,
                    role_type: 'downstairs',
                    type: 'assigned',
                    short_name: deacon
                }
            }        
        }
        this.roles[`${timestamp},service,upstairs`] = {
            occasion_type: 'service', 
            time: timestamp, 
            type: 'upstairs', 
            count: 4
        }    
        for (const team of schedule.upstairs) {
            for (const deacon of this._findDeaconsOnTeam(workbook, team)) {
                this.attendances[`${timestamp},service,upstairs,${deacon}`] = {
                    occasion_type: 'service',
                    time: timestamp,
                    role_type: 'upstairs',
                    type: 'assigned',
                    short_name: deacon
                }
            }        
        }
    }
    
    _loadBaptismRoles(workbook, schedule, timestamp) {
        this.roles[`${timestamp},service,baptism`] = {
            occasion_type: 'service', 
            time: timestamp, 
            type: 'baptism', 
            count: 2
        }
        for (const deacon of this._findDeaconsOnTeam(workbook, schedule.baptisms)) {
            this.attendances[`${timestamp},service,baptism,${deacon}`] = {
                occasion_type: 'service',
                time: timestamp,
                role_type: 'baptism',
                type: 'assigned',
                participant_name: deacon
            };    
        }
    }

    _inDateRange( date, from_date, to_date) {
        return (date > from_date && date <= to_date);
    }

    _buildDate (date, time) {
        return (date + "T" + time);
    }

    _findDeaconsOnTeam(workbook, team) {
        let result = [];
        for (const deacon of workbook.rosterSheet.deacons) {
            if (deacon.team === team) {
                result.push(deacon.short_name);
            }
        }
    }

    _findTeamScheduleByDate(workbook, date) {
        return workbook.teamScheduleSheet.find (value => {
            return value.date === date;
        })
    }

}

module.exports = ImportCandidate;