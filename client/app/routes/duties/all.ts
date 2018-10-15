import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import OccasionsService from '../../services/occasions';

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
        this.controllerFor('duties').set('title', 'All Duties');       
    }
}