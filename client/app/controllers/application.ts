import Controller from '@ember/controller';
import LocalService from '../services/local';
import { service } from '@ember-decorators/service';

export default class ApplicationController extends Controller {
    @service local! : LocalService;
    setMe(value : string) {
        this.local.me = value;
        this.model.me = value;
    }
}

declare module '@ember/controller' {
    interface Registry {
        'application': ApplicationController;
    }
}
