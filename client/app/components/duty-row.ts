import Component from '@ember/component';
import { capitalize } from '@ember/string';
import { classNames } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';

@classNames('duty-row')
export default class DutyRow extends Component {
    itemclick! : Function;
    occasion!: Occasion;
    role!: Role; 
    rules!: RoleRules;
    @computed('role')
    get icon() {
        if (this.rules) {
            return this.rules.getIconImage(this.role);
        } else {
            return 'question-circle';
        }
    }
    @computed('role') 
    get icontype () {
        if (new Date() > new Date(this.occasion.when)) {
            return 'disabled';
        } else if (this.rules) {
            return this.rules.getIconType(this.role);
        } else {
            return 'disabled';
        }
    }
    @computed('occasion','role') 
    get type ()
    {
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
    @computed('role')
    get names() {
        return this.rules.getNames(this.role).join(', ');
    }
}