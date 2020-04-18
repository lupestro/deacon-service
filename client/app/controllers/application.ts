import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import LocalService from '../services/local';
import ApiService from '../services/api';

export default class ApplicationController extends Controller {
    @service local! : LocalService;
    @service api! : ApiService;
    @tracked watchableMe!: string;

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

    get myId() {
        let model = this.model as ApplicationModel;
        let myParticipant = model.participants.find ( participant => {
            return participant.short_name === this.me;
        });
        return myParticipant ? myParticipant.id : 0;
    }

    get myFamily() {
        let model = this.model as ApplicationModel;
        let myParticipant = model.participants.find ( participant => {
            return participant.short_name === this.me;
        });
        if (!myParticipant || !myParticipant.family) return [this.me];

        return model.participants.filter ( participant => {
            return participant.family && myParticipant && participant.family === myParticipant.family;
        }).map( participant => {
            return participant.short_name;
        });
    }
}

// The following definition is needed for TypeScript because child routes request it via controllerFor.

declare module '@ember/controller' {
    interface Registry {
        'application': ApplicationController;
    }
}
