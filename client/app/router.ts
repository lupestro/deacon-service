import EmberRouter from '@ember/routing/router';
import config from 'deacon-dash/config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

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
  this.route('not-found', { path: '/*path'});
});

export default Router;
