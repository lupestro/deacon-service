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
    clickNewMe() {
        this.transitionToRoute('roster','mine');
    }
    @action
    clickCalendar() {
        console.log('ToDo: Calendar');
    }
    @action
    clickMyDuties() {
        console.log (this.application.me);
        if (this.application.me === "") {
            this.transitionToRoute('roster','mine'); 
        } else {
            this.application.refreshOccasions();
            this.transitionToRoute('duties.mine');
        }
    }
    @action
    clickFamilyDuties() {
        this.application.refreshOccasions();
        this.transitionToRoute('duties.family');
    }
    @action
    clickAllDuties() {
        this.application.refreshOccasions();
        this.transitionToRoute('duties.all');
    }
    @action
    clickDutySubstitutions() {
        this.application.refreshOccasions();
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
