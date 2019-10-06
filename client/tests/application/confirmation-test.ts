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

    test ('Near to service date (My Duties)', async function(assert) {
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

    test ('Near to service date (Family Duties)', async function(assert) {
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

    test ('My Duties - Far before service or after service', async function(assert) {
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

    test ('Family Duties - Far before service or after service', async function(assert) {
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

    });

    test ('My Duties - Eight days before service', async function(assert){
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

    test ('My Duties - Seven days before service', async function(assert){
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

    test ('My Duties - Six Days before service', async function(assert){
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

    test ('My Duties - After service that day', async function(assert) {
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

    test ('My Duties - The day after service', async function(assert) {
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


});