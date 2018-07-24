import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from '../application';
import { controller } from '@ember-decorators/controller';
import { computed } from '@ember-decorators/object';

class SubstitutionRoleRules extends DutiesRoleRules {
    constructor(who : string[]) {
        super(who);
    }
    doesRoleMatch(role: Role) : boolean {
        return this.hasHoles(role);
    }
};

export default class DutiesSubstitutionController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @computed ('application.me') get rules() {
        return new SubstitutionRoleRules([])
    };
    @computed('occasions') get occasions() : Occasion[] {
        return this.getMatchingOccasions(this.application.model.occasions, this.rules, []);
    }
}

