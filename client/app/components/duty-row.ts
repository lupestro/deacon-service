import Component from '@ember/component';
import { capitalize } from '@ember/string';
import { classNames, className } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import moment from 'moment';

@classNames('duty-row')
export default class DutyRow extends Component {
    occasion!: Occasion;
    role!: Role; 
    rules!: RoleRules;
    clicked!: Function;
    held!: Function;

    constructor (){ 
        super(...arguments);
    }

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
        if (this.rules) {
            return this.rules.getIconType(this.role);
        } else {
            return 'disabled';
        }
    }
    @computed('occasion')
    @className('historical')
    get historical() 
    {
        if (moment(this.occasion.when) < moment().startOf('day')) {
            return 'historical';
        } else {
            return '';
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

    tap() {
        (this.clicked)();
    }

    longPress() {
        (this.held)();
    }   
}