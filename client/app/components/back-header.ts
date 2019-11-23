import Component from '@ember/component';

export default class BackHeader extends Component {
    tagName = "";
    title! : string; // Component parameter
    back! : any;    // Component parameter - action
}