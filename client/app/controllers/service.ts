import Controller from '@ember/controller';

export default class ServiceController extends Controller {
}
declare module '@ember/controller' {
    interface Registry {
        'service': ServiceController;
    }
}
