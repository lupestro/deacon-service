import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
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

interface RoleListArgs {
    sourceData : Occasion[];
    showNames : boolean; 
    clickType : string; 
    holdType : string; 
    permit: Function;
    update : Function;
}

export default class RoleList extends Component<RoleListArgs> {
    @tracked overlay: Overlay = OVERLAYS['empty'];

    @action
    inserted(element: HTMLElement) {
        if (element) {
            const height = Math.max(document.documentElement ? document.documentElement.clientHeight : 0, window.innerHeight || 0);
            element.style.height = (height - 180)+ 'px';
        }
    } 
    
    @action 
    clicked(role: Role, occasion: Occasion) {
        if (this.overlay.type !== "empty") {
            this.overlay = OVERLAYS['empty'];
        } else {
            const actualClickType = this.args.permit ? 
                this.args.permit(role, occasion, this.args.clickType) : 
                this.args.clickType;
            if (actualClickType && actualClickType != 'empty')  {
                let overlay = Object.assign({}, OVERLAYS[actualClickType]);
                overlay.role = role.id;
                this.overlay = overlay;
            }
        }
    }

    @action 
    held(role: Role, occasion: Occasion) {
        if (this.overlay.type !== "empty") {
            this.overlay = OVERLAYS['empty'];
        } else {
            const actualHoldType = this.args.permit ? 
                this.args.permit(role, occasion, this.args.holdType) : 
                this.args.holdType;
            if (actualHoldType && actualHoldType != 'empty')  {
                let overlay = Object.assign({}, OVERLAYS[actualHoldType]);
                overlay.role = role.id;
                this.overlay = overlay;    
            }
        }
    }

    @action 
    submitChange(role: Role) {
        (this.args.update)(role, this.overlay.type);
        this.overlay = OVERLAYS['empty'];
    }

    @action 
    cancelChange() {
        this.overlay = OVERLAYS['empty'];
    }
}