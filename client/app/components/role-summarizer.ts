import Component from '@ember/component';
import { computed } from '@ember/object';
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
const CHECKMARK = '\u2713';

export default class RoleSummarizer extends Component {
    tagName = '';
    occasion!: Occasion;
    role!: Role;
    @service api!: ApiService;
    
    @computed('occasion','role') 
    get duty(): Duty {
        return {
            iconimage: ICON_IMAGES[this.attendanceType],
            icontype: ICON_CLASSES[this.attendanceType],
            type: this.type,
            subtype: this.subtype,
            names: this.names,
            historical: (moment(this.occasion.when) < this.api.today)
        };
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
    
    @computed('role.attendances') 
    get attendanceType (): string {
        let summaryType = 'confirmed';
        this.role.attendances.forEach( attendance => {
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

    @computed('role.attendances') 
    get names() : string {
        return this.role.attendances.map( attendance => {
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
