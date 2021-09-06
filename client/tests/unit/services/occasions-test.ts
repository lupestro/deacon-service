import ApplicationInstance from '@ember/application/instance';
import Service from '@ember/service';

import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import type { OccasionData, RoleData } from 'deacon-dash/services/api';
import OccasionsService from 'deacon-dash/services/occasions';
import type {
  ParticipantIdMap,
  FilterRule,
} from 'deacon-dash/services/occasions';

const FLINTSTONE_PARTY_ROLES: RoleData[] = [
  {
    id: 11,
    type: 'Mover',
    required: 20,
    assigned: [{ id: 112, who: 4 }],
    declined: [],
    confirmed: [{ id: 111, who: 1 }],
  },
  {
    id: 12,
    type: 'Planner',
    required: 2,
    assigned: [{ id: 121, who: 3 }],
    declined: [],
    confirmed: [{ id: 122, who: 2 }],
  },
  {
    id: 13,
    type: 'Leader',
    required: 1,
    assigned: [],
    declined: [],
    confirmed: [{ id: 131, who: 7 }],
  },
];
const FLINTSTONE_PLAYGROUP_ROLES: RoleData[] = [
  {
    id: 21,
    type: 'Kid',
    required: 5,
    assigned: [
      { id: 211, who: 5 },
      { id: 212, who: 6 },
    ],
    declined: [],
    confirmed: [],
  },
  {
    id: 22,
    type: 'Mom',
    required: 2,
    assigned: [
      { id: 221, who: 2 },
      { id: 222, who: 3 },
    ],
    declined: [],
    confirmed: [],
  },
];
const FLINTSTONE_WORK_ROLES: RoleData[] = [
  {
    id: 31,
    type: 'DinoOperator',
    required: 2,
    assigned: [{ id: 311, who: 7 }],
    declined: [{ id: 312, who: 4, substitute: 1 }],
    confirmed: [],
  },
  {
    id: 32,
    type: 'Boss',
    required: 1,
    assigned: [{ id: 321, who: 7 }],
    declined: [],
    confirmed: [],
  },
];

const FLINTSTONE_OCCASIONS: OccasionData[] = [
  {
    id: 1,
    when: '0032-07-01T19:00:00',
    type: 'Party',
    subtype: 'Christmas',
    roles: FLINTSTONE_PARTY_ROLES,
  },
  {
    id: 2,
    when: '0032-07-04T09:00:00',
    type: 'Playgroup',
    subtype: '',
    roles: FLINTSTONE_PLAYGROUP_ROLES,
  },
  {
    id: 3,
    when: '0032-08-12T08:00:00',
    type: 'Work',
    subtype: 'Morning',
    roles: FLINTSTONE_WORK_ROLES,
  },
];
const EMPTY_OCCASIONS: OccasionData[] = [];

const PARTICIPANT_IDS: ParticipantIdMap = {
  1: 'Fred',
  2: 'Wilma',
  3: 'Betty',
  4: 'Barney',
  5: 'Pebbles',
  6: 'BamBam',
  7: 'Prufrock',
};
const CONFIRMED_FILTER: FilterRule = {
  assignee: [],
  substitute: [],
  involved: [],
  type: 'confirmed',
};
const BETTY_FILTER: FilterRule = {
  assignee: ['Betty'],
  substitute: [],
  involved: [],
  type: '',
};
//const FRED_SUB_FILTER : FilterRule = { assignee:[], substitute:['Fred'], involved:[], type: ''};
const FLINTSTONE_FILTER: FilterRule = {
  assignee: ['Fred', 'Wilma', 'Pebbles'],
  substitute: [],
  involved: [],
  type: '',
};
//const FRED_SUB_BARNEY_FILTER: FilterRule = { assignee: ['Barney'], substitute:['Fred'], involved:[], type: ''};
const FRED_CONFIRMED_FILTER: FilterRule = {
  assignee: ['Fred'],
  substitute: [],
  involved: [],
  type: 'confirmed',
};

function registerApi(owner: ApplicationInstance, data: OccasionData[]) {
  owner.register(
    'service:api',
    // eslint-disable-next-line ember/no-classic-classes
    Service.extend({
      getOccasions(): Promise<OccasionData[]> {
        return Promise.resolve(data);
      },
      /* mock code */
    })
  );
}
module('Unit | Service | occasions', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('with empty data', async function (assert) {
    registerApi(this.owner, EMPTY_OCCASIONS);
    let service: OccasionsService = this.owner.lookup('service:occasions');
    service.seed(PARTICIPANT_IDS);
    const results = await service.refresh();
    assert.equal(results.length, 0, 'We should get no data');
    const filtered = service.filter(CONFIRMED_FILTER);
    assert.equal(filtered.length, 0, "We shouldn't have filtered data");
    assert.throws(() => {
      service.update(FLINTSTONE_PARTY_ROLES[0]);
    }, 'Cannot update occasions - no occasion with that role found');
  });

  test('yabba-dabba-confirmed data', async function (assert) {
    registerApi(this.owner, FLINTSTONE_OCCASIONS);
    let service: OccasionsService = this.owner.lookup('service:occasions');
    service.seed(PARTICIPANT_IDS);
    const results = await service.refresh();
    assert.equal(results.length, 3, 'We should get three occasions');

    let filtered = service.filter(CONFIRMED_FILTER);
    assert.equal(
      filtered.length,
      1,
      'We should only have confirmation for the party'
    );
    if (filtered.length > 0) {
      assert.equal(
        filtered[0].roles.length,
        3,
        'We should have confirmations for all three roles for the party'
      );
      if (filtered[0].roles.length > 0) {
        assert.equal(
          filtered[0].roles[0].attendances.length,
          1,
          'We should have only one attendance in the role'
        );
        assert.equal(
          filtered[0].roles[0].attendances[0].type,
          'confirmed',
          'It had better be a confirmed role'
        );
      }
      if (filtered[0].roles.length > 1) {
        assert.equal(
          filtered[0].roles[1].attendances.length,
          1,
          'we shuould have only one attendance for the second role'
        );
        assert.equal(
          filtered[0].roles[1].attendances[0].type,
          'confirmed',
          'It had better be a confirmed role'
        );
      }
      if (filtered[0].roles.length > 2) {
        assert.equal(
          filtered[0].roles[2].attendances.length,
          1,
          'we shuould have only one attendance for the second role'
        );
        assert.equal(
          filtered[0].roles[2].attendances[0].type,
          'confirmed',
          'It had better be a confirmed role'
        );
      }
    }
  });
  test('yabba-dabba-betty data', async function (assert) {
    registerApi(this.owner, FLINTSTONE_OCCASIONS);
    let service: OccasionsService = this.owner.lookup('service:occasions');
    service.seed(PARTICIPANT_IDS);
    const results = await service.refresh();
    assert.equal(results.length, 3, 'We should get three occasions');

    let filtered = service.filter(BETTY_FILTER);
    assert.equal(
      filtered.length,
      2,
      'Betty has two roles - a Mom for the playgroup and a planner for the party'
    );
    if (filtered.length > 0) {
      assert.equal(filtered[0].type, 'Party');
      assert.equal(filtered[0].roles.length, 1);
      assert.equal(filtered[0].roles[0].attendances.length, 1);
      assert.equal(filtered[0].roles[0].attendances[0].who, 3);
    }
    if (filtered.length > 1) {
      assert.equal(filtered[1].type, 'Playgroup');
      assert.equal(filtered[1].roles.length, 1);
      assert.equal(filtered[1].roles[0].attendances.length, 1);
      assert.equal(filtered[1].roles[0].attendances[0].who, 3);
    }
  });

  test('yabba-dabba-flintstone data', async function (assert) {
    registerApi(this.owner, FLINTSTONE_OCCASIONS);
    let service: OccasionsService = this.owner.lookup('service:occasions');
    service.seed(PARTICIPANT_IDS);
    const results = await service.refresh();
    assert.equal(results.length, 3, 'We should get three occasions');

    let filtered = service.filter(FLINTSTONE_FILTER);
    assert.equal(
      filtered.length,
      2,
      'There are flintstones assigned to the party and the playgroup, but Fred is only substituting for Barney at work'
    );
    if (filtered.length > 0) {
      assert.equal(filtered[0].type, 'Party');
      assert.equal(filtered[0].roles.length, 2);
      assert.equal(filtered[0].roles[0].attendances.length, 1);
      assert.equal(filtered[0].roles[0].attendances[0].who, 1);
      assert.equal(filtered[0].roles[1].attendances.length, 1);
      assert.equal(filtered[0].roles[1].attendances[0].who, 2);
    }
    if (filtered.length > 1) {
      assert.equal(filtered[1].type, 'Playgroup');
      assert.equal(filtered[1].roles.length, 2);
      assert.equal(filtered[1].roles[0].attendances.length, 1);
      assert.equal(filtered[1].roles[0].attendances[0].who, 5);
      assert.equal(filtered[1].roles[1].attendances.length, 1);
      assert.equal(filtered[1].roles[1].attendances[0].who, 2);
    }
  });

  test('yabba-dabba-combo data', async function (assert) {
    registerApi(this.owner, FLINTSTONE_OCCASIONS);
    let service: OccasionsService = this.owner.lookup('service:occasions');
    service.seed(PARTICIPANT_IDS);
    const results = await service.refresh();
    assert.equal(results.length, 3, 'We should get three occasions');

    let filtered = service.filter(FRED_CONFIRMED_FILTER);
    assert.equal(
      filtered.length,
      1,
      'Fred is only confirmed as a mover at the party'
    );
    if (filtered.length > 0) {
      assert.equal(filtered[0].type, 'Party');
      assert.equal(filtered[0].roles.length, 1);
      assert.equal(filtered[0].roles[0].type, 'Mover');
      assert.equal(filtered[0].roles[0].attendances.length, 1);
      assert.equal(filtered[0].roles[0].attendances[0].who, 1);
    }
  });
});
