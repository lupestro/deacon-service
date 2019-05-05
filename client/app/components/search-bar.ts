import Component from '@ember/component';
import {classNames} from '@ember-decorators/component';
import { action } from '@ember/object';

@classNames('search-bar')
export default class SearchBar extends Component {
    searchtext! : string;

    @action
    clear(){
        this.set('searchtext',"");
    }
};