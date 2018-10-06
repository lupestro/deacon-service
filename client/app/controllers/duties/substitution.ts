import { controller } from '@ember-decorators/controller';
import { computed, action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from '../application';
import ApiService from '../../services/api';

class SubstitutionRoleRules extends DutiesRoleRules {
    constructor(who : string[]) {
        super(who);
    }
    doesRoleMatch(role: Role) : boolean {
        return role.declined.length > 0;
    }
};

export default class DutiesSubstitutionController extends DutiesBaseController {
    @service api!: ApiService;
    @controller('application') application! : ApplicationController;
    @computed ('application.me') get rules() {
        return new SubstitutionRoleRules([])
    };
    @computed('application.model.occasions') get occasions() : Occasion[] {
        return this.getMatchingOccasions(this.application.model.occasions, this.rules, []);
    }
    @action permit(role: Role, occasion: Occasion, actionType: string) : string {
        if (this.isHistorical(occasion.when) || actionType !== 'substitute') {
            return 'empty'
        } else {
            if (!!role.declined.find ( item => {
                return item.who_name === this.application.me;
            })) {
                return 'empty';
            } else {
                return actionType;
            }
        }
    }
    @action changeSubstitution(role: Role, occasion: Occasion, changeType: string) {
        const myId = this.application.model.id_map[this.application.me];
        const att = this.findFirstForSubstitute(role);
        if (att && att.id) {
            this.api.substitute(att.id, myId).then( updatedRole => {
                if (updatedRole) {
                    this.application.refreshOccasions();
                }
            })
            .catch( error => {
                console.log(`Failed substituting id ${myId} for id ${att.id}:`, error);
            });
        }
        console.log(`Change substitution for ${this.application.me} in role ${role.type} to ${changeType}`);
    }

    findFirstForSubstitute(role:Role) : Attendance | undefined {
        const declined = role.declined.find ( item => {
            return !item.substitute;
        })
        return declined;
    }

}

