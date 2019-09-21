import Component from '@ember/component';
import { action } from '@ember/object';
import { classNames } from '@ember-decorators/component';

@classNames('duty-overlay')
export default class DutyOverlay extends Component {
    submission!: Function;
    closure!: Function;

    @action 
    submitAction() {
        this.submission();
    }

    @action 
    closeAction() {
        this.closure();
    }
}

