import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ApiService from 'deacon-dash/services/api';
import moment from 'moment';

export default class DutiesBaseController extends Controller {
    @service api! : ApiService;    
    isImminent(when:string) : boolean {
        const sched = moment(when);
        return sched >= this.api.today && sched < this.api.today.add(8,'days');
    }

    isHistorical(when:string) : boolean {
        return moment(when) < this.api.today;
    }

}
