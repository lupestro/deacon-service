import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import OccasionsService from '../../services/occasions';

export default class DutiesMineRoute extends Route {
    @service occasions!: OccasionsService;

    model() {
        return this.occasions.refresh().then ( () => { 
            const filter: FilterRule = {
                type: '',
                involved: [this.controllerFor('application').me],
                substitute: [],
                assignee: []
            }
            return { 
                filter: filter, 
                occasions: this.occasions.filter(filter) 
            }; 
        });
    }

    @action 
    didTransition() {
        this.controllerFor('duties').set('title', 'My Duties'); 
    }
}