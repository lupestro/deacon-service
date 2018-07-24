import Service from '@ember/service';
import RSVP from 'rsvp';

const participantsRecord : ParticipantsData = {
    "success":true,
    "data":[
        {"id":1,"type":"deacon","short_name":"Alan","full_name":"Alan Brown","team":5,"family":null},
        {"id":2,"type":"deacon","short_name":"Ava","full_name":"Ava Smigliani","team":5,"family":2},
        {"id":3,"type":"deacon","short_name":"Bill-M","full_name":"Bill McIntyre","team":6,"family":null},
        {"id":4,"type":"deacon","short_name":"Bill-T","full_name":"Bill Thorpe","team":7,"family":null},
        {"id":5,"type":"deacon","short_name":"Cayden","full_name":"Cayden Plummer","team":8,"family":null},
        {"id":6,"type":"deacon","short_name":"Charles","full_name":"Charles Okorie","team":7,"family":null},
        {"id":7,"type":"deacon","short_name":"Dale","full_name":"Dale Neth","team":1,"family":null},
        {"id":8,"type":"deacon","short_name":"Eli","full_name":"Eli Whitney","team":9,"family":null},
        {"id":9,"type":"deacon","short_name":"Gary","full_name":"Gary Lambert","team":8,"family":null},
        {"id":10,"type":"deacon","short_name":"Jim","full_name":"Jim Stone","team":2,"family":3},
        {"id":11,"type":"deacon","short_name":"Joe","full_name":"Joe Hines","team":9,"family":4},
        {"id":12,"type":"deacon","short_name":"Kim","full_name":"Kimberly Lynch","team":2,"family":null},
        {"id":13,"type":"deacon","short_name":"Laurie","full_name":"Laurie Kofstad","team":6,"family":null},
        {"id":14,"type":"deacon","short_name":"Mike","full_name":"Mike Winton","team":3,"family":null},
        {"id":15,"type":"deacon","short_name":"Ralph","full_name":"Ralph Mack","team":1,"family":null},
        {"id":16,"type":"deacon","short_name":"Rich","full_name":"Rich Smigliani","team":3,"family":2},
        {"id":17,"type":"deacon","short_name":"Roy","full_name":"Roy Rumbaugh","team":4,"family":1},
        {"id":18,"type":"deacon","short_name":"Sandra","full_name":"Sandra Rumbaugh","team":4,"family":1},
        {"id":19,"type":"deacon","short_name":"Erin","full_name":"Erin Shannon","team":0,"family":null},
        {"id":20,"type":"deacon","short_name":"Tom","full_name":"Tom Donovan","team":0,"family":null},
        {"id":21,"type":"substitute","short_name":"Karen","full_name":"Karen Menchion","team":null,"family":null},
        {"id":22,"type":"substitute","short_name":"Caryl","full_name":"Caryl Sullivan","team":null,"family":null},
        {"id":23,"type":"substitute","short_name":"Jan","full_name":"Jan Hanks","team":null,"family":null},
        {"id":24,"type":"substitute","short_name":"Walter","full_name":"Walter Marquis","team":null,"family":null},
        {"id":25,"type":"substitute","short_name":"Mary","full_name":"Mary Dopp","team":null,"family":null},
        {"id":26,"type":"substitute","short_name":"JoAnn","full_name":"Jo Ann Anderson","team":null,"family":null},
        {"id":27,"type":"substitute","short_name":"Ray","full_name":"Ray Baldwin","team":null,"family":null},
        {"id":28,"type":"substitute","short_name":"Colleen","full_name":"Colleen Hogan","team":null,"family":4},
        {"id":29,"type":"substitute","short_name":"Maribeth","full_name":"Maribeth Stone","team":null,"family":3},
        {"id":30,"type":"substitute","short_name":"Keanna","full_name":"Keanna Smigliani","team":null,"family":2}
    ]
};


const occasions: OccasionData = {
    "success":true,
    "data":[
        {
            "id":1,
            "when":"2018-06-03T08:30:00.000Z",
            "type":"service",
            "subtype":"communion",
            "roles":[
                {
                    "id":1,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":1,"who":10,"team":null}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":2,
                    "type":"dom",
                    "required":2,
                    "assigned":[{"id":2,"who":3,"team":6},{"id":3,"who":13,"team":6}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":3,
                    "type":"downstairs",
                    "required":4,
                    "assigned":[
                        {"id":4,"who":1,"team":5},
                        {"id":5,"who":2,"team":5},
                        {"id":6,"who":17,"team":4},
                        {"id":7,"who":18,"team":4},
                        {"id":14,"who":7,"team":1},
                        {"id":15,"who":15,"team":1},
                        {"id":16,"who":4,"team":7},
                        {"id":17,"who":6,"team":7},
                        {"id":18,"who":8,"team":9},
                        {"id":19,"who":11,"team":9}
                    ],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":2,
            "when":"2018-06-03T10:00:00.000Z",
            "type":"service",
            "subtype":"communion",
            "roles":[
                {
                    "id":5,
                    "type":"dom",
                    "required":2,
                    "assigned":[{"id":8,"who":3,"team":6},{"id":9,"who":13,"team":6}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":7,
                    "type":"upstairs",
                    "required":4,
                    "assigned":[
                        {"id":10,"who":1,"team":5},
                        {"id":11,"who":2,"team":5},
                        {"id":12,"who":17,"team":4},
                        {"id":13,"who":18,"team":4}
                    ],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":4,
            "when":"2018-06-17T09:00:00.000Z",
            "type":"service",
            "subtype":null,
            "roles":[
                {
                    "id":8,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":20,"who":15,"team":null}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":5,
            "when":"2018-06-24T09:00:00.000Z",
            "type":"service",
            "subtype":"baptism",
            "roles":[
                {
                    "id":9,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":21,"who":6,"team":null}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":10,
                    "type":"baptism",
                    "required":2,
                    "assigned":[{"id":22,"who":14,"team":3},{"id":23,"who":16,"team":3}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":6,
            "when":"2018-07-01T09:00:00.000Z",
            "type":"service",
            "subtype":"communion",
            "roles":[
                {
                    "id":11,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":24,"who":14,"team":null}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":12,
                    "type":"dom",
                    "required":2,
                    "assigned":[{"id":25,"who":4,"team":7},{"id":26,"who":6,"team":7}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":13,
                    "type":"downstairs",
                    "required":6,
                    "assigned":[
                        {"id":27,"who":8,"team":9},
                        {"id":28,"who":11,"team":9},
                        {"id":29,"who":12,"team":2},
                        {"id":30,"who":10,"team":2},
                        {"id":31,"who":7,"team":1},
                        {"id":32,"who":15,"team":1}
                    ],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":7,
            "when":"2018-07-08T09:00:00.000Z",
            "type":"service",
            "subtype":null,
            "roles":[
                {
                    "id":14,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":33,"who":9,"team":null}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":8,
            "when":"2018-07-15T09:00:00.000Z",
            "type":"service",
            "subtype":null,
            "roles":[
                {
                    "id":15,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":34,"who":7,"team":null}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":9,
            "when":"2018-07-22T09:00:00.000Z",
            "type":"service",
            "subtype":null,
            "roles":[
                {
                    "id":16,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":35,"who":16,"team":null}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":10,
            "when":"2018-07-29T09:00:00.000Z",
            "type":"service",
            "subtype":"baptism",
            "roles":[
                {
                    "id":17,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":36,"who":15,"team":null}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":18,
                    "type":"baptism",
                    "required":2,
                    "assigned":[{"id":37,"who":8,"team":9},{"id":38,"who":11,"team":9}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":12,
            "when":"2018-08-05T09:00:00.000Z",
            "type":"service",
            "subtype":"communion",
            "roles":[
                {
                    "id":21,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":39,"who":6,"team":null}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":22,
                    "type":"dom",
                    "required":2,
                    "assigned":[{"id":40,"who":5,"team":8},{"id":41,"who":9,"team":8}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":23,
                    "type":"downstairs",
                    "required":6,
                    "assigned":[
                        {"id":42,"who":3,"team":6},
                        {"id":43,"who":13,"team":6},
                        {"id":44,"who":17,"team":4},
                        {"id":45,"who":18,"team":4},
                        {"id":46,"who":14,"team":3},
                        {"id":47,"who":16,"team":3}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":13,
            "when":"2018-08-12T09:00:00.000Z",
            "type":"service",
            "subtype":null,
            "roles":[
                {
                    "id":24,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":48,"who":14,"team":null}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":14,
            "when":"2018-08-19T09:00:00.000Z",
            "type":"service",
            "subtype":null,
            "roles":[
                {
                    "id":25,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":49,"who":9,"team":null}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        },
        {
            "id":15,
            "when":"2018-08-26T09:00:00.000Z",
            "type":"service",
            "subtype":"baptism",
            "roles":[
                {
                    "id":26,
                    "type":"dod",
                    "required":1,
                    "assigned":[{"id":50,"who":7,"team":null}],
                    "confirmed":[],
                    "declined":[]
                },
                {
                    "id":27,
                    "type":"baptism",
                    "required":2,
                    "assigned":[{"id":51,"who":3,"team":6},{"id":52,"who":13,"team":6}],
                    "confirmed":[],
                    "declined":[]
                }
            ]
        }
    ]
};

export default class ApiService extends Service {
    getParticipants() {
        return RSVP.resolve(participantsRecord.data);
    }
    getOccasions() {
        return RSVP.resolve(occasions.data);
    }
}

type OccasionData = {
    success: boolean,
    data: Occasion[]
  };

type ParticipantsData = {
    success: boolean,
    data: Participant[]
  };

declare global {
    
    type Participant = {
        id: number,
        type: string,
        short_name: string,
        full_name: string,
        team: number | null,
        family: number | null
      }; 
    
    type Attendance = {
        id: number,
        who: number,
        who_name?: string,
        team: number | null,
        substitute?: number,
        sub_name? : string
      };
    
    type Role = {
        id: number,
        icon?: string,
        type: string,
        required: number,
        assigned: Attendance[],
        confirmed: Attendance[],
        declined: Attendance[]
      };
      
    type Occasion = {
        id: number,
        when: string,
        type: string,
        subtype: string | null,
        roles: Role[]
      }
    
    }
  
