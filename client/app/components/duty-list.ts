import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

@classNames('duty-list')
export default class DutyList extends Component.extend(RecognizerMixin, { recognizers: 'tap press' }) {
}