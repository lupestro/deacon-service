DELETE FROM roles;
DELETE FROM occasions;

DO $$
    DECLARE occId integer;
BEGIN
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-08-26 09:00','service','baptism') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('baptism', 2, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-09-02 9:00','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 4, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-09-09 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-09-16 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-09-16 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-09-23 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-09-23 10:00','service','baptism') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('baptism', 2, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-09-30 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-09-30 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-10-07 8:30','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 4, occId);
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-10-07 10:00','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 6, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('upstairs', 4, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-10-14 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-10-14 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-10-14 10:00','coffee-hour') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('brew', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('pour', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-10-21 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-10-21 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-10-28 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-10-28 10:00','service','baptism') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('baptism', 2, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-11-04 8:30','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 4, occId);
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-11-04 10:00','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 6, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('upstairs', 4, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-11-11 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-11-11 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-11-18 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-11-18 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-11-25 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-11-25 10:00','service','baptism') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('baptism', 2, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-12-02 8:30','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 4, occId);
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-12-02 10:00','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 6, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('upstairs', 4, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-12-09 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-12-09 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-12-16 08:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-12-16 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-12-23 8:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-12-23 10:00','service','baptism') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('baptism', 2, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-12-23 10:00','coffee-hour') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('brew', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('pour', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-12-30 8:30','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO occasions (time, type) VALUES ('2018-12-30 10:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

END $$;

