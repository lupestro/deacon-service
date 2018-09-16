import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from '../application';
import { controller } from '@ember-decorators/controller';
import { computed } from '@ember-decorators/object';

export default class DutiesAnyController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @computed ('model.name') get rules() {
        return new DutiesRoleRules([this.model.name]);
    };
    @computed('occasions','rules') get occasions() : Occasion[] {
        return this.getMatchingOccasions(
            this.application.model.occasions, 
            this.rules, 
            [this.model.name]
        );
    }
}
