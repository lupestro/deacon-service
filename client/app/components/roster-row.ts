import Component from '@ember/component';

export default class RosterRow extends Component {
    tagName='';
    selection! : Function;
    model! : Participant;

    isAlternate! : boolean;
    isHistorical! : boolean;

    init() {
        super.init();
        this.isAlternate = this.model.type === 'substitute';
        this.isHistorical = this.model.type === 'historical';
    }
}