import Component from '@ember/component';
import { action } from '@ember-decorators/object';
import { classNames } from '@ember-decorators/component';

@classNames('duty-overlay')
export default class DutyOverlay extends Component {
    submit!: Function;
    close!: Function;

    @action 
    submitAction() {
        (this.get('submit'))();
    }

    @action 
    closeAction() {
        (this.get('close'))();
    }
}

