import Route from '@ember/routing/route';
import ApiService from 'deacon-dash/services/api';
import LocalService from 'deacon-dash/services/local';
import { service } from '@ember-decorators/service';
import RSVP from 'rsvp';

export default class ApplicationRoute extends Route {
    @service api!: ApiService;
    @service local!: LocalService;
    model () {
        return RSVP.hash ({
            participants: this.api.getParticipants(),
            occasions: this.api.getOccasions(),
            me: this.local.me
        });
    }
}