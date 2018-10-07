import { controller } from '@ember-decorators/controller';
import { computed, action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import DutiesBaseController, {DutiesRoleRules} from './base';
import ApplicationController from '../application';
import ApiService from '../../services/api';

export default class DutiesMineController extends DutiesBaseController {
    @service api!: ApiService;
    @controller('application') application! : ApplicationController;
    @computed ('application.watchableMe') get rules() {
        return new DutiesRoleRules([this.application.me])
    };
    @computed('application.model.occasions','application.watchableMe','rules') get occasions() : Occasion[] {
        return this.getMatchingOccasions(
            this.application.model.occasions, 
            this.rules, 
            [this.application.me]
        );
    }
    @action permit(role: Role, occasion: Occasion, actionType: string) : string {
        if (actionType === 'confirm') {
            if (this.isImminent(occasion.when)) {
                const confirmed = role.confirmed.find ( item => {
                    return !!item.who_name && (item.who_name === this.application.me);
                })
                if (confirmed) {
                    return 'unconfirm';
                } else {
                    return actionType;
                }
            } else {
                return 'empty';
            }
        } else {
            if (this.isHistorical(occasion.when)) {
                return 'empty';
            } else {
                const declined = role.declined.find ( item => {
                    return !!item.who_name && (item.who_name === this.application.me);
                })
                if (declined) {
                    return 'unconfirm';
                } else {
                    return actionType;
                }
            }
        }
    }
    @action changeCommitment(role: Role, changeType: string) {
        if (changeType === 'confirm') {
            const att = this.findAttendance(role, this.application.me);
            if (att && att.id) { 
                this.api.confirmAttendance(att.id)
                .then(updatedRole => {
                    if (updatedRole) {
                        this.application.refreshOccasions();
                    }
                })
                .catch( error => {
                    console.log(`Failed confirming attendance for id ${att.id}:`, error);
                });
            }
        } else if (changeType === 'unconfirm') {
            const att = this.findAttendance(role, this.application.me);
            if (att && att.id) { 
                this.api.unconfirmAttendance(att.id)
                .then(updatedRole => {
                    if (updatedRole) {
                        this.application.refreshOccasions();
                    }
                })
                .catch( error => {
                    console.log(`Failed unconfirming attendance for id ${att.id}:`, error);
                });
            }
        } else if (changeType === 'decline') {
            const att = this.findAttendance(role, this.application.me);
            if (att && att.id) { 
                this.api.declineAttendance(att.id).then(updatedRole => {
                    if (updatedRole) {
                        this.application.refreshOccasions();
                    }
                })
                .catch( error => {
                    console.log(`Failed declining attendance for id ${att.id}:`, error);
                });
            }
        }

        console.log(`Change attendance for ${this.application.me} in role ${role.type} to ${changeType}`);
    }
    findAttendance(role:Role, who: string) : Attendance | undefined {
        const assigned = role.assigned.find( item => {
            return !!item.who_name && (item.who_name === who);
        });
        if (assigned) {
            return assigned;
        }
        const declined = role.declined.find ( item => {
            return !!item.who_name && (item.who_name === who);
        })
        if (declined) {
            return declined;
        }
        const confirmed = role.confirmed.find ( item => {
            return !!item.who_name && (item.who_name === who);
        })
        if (confirmed) {
            return confirmed;
        }
        return undefined;
    }
}
