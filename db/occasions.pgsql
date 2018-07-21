DELETE FROM roles;
DELETE FROM occasions;

DO $$
    DECLARE occId integer;
BEGIN
    INSERT INTO occasions (time, type, subtype) VALUES ('2018-06-03 8:30','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 4, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-06-03 10:00','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 6, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('upstairs', 4, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-06-10 10:00','service');

    INSERT INTO occasions (time, type) VALUES ('2018-06-17 09:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-06-24 09:00','service','baptism') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('baptism', 2, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-07-01 09:00','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1,  occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2,  occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 6,  occId);

    INSERT INTO occasions (time, type) VALUES ('2018-07-08 09:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-07-15 09:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-07-22 09:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-07-29 09:00','service','baptism') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('baptism', 2, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-08-05 09:00','coffee-hour') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('brew', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('pour', 1, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-08-05 9:00','service','communion') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('dom', 2, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('downstairs', 6, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-08-12 09:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type) VALUES ('2018-08-19 09:00','service') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);

    INSERT INTO occasions (time, type, subtype) VALUES ('2018-08-26 09:00','service','baptism') RETURNING id INTO occId;
    INSERT INTO roles (type, count, occasion) VALUES ('dod', 1, occId);
    INSERT INTO roles (type, count, occasion) VALUES ('baptism', 2, occId);

END $$;

