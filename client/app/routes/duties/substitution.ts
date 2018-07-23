import Route from '@ember/routing/route';
import { action } from '@ember-decorators/object';

export default class DutiesSubstitutionRoute extends Route {
    @action  didTransition() {
        this.controllerFor('duties').set('title', 'Substitution');       
    }
}