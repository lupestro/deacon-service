import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';
import ApplicationController from './application';
import { controller } from '@ember-decorators/controller';

export default class RosterController extends Controller {
    @controller('application') application! : ApplicationController;
    title: string;
    constructor() {
        super(...arguments);
        this.title = 'Duties';
    }
    @action clickReturn (shortname : string | undefined) {
        if (typeof shortname === "undefined") {
            this.transitionToRoute('duties.all');
        } else if (this.model.dutytype === 'mine') {
            this.application.setMe(shortname);
            this.transitionToRoute('duties.mine');
        } else {
            this.transitionToRoute('duties.any', shortname);
        }
    }
    @action incrementalSearch(searchstring: string) {

    }
}
