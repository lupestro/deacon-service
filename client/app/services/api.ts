import Service from '@ember/service';
import fetch from 'fetch';
import Ember from 'ember';
import moment from 'moment';
import ENV from '../config/environment';

declare type ErrorRecord = {
    success: boolean,
    err: string
}

declare type ParticipantsRecord  = {
    success: boolean,
    data:Participant[],
};

declare type OccasionsRecord  = {
    success: boolean,
    data: OccasionData[],
};

declare type RoleRecord = {
    success: boolean,
    data: RoleData,
}

export type Participant = {
    id: number,
    type: string,
    short_name: string,
    full_name: string,
    team?: number | null,
    family?: number | null
}; 
    
export type AttendanceData = {
    id: number,
    who: number,
    team?: number | null,
    substitute?: number
};

export type RoleData = {
    id: number,
    type: string,
    required: number,
    assigned: AttendanceData[],
    confirmed: AttendanceData[],
    declined: AttendanceData[]
};
    
export type OccasionData = {
    id: number,
    when: string,
    type: string,
    subtype: string | null,
    roles: RoleData[]
};
export default class ApiService extends Service {
    now : string = "";
    get today() {
        if (Ember.testing || ENV.APP.timeFreeze) {
            return moment(this.now).startOf('day');
        }
        return moment().startOf('day');
    }
    
    getParticipants() {
        return fetch('/api/v1/participants').then( result  => { 
            return result.json();
        }).then ( json => { 
            if (!json.success) {
                throw (json as ErrorRecord).err;
            }
            return (json as ParticipantsRecord).data;
        })
    }

    getOccasions() {
        return fetch('/api/v1/occasions').then( result  => { 
            return result.json();
        }).then ( json => { 
            if (!json.success) {
                throw (json as ErrorRecord).err;
            }
            if ((Ember.testing || ENV.APP.timeFreeze) && json.now && !this.now) {
                this.now = json.now;
            }
            return (json as OccasionsRecord).data;
        })
    }

    confirmAttendance(id:number) {
        return fetch(`/api/v1/attendance/${id}/type`,{
            method: 'POST',
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: '{ "type": "confirmed" }',
        }).then( result => {
            return result.json();
        }).then (json => {
            if (!json.success) {
                throw (json as ErrorRecord).err;
            }
            return (json as RoleRecord).data;
        })
    }

    unconfirmAttendance(id:number) {
        return fetch(`/api/v1/attendance/${id}/type`,{
            method: 'POST',
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: '{ "type": "assigned" }',
        }).then( result => {
            return result.json();
        }).then (json => {
            if (!json.success) {
                throw (json as ErrorRecord).err;
            }
            return (json as RoleRecord).data;
        })
    }

    declineAttendance(id:number) {
        return fetch(`/api/v1/attendance/${id}/type`, {
            method: 'POST',
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: '{ "type": "declined" }',
        }).then( result => {
            return result.json();
        }).then (json => {
            if (!json.success) {
                throw (json as ErrorRecord).err;
            }
            return (json as RoleRecord).data;
        })
    }
    
    substitute(id : number, substitute: number) {
        return fetch(`/api/v1/attendance/${id}/substitute`, {
            method: 'POST',
            headers: {
                "Accept": "application/json; charset=utf-8",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: `{ "substitute": "${substitute}" }`,
        }).then( result => {
            return result.json();
        }).then (json => {
            if (!json.success) {
                throw (json as ErrorRecord).err;
            }
            return (json as RoleRecord).data;
        })
    }
}
