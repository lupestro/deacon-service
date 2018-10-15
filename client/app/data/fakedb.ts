let participants : Participant[]= [
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
];
let occasions : OccasionData[] = [
    {
      "id": 1,
      "when": "2018-08-26T13:00:00.000Z",
      "type": "service",
      "subtype": "baptism",
      "roles": [
        {
          "id": 1,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 1,
              "who": 7,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 2,
          "type": "baptism",
          "required": 2,
          "assigned": [
            {
              "id": 2,
              "who": 3,
              "team": 6
            },
            {
              "id": 3,
              "who": 13,
              "team": 6
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 2,
      "when": "2018-09-02T13:00:00.000Z",
      "type": "service",
      "subtype": "communion",
      "roles": [
        {
          "id": 3,
          "type": "dod",
          "required": 1,
          "assigned": [],
          "confirmed": [
            {
              "id": 4,
              "who": 16
            }
          ],
          "declined": []
        },
        {
          "id": 4,
          "type": "dom",
          "required": 2,
          "assigned": [],
          "confirmed": [
            {
              "id": 5,
              "who": 8
            },
            {
              "id": 6,
              "who": 11
            }
          ],
          "declined": []
        },
        {
          "id": 5,
          "type": "downstairs",
          "required": 4,
          "assigned": [],
          "confirmed": [
            {
              "id": 7,
              "who": 5
            },
            {
              "id": 8,
              "who": 9
            },
            {
              "id": 9,
              "who": 14
            },
            {
              "id": 12,
              "who": 2
            }
          ],
          "declined": [
            {
              "id": 10,
              "who": 16,
              "substitute": 13
            },
            {
              "id": 11,
              "who": 1
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "when": "2018-09-09T14:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 6,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 13,
              "who": 15,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 4,
      "when": "2018-09-16T12:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 7,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 14,
              "who": 6,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 5,
      "when": "2018-09-16T14:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 8,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 15,
              "who": 6,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 6,
      "when": "2018-09-23T12:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 9,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 16,
              "who": 14,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 7,
      "when": "2018-09-23T14:00:00.000Z",
      "type": "service",
      "subtype": "baptism",
      "roles": [
        {
          "id": 10,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 17,
              "who": 14,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 11,
          "type": "baptism",
          "required": 2,
          "assigned": [
            {
              "id": 18,
              "who": 5,
              "team": 8
            },
            {
              "id": 19,
              "who": 9,
              "team": 8
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 8,
      "when": "2018-09-30T12:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 12,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 20,
              "who": 9,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 9,
      "when": "2018-09-30T14:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 13,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 21,
              "who": 9,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 10,
      "when": "2018-10-07T12:30:00.000Z",
      "type": "service",
      "subtype": "communion",
      "roles": [
        {
          "id": 14,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 22,
              "who": 7,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 15,
          "type": "dom",
          "required": 2,
          "assigned": [
            {
              "id": 23,
              "who": 7,
              "team": 1
            },
            {
              "id": 24,
              "who": 15,
              "team": 1
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 16,
          "type": "downstairs",
          "required": 4,
          "assigned": [
            {
              "id": 25,
              "who": 17,
              "team": 4
            },
            {
              "id": 26,
              "who": 18,
              "team": 4
            },
            {
              "id": 27,
              "who": 1,
              "team": 5
            },
            {
              "id": 28,
              "who": 2,
              "team": 5
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 11,
      "when": "2018-10-07T14:00:00.000Z",
      "type": "service",
      "subtype": "communion",
      "roles": [
        {
          "id": 17,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 29,
              "who": 7,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 18,
          "type": "dom",
          "required": 2,
          "assigned": [
            {
              "id": 30,
              "who": 7,
              "team": 1
            },
            {
              "id": 31,
              "who": 15,
              "team": 1
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 19,
          "type": "downstairs",
          "required": 6,
          "assigned": [
            {
              "id": 32,
              "who": 8,
              "team": 9
            },
            {
              "id": 33,
              "who": 11,
              "team": 9
            },
            {
              "id": 34,
              "who": 3,
              "team": 6
            },
            {
              "id": 35,
              "who": 13,
              "team": 6
            },
            {
              "id": 36,
              "who": 5,
              "team": 8
            },
            {
              "id": 37,
              "who": 9,
              "team": 8
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 20,
          "type": "upstairs",
          "required": 4,
          "assigned": [
            {
              "id": 38,
              "who": 17,
              "team": 4
            },
            {
              "id": 39,
              "who": 18,
              "team": 4
            },
            {
              "id": 40,
              "who": 1,
              "team": 5
            },
            {
              "id": 41,
              "who": 2,
              "team": 5
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 12,
      "when": "2018-10-14T12:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 21,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 42,
              "who": 16,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 13,
      "when": "2018-10-14T14:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 22,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 43,
              "who": 16,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 15,
      "when": "2018-10-21T12:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 25,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 44,
              "who": 15,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 16,
      "when": "2018-10-21T14:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 26,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 45,
              "who": 15,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 17,
      "when": "2018-10-28T12:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 27,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 46,
              "who": 6,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 18,
      "when": "2018-10-28T14:00:00.000Z",
      "type": "service",
      "subtype": "baptism",
      "roles": [
        {
          "id": 28,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 47,
              "who": 6,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 29,
          "type": "baptism",
          "required": 2,
          "assigned": [
            {
              "id": 48,
              "who": 8,
              "team": 9
            },
            {
              "id": 49,
              "who": 11,
              "team": 9
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 19,
      "when": "2018-11-04T13:30:00.000Z",
      "type": "service",
      "subtype": "communion",
      "roles": [
        {
          "id": 30,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 50,
              "who": 14,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 31,
          "type": "dom",
          "required": 2,
          "assigned": [
            {
              "id": 51,
              "who": 12,
              "team": 2
            },
            {
              "id": 52,
              "who": 10,
              "team": 2
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 32,
          "type": "downstairs",
          "required": 4,
          "assigned": [
            {
              "id": 53,
              "who": 5,
              "team": 8
            },
            {
              "id": 54,
              "who": 9,
              "team": 8
            },
            {
              "id": 55,
              "who": 14,
              "team": 3
            },
            {
              "id": 56,
              "who": 16,
              "team": 3
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 20,
      "when": "2018-11-04T15:00:00.000Z",
      "type": "service",
      "subtype": "communion",
      "roles": [
        {
          "id": 33,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 57,
              "who": 14,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 34,
          "type": "dom",
          "required": 2,
          "assigned": [
            {
              "id": 58,
              "who": 12,
              "team": 2
            },
            {
              "id": 59,
              "who": 10,
              "team": 2
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 35,
          "type": "downstairs",
          "required": 6,
          "assigned": [
            {
              "id": 60,
              "who": 4,
              "team": 7
            },
            {
              "id": 61,
              "who": 6,
              "team": 7
            },
            {
              "id": 62,
              "who": 8,
              "team": 9
            },
            {
              "id": 63,
              "who": 11,
              "team": 9
            },
            {
              "id": 64,
              "who": 17,
              "team": 4
            },
            {
              "id": 65,
              "who": 18,
              "team": 4
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 36,
          "type": "upstairs",
          "required": 4,
          "assigned": [
            {
              "id": 66,
              "who": 5,
              "team": 8
            },
            {
              "id": 67,
              "who": 9,
              "team": 8
            },
            {
              "id": 68,
              "who": 14,
              "team": 3
            },
            {
              "id": 69,
              "who": 16,
              "team": 3
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 21,
      "when": "2018-11-11T13:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 37,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 70,
              "who": 7,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 22,
      "when": "2018-11-11T15:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 38,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 71,
              "who": 7,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 23,
      "when": "2018-11-18T13:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 39,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 72,
              "who": 16,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 24,
      "when": "2018-11-18T15:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 40,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 73,
              "who": 16,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 25,
      "when": "2018-11-25T13:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 41,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 74,
              "who": 15,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 26,
      "when": "2018-11-25T15:00:00.000Z",
      "type": "service",
      "subtype": "baptism",
      "roles": [
        {
          "id": 42,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 75,
              "who": 15,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 43,
          "type": "baptism",
          "required": 2,
          "assigned": [
            {
              "id": 76,
              "who": 4,
              "team": 7
            },
            {
              "id": 77,
              "who": 6,
              "team": 7
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 27,
      "when": "2018-12-02T13:30:00.000Z",
      "type": "service",
      "subtype": "communion",
      "roles": [
        {
          "id": 44,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 78,
              "who": 9,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 45,
          "type": "dom",
          "required": 2,
          "assigned": [
            {
              "id": 79,
              "who": 14,
              "team": 3
            },
            {
              "id": 80,
              "who": 16,
              "team": 3
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 46,
          "type": "downstairs",
          "required": 4,
          "assigned": [
            {
              "id": 81,
              "who": 4,
              "team": 7
            },
            {
              "id": 82,
              "who": 6,
              "team": 7
            },
            {
              "id": 83,
              "who": 12,
              "team": 2
            },
            {
              "id": 84,
              "who": 10,
              "team": 2
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 28,
      "when": "2018-12-02T15:00:00.000Z",
      "type": "service",
      "subtype": "communion",
      "roles": [
        {
          "id": 47,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 85,
              "who": 9,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 48,
          "type": "dom",
          "required": 2,
          "assigned": [
            {
              "id": 86,
              "who": 17,
              "team": 4
            },
            {
              "id": 87,
              "who": 18,
              "team": 4
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 49,
          "type": "downstairs",
          "required": 6,
          "assigned": [
            {
              "id": 88,
              "who": 7,
              "team": 1
            },
            {
              "id": 89,
              "who": 15,
              "team": 1
            },
            {
              "id": 90,
              "who": 1,
              "team": 5
            },
            {
              "id": 91,
              "who": 2,
              "team": 5
            },
            {
              "id": 92,
              "who": 5,
              "team": 8
            },
            {
              "id": 93,
              "who": 9,
              "team": 8
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 50,
          "type": "upstairs",
          "required": 4,
          "assigned": [
            {
              "id": 94,
              "who": 4,
              "team": 7
            },
            {
              "id": 95,
              "who": 6,
              "team": 7
            },
            {
              "id": 96,
              "who": 12,
              "team": 2
            },
            {
              "id": 97,
              "who": 10,
              "team": 2
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 29,
      "when": "2018-12-09T13:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 51,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 98,
              "who": 7,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 30,
      "when": "2018-12-09T15:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 52,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 99,
              "who": 7,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 31,
      "when": "2018-12-16T13:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 53,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 100,
              "who": 16,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 32,
      "when": "2018-12-16T15:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 54,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 101,
              "who": 16,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 33,
      "when": "2018-12-23T13:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 55,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 102,
              "who": 15,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 34,
      "when": "2018-12-23T15:00:00.000Z",
      "type": "service",
      "subtype": "baptism",
      "roles": [
        {
          "id": 56,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 103,
              "who": 15,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        },
        {
          "id": 57,
          "type": "baptism",
          "required": 2,
          "assigned": [
            {
              "id": 104,
              "who": 17,
              "team": 4
            },
            {
              "id": 105,
              "who": 18,
              "team": 4
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 36,
      "when": "2018-12-30T13:30:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 60,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 106,
              "who": 6,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    },
    {
      "id": 37,
      "when": "2018-12-30T15:00:00.000Z",
      "type": "service",
      "subtype": null,
      "roles": [
        {
          "id": 61,
          "type": "dod",
          "required": 1,
          "assigned": [
            {
              "id": 107,
              "who": 6,
              "team": null
            }
          ],
          "confirmed": [],
          "declined": []
        }
      ]
    }
  ];

export { occasions, participants} ;