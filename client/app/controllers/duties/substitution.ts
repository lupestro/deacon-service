import Controller from '@ember/controller';
import ApplicationController from '../application';
import { controller } from '@ember-decorators/controller';

export default class DutiesSubstitutionController extends Controller {
    @controller('application') application! : ApplicationController;
    constructor() {
        super(...arguments);
    }
}
