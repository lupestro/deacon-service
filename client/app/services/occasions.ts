import Service from '@ember/service';
import { inject as service } from '@ember/service';
import ApiService from './api';
import RSVP from 'rsvp';

declare global {
    
    type Attendance = {
        id: number,
        type: string,
        who: number,
        who_name: string,
        team: number,
        substitute: number,
        sub_name : string
    };
    
    type Role = {
        id: number,
        type: string,
        required: number,
        attendances: Attendance[]
    };
      
    type Occasion = {
        id: number,
        when: string,
        type: string,
        subtype: string,
        roles: Role[]
    };
    
    type FilterRule = {
        assignee: string[];
        substitute: string[];
        involved: string[];
        type: string;
    };
    
    type ParticipantIdMap = {
        [id:number]: string
    }        
}

const FILTER_RULE_NULL : FilterRule = {assignee:[], substitute:[], involved:[], type: "" };

export default class OccasionsService extends Service {
    @service api!: ApiService;
    ids?: ParticipantIdMap;
    occasions?: Occasion[];

    seed (ids : ParticipantIdMap) {
        this.ids = Object.assign({}, ids); // NOTE: ONLY PLACE ids IS POPULATED
    }

    refresh () : Promise<Occasion[]> {
        if (!this.ids) {
            return RSVP.Promise.reject("Cannot refresh occasions - not primed with participants");
        }
        return this.api.getOccasions().then( occasions => {
            this.occasions = occasions.map(occasion => {        // NOTE: ONLY PLACE occasions IS POPULATED
                return this._convertOccasion(occasion);
            }); 
            return this.filter(FILTER_RULE_NULL);   // Only a clone is exported
        });
    }

    update (roledata: RoleData) : void {
        if (!this.occasions) {
            throw ("Cannot update occasions - not populated yet");
        }
        let roleIndex = -1;
        let occasionsIndex = this.occasions.findIndex( occasion => {
            const idx = occasion.roles.findIndex ( role => {
                return role.id === roledata.id;
            })
            if (idx != -1) {
                roleIndex = idx;
                return true;
            }
            return false;
        })
        if (occasionsIndex === -1) {
            throw ("Cannot update occasions - no occasion with that role found");
        }
        this.occasions[occasionsIndex].roles[roleIndex] = this._convertRole(roledata); //NOTE: ONLY PLACE occasions IS MODIFIED
    }

    filter (filter: FilterRule) : Occasion[] {
        if (!this.occasions) {
            throw "Cannot filter occasions - occasions not yet populated";
        }
        let result : Occasion[] = [];
        for (const occasion of this.occasions) {
            let roles : Role[] = [];
            for (const role of occasion.roles) {
                const matches = role.attendances.filter ( attendance => {
                    return this._match(filter, attendance);
                }).map (attendance => {
                    return Object.assign({}, attendance); // cloning the matches
                })
                if (matches.length > 0) {
                    roles.push(Object.assign(Object.assign({}, role), { attendances: matches})); //cloning the role with the cloned matches
                }
            }
            if (roles.length > 0) {
                result.push(Object.assign(Object.assign({}, occasion), {roles: roles})); //cloning the occasion with the cloned roles
            }
        }
        return result;  // Only ever returns a clone of the desired subset
    }

    // -------- Local methods -----------

    _match(filter: FilterRule, attendance: Attendance) {
        let match = true;
        if ((filter.type != "") && (attendance.type !== filter.type)) {
            match = false;
        }
        if (filter.assignee.length > 0 && !filter.assignee.includes(attendance.who_name)) {
            match = false;
        }
        if (filter.substitute.length > 0 && !filter.substitute.includes(attendance.sub_name)) {
            match = false;
        }
        if (filter.involved.length > 0 && !filter.involved.includes(attendance.who_name) && !filter.involved.includes(attendance.sub_name)) {
            match = false;
        }
        return match;
    }

    _convertOccasion(occasion: OccasionData) : Occasion {
        return {
            id: occasion.id,
            when: occasion.when,
            type: occasion.type,
            subtype: occasion.subtype ? occasion.subtype : "",
            roles: occasion.roles.map( role => {
                return this._convertRole(role);
            })
        };
    }
    
    _convertRole(role: RoleData) : Role {
        return {
            id: role.id,
            type: role.type,
            required: role.required,
            attendances: role.assigned.map ( attendance => { 
                return this._convertAttendance('assigned', attendance);
            }).concat(
                role.confirmed.map( attendance => {
                    return this._convertAttendance('confirmed', attendance);
                }),
                role.declined.map ( attendance => {
                    return this._convertAttendance('declined', attendance);
                })
            )
        };
    }
    
    _convertAttendance(type: string, attendance: AttendanceData) : Attendance {
        return {
            id: attendance.id,
            type: type,
            who: attendance.who,
            who_name: this.ids ? this.ids[attendance.who] : "",
            team: attendance.team ? attendance.team : 0,
            substitute: attendance.substitute ? attendance.substitute : 0,
            sub_name : attendance.substitute ? (this.ids? this.ids[attendance.substitute] : "") : ""                      
        };
    }
}
