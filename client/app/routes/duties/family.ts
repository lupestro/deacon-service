import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import OccasionsService from '../../services/occasions';
import DutiesFamilyController from '../../controllers/duties/family';
import DutiesController from '../../controllers/duties';
import ApplicationController from '../../controllers/application';

export default class DutiesFamilyRoute extends Route {
    @service occasions!: OccasionsService;

    model() {
        return this.occasions.refresh().then ( occasions => { 
            return {filter: null, occasions: occasions}; 
        });
    }

    // We had to defer this activity because getting the family depended upon the model being available in the application controller.
    // The model() method for the parent completes before the model() method for the child is called.
    // However, this doesn't guarantee that the setupController for the parent happens before the model() method for the child.
    // Hence the model may have been calculated but not yet emplaced in the controller when the chlid tries to use it in the model.
    // We were forced to defer the calculation of the filter until setupController on the child, which *is* guaranteed to run after
    // setupController on the parent.
    setupController(controller: DutiesFamilyController) {
        this._super(...arguments);
        const filter: FilterRule = {
            type: '',
            involved: (this.controllerFor('application') as ApplicationController).myFamily,
            substitute: [],
            assignee: []
        }
        controller.model = {
            filter: filter, 
            occasions: this.occasions.filter(filter)
        };
    }

    @action 
    didTransition() {
        (this.controllerFor('duties') as DutiesController).title = 'Family Duties';       
    }
}