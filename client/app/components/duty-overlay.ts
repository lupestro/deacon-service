import Component from '@ember/component';
import { action } from '@ember/object';

export default class DutyOverlay extends Component {
    tagName = "";
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

