import { inject as controller } from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import DutiesBaseController from './base';
import ApplicationController from '../application';
import ApiService from '../../services/api';
import OccasionsService from '../../services/occasions';

export default class DutiesMineController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @service api!: ApiService;
    @service occasions!: OccasionsService;

    @action 
    permit(_role: Role, occasion: Occasion, attendance: Attendance, changeType: string) : string {
        if (changeType === 'confirm') {
            if (this.isImminent(occasion.when) && attendance.who_name === this.application.me) {
                if (attendance.type === 'confirmed') {
                    return 'unconfirm';
                } else {
                    return 'confirm';
                }
            } else {
                return 'empty';
            }
        } else {
            if (this.isHistorical(occasion.when) || attendance.who_name !== this.application.me) {
                return 'empty';
            } else {
                if (attendance.type === 'declined') {
                    return 'unconfirm';
                } else {
                    return 'decline';
                }
            }
        }
    }

    @action 
    changeCommitment(attendance: Attendance, changeType: string) {
        if (changeType === 'confirm') {
            this.api.confirmAttendance(attendance.id)
            .then(updatedRole => {
                this.occasions.update(updatedRole);
                this.set('model', {filter: this.model.filter, occasions: this.occasions.filter(this.model.filter)});
            })
            .catch( error => {
                console.log(`Failed confirming attendance for id ${attendance.id}:`, error);
            });
        } else if (changeType === 'unconfirm') {
            this.api.unconfirmAttendance(attendance.id)
            .then(updatedRole => {
                this.occasions.update(updatedRole);
                this.set('model', {filter: this.model.filter, occasions: this.occasions.filter(this.model.filter)});
            })
            .catch( error => {
                console.log(`Failed unconfirming attendance for id ${attendance.id}:`, error);
            });
        } else if (changeType === 'decline') {
            this.api.declineAttendance(attendance.id).then(updatedRole => {
                this.occasions.update(updatedRole);
                this.set('model', {filter: this.model.filter, occasions: this.occasions.filter(this.model.filter)});
            })
            .catch( error => {
                console.log(`Failed declining attendance for id ${attendance.id}:`, error);
            });
        }

        console.log(`Change attendance ${attendance.id} for ${this.application.me} to ${changeType}`);
    }
}
