import Component from '@ember/component';
import { action } from '@ember/object';

export default class SearchBar extends Component {
    tagName = "";
    searchtext! : string;
    
    @action 
    clear(){
        this.set('searchtext',"");
    }
};