import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { visit, triggerEvent } from '@ember/test-helpers';

module('Application | Navigation', function(hooks) {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    test ('Walk the tabs - no identity', async function(assert) {
        var localService = this.owner.lookup('service:local');
        localService.me = "";
        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("Roster");
        await triggerEvent('[data-test="Back"]', "tap");
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Family"]',"tap");
        assert.dom('.header-title').hasText("Roster");
        await triggerEvent('[data-test="Back"]', "tap");
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Subs"]',"tap");
        assert.dom('.header-title').hasText("Substitution");
        await triggerEvent('[data-test="All"]',"tap");
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Any"]',"tap");
        assert.dom('.header-title').hasText("Roster");
    });

    test ('Walk the tabs - with identity', async function(assert) {
        var localService = this.owner.lookup('service:local');
        localService.me = "Barney";
        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");
        await triggerEvent('[data-test="Family"]',"tap");
        assert.dom('.header-title').hasText("Family Duties");
        await triggerEvent('[data-test="All"]',"tap");
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Subs"]',"tap");
        assert.dom('.header-title').hasText("Substitution");
        await triggerEvent('[data-test="Any"]',"tap");
        assert.dom('.header-title').hasText("Roster");
    });

    test ('Establish identity (My Duties)', async function(assert) {
        var localService = this.owner.lookup('service:local');
        localService.me = "";
        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("Roster");
        await triggerEvent('[data-test="Barney"]',"tap");
        assert.dom('.header-title').hasText("My Duties");
        await triggerEvent('[data-test="Family"]',"tap");
        assert.dom('.header-title').hasText("Family Duties");
        await triggerEvent('[data-test="All"]',"tap");
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Subs"]',"tap");
        assert.dom('.header-title').hasText("Substitution");
        await triggerEvent('[data-test="Any"]',"tap");
        assert.dom('.header-title').hasText("Roster");
    });

    test ('Establish identity (Family Duties)', async function(assert) {
        var localService = this.owner.lookup('service:local');
        localService.me = "";
        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Family"]',"tap");
        assert.dom('.header-title').hasText("Roster");
        await triggerEvent('[data-test="Barney"]', "tap");
        assert.dom('.header-title').hasText("Family Duties");
        await triggerEvent('[data-test="All"]',"tap");
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Subs"]',"tap");
        assert.dom('.header-title').hasText("Substitution");
        await triggerEvent('[data-test="Any"]',"tap");
        assert.dom('.header-title').hasText("Roster");
    });

    test ('Any Duties - without identity', async function(assert) {
        var localService = this.owner.lookup('service:local');
        localService.me = "";
        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Any"]',"tap");
        assert.dom('.header-title').hasText("Roster");
        await triggerEvent('[data-test="Barney"]', "tap");
        assert.dom('.header-title').hasText("Barney's Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("Roster");
        await triggerEvent('[data-test="Back"]',"tap");
        assert.dom('.header-title').hasText("All Duties");
    });

    test ('Any Duties - with identity', async function(assert) {
        var localService = this.owner.lookup('service:local');
        localService.me = "Fred";
        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Any"]',"tap");
        assert.dom('.header-title').hasText("Roster");
        await triggerEvent('[data-test="Barney"]', "tap");
        assert.dom('.header-title').hasText("Barney's Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");
    });

    
});