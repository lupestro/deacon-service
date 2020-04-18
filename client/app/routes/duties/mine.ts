import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import OccasionsService from '../../services/occasions';
import DutiesController from '../../controllers/duties';
import ApplicationController from '../../controllers/application';

export default class DutiesMineRoute extends Route {
    @service occasions!: OccasionsService;

    model() {
        return this.occasions.refresh().then ( () => { 
            let appController: ApplicationController = this.controllerFor('application') as ApplicationController;
            const filter: FilterRule = {
                type: '',
                involved: [appController.me],
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
        (this.controllerFor('duties') as DutiesController).title = 'My Duties'; 
    }
}