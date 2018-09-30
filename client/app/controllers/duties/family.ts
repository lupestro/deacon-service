import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from '../application';
import { controller } from '@ember-decorators/controller';
import { computed, action } from '@ember-decorators/object';

export default class DutiesMineController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @computed ('application.watchableMe') get rules() {
        return new DutiesRoleRules(this.members)
    };
    @computed('occasions','application.watchableMe') get occasions() : Occasion[] {
        return this.getMatchingOccasions(
            this.application.model.occasions, 
            this.rules, 
            this.members);
    }
    @computed('application.model.participants', 'application.watchableMe') get members() {
        let model = this.application.model as ApplicationModel;
        if (model.id_map) {
            let myId = model.id_map[this.application.me];
            let me = model.participants.find(item => { return item.id === myId; });
            if (me && me.family) {
                let family = me.family;
                return model.participants
                    .filter( item => { return item.family == family; })
                    .map( item => { return item.short_name; })
            } 
        }
        return [this.application.me];
    }
    @action changeCommitment(role: Role, changeType: string) {
        console.log(`Change attendance for ${this.application.me} in role ${role.type} to ${changeType}`);
    }
}
