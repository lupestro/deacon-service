import Service from '@ember/service';

declare type ParticipantsRecord  = {
    success: boolean,
    data?:Participant[],
    err?: string
};
declare type OccasionsRecord  = {
    success: boolean,
    data?: Occasion[],
    err?: string
};

declare type RoleRecord = {
    success: boolean,
    data?: Role,
    err?: string
}

export default class ApiService extends Service {
    getParticipants() {
        return fetch('/api/v1/participants').then( result  => { 
            return result.json();
        }).then ( json => { 
            let record = json as ParticipantsRecord;
            if (!record.success) {
                throw (record.err);
            }
            return record.data!;
        })
    }
    getOccasions() {
        return fetch('/api/v1/occasions').then( result  => { 
            return result.json();
        }).then ( json => { 
            let record = json as OccasionsRecord;
            if (!record.success) {
                throw (record.err);
            }
            return record.data!;
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
            let record = json as RoleRecord;
            if (!record.success) {
                throw (record.err);
            }
            return record.data!;
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
            let record = json as RoleRecord;
            if (!record.success) {
                throw (record.err);
            }
            return record.data!;
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
            let record = json as RoleRecord;
            if (!record.success) {
                throw (record.err);
            }
            return record.data!;
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
            let record = json as RoleRecord;
            if (!record.success) {
                throw (record.err);
            }
            return record.data!;
        })
    }
}

declare global {
    
    type Participant = {
        id: number,
        type: string,
        short_name: string,
        full_name: string,
        team: number | null,
        family: number | null
      }; 
    
    type Attendance = {
        id: number,
        who: number,
        who_name?: string,
        team?: number | null,
        substitute?: number,
        sub_name? : string
      };
    
    type Role = {
        id: number,
        icon?: string,
        type: string,
        required: number,
        assigned: Attendance[],
        confirmed: Attendance[],
        declined: Attendance[]
      };
      
    type Occasion = {
        id: number,
        when: string,
        type: string,
        subtype: string | null,
        roles: Role[]
      }
    
    }
  
