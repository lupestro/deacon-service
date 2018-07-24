import Controller from '@ember/controller';
import LocalService from '../services/local';
import { service } from '@ember-decorators/service';

export default class ApplicationController extends Controller {
    @service local! : LocalService;
    get me() {
        let result = this.local.me;
        if (!this.watchableMe) {
            this.set('watchableMe', result);
        }
        return result; 
    }
    set me(value: string) {
        this.local.me = value;
        this.set('watchableMe', value);
    }
    watchableMe!: string;
}

declare module '@ember/controller' {
    interface Registry {
        'application': ApplicationController;
    }
}
