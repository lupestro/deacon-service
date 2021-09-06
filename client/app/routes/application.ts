import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import ApiService from '../services/api';
import type { Participant } from '../services/api';
import LocalService from '../services/local';
import OccasionsService from '../services/occasions';
import type { ParticipantIdMap } from '../services/occasions';

declare global {
    type ApplicationModel = {
        participants: Participant[];
    };
}

export default class ApplicationRoute extends Route {
    @service api!: ApiService;
    @service occasions! : OccasionsService;
    @service local!: LocalService;
    
    model () {
        return this.api.getParticipants().then ( participants => {
            let name_map: ParticipantIdMap = {};
            for (let participant of participants) {
                name_map[participant.id] = participant.short_name;
            }
            this.occasions.seed(name_map);
            return this.occasions.refresh().then ( () => {
                return { participants: participants };
            });
        })
    }
}
