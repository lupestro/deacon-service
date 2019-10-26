import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import OccasionsService from '../../services/occasions';
import DutiesController from '../../controllers/duties';

export default class DutiesSubstitutionRoute extends Route {
    @service occasions!: OccasionsService;

    model() {
        return this.occasions.refresh().then ( () => { 
            const filter: FilterRule = {
                type: 'declined',
                involved: [],
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
        (this.controllerFor('duties') as DutiesController).set('title', 'Substitution');       
    }
}