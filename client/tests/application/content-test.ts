import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import defaultScenario from '../../mirage/scenarios/default';
import { visit, triggerEvent } from '@ember/test-helpers';

// eslint-disable-next-line no-undef
let allDutiesContentCheck = function (assert: Assert) {
  assert.dom('.sub-header').exists({ count: 5 });

  let occasionSelector = '.sub-header[data-test="2019-10-01T12:30:00.000Z"]';
  assert.dom(occasionSelector).hasText('October 01, 2019 08:30');
  let rowSelector = occasionSelector;

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-type', 'DoD');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-names', 'Pebbles');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-type', 'Communion');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-subtype', 'Downstairs');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-names', 'Fred');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper';
  assert.dom(rowSelector + '.duty-row').doesNotExist();

  occasionSelector = '.sub-header[data-test="2019-10-01T14:00:00.000Z"]';
  assert.dom(occasionSelector).hasText('October 01, 2019 10:00');
  rowSelector = occasionSelector;

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-type', 'DoD');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-names', 'Pebbles');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-type', 'Communion');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-subtype', 'Downstairs');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-names', 'Betty, Pearl');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-type', 'Communion');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-subtype', 'Upstairs');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-names', 'Fred');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper';
  assert.dom(rowSelector + '.duty-row').doesNotExist();

  occasionSelector = '.sub-header[data-test="2019-10-08T14:00:00.000Z"]';
  assert.dom(occasionSelector).hasText('October 08, 2019 10:00');
  rowSelector = occasionSelector;

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-type', 'DoD');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-names', 'Joe');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper';
  assert.dom(rowSelector + '.duty-row').doesNotExist();

  occasionSelector = '.sub-header[data-test="2019-10-15T14:00:00.000Z"]';
  assert.dom(occasionSelector).hasText('October 15, 2019 10:00');
  rowSelector = occasionSelector;

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-type', 'DoD');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-names', 'Barney');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper';
  assert.dom(rowSelector + '.duty-row').doesNotExist();

  occasionSelector = '.sub-header[data-test="2019-10-22T14:00:00.000Z"]';
  assert.dom(occasionSelector).hasText('October 22, 2019 10:00');
  rowSelector = occasionSelector;

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-type', 'DoD');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-names', 'Pearl');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
  assert.dom(rowSelector + '.duty-row').exists();
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-type', 'Baptism');
  assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-icon', 'unconfirmed');
  assert
    .dom(rowSelector + '.duty-row')
    .hasAttribute('data-test-names', 'Sam, Tex');

  rowSelector = rowSelector + ' ~ .duty-row-wrapper';
  assert.dom(rowSelector + '.duty-row').doesNotExist();
};

module('Application | Content', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  hooks.beforeEach(() => {
    defaultScenario(server);
  });

  test('All Duties content - no identity', async function (assert) {
    var localService = this.owner.lookup('service:local');
    localService.me = '';
    await visit('/');
    assert.dom('.header-title').hasText('All Duties');
    allDutiesContentCheck(assert);
  });

  test('All Duties content - with identity', async function (assert) {
    var localService = this.owner.lookup('service:local');
    localService.me = 'Barney';
    await visit('/');
    assert.dom('.header-title').hasText('All Duties');
    allDutiesContentCheck(assert);
  });

  test('My Duties content - Fred', async function (assert) {
    var localService = this.owner.lookup('service:local');
    localService.me = 'Fred';
    await visit('/');
    assert.dom('.header-title').hasText('All Duties');
    await triggerEvent('[data-test="Me"]', 'tap');
    assert.dom('.header-title').hasText('My Duties');

    assert.dom('.sub-header').exists({ count: 2 });

    let occasionSelector = '.sub-header[data-test="2019-10-01T12:30:00.000Z"]';
    assert.dom(occasionSelector).hasText('October 01, 2019 08:30');
    let rowSelector = occasionSelector;

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-type', 'Communion');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-subtype', 'Downstairs');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Fred');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper';
    assert.dom(rowSelector + '.duty-row').doesNotExist();

    occasionSelector = '.sub-header[data-test="2019-10-01T14:00:00.000Z"]';
    assert.dom(occasionSelector).hasText('October 01, 2019 10:00');
    rowSelector = occasionSelector;

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-type', 'Communion');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-subtype', 'Upstairs');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Fred');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper';
    assert.dom(rowSelector + '.duty-row').doesNotExist();
  });

  test('Family Duties content - Fred', async function (assert) {
    var localService = this.owner.lookup('service:local');
    localService.me = 'Fred';
    await visit('/');
    assert.dom('.header-title').hasText('All Duties');
    await triggerEvent('[data-test="Family"]', 'tap');
    assert.dom('.header-title').hasText('Family Duties');

    assert.dom('.sub-header').exists({ count: 3 });

    let occasionSelector = '.sub-header[data-test="2019-10-01T12:30:00.000Z"]';
    assert.dom(occasionSelector).hasText('October 01, 2019 08:30');
    let rowSelector = occasionSelector;

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-type', 'DoD');
    assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Pebbles');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-type', 'Communion');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-subtype', 'Downstairs');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Fred');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper';
    assert.dom(rowSelector + '.duty-row').doesNotExist();

    occasionSelector = '.sub-header[data-test="2019-10-01T14:00:00.000Z"]';
    assert.dom(occasionSelector).hasText('October 01, 2019 10:00');
    rowSelector = occasionSelector;

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-type', 'DoD');
    assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Pebbles');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-type', 'Communion');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-subtype', 'Upstairs');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Fred');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper';
    assert.dom(rowSelector + '.duty-row').doesNotExist();

    occasionSelector = '.sub-header[data-test="2019-10-22T14:00:00.000Z"]';
    assert.dom(occasionSelector).hasText('October 22, 2019 10:00');
    rowSelector = occasionSelector;

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-type', 'Baptism');
    assert.dom(rowSelector + '.duty-row').hasAttribute('data-test-subtype', '');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Tex');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper';
    assert.dom(rowSelector + '.duty-row').doesNotExist();
  });

  test('Substitution content', async function (assert) {
    var localService = this.owner.lookup('service:local');
    localService.me = 'Fred';
    await visit('/');
    assert.dom('.header-title').hasText('All Duties');
    await triggerEvent('[data-test="Subs"]', 'tap');
    assert.dom('.header-title').hasText('Substitution');

    assert.dom('.sub-header').doesNotExist();
  });

  test('Any Duties content - Fred', async function (assert) {
    var localService = this.owner.lookup('service:local');
    localService.me = 'Barney';
    await visit('/');
    assert.dom('.header-title').hasText('All Duties');
    await triggerEvent('[data-test="Any"]', 'tap');
    assert.dom('.header-title').hasText('Roster');
    await triggerEvent('[data-test=Fred]', 'tap');
    assert.dom('.header-title').hasText("Fred's Duties");

    assert.dom('.sub-header').exists({ count: 2 });

    let occasionSelector = '.sub-header[data-test="2019-10-01T12:30:00.000Z"]';
    assert.dom(occasionSelector).hasText('October 01, 2019 08:30');
    let rowSelector = occasionSelector;

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-type', 'Communion');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-subtype', 'Downstairs');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Fred');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper';
    assert.dom(rowSelector + '.duty-row').doesNotExist();

    occasionSelector = '.sub-header[data-test="2019-10-01T14:00:00.000Z"]';
    assert.dom(occasionSelector).hasText('October 01, 2019 10:00');
    rowSelector = occasionSelector;

    rowSelector = rowSelector + ' ~ .duty-row-wrapper ';
    assert.dom(rowSelector + '.duty-row').exists();
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-type', 'Communion');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-subtype', 'Upstairs');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-icon', 'unconfirmed');
    assert
      .dom(rowSelector + '.duty-row')
      .hasAttribute('data-test-names', 'Fred');

    rowSelector = rowSelector + ' ~ .duty-row-wrapper';
    assert.dom(rowSelector + '.duty-row').doesNotExist();
  });
});
