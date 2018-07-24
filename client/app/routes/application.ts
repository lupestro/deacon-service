import Route from '@ember/routing/route';
import ApiService from 'deacon-dash/services/api';
import LocalService from 'deacon-dash/services/local';
import { service } from '@ember-decorators/service';
import RSVP from 'rsvp';

declare type ApplicationModel = {
    participants: Participant[];
    occasions: Occasion[];
    me: string;
    id_map?: { [ key:string ] : number};
    name_map?: { [ key:number ] : string};
};

export default class ApplicationRoute extends Route {
    @service api!: ApiService;
    @service local!: LocalService;
    model () : RSVP.Promise<ApplicationModel> {
        return RSVP.hash ({
            participants: this.api.getParticipants(),
            occasions: this.api.getOccasions(),
            me: this.local.me
        });
    }
    afterModel(model: ApplicationModel) {
        model.id_map = {};
        model.name_map = {};
        for (let participant of model.participants) {
            model.id_map[participant.short_name] = participant.id;
            model.name_map[participant.id] = participant.short_name;
        }
        for (let occasion of model.occasions) {
            for (let role of occasion.roles) {
                for (let assigned of role.assigned) {
                    assigned.who_name = model.name_map[assigned.who];
                }
                for (let confirmed of role.confirmed) {
                    confirmed.who_name = model.name_map[confirmed.who];
                }
                for (let declined of role.declined) {
                    declined.who_name = model.name_map[declined.who];
                    if (typeof declined.substitute !== "undefined") {
                        declined.sub_name = model.name_map[declined.substitute];
                    }
                }
            }
        }
    }
}