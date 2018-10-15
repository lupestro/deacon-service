import DutiesBaseController from './base';
import { action } from '@ember-decorators/object';

export default class DutiesAnyController extends DutiesBaseController {

    @action 
    permit( /* role: Role, occasion: Occasion, attendance: Attendance, actionType: string */) : string { 
        return 'empty'; 
    }

    @action 
    change(/*attendance: Attendance, changeType: string*/) {
        // Do nothing - this will never be called
    }
}
