import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { visit, click, triggerEvent } from '@ember/test-helpers';


let rowSelector = function(when: string, what: string, who: string) {
    const occasionSelector = `.sub-header[data-test="${when}"]`;
    return occasionSelector + ` ~ .duty-row-wrapper .duty-row[data-test-type="${what}"][data-test-names="${who}"]`;
};

module('Application | Confirmation', function(hooks) {
    setupApplicationTest(hooks);
    setupMirage(hooks);

    test('Overlay dismissal', async function(assert) {
        this.owner.lookup('service:local').me = "Joe";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");
        let selector = rowSelector("2019-10-08T14:00:00.000Z", "DoD", "Joe");
        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});
        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();
    });

    test ('Near service date -- yes (My Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Joe";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");
        let selector = rowSelector("2019-10-08T14:00:00.000Z", "DoD", "Joe");
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});
        await click('.duty-overlay [data-test="no"]')
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});
        await click('.duty-overlay [data-test="yes"]')
        assert.dom(selector).hasAttribute("data-test-icon", "confirmed");
        
    });

    test ('Near service date -- yes (Family Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Joe";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Family"]',"tap");
        assert.dom('.header-title').hasText("Family Duties");
        let selector = rowSelector("2019-10-08T14:00:00.000Z", "DoD", "Joe");
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});
        await click('.duty-overlay [data-test="no"]')
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});
        await click('.duty-overlay [data-test="yes"]')
        assert.dom(selector).hasAttribute("data-test-icon", "confirmed");
        
    });

    test ('Near service date -- yes (All Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Joe";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        let selector = rowSelector("2019-10-08T14:00:00.000Z", "DoD", "Joe");
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});
        await click('.duty-overlay [data-test="no"]')
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});
        await click('.duty-overlay [data-test="yes"]')
        selector = rowSelector("2019-10-08T14:00:00.000Z", "DoD", "✓Joe");
        assert.dom(selector).hasAttribute("data-test-icon", "confirmed");
    });

    test ('Near service date -- no (Any Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Joe";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Any"]',"tap");
        assert.dom('.header-title').hasText("Roster");
        await triggerEvent('[data-test="Joe"]', "tap");

        let selector = rowSelector("2019-10-08T14:00:00.000Z", "DoD", "Joe");
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        
    });

    test ('Far before service or after service date -- no (My Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Pearl";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");

        let pastSelector = rowSelector("2019-10-01T14:00:00.000Z", "Communion", "Pearl");
        assert.dom(pastSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(pastSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        

        let futureSelector = rowSelector("2019-10-22T14:00:00.000Z", "DoD", "Pearl");
        assert.dom(futureSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(futureSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        
    });

    test ('Far before service or after service date -- no (Family Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Pearl";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");

        await triggerEvent('[data-test="Family"]',"tap");
        assert.dom('.header-title').hasText("Family Duties");

        let pastSelector = rowSelector("2019-10-01T14:00:00.000Z", "Communion", "Pearl");
        assert.dom(pastSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(pastSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        

        let futureSelector = rowSelector("2019-10-22T14:00:00.000Z", "DoD", "Pearl");
        assert.dom(futureSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(futureSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        
        
    });

    test ('Far before service or after service date -- no (All Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Pearl";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        let pastSelector = rowSelector("2019-10-01T14:00:00.000Z", "Communion", "Betty, Pearl");
        assert.dom(pastSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(pastSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        

        let futureSelector = rowSelector("2019-10-22T14:00:00.000Z", "DoD", "Pearl");
        assert.dom(futureSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(futureSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        

    });
    test ('Eight days before service -- no (My Duties)', async function(assert){
        this.owner.lookup('service:local').me = "Barney";
        this.owner.lookup('service:api').now = "2019-10-07T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");

        let borderlineSelector = rowSelector("2019-10-15T14:00:00.000Z", "DoD", "Barney");
        assert.dom(borderlineSelector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(borderlineSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        
        await triggerEvent(borderlineSelector, 'tap');
    });

    test ('Seven days before service -- yes (My Duties)', async function(assert){
        this.owner.lookup('service:local').me = "Barney";
        this.owner.lookup('service:api').now = "2019-10-08T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");

        let borderlineSelector = rowSelector("2019-10-15T14:00:00.000Z", "DoD", "Barney");
        assert.dom(borderlineSelector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(borderlineSelector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});        
        await triggerEvent(borderlineSelector, 'tap');
    });

    test ('Six days before service -- yes (My Duties)', async function(assert){
        this.owner.lookup('service:local').me = "Barney";
        this.owner.lookup('service:api').now = "2019-10-09T14:00:00.000Z";
        await visit('/');
        assert.dom('.header-title').hasText("All Duties");

        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");

        let borderlineSelector = rowSelector("2019-10-15T14:00:00.000Z", "DoD", "Barney");
        assert.dom(borderlineSelector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(borderlineSelector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});        
        await triggerEvent(borderlineSelector, 'tap');
    });

    test ('After service that day -- yes (My Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Joe";
        this.owner.lookup('service:api').now = "2019-10-08T23:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");
        let selector = rowSelector("2019-10-08T14:00:00.000Z", "DoD", "Joe");
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});        
        await triggerEvent(selector, 'tap');
        
    });

    test ('The day after service -- no (My Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Joe";
        this.owner.lookup('service:api').now = "2019-10-09T08:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Me"]',"tap");
        assert.dom('.header-title').hasText("My Duties");
        let selector = rowSelector("2019-10-08T14:00:00.000Z", "DoD", "Joe");
        assert.dom(selector).hasAttribute("data-test-icon", "unconfirmed");

        await triggerEvent(selector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        
        await triggerEvent(selector, 'tap');        
    });

    test ('Near service date, family member -- no (Family Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Pearl";
        this.owner.lookup('service:api').now = "2019-10-15T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");
        await triggerEvent('[data-test="Family"]',"tap");
        assert.dom('.header-title').hasText("Family Duties");

        let futureSelector = rowSelector("2019-10-22T14:00:00.000Z", "Baptism", "Sam");
        assert.dom(futureSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(futureSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        
    });

    test ('Near service date, somebody else -- no (All Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Pearl";
        this.owner.lookup('service:api').now = "2019-10-15T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");

        let futureSelector = rowSelector("2019-10-22T14:00:00.000Z", "Baptism", "Sam, Tex");
        assert.dom(futureSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(futureSelector, 'tap');
        assert.dom('.duty-overlay').doesNotExist();        
    });

    test ('Near service date, line shared with somebody else -- yes (All Duties)', async function(assert) {
        this.owner.lookup('service:local').me = "Sam";
        this.owner.lookup('service:api').now = "2019-10-15T14:00:00.000Z";

        await visit('/');
        assert.dom('.header-title').hasText("All Duties");

        let futureSelector = rowSelector("2019-10-22T14:00:00.000Z", "Baptism", "Sam, Tex");
        assert.dom(futureSelector).hasAttribute("data-test-icon", "unconfirmed");
        await triggerEvent(futureSelector, 'tap');
        assert.dom('.duty-overlay').exists({count:1});        
    });

});