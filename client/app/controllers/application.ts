import Controller from '@ember/controller';
import { service } from '@ember-decorators/service';
import LocalService from '../services/local';
import ApiService from '../services/api';

export default class ApplicationController extends Controller {
    @service local! : LocalService;
    @service api! : ApiService;
    watchableMe!: string;

    get me() {
        let result = this.local.me;
        if (!this.watchableMe) {
            this.set('watchableMe', result);
        }
        return result; 
    }
    set me(value: string) {
        this.local.me = value;
        this.set('watchableMe', value);
    }
    refreshOccasions() {
        this.api.getOccasions().then(occasions => {
            for (let occasion of occasions) {
                for (let role of occasion.roles) {
                    for (let assigned of role.assigned) {
                        assigned.who_name = this.model.name_map[assigned.who];
                    }
                    for (let confirmed of role.confirmed) {
                        confirmed.who_name = this.model.name_map[confirmed.who];
                    }
                    for (let declined of role.declined) {
                        declined.who_name = this.model.name_map[declined.who];
                        if (typeof declined.substitute !== "undefined") {
                            declined.sub_name = this.model.name_map[declined.substitute];
                        }
                    }
                }
            }
    
            let model : ApplicationModel = {
                participants: this.model.participants,
                occasions: occasions,
                id_map: this.model.id_map,
                name_map: this.model.name_map
            };
            this.set('model', model);
        })
    }
}

declare module '@ember/controller' {
    interface Registry {
        'application': ApplicationController;
    }
}
