import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';

export default class NotFoundRoute extends Route {
    @service declare router: RouterService;
    beforeModel() {
        this.router.transitionTo('duties.all');
    }
}
