import Controller from '@ember/controller';
import ApplicationController from '../application';
import { controller } from '@ember-decorators/controller';

export class DutiesRoleRules implements RoleRules {
    who: string[];
    constructor(who: string[]) {
        this.who = who;
    }
    anyUnconfirmed(role: Role) : boolean {
        return role.assigned.any( assigned => {
            return !role.confirmed.any(confirmed => {
                return confirmed.who === assigned.who; 
            });
        })
    }
    hasHoles(role: Role) : boolean {
        return role.declined.any( item => {
            return !item.substitute;
        })
    }
    getIconType(role: Role): string {
        if (role.declined.length === 0) {
            return this.anyUnconfirmed(role) ? 'unconfirmed' : 'confirmed';
        } else {
            return this.hasHoles(role) ? 'needy' : 'satisfied';
        }
        return '';
    }
    getIconImage(role: Role): string {
        if (role.declined.length === 0) {
            return this.anyUnconfirmed(role) ? 'circle' : 'check-circle'
        } else {
            return this.hasHoles(role) ? 'exclamation-triangle' : 'exchange-alt'
        }
    }
    _assignedActive(role: Role, who: Attendance) {
        return !role.declined.any (item =>{
            return item.who === who.who ;
        })
    }
    getNames(role: Role): string[] {
        let assigned =  role.assigned.filter( item => {
            return this._assignedActive(role, item) && 
                (
                    this.who.length === 0 || 
                    (!!item.who_name && this.who.includes(item.who_name))
                );
        }).map( item => { 
            return item.who_name ? item.who_name : ''; 
        });
        let confirmed =  role.confirmed.filter( item => {
            return this._assignedActive(role, item) && 
                (
                    this.who.length === 0 || 
                    (!!item.who_name && this.who.includes(item.who_name))
                );
        }).map( item => { 
            return item.who_name ? `\u2713${item.who_name}` : ''; 
        });
        let substituted = role.declined.filter( item => {
            return this.who.length === 0 || 
                (!!item.sub_name && this.who.includes(item.sub_name));
        }).map( item => { 
            if (item.sub_name) {
                return `${item.sub_name} [${item.who_name}]`;
            } else if (item.who_name) {
                return `\u2718'[${item.who_name}]`;
            } else return '';
        });
        return assigned.concat(substituted).concat(confirmed);
    }
    doesRoleMatch(role: Role) : boolean {
        if (this.who.length === 0) {
            return true; 
        }
        return role.assigned.any( item => {
            return !!item.who_name && this.who.includes(item.who_name);
        }) || role.declined.any( item => {
            return (!!item.who_name && this.who.includes(item.who_name)) ||
                (!!item.sub_name && this.who.includes(item.sub_name));
        }) || role.confirmed.any( item => {
            return !!item.who_name && this.who.includes(item.who_name);
        });
    }
}

export default class DutiesBaseController extends Controller {
    @controller('application') application! : ApplicationController;
    constructor() {
        super(...arguments);
    }
    getMatchingOccasions(occasions: Occasion[], rules: RoleRules, who: string[]) : Occasion[] {
        return occasions.filter (occasion => {
            return occasion.roles.any(role => {
                return rules.doesRoleMatch(role, who);
            });
        }).map (occasion => {
            let newocc = Object.assign({}, occasion);
            newocc.roles = occasion.roles.filter(role => {
                return rules.doesRoleMatch(role,who);
            }).map ( role => {
                return Object.assign({}, role);
            })
            return newocc;
        })
    }
}
