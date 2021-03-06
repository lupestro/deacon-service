import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import OccasionsService from '../../services/occasions';
import DutiesController from '../../controllers/duties';

export default class DutiesAllRoute extends Route {
    @service occasions!: OccasionsService;

    model() {
        return this.occasions.refresh().then ( occasions => { 
            const filter: FilterRule = {
                type: '',
                involved: [],
                substitute: [],
                assignee: []
            }
            return {
                filter: filter, 
                occasions: occasions
            }; 
        })
    }

    @action 
    didTransition() {
        (this.controllerFor('duties') as DutiesController).title = 'All Duties';
    }
}