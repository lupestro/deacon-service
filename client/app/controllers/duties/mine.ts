import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from '../application';
import { controller } from '@ember-decorators/controller';
import { computed } from '@ember-decorators/object';

export default class DutiesMineController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @computed ('application.me') get rules() {
        return new DutiesRoleRules([this.application.me])
    };
    @computed('occasions') get occasions() : Occasion[] {
        return this.getMatchingOccasions(this.application.model.occasions, this.rules, [this.application.me]
        );
    }
}
