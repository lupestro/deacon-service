import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';

@classNames('sub-header')
export default class SubHeader extends Component {
    title! : string;
}