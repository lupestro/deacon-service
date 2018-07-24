import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';

@classNames('duty-list')
export default class DutyRow extends Component {
    itemclick! : Function;
    sourceData! : Occasion[];
}