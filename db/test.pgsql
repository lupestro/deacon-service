CREATE TABLE dbtest (
    id SERIAL PRIMARY KEY,
    status TEXT NOT NULL CHECK (
        status = 'happy' or status='sad' or status='confused'
    ),
    name TEXT NOT NULL,
    description TEXT NULL,
    updated TIMESTAMP DEFAULT(CURRENT_TIMESTAMP),
    UNIQUE (status, name)
);
