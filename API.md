# DeaconService Server API

## Occasions - GET /api/v1/occasions

* Response:

```json
  {
    "success": bool,
    "data": [ // Occasion data
          {
            "id": occasion-id (number),
            "when": iso-timestamp-string-with-zone, 
            "type": ( "service" ),
            "subtype": ( null | "communion" | "baptism" ),
            "roles": [ //Role data
              {
                "id": role-id (number),
                "type": ( "dod" | "baptism" | "upstairs" | "downstairs" ),
                "required": count (number),
                "assigned": [ //Attendance data
                  {
                    "id": attendance-id (number),
                    "who": participant-id (number),
                    "team": team-id (number) | null,
                    "substitute": participant-id (number) | null
                  }
                ],
                "confirmed": [ //Attendance data
                    ...
                ],
                "declined": [ //Attendance data
                    ...
                ]
              },...
            ]
          }, ...
       ]
   },
```

## Participants - GET /api/v1/participants

* Response:

```json
  {
    "success": boolean,
    "data":[  // Participant data
      {
        "id": participant-id (number),
        "type": ( deacon | substitute ),
        "short_name": string,
        "full_name": string,
        "team": team-id | null,
        "family": family-id | null
      }
    ], ...
  }
```

## Update Attendance Type - POST /api/v1/attendance/{attendance-id}/type

Changes the status of the participant with whom the attendance is associated for the associated role

* Body: attendance-type

```json
  { 
      "type": ("confirmed" | "assigned" | "declined" )
  }
```

* Response: updated occasion data

```json
  {
    "success": bool,
    "data": { // occasion data
        "id": occasion-id (number),
        "when": iso-timestamp-string-with-zone, 
        "type": ( "service" ),
        "subtype": ( null | "communion" | "baptism" ),
        "roles": [ //Role data
            ... all roles for occasion ...
        ]
    }
  }
```

## Substitute For Attendee - POST /api/v1/attendance/{attendance-id}/substitute

Designates a participant as a substitute for the participant with whom the attendance is associated. Setting to null revokes the substitution.

* Body: 
```json
  { 
      "substitute": participant-id (number) | null
  }
```

* Response: updated occasion data

```json
  {
    "success": bool,
    "data": { // occasion data
        "id": occasion-id (number),
        "when": iso-timestamp-string-with-zone, 
        "type": ( "service" ),
        "subtype": ( null | "communion" | "baptism" ),
        "roles": [ //Role data
            ... all roles for occasion ...
        ]
    }
  }
```
