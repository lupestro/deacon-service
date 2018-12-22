import Application from 'deacon-dash/app';
import config from 'deacon-dash/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
