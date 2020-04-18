import Component from '@glimmer/component';
import { capitalize } from '@ember/string';
import { inject as service } from '@ember/service';
import ApiService from 'deacon-dash/services/api';
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

interface AttendanceFormatterArgs {
    occasion: Occasion;
    role: Role;
    attendance: Attendance;
};

export default class AttendanceFormatter extends Component<AttendanceFormatterArgs> {
    @service api!: ApiService;

    get duty(): Duty {
        return {
            iconimage: ICON_IMAGES[this.attendanceType],
            icontype: ICON_CLASSES[this.attendanceType],
            type: this.type,
            subtype: this.subtype,
            names: this.names,
            historical: (moment(this.args.occasion.when) < this.api.today)
        };
    }

    get attendanceType (): string {
        return (this.args.attendance.type !== 'declined') ? this.args.attendance.type : 
            this.args.attendance.substitute ? 'declined-sub' : 'declined-nosub';
    }

    get type(): string{
        if (this.args.role.type === 'dod') {
            return 'DoD';
        }
        if (this.args.occasion.subtype) {
            return capitalize(this.args.occasion.subtype);
        } else {
            return capitalize(this.args.occasion.type);
        }    
    }

    get subtype() {
        switch (this.args.role.type) {
            case 'dod': return '';
            case 'baptism': return '';
            case 'dom': return 'DOM';
            default: return capitalize(this.args.role.type);
        }
    }

    get names() : string {
        if (this.args.attendance.type === 'declined') {
            var prefix = this.args.attendance.substitute ? this.args.attendance.sub_name : BIG_X;
            return `${prefix}[${this.args.attendance.who_name}]`
        } else {
            return `${this.args.attendance.who_name}`
        }
    }
}
