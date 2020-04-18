import Component from '@glimmer/component';
import { action } from '@ember/object';

interface SearchBarArgs {
    searchtext: string;
    update: Function;
}
export default class SearchBar extends Component<SearchBarArgs> {
    @action 
    changed(event:KeyboardEvent){
        if (event.target && event.target instanceof HTMLInputElement) {
            this.args.update((event.target as HTMLInputElement).value);
        }
    }
    @action 
    clear(){
        this.args.update("");
    }
};