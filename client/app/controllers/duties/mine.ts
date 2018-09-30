import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from '../application';
import { controller } from '@ember-decorators/controller';
import { computed, action } from '@ember-decorators/object';

export default class DutiesMineController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @computed ('application.watchableMe') get rules() {
        return new DutiesRoleRules([this.application.me])
    };
    @computed('occasions','application.watchableMe') get occasions() : Occasion[] {
        return this.getMatchingOccasions(
            this.application.model.occasions, 
            this.rules, 
            [this.application.me]
        );
    }
    @action changeCommitment(role: Role, changeType: string) {
        console.log(`Change attendance for ${this.application.me} in role ${role.type} to ${changeType}`);
    }
}
