# DeaconService API - v1

## Occasions - GET /api/v1/occasions

* Response:

```
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

```
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

## Update Attendance Type - POST /api/v1/attendance/:attendance-id/type

Changes the status of the participant with whom the attendance is associated for the associated role

* Body: attendance-type

```
  { 
      "type": ("confirmed" | "assigned" | "declined" )
  }
```

* Response: updated occasion data

```
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

## Substitute For Attendee - POST /api/v1/attendance/:attendance-id/substitute

Designates a participant as a substitute for the participant with whom the attendance is associated. Setting to null revokes the substitution.

* Body: 
```
  { 
      "substitute": participant-id (number) | null
  }
```

* Response: updated occasion data

```
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

# DeaconService API - v2

Natural Keys:
* Participant: `short-name`
* Occasion: `when` and `occasion-type`
* Role: `role-type` (per occasion, so occasion keys as well)
* Attendance: `who` (per role, so role keys as well)

## Occasions - GET /api/v2/occasions

* Response:

```
  {
    "success": bool,
    "data": [ // Occasion data
          {
            "when": iso-timestamp-string-with-zone, 
            "occasion-type": ( "service" ), 
            "subtype": ( null | "communion" | "baptism" ),
            "roles": [ //Role data
              {
                "role-type": ( "dod" | "baptism" | "upstairs" | "downstairs" ), 
                "required": count (number),
                "attendances" [
                  {
                    "who": short-name (string), 
                    "attendance-type": ( "assigned" | "confirmed" | "declined" )
                    "team": team-id (number) | null,
                    "substitute": short-name (string) | null
                  }, ...
                ]
              }, ...
            ]
          }, ...
       ]
   },
```

## Participants - GET /api/v2/participants

* Response:

```
  {
    "success": boolean,
    "data":[  // Participant data
      {
        "short-name": short-name (string), 
        "type": ( deacon | substitute ),
        "full-name": string,
        "team": team-id | null,
        "family": family-id | null
      }
    ], ...
  }
```

## Update Attendance Type - POST /api/v2/attendance-type

Changes the status of the participant for the associated role

* Body: attendance-type

```
  {
      "when":  iso-timestamp-string-with-zone (string),
      "occasion-type": ( "service" ),
      "role-type": ( "dod" | "baptism" | "upstairs" | "downstairs" ),
      "short-name": short-name (string),
      "attendence-type": ("confirmed" | "assigned" | "declined" )
  }
```

* Response: updated occasion data

```
  {
    "success": bool,
    "data": { // occasion data
      "when": iso-timestamp-string-with-zone, 
      "occasion-type": ( "service" ),
      "role-type": ( "dod" | "baptism" | "upstairs" | "downstairs" ),
      "attendances" [
        {
          "who": short-name (string),
          "attendance-type": ( "assigned" | "confirmed" | "declined" )
          "team": team-id (number) | null,
          "substitute": short-name (string) | null
        }, ...
      ]
    }
  }
```

## Substitute For Attendee - POST /api/v2/attendance-substitute

Designates a participant as a substitute for the participant with whom the attendance is associated. Setting to null revokes the substitution.

* Body: 
```
  {
      "when":  iso-timestamp-string-with-zone (string),
      "occasion-type": ( "service" ),
      "role-type": ( "dod" | "baptism" | "upstairs" | "downstairs" ),
      "short-name": string,
      "substitute": short-name (string) | null
  }
```

* Response: updated occasion data

```
  {
    "success": bool,
    "data": { // occasion data
      "occasion-type": ( "service" ),
      "when": iso-timestamp-string-with-zone, 
      "role-type": ( "dod" | "baptism" | "upstairs" | "downstairs" ),
      "attendances" [
        {
          "who": short-name (string),
          "attendance-type": ( "assigned" | "confirmed" | "declined" )
          "team": team-id (number) | null,
          "substitute": short-name (string) | null
        }, ...
      ]
    }
  }
```

