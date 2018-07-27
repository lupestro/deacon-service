
import Controller from '@ember/controller';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default class RosterController extends Controller.extend(RecognizerMixin, {
    recognizers: 'pan tap press'
}) {

}