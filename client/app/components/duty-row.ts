import Component from '@ember/component';
import { classNames, className } from '@ember-decorators/component';
import { computed } from '@ember/object';

@classNames('duty-row')
export default class DutyRow extends Component {
    duty!: Duty;
    clicked!: Function;
    held!: Function;

    @className('historical')
    @computed('duty') 
    get historical() 
    {
        return this.duty.historical;
    } 

    tap() {
        (this.clicked)();
    }

    longPress() {
        (this.held)();
    }   
}