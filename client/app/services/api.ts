import Service from '@ember/service';
import RSVP from 'rsvp';

export default class ApiService extends Service {
    getParticipants() {
        return RSVP.resolve([]);
    }
    getOccasions() {
        return RSVP.resolve([]);
    }
}