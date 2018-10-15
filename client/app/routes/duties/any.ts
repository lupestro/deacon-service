import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import OccasionsService from '../../services/occasions';

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
        this.controllerFor('duties').set('title', title);       
    }
}
