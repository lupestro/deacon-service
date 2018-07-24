import Component from '@ember/component';
import {classNames} from '@ember-decorators/component';

@classNames('roster-row')
export default class RosterRow extends Component {
    selection! : Function;
    model! : Participant;
    constructor() {
        super(...arguments);
    }
    click() {
        (this.selection)(this.model.short_name);
    }
}