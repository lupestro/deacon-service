import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
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

    @computed('watchableMe','model.participants') 
    get myId() {
        let model = this.model as ApplicationModel;
        let myParticipant = model.participants.find ( participant => {
            return participant.short_name === this.me;
        });
        return myParticipant ? myParticipant.id : 0;
    }

    @computed('watchableMe','model.participants') 
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
