import Component from '@ember/component';
import { classNames, className } from '@ember-decorators/component';

@classNames('roster-row')
export default class RosterRow extends Component {
    selection! : Function;
    model! : Participant;
    @className('alternate') 
    isAlternate : boolean;
    @className('historical')
    isHistorical : boolean;
    constructor() {
        super(...arguments);
        this.isAlternate = this.model.type === 'substitute';
        this.isHistorical = this.model.type === 'historical';
    }
    click() {
        (this.selection)(this.model.short_name);
    }
    tap() {
        (this.selection)(this.model.short_name);
    }
}