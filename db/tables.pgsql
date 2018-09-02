DROP TABLE attendances;
DROP TABLE roles;
DROP TABLE occasions;
DROP TABLE participants;

CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    type text NOT NULL CHECK (type = 'deacon' or type = 'substitute' or type = 'historical'),
    office text NULL CHECK (office='chair' or office='co-chair' or office='secretary' or office='treasurer'),
    short_name text UNIQUE NOT NULL,
    full_name text NOT NULL,
    email text NULL,
    team integer NULL,
    family integer NULL,
    updated TIMESTAMP DEFAULT(CURRENT_TIMESTAMP)
);

CREATE TABLE occasions (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (type='service' or type = 'coffee-hour'),
    subtype TEXT NULL CHECK (subtype='communion' or subtype='baptism'),
    time TIMESTAMP NOT NULL,
    updated TIMESTAMP DEFAULT(CURRENT_TIMESTAMP),
    UNIQUE (type, time)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (
        type = 'dom' or type = 'dod' or type = 'upstairs' or type = 'downstairs' or
        type = 'baptism' or type = 'brew' or type = 'pour'
    ),
    count INTEGER,
    occasion BIGINT NOT NULL REFERENCES occasions(id) ON DELETE CASCADE,
    updated TIMESTAMP DEFAULT(CURRENT_TIMESTAMP),
    UNIQUE (occasion, type)
);

CREATE TABLE attendances (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL CHECK (
        type = 'assigned' or type='confirmed' or type='declined'
    ),
    role BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    participant BIGINT NOT NULL REFERENCES participants(id) ON DELETE RESTRICT,
    substitute BIGINT NULL REFERENCES participants(id) ON DELETE RESTRICT,
    team INTEGER,
    updated TIMESTAMP DEFAULT(CURRENT_TIMESTAMP),
    UNIQUE (type, role, participant)
);
