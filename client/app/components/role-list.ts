import Component from '@ember/component';
import { classNames, tagName } from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { action } from '@ember/object';

type Overlay = {
    role: number;
    type: string;
    title: string;
    icon: string;
    icontype: string;
};

const OVERLAYS : {[name: string]: Overlay } = {
    empty: {role: -1, type: "empty", title: "", icon: "", icontype: ""},
    confirm: {role: 0, type: "confirm", title: "Confirm", icon: "check-circle", icontype: 'confirmed' },
    decline: {role: 0, type: "decline", title: "Decline", icon: "exclamation-triangle", icontype: 'needy' },
    substitute: { role: 0, type: "substitute", title: "Substitute", icon: 'exchange-alt', icontype: 'satisfied' },
    unconfirm: { role: 0, type: "unconfirm", title: "Unconfirm", icon: "circle", icontype: 'unconfirmed' }
};

@classNames('duty-list')
@tagName('main')
export default class RoleList extends Component.extend(
        RecognizerMixin, { recognizers: 'tap long-press' }) {
    clickType!: string;
    holdType!: string;
    update!: Function;
    permit!: Function;

    overlay!: Overlay;

    init() {
        super.init();
        this.overlay = OVERLAYS['empty'];
    }

    didInsertElement() {
        const height = Math.max(document.documentElement ? document.documentElement.clientHeight : 0, window.innerHeight || 0);
        const element = document.getElementById(this.elementId);
        if (element) {
            element.style.height = (height - 170)+ 'px';
        }
    } 
    
    @action 
    clicked(role: Role, occasion: Occasion) {
        if (this.overlay.type !== "empty") {
            this.set('overlay', OVERLAYS['empty']);
        } else {
            const actualClickType = this.permit ? (this.permit)(role, occasion, this.clickType) : this.clickType;
            if (actualClickType && actualClickType != 'empty')  {
                let overlay = Object.assign({}, OVERLAYS[actualClickType]);
                overlay.role = role.id;
                this.set('overlay', overlay);
            }
        }
    }

    @action 
    held(role: Role, occasion: Occasion) {
        if (this.overlay.type !== "empty") {
            this.set('overlay', OVERLAYS['empty']);
        } else {
            const actualHoldType = this.permit ? (this.permit)(role, occasion, this.holdType) : this.holdType;
            if (actualHoldType && actualHoldType != 'empty')  {
                let overlay = Object.assign({}, OVERLAYS[actualHoldType]);
                overlay.role = role.id;
                this.set('overlay', overlay);    
            }
        }
    }

    @action 
    submitChange(role: Role) {
        (this.update)(role, this.overlay.type);
        this.set('overlay', OVERLAYS['empty']);
    }

    @action 
    cancelChange() {
        this.set('overlay', OVERLAYS['empty']);
    }
}