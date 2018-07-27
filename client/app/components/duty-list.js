import Component from '@ember/component';
//import { classNames } from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default class DutyList extends Component.extend(RecognizerMixin, {
    classNames: ['duty-list'],
    recognizers: "tap press"
}) {}