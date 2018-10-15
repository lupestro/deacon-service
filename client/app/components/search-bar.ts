import Component from '@ember/component';
import {classNames} from '@ember-decorators/component';
import { action } from '@ember-decorators/object';

@classNames('search-bar')
export default class SearchBar extends Component {
    searchtext! : string;

    constructor() {
        super(...arguments);
    }

    @action
    clear(){
        this.set('searchtext',"");
    }
};