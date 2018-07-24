import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from '../application';
import { controller } from '@ember-decorators/controller';
import { computed } from '@ember-decorators/object';

export default class DutiesMineController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @computed('application.model.participants', 'application.model.me') get members() {
        let model = this.application.model as ApplicationModel;
        if (model.id_map) {
            let myId = model.id_map[model.me];
            let me = model.participants.find(item => { return item.id === myId; });
            if (me && me.family) {
                let family = me.family;
                return model.participants
                    .filter( item => { return item.family == family; })
                    .map( item => { return item.short_name; })
            } 
        }
        return [model.me];
    }
    @computed ('application.model.me') get rules() {
        return new DutiesRoleRules(this.members)
    };
    @computed('occasions') get occasions() : Occasion[] {
        return this.getMatchingOccasions(this.application.model.occasions, this.rules, this.members);
    }
}
