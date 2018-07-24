import Service from '@ember/service';
import { participants, occasions } from '../data/fakedb';
import RSVP from 'rsvp';

const participantsRecord  = {
    "success":true,
    "data": participants
};

const occasionsRecord = {
    "success":true,
    "data": occasions
};

export default class ApiService extends Service {
    getParticipants() {
        return RSVP.resolve(participantsRecord.data);
    }
    getOccasions() {
        return RSVP.resolve(occasionsRecord.data);
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
        team: number | null,
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
  
