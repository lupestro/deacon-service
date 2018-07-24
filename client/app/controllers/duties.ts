import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import ApplicationController from './application';
import { controller } from '@ember-decorators/controller';

declare global {
    interface RoleRules {
        getIconType (role: Role) : string;
        getIconImage (role: Role) : string;
        getNames(role: Role): string[];
        doesRoleMatch (role: Role, who: string[]) : boolean;
    }
}

export default class DutiesController extends Controller {
    @controller('application') application! : ApplicationController;
    title: string;
    constructor() {
        super(...arguments);
        this.title = 'Duties';
    }
    @action
    clickCalendar() {
        console.log('ToDo: Calendar');
    }
    @action
    clickMyDuties() {
        console.log (this.application.model.me);
        if (this.application.model.me === "") {
            this.transitionToRoute('roster','mine'); 
        } else {
            this.transitionToRoute('duties.mine');
        }
    }
    @action
    clickFamilyDuties() {
        this.transitionToRoute('duties.family');
    }
    @action
    clickAllDuties() {
        this.transitionToRoute('duties.all');
    }
    @action
    clickDutySubstitutions() {
        this.transitionToRoute('duties.substitution');
    }
    @action
    clickAnyPersonDuties() {
        this.transitionToRoute('roster', 'any');
    }
}

declare module '@ember/controller' {
    interface Registry {
        'duties': DutiesController;
    }
}
