import Component from '@ember/component';
import {tagName, classNames} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

@tagName('header')
@classNames('header')
export default class Header extends Component.extend(RecognizerMixin, { recognizers: 'tap press' }) {
}