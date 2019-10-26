export default function(server) {

  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */

  server.db.createCollection('participants', [
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
  ]);

  server.db.createCollection('occasions', [
    {
      "id": 1,
      "when": "2019-10-01T12:30:00.000Z",
      "type": "service",
      "subtype": "communion",
    },
    {
      "id": 2,
      "when": "2019-10-01T14:00:00.000Z",
      "type": "service",
      "subtype": "communion"
    },
    {
      "id": 3,
      "when": "2019-10-08T14:00:00.000Z",
      "type": "service",
      "subtype": null
    },
    {
      "id": 4,
      "when": "2019-10-15T14:00:00.000Z",
      "type": "service",
      "subtype": null
    },
    {
      "id": 5,
      "when": "2019-10-22T14:00:00.000Z",
      "type": "service",
      "subtype": "baptism"
    }
  ]);

  server.db.createCollection("roles", [
    {
      "occasionId": 1,
      "id": 11,
      "type": "dod",
      "required": 1,
    },
    {
      "occasionId": 1,
      "id": 12,
      "type": "downstairs",
      "required": 1
      },
      {
        "occasionId": 2,  
        "id": 21,
        "type": "dod",
        "required": 1
    },
    {
      "occasionId": 2,  
      "id": 22,
      "type": "downstairs",
      "required": 1
    },
    {
      "occasionId": 2,  
      "id": 23,
      "type": "upstairs",
      "required": 1
    },
    {
      "occasionId": 3,
      "id": 31,
      "type": "dod",
      "required": 1
    },
    {
      "occasionId": 4,
      "id": 41,
      "type": "dod",
      "required": 1
    },
    {
      "occasionId": 5,
      "id": 51,
      "type": "dod",
      "required": 1,
    },
    {
      "occasionId": 5,
      "id": 52,
      "type": "baptism",
      "required": 1,
    }
  ]);
  server.db.createCollection('attendances', [
    {
      "id": 111,
      "roleId": 11,
      "type": "assigned",
      "who": 3
    },
    {
      "id": 112,
      "roleId": 12,
      "type": "assigned",
      "who": 1
    },
    { 
      "roleId": 21,
      "id": 121,
      "type": "assigned",
      "who": 3
    },
    {
      "roleId": 22,
      "id": 122,
      "type": "assigned",
      "who": 4
    },
    {
      "roleId": 22,
      "id": 222,
      "type": "assigned",
      "who": 6
    },
    {
      "roleId": 23,
      "id": 123,
      "type": "assigned",
      "who": 1
    },
    {
      "id": 131,
      "roleId": 31,
      "type": "assigned",
      "who": 5
    },
    {
      "id": 141,
      "roleId": 41,
      "type" : "assigned",
      "who": 2
    },
    {
        "id": 151,
        "roleId": 51,
        "type" : "assigned",
        "who": 6
    },
    {
        "id": 152,
        "roleId": 52,
        "type" : "assigned",
        "who": 7
    },
    {
        "id": 252,
        "roleId": 52,
        "type" : "assigned",
        "who": 8
    }
]);
}
