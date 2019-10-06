export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  */

  this.get('/api/v1/participants', () => { return {
    "success": true,
    "data": [
        {
            "id": 1,
            "type": "deacon",
            "short_name": "Fred",
            "full_name": "Fred Flintstone",
            "team": 1,
            "family": 1
        },
        {
            "id": 2,
            "type": "deacon",
            "short_name": "Barney",
            "full_name": "Barney Rubble",
            "team": 1,
            "family": 2
        },
        {
            "id": 3,
            "type": "deacon",
            "short_name": "Pebbles",
            "full_name": "Pebbles Flintstone",
            "team": 2,
            "family": 1
        },
        {
            "id": 4,
            "type": "deacon",
            "short_name": "Betty",
            "full_name": "Betty Rubble",
            "team": 2,
            "family": 2
        },
        {
            "id": 5,
            "type": "deacon",
            "short_name": "Joe",
            "full_name": "Joe Rockhead",
            "team": 3,
            "family": null
        },
        {
            "id": 6,
            "type": "deacon",
            "short_name": "Pearl",
            "full_name": "Pearl Slaghoople",
            "team": 3,
            "family": 2
        },
        {
            "id": 7,
            "type": "deacon",
            "short_name": "Sam",
            "full_name": "Sam Slagheap",
            "team": 4,
            "family": 2
        },
        {
            "id": 8,
            "type": "deacon",
            "short_name": "Tex",
            "full_name": "Tex Hardrock",
            "team": 4,
            "family": 1
        },
        {
            "id": 9,
            "type": "deacon",
            "short_name": "George",
            "full_name": "George Slate",
            "team": 4,
            "family": null
        },
        {
            "id": 10,
            "type": "historical",
            "short_name": "Bamm-Bamm",
            "full_name": "Bamm-Bamm Rubble",
            "team": null,
            "family": null
        },
        {
            "id": 11,
            "type": "substitute",
            "short_name": "Gazoo",
            "full_name": "The Great Gazoo",
            "team": null,
            "family": null
        }
    ]
  }});

  this.get('/api/v1/occasions', () => { return {
    "success": true,
    "data": [
        {
            "id": 1,
            "when": "2019-10-01T12:30:00.000Z",
            "type": "service",
            "subtype": "communion",
            "roles": [
                {
                    "id": 11,
                    "type": "dod",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 111,
                            "who": 3
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                },
                {
                    "id": 12,
                    "type": "downstairs",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 112,
                            "who": 1
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                }
            ]
        },
        {
            "id": 2,
            "when": "2019-10-01T14:00:00.000Z",
            "type": "service",
            "subtype": "communion",
            "roles": [
                {
                    "id": 21,
                    "type": "dod",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 121,
                            "who": 3
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                },
                {
                    "id": 22,
                    "type": "downstairs",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 122,
                            "who": 4
                        },
                        {
                            "id": 123,
                            "who": 6
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                },
                {
                    "id": 23,
                    "type": "upstairs",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 123,
                            "who": 1
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                }
            ]
        },
        {
            "id": 3,
            "when": "2019-10-08T14:00:00.000Z",
            "type": "service",
            "subtype": null,
            "roles": [
                {
                    "id": 31,
                    "type": "dod",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 131,
                            "who": 5
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                }
            ]
        },
        {
            "id": 4,
            "when": "2019-10-15T14:00:00.000Z",
            "type": "service",
            "subtype": null,
            "roles": [
                {
                    "id": 41,
                    "type": "dod",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 141,
                            "who": 2
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                }
            ]
        },
        {
            "id": 5,
            "when": "2019-10-22T14:00:00.000Z",
            "type": "service",
            "subtype": "baptism",
            "roles": [
                {
                    "id": 51,
                    "type": "dod",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 151,
                            "who": 6
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                },
                {
                    "id": 52,
                    "type": "baptism",
                    "required": 1,
                    "assigned": [
                        {
                            "id": 151,
                            "who": 7
                        },
                        {
                            "id": 152,
                            "who": 8
                        }
                    ],
                    "confirmed": [],
                    "declined": []
                }

            ]
        }
    ]
  }});
}
