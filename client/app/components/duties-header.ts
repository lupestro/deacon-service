import Component from '@ember/component';
import {tagName, classNames} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

@tagName('header')
@classNames('header')
export default class DutiesHeader extends Component.extend(RecognizerMixin, { recognizers: 'tap press' }) {
}