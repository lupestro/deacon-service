import Component from '@ember/component';
import { action } from '@ember/object';
//import { htmlSafe } from '@ember/template';

export default class RosterList extends Component {
    tagName = "";

    @action
    inserted(element:HTMLElement) {
        if (element) {
            const height = Math.max(document.documentElement ? document.documentElement.clientHeight : 0, window.innerHeight || 0);
            element.style.height = `${height - 200}px`;
        }
    } 
}