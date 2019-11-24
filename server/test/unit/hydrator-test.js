var expect = require('chai').expect;
var hydrator = require('../../src/api/hydrator');

const OCCASION_ITEMS = [
    { name: 'empty input should produce empty output', input:[], output:[]},
    {
        name: 'simple input should produce simple output',
        input: [
            {
                occasion: 1, when: '2018-01-01 12:00', type: 'service', subtype: 'communion',
                role: 1, roletype: 'dod', count: 1,
                attendance: 1, attype: 'assigned', participant: "2", team: 3
            }
        ],
        output:[
            {
                id: 1, when: "2018-01-01 12:00", type: "service", subtype:"communion",
                roles:[
                    {
                        id: 1, type: "dod", required:1,
                        assigned:[
                            {id: 1, team: 3, who: 2}
                        ],
                        confirmed:[],
                        declined:[]
                    }
                ]
            }
        ]
    },
    {
        name: 'single occasion should parcel itself into roles and assignments',
        input: [
            {
                occasion: 1, when: '2018-01-01 12:00', type: 'service', subtype: 'communion',
                role: 1, roletype: 'dod', count: 1,
                attendance: 1, attype: 'assigned', participant: "2"
            },
            {
                occasion: 1, when: '2018-01-01 12:00', type: 'service', subtype: 'communion',
                role: 2, roletype: 'dom', count: 2,
                attendance: 2, attype: 'assigned', participant: "2", team: 3
            },
            {
                occasion: 1, when: '2018-01-01 12:00', type: 'service', subtype: 'communion',
                role: 2, roletype: 'dom', count: 2,
                attendance: 3, attype: 'assigned', participant: "4", team: 3
            }
        ],
        output:[
            {
                id: 1, when: "2018-01-01 12:00", type: "service", subtype:"communion",
                roles:[
                    {
                        id: 1, type: "dod", required:1,
                        assigned:[
                            {id: 1, who: 2}
                        ],
                        confirmed:[],
                        declined:[]
                    },
                    {
                        id: 2, type: "dom", required:2,
                        assigned:[
                            {id: 2, team: 3, who: 2},
                            {id: 3, team: 3, who: 4}
                        ],
                        confirmed:[],
                        declined:[]
                    }
                ]
            }
        ]
    },
    {
        name: 'multiple occasions should produce multiple outputs',
        input: [
            {
                occasion: 1, when: '2018-01-01 12:00', type: 'service',
                role: 1, roletype: 'dod', count: 1,
                attendance: 1, attype: 'assigned', participant: "3"
            },
            {
                occasion: 2, when: '2018-01-02 12:00', type: 'service', subtype: 'baptism',
                role: 2, roletype: 'baptism', count: 2,
                attendance: 2, attype: 'confirmed', participant: "2", team: 3
            },
            {
                occasion: 2, when: '2018-01-02 12:00', type: 'service', subtype: 'baptism',
                role: 2, roletype: 'baptism', count: 2,
                attendance: 3, attype: 'assigned', participant: "4", team: 3
            }
        ],
        output:[
            {
                id: 1, when: "2018-01-01 12:00", type: "service", subtype: undefined,
                roles:[
                    {
                        id: 1, type: "dod", required:1,
                        assigned:[
                            {id: 1, who: 3}
                        ],
                        confirmed:[],
                        declined:[]
                    }
                ]
            },
            {
                id: 2, when: "2018-01-02 12:00", type: "service", subtype:"baptism",
                roles:[
                    {
                        id: 2, type: "baptism", required:2,
                        assigned:[
                            {id: 3, team: 3, who: 4}
                        ],
                        confirmed:[
                            {id: 2, team: 3, who: 2}
                        ],
                        declined:[]
                    }
                ]
            }
        ]
    }
];

const ROLE_ITEMS = [
    { name: 'should return null role for empty input', input:[], output:null},
    {
        name: 'simple role should have simple output',
        input: [
            {
                role: 1, roletype: 'dod', count: 1,
                attendance: 1, attype: 'assigned', participant: "3"
            }
        ],
        output: {
            id: 1, type: "dod", required: 1,
            assigned:[
                {id: 1, who: 3}
            ],
            confirmed:[],
            declined:[]
        }
    },
    {
        name: 'complex role should parcel itself out',
        input: [
            {
                role: 1, roletype: 'baptism', count: 3,
                attendance: 1, attype: 'assigned', participant: "3"
            },
            {
                role: 1, roletype: 'baptism', count: 3,
                attendance: 2, attype: 'assigned', participant: "4"
            },
            {
                role: 1, roletype: 'baptism', count: 3,
                attendance: 3, attype: 'confirmed', participant: "5"
            },
        ],
        output: {
            id: 1, type: "baptism", required: 3,
            assigned:[
                {id: 1, who: 3},
                {id: 2, who: 4}
            ],
            confirmed:[
                {id: 3, who: 5}

            ],
            declined:[]
        }
    }
];

describe('Unit - api/hydrator', function (){

    describe('pumpOccasionData', function () {
        for (let item of OCCASION_ITEMS) {
            it(item.name, function () {
                expect(hydrator.pumpOccasionData(item.input)).to.be.deep.equal(item.output);
            });    
        }
    });

    describe('pumpRoleData', function(){
        for (let item of ROLE_ITEMS) {
            it (item.name, function () {
                expect(hydrator.pumpRoleData(item.input)).to.be.deep.equal(item.output);
            });    
        }
    });

});
