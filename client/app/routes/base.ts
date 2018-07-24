import Route from '@ember/routing/route';

export default class BaseRoute extends Route {
    beforeModel() {
        this.transitionTo('duties.all');
    }
}
