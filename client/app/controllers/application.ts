import Controller from '@ember/controller';
import LocalService from '../services/local';
import { service } from '@ember-decorators/service';

export default class ApplicationController extends Controller {
    @service local! : LocalService;
    get me() {
       return this.local.me; 
    }
    set me(value: string) {
        this.local.me = value;
    }
}

declare module '@ember/controller' {
    interface Registry {
        'application': ApplicationController;
    }
}
