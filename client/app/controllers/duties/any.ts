import Controller from '@ember/controller';
import ApplicationController from 'deacon-dash/controllers/application';
import { controller } from '@ember-decorators/controller';

export default class DutiesAnyController extends Controller {
    @controller('application') application! : ApplicationController;
    constructor() {
        super(...arguments);
    }
}
