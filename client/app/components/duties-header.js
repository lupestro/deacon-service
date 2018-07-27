import Component from '@ember/component';
//import {tagName, classNames} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default class DutiesHeader extends Component.extend( RecognizerMixin, {
    tagName: 'header',
    classNames: ['header'],
    recognizers: 'tap press'
}) {}