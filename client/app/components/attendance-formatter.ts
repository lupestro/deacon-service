import Component from '@ember/component';
import { computed } from '@ember/object';
import { capitalize } from '@ember/string';
import moment from 'moment';

const ICON_IMAGES : { [attype: string]:string} = {
    'assigned': 'circle',
    'confirmed': 'check-circle',
    'declined-nosub': 'exclamation-triangle',
    'declined-sub': 'exchange-alt'
}
const ICON_CLASSES : { [attype: string]:string} = {
    'assigned': 'unconfirmed',
    'confirmed': 'confirmed',
    'declined-nosub': 'needy',
    'declined-sub': 'satisfied'
}

const BIG_X = "\u2718";

export default class AttendanceFormatter extends Component {
    occasion!: Occasion;
    role!: Role;
    attendance!: Attendance;

    @computed('occasion','role','attendance') 
    get duty(): Duty {
        return {
            iconimage: ICON_IMAGES[this.attendanceType],
            icontype: ICON_CLASSES[this.attendanceType],
            type: this.type,
            subtype: this.subtype,
            names: this.names,
            historical: (moment(this.occasion.when) < moment().startOf('day'))
        };
    }

    @computed('attendance') 
    get attendanceType (): string {
        return (this.attendance.type !== 'declined') ? this.attendance.type : 
            this.attendance.substitute ? 'declined-sub' : 'declined-nosub';
    }

    @computed('role.type','occasion.{type,subtype}') 
    get type(): string{
        if (this.role.type === 'dod') {
            return 'DoD';
        }
        if (this.occasion.subtype) {
            return capitalize(this.occasion.subtype);
        } else {
            return capitalize(this.occasion.type);
        }    
    }

    @computed('role.type')
    get subtype() {
        switch (this.role.type) {
            case 'dod': return '';
            case 'baptism': return '';
            case 'dom': return 'DOM';
            default: return capitalize(this.role.type);
        }
    }

    @computed('attendance') 
    get names() : string {
        if (this.attendance.type === 'declined') {
            var prefix = this.attendance.substitute ? this.attendance.sub_name : BIG_X;
            return `${prefix}[${this.attendance.who_name}]`
        } else {
            return `${this.attendance.who_name}`
        }
    }
}
