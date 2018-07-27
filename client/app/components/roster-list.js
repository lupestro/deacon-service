import Component from '@ember/component';
//import {classNames} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default class RosterList extends Component.extend( RecognizerMixin, {
    classNames: ['roster-list'],
    recognizers: 'tap press'
}) {}