import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class RosterList extends Component {

    @action
    inserted(element:HTMLElement) {
        if (element) {
            const height = Math.max(document.documentElement ? document.documentElement.clientHeight : 0, window.innerHeight || 0);
            element.style.height = `${height - 210}px`;
        }
    } 
}