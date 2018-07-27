import Component from '@ember/component';
//import {classNames} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';


export default class SelectionBar extends Component.extend( RecognizerMixin, {
    classNames: ['selection-bar','footer'],
    recognizers: 'tap press'
}) {}