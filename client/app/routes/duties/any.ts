import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';


export default class DutiesAnyRoute extends Route {
    model(params: DutiesAnyRouteParams) {
        return { name: params.shortname };
    }
    @action didTransition() {
        let title = this.controller.model.name + "'s Duties";
        this.controllerFor('duties').set('title', title);       
    }
}

type DutiesAnyRouteParams = {
    shortname: string;
};
