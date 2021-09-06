import Component from '@glimmer/component';
import { capitalize } from '@ember/string';
import { inject as service } from '@ember/service';
import ApiService from 'deacon-dash/services/api';
import moment from 'moment';
import type { Occasion, Role } from 'deacon-dash/services/occasions';

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
const CHECKMARK = '\u2713';

interface RoleSummarizerArgs {
    occasion: Occasion,
    role: Role
}
export default class RoleSummarizer extends Component<RoleSummarizerArgs> {
    tagName = '';
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
    
    get attendanceType (): string {
        let summaryType = 'confirmed';
        this.args.role.attendances.forEach( attendance => {
            if (attendance.type === 'declined') {
                if (!attendance.substitute) {
                    summaryType = 'declined-nosub';
                } else if (summaryType != 'declined-nosub') {
                    summaryType = 'declined-sub';
                }
            } else if (attendance.type === 'assigned' && (summaryType.substring(0,8) !== 'declined')) {
                summaryType = 'assigned';
            }  
        });
        return summaryType;
    }

    get names() : string {
        return this.args.role.attendances.map( attendance => {
            if (attendance.type === 'declined') {
                var prefix = attendance.substitute ? attendance.sub_name : BIG_X;
                return `${prefix}[${attendance.who_name}]`
            } else {
                var prefix = attendance.type === 'confirmed'? CHECKMARK : '';
                return `${prefix}${attendance.who_name}`
            }    
        }).join(', ');
    }
}
