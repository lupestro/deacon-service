import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
    setMe(value : string) {
        this.model.mine = value;
    }
}

declare module '@ember/controller' {
    interface Registry {
        'application': ApplicationController;
    }
}
