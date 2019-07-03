import Component from '@ember/component';
import { classNames, tagName } from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { action } from '@ember/object';


declare global {
    type Overlay = {
        attendance: number;
        type: string;
        title: string;
        icon: string;
        icontype: string;
        live: boolean;
    };
    type Duty  = {
        iconimage: string;
        icontype: string;
        type: string;
        subtype: string;
        names: string;
        historical: boolean;
    };
    type AttendanceRule = {
        assignee: string[];
        substitute: string[];
        type: string;
    };
}

const OVERLAYS : {[name: string]: Overlay } = {
    empty: {attendance: -1, type: "empty", title: "", icon: "", icontype: "", live: false},
    confirm: {attendance: 0, type: "confirm", title: "Confirm", icon: "check-circle", icontype: 'confirmed', live: true },
    decline: {attendance: 0, type: "decline", title: "Decline", icon: "exclamation-triangle", icontype: 'needy' , live: true},
    substitute: { attendance: 0, type: "substitute", title: "Substitute", icon: 'exchange-alt', icontype: 'satisfied', live: true},
    unconfirm: { attendance: 0, type: "unconfirm", title: "Unconfirm", icon: "circle", icontype: 'unconfirmed', live: true },
    revoke: { attendance: 0, type: "revoke", title: "Revoke", icon: "exclamation-triangle", icontype: 'needy', live: true}
};

@classNames('duty-list')
@tagName('main')
export default class AttendanceList extends Component.extend(
        RecognizerMixin, { recognizers: 'tap long-press' }) {
    rule!: AttendanceRule;
    clickType!: string;
    holdType!: string;
    update!: Function;
    permit!: Function;

    overlay!: Overlay;

    init() {
        super.init();
        this.overlay = OVERLAYS['empty'];
    }

    didInsertElement() {
        const height = Math.max(document.documentElement? document.documentElement.clientHeight : 0, window.innerHeight || 0);
        const element = document.getElementById(this.elementId);
        if (element) {
            element.style.height = (height - 170)+ 'px';
        }
    } 
    
    @action 
    clicked(role: Role, occasion: Occasion, attendance: Attendance) {
        if (this.overlay.type !== "empty") {
            this.set('overlay', OVERLAYS['empty']);
        } else {
            const actualClickType = this.permit ? (this.permit)(role, occasion, attendance, this.clickType) : this.clickType;
            if (actualClickType && actualClickType != 'empty')  {
                let overlay = Object.assign({}, OVERLAYS[actualClickType]);
                overlay.attendance = attendance.id;
                this.set('overlay', overlay);
            }
        }
    }

    @action 
    held(role: Role, occasion: Occasion, attendance: Attendance) {
        if (this.overlay.type !== "empty") {
            this.set('overlay', OVERLAYS['empty']);
        } else {
            const actualHoldType = this.permit ? (this.permit)(role, occasion, attendance, this.holdType) : this.holdType;
            if (actualHoldType && actualHoldType != 'empty')  {
                let overlay = Object.assign({}, OVERLAYS[actualHoldType]);
                overlay.attendance = attendance.id;
                this.set('overlay', overlay);    
            }
        }
    }

    @action 
    submitChange(attendance: Attendance) {
        (this.update)(attendance, this.overlay.type);
        this.set('overlay', OVERLAYS['empty']);
    }
    
    @action 
    cancelChange() {
        this.set('overlay', OVERLAYS['empty']);
    }

}