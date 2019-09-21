import Component from '@ember/component';
import { computed } from '@ember/object';

export default class DutyRow extends Component {
    tagName = '';
    duty!: Duty;
    clicked!: Function;
    held!: Function;

    @computed('duty') 
    get historical() 
    {
        return this.duty.historical;
    } 
}