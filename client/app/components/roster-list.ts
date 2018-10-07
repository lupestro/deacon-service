import Component from '@ember/component';
import {classNames} from '@ember-decorators/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

@classNames('roster-list')
export default class RosterList extends Component.extend(RecognizerMixin, { recognizers: 'tap press' }) {
    didInsertElement() {
        const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const element = document.getElementById(this.elementId);
        if (element) {
            element.style.height = (height - 190)+ 'px';
        }
    } 
}