import { controller } from '@ember-decorators/controller';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import DutiesBaseController  from './base';
import ApplicationController from '../application';
import ApiService from '../../services/api';
import OccasionsService from '../../services/occasions';

export default class DutiesSubstitutionController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @service api!: ApiService;
    @service occasions!: OccasionsService;

    @action 
    permit(_role: Role, occasion: Occasion, attendance: Attendance, actionType: string) : string {
        if (this.isHistorical(occasion.when) ) {
            return 'empty'
        } else if (actionType === 'substitute') {
            if (attendance.substitute || attendance.who_name === this.application.me) {
                return 'empty';
            } else {
                return actionType;
            }
        } else if (actionType === 'revoke') {
            if (attendance.sub_name && attendance.sub_name === this.application.me) {
                return actionType;
            } else {
                return 'empty';
            }
        } else {
            return 'empty';
        }
    }

    @action 
    changeSubstitution(attendance: Attendance, changeType: string) {
        const myId = this.application.myId;
        if (changeType === 'substitute') {
            this.api.substitute(attendance.id, myId).then( updatedRole => {
                this.occasions.update(updatedRole);
                this.set('model', {filter: this.model.filter, occasions: this.occasions.filter(this.model.filter)});
            })
            .catch( error => {
                console.log(`Failed substituting id ${myId} for id ${attendance.id}:`, error);
            });
        } else if (changeType === 'revoke') {
            this.api.declineAttendance(attendance.id).then( updatedRole => {
                this.occasions.update(updatedRole);
                this.set('model', {filter: this.model.filter, occasions: this.occasions.filter(this.model.filter)});
            })
            .catch( error => {
                console.log(`Failed revoking substitution of id ${myId} for id ${attendance.id}:`, error);
            });
        }
        console.log(`Change substitution on id ${attendance.id} for ${this.application.me} to ${changeType}`);
    }
}
