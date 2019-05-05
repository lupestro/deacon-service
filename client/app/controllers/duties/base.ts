import Controller from '@ember/controller';
import moment from 'moment';

export default class DutiesBaseController extends Controller {
    
    isImminent(when:string) : boolean {
        const sched = moment(when);
        return sched >= moment().startOf('day') && sched < moment().startOf('day').add(8,'days');
    }

    isHistorical(when:string) : boolean {
        return moment(when) < moment().startOf('day');
    }

}
