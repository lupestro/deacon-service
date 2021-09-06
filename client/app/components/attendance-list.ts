import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type { Occasion, Role, Attendance } from 'deacon-dash/services/occasions';
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

interface AttendanceListArgs {
    sourceData : Occasion[];
    showNames : boolean;
    clickType? : string;
    holdType? : string;
    permit? : Function;
    update : Function;
};
export default class AttendanceList extends Component<AttendanceListArgs> {
    rule!: AttendanceRule; // ???
    @tracked overlay: Overlay = OVERLAYS['empty'];
    
    @action 
    clicked(role: Role, occasion: Occasion, attendance: Attendance) {
        if (this.overlay.type !== "empty") {
            this.overlay = OVERLAYS["empty"];
        } else {
            const actualClickType = this.args.permit ? 
                this.args.permit(role, occasion, attendance, this.args.clickType) : 
                this.args.clickType;
            if (actualClickType && actualClickType != 'empty')  {
                let overlay = Object.assign({}, OVERLAYS[actualClickType]);
                overlay.attendance = attendance.id;
                this.overlay = overlay;
            }
        }
    }

    @action 
    held(role: Role, occasion: Occasion, attendance: Attendance) {
        if (this.overlay.type !== "empty") {
            this.overlay = OVERLAYS["empty"];
        } else {
            const actualHoldType = this.args.permit ? 
                this.args.permit(role, occasion, attendance, this.args.holdType) : 
                this.args.holdType;
            if (actualHoldType && actualHoldType != 'empty')  {
                let overlay = Object.assign({}, OVERLAYS[actualHoldType]);
                overlay.attendance = attendance.id;
                this.overlay = overlay;
            }
        }
    }

    @action 
    submitChange(attendance: Attendance) {
        this.args.update(attendance, this.overlay.type);
        this.overlay = OVERLAYS["empty"];
    }
    
    @action 
    cancelChange() {
        this.overlay = OVERLAYS["empty"];
    }

}