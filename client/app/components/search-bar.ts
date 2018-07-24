import Component from '@ember/component';
import {classNames} from '@ember-decorators/component';
import { action } from '@ember-decorators/object';

@classNames('roster-search')
export default class SearchBar extends Component {
    constructor() {
        super(...arguments);
    }
    searchtext! : string;
    @action
    clear(){
        this.set('searchtext',"");
    }
};