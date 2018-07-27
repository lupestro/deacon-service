import Component from '@ember/component';
import {classNames} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

@classNames('roster-list')
export default class RosterList extends Component.extend(RecognizerMixin, { recognizers: 'tap press' }) {
}