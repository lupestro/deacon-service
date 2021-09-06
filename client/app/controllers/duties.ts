import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ApplicationController from './application';
import { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type { Role } from 'deacon-dash/services/occasions';


declare global {
    interface RoleRules {
        getIconType (role: Role) : string;
        getIconImage (role: Role) : string;
        getNames(role: Role): string[];
        doesRoleMatch (role: Role, who: string[]) : boolean;
    }
}

export default class DutiesController extends Controller {
    @controller('application') declare application : ApplicationController;
    @service('router') declare router: RouterService;
    @tracked title: string = 'Duties';

    @action
    clickNewMe() {
        this.router.transitionTo('roster','mine');
    }

    @action
    clickCalendar() {
        console.log('ToDo: Calendar');
    }

    @action
    clickMyDuties() {
        if (this.application.me === "") {
            this.router.transitionTo('roster','mine'); 
        } else {
            this.router.transitionTo('duties.mine');
        }
    }

    @action
    clickFamilyDuties() {
        if (this.application.me === "") {
            this.router.transitionTo('roster','family'); 
        } else {
            this.router.transitionTo('duties.family');
        }
    }

    @action
    clickAllDuties() {
        this.router.transitionTo('duties.all');
    }

    @action
    clickDutySubstitutions() {
        this.router.transitionTo('duties.substitution');
    }
    
    @action
    clickAnyPersonDuties() {
        this.router.transitionTo('roster', 'any');
    }
    @action
    clickNone(){        
    }
}

// The following definition is needed for TypeScript because child routes request it via controllerFor.

declare module '@ember/controller' {
    interface Registry {
        'duties': DutiesController;
    }
}
