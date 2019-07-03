import Component from '@ember/component';
import { action } from '@ember/object';

export default class NavigationItem extends Component {
    tagName = '';
    itemclick! : Function;
    itempress! : Function;

    @action
    pressIfAvailable() {
        if (this.itempress) {
            this.itempress();
        }
    }
}