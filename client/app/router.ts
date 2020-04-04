import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('duties', function () {
    this.route('mine');
    this.route('family');
    this.route('all');
    this.route('substitution');
    this.route('any', {path:'/any/:shortname'} );
  });
  this.route('service', {path:'/service/:timestamp'});
  this.route('roster', { path: '/roster/:picking'});
  this.route('base', { path: '/' })
  this.route('not-found', { path: '/*path'});
});
