import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';

export default class DutiesAllRoute extends Route {
    @action  didTransition() {
        this.controllerFor('duties').set('title', 'All Duties');       
    }
}