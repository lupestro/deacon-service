import Controller from '@ember/controller';
import { action } from '@ember/object';
import ApplicationController from './application';
import { inject as controller } from '@ember/controller';

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
    title: string = 'Duties';

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
        if (this.application.me === "") {
            this.transitionToRoute('roster','mine'); 
        } else {
            this.transitionToRoute('duties.mine');
        }
    }

    @action
    clickFamilyDuties() {
        if (this.application.me === "") {
            this.transitionToRoute('roster','family'); 
        } else {
            this.transitionToRoute('duties.family');
        }
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
