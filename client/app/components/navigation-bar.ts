import Component from '@ember/component';
import {classNames, tagName} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

@classNames('selection-bar','footer')
@tagName('nav')
export default class NavigationBar extends Component.extend(
    RecognizerMixin, { recognizers: 'tap long-press' }) {
}