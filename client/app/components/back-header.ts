import Component from '@ember/component';
import {tagName, classNames} from '@ember-decorators/component';

@tagName('header') 
@classNames('header')
export default class BackHeader extends Component {
    title! : string; // Component parameter
    back! : any;    // Component parameter - action
}