declare module "ember-load-initializers" {
    import Ember from 'ember';
    export default function loadInitializers (app: Readonly<typeof Ember.Application>, prefix: string) : void;
}