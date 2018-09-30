import Component from '@ember/component';
import {classNames} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

@classNames('selection-bar','footer')
export default class SelectionBar extends Component.extend(RecognizerMixin, { recognizers: 'tap long-press' }) {
}