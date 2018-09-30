import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { action } from '@ember-decorators/object';

type Overlay = {
    role: number;
    type: string;
    title: string;
    icon: string;
    icontype: string;
};

const OVERLAYS : {[name: string]: Overlay } = {
    empty: {role: -1, type: "", title: "", icon: "", icontype: ""},
    confirm: {role: 0, type: "confirm", title: "Confirm", icon: "check-circle", icontype: 'confirmed' },
    decline: {role: 0, type: "decline", title: "Decline", icon: "exclamation-triangle", icontype: 'needy' },
    substitute: { role: 0, type: "substitute", title: "Substitute", icon: 'exchange-alt', icontype: 'satisfied' },
    tentative: { role: 0, type: "unconfirm", title: "Unconfirm", icon: "circle", icontype: 'unconfirmed' }
};

@classNames('duty-list')
export default class DutyList extends Component.extend(RecognizerMixin, { recognizers: 'tap long-press' }) {
    clickType!: string;
    holdType!: string;
    action!: Function;

    overlay: Overlay;
    constructor() {
        super(...arguments);
        this.overlay = OVERLAYS['empty'];
    }
    @action clicked(role: Role) {
        if (this.clickType && this.clickType !== 'empty') {
            let overlay = Object.assign({}, OVERLAYS[this.clickType]);
            overlay.role = role.id;
            this.set('overlay', overlay);    
        }
    }
    @action held(role: Role) {
        if (this.holdType && this.holdType !== 'empty') {
            let overlay = Object.assign({}, OVERLAYS[this.holdType]);
            overlay.role = role.id;
            this.set('overlay', overlay);
        }
    }
    @action submit(role: Role) {
        (this.action)(role, this.overlay.type);
        this.set('overlay', OVERLAYS['empty']);
    }
    @action cancel() {
        this.set('overlay', OVERLAYS['empty']);
    }
}