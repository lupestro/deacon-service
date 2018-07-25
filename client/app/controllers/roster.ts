import Controller from '@ember/controller';
import { action, computed } from '@ember-decorators/object';
import { controller, service } from '@ember-decorators/controller';
import ApplicationController from './application';
import ApiService from '../services/api';

export default class RosterController extends Controller {
    @controller('application') application! : ApplicationController;
    @service api!: ApiService;
    searchtext: string;
    constructor() {
        super(...arguments);
        this.searchtext = "";
    }
   
    @action clickReturn (shortname : string | undefined) {
        this.set('searchtext',"");
        if (typeof shortname === "undefined") {
            this.transitionToRoute('duties.all');
        } else if (this.model.dutytype === 'mine') {
            this.application.me = shortname;
            this.transitionToRoute('duties.mine');
        } else {
            this.transitionToRoute('duties.any', shortname);
        }
    }
    @computed('searchtext','application.model.participants') 
    get candidates() : Participant[] {
        if (this.searchtext === "") {
            return this.application.model.participants;
        } else {
            let participants = this.application.model.participants as Participant[];
            return participants.filter(person  => {
                let expr = new RegExp(this.searchtext, 'i');
                return person.short_name.match(expr) || person.full_name.match(expr);
            })
        }
    }
}
