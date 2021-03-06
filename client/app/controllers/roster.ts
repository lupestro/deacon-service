import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import ApplicationController from './application';
import ApiService from '../services/api';

export default class RosterController extends Controller {
    @controller('application') application! : ApplicationController;
    @service api!: ApiService;
    @tracked searchtext: string = "";
    
    @action 
    update(searchtext: string) {
        this.searchtext = searchtext;
    }

    @action 
    clickReturn (shortname : string | undefined) {
        this.searchtext = "";
        if (typeof shortname === "undefined") {
            this.transitionToRoute('duties.all');
        } else if (this.model.dutytype === 'mine') {
            this.application.me = shortname;
            this.transitionToRoute('duties.mine');
        } else if (this.model.dutytype === 'family') {
            this.application.me = shortname;
            this.transitionToRoute('duties.family');
        } else {
            this.transitionToRoute('duties.any', shortname);
        }
    }

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
