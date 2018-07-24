import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from 'deacon-dash/controllers/application';
import { controller } from '@ember-decorators/controller';
import { computed } from '@ember-decorators/object';

export default class DutiesAllController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @computed ('model.name') get rules() {
        return new DutiesRoleRules([]);
    };
    @computed('occasions') get occasions() : Occasion[] {
        return this.getMatchingOccasions(this.application.model.occasions, this.rules, []);
    }
}
