import Component from '@ember/component';
import {tagName, classNames} from '@ember-decorators/component';

@tagName('header') 
@classNames('header')
export default class DutiesHeader extends Component {
    title! : string; // Component parameter
    icon! : string; // Component parameter
    iconclick! : any;    // Component parameter - action
}