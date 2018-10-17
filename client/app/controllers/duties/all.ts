import { controller } from '@ember-decorators/controller';
import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';

import DutiesBaseController from './base';
import ApplicationController from '../application';
import ApiService from '../../services/api';
import OccasionsService from '../../services/occasions';

export default class DutiesAllController extends DutiesBaseController {
    @controller('application') application! : ApplicationController;
    @service api!: ApiService;
    @service occasions!: OccasionsService;

    _findMyAttendance(me: string, role:Role) {
        return role.attendances.find( attendance => {
            return attendance.who_name === me;
        })
    }

    @action 
    permit( role: Role, occasion: Occasion, actionType: string) : string { 
        let attendance = this._findMyAttendance(this.application.me, role);
        if (actionType === 'confirm') {
            let attendance = this._findMyAttendance(this.application.me, role);
            if (this.isImminent(occasion.when) && attendance) {
                if (attendance.type === 'confirmed') {
                    return 'unconfirm';
                } else {
                    return 'confirm';
                }
            } else {
                return 'empty';
            }
        } else {
            if (this.isHistorical(occasion.when) || !attendance) {
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
    change(role: Role, changeType: string) {
        let attendance = this._findMyAttendance(this.application.me, role);
        if (attendance) {
            if (changeType === 'confirm') {
                this.api.confirmAttendance(attendance.id)
                .then(updatedRole => {
                    this.occasions.update(updatedRole);
                    this.set('model', {filter: this.model.filter, occasions: this.occasions.filter(this.model.filter)});
                })
                .catch( error => {
                    console.log(`Failed confirming attendance for id ${attendance!.id}:`, error);
                });
            } else if (changeType === 'unconfirm') {
                this.api.unconfirmAttendance(attendance.id)
                .then(updatedRole => {
                    this.occasions.update(updatedRole);
                    this.set('model', {filter: this.model.filter, occasions: this.occasions.filter(this.model.filter)});
                })
                .catch( error => {
                    console.log(`Failed unconfirming attendance for id ${attendance!.id}:`, error);
                });
            } else if (changeType === 'decline') {
                this.api.declineAttendance(attendance.id).then(updatedRole => {
                    this.occasions.update(updatedRole);
                    this.set('model', {filter: this.model.filter, occasions: this.occasions.filter(this.model.filter)});
                })
                .catch( error => {
                    console.log(`Failed declining attendance for id ${attendance!.id}:`, error);
                });
            }

            console.log(`Change attendance ${attendance.id} for ${this.application.me} to ${changeType}`);
        }
    }
}
