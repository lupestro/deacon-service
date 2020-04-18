import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import OccasionsService from '../../services/occasions';
import DutiesController from '../../controllers/duties';

type DutiesAnyRouteParams = {
    shortname: string;
};

export default class DutiesAnyRoute extends Route {
    @service occasions!: OccasionsService;

    model(params: DutiesAnyRouteParams) {
        return this.occasions.refresh().then ( () => { 
            const filter: FilterRule = {
                type: '',
                involved: [params.shortname],
                substitute: [],
                assignee: []
            }
            return {
                name: params.shortname, 
                filter: filter,
                occasions: this.occasions.filter(filter)
            };
        });
    }

    @action 
    didTransition() {
        let title = this.controller.model.name + "'s Duties";
        (this.controllerFor('duties') as DutiesController).title = title;       
    }
}
