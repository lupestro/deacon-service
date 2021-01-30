export default function () {
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

  this.passthrough('/write-coverage');

  this.get('/api/v1/participants', (schema) => {
    return {
      success: true,
      data: schema.db.participants,
    };
  });

  this.get('/api/v1/occasions', (schema) => {
    return {
      success: true,
      now: '2019-10-07T08:00:00.000Z',
      data: schema.db.occasions.map((occasion) => {
        var occ = Object.assign({}, occasion);
        occ.roles = schema.db.roles
          .where({ occasionId: occ.id })
          .map((role) => {
            var r = Object.assign({}, role);
            r.assigned = schema.db.attendances.where({
              type: 'assigned',
              roleId: role.id,
            });
            r.confirmed = schema.db.attendances.where({
              type: 'confirmed',
              roleId: role.id,
            });
            r.declined = schema.db.attendances.where({
              type: 'declined',
              roleId: role.id,
            });
            return r;
          });
        return occ;
      }),
    };
  });

  this.post('/api/v1/attendance/:id/type', (schema, request) => {
    const reqjson = JSON.parse(request.requestBody);
    let attendance = schema.db.attendances.find(request.params.id);
    let type = reqjson.type === 'unconfirmed' ? 'assigned' : reqjson.type;
    if (attendance.type !== type) {
      schema.db.attendances.update(request.params.id, {
        type: type,
        substitute: null,
        sub_name: null,
      });
    } else {
      return {
        success: false,
        error:
          'Confirming what is already confirmed, unconfirming what is already unconfirmed, or declining what is already declined.',
      };
    }
    let r = Object.assign({}, schema.db.roles.find(attendance.roleId));
    r.assigned = schema.db.attendances.where({
      type: 'assigned',
      roleId: r.id,
    });
    r.confirmed = schema.db.attendances.where({
      type: 'confirmed',
      roleId: r.id,
    });
    r.declined = schema.db.attendances.where({
      type: 'declined',
      roleId: r.id,
    });
    return {
      success: true,
      data: r,
    };
  });

  this.post('/api/v1/attendance/:id/substitute', (schema, request) => {
    const reqjson = JSON.parse(request.requestBody);
    let attendance = schema.db.attendances.find(request.params.id);
    let sub = schema.db.participants.find(reqjson.substitute);
    if (attendance.type === 'declined') {
      schema.db.attendances.update(request.params.id, {
        substitute: sub.id,
        sub_name: sub.short_name,
      });
    } else {
      return {
        success: false,
        error: 'Applying substitute to an attendance that is not declined.',
      };
    }
    let r = Object.assign({}, schema.db.roles.find(attendance.roleId));
    r.assigned = schema.db.attendances.where({
      type: 'assigned',
      roleId: r.id,
    });
    r.confirmed = schema.db.attendances.where({
      type: 'confirmed',
      roleId: r.id,
    });
    r.declined = schema.db.attendances.where({
      type: 'declined',
      roleId: r.id,
    });
    return {
      success: true,
      data: r,
    };
  });
}
