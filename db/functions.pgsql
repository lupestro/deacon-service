
-- Attendance management functions

CREATE OR REPLACE FUNCTION assign_role_to_person (IN part_name TEXT, IN role_type TEXT, IN occ_time TIMESTAMP) RETURNS void AS $$ 
    DECLARE roleId integer;
    DECLARE partId integer;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    FOR partId IN SELECT id FROM participants WHERE short_name = part_name LOOP -- should only happen once
        INSERT INTO attendances (type, role, participant) VALUES ('assigned', roleId, partId);
    END LOOP;
END    
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assign_role_to_team (IN part_team integer, IN role_type TEXT, IN occ_time TIMESTAMP) RETURNS void AS $$ 
    DECLARE roleId integer;
    DECLARE partId integer;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    FOR partId IN SELECT id FROM participants WHERE team = part_team LOOP
        INSERT INTO attendances (type, role, participant, team) VALUES ('assigned', roleId, partId, part_team);
    END LOOP;
END    
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION confirm_role_for_person (IN part_name TEXT, IN role_type TEXT, IN occ_time TIMESTAMP) RETURNS void AS $$ 
    DECLARE roleId integer;
    DECLARE partId integer;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    SELECT id FROM participants WHERE short_name = part_name INTO partId;
    IF NOT FOUND THEN 
        RAISE 'Participant % not found', part_name;
    END IF;
    SELECT id FROM attendances WHERE role = roleId and participant = partId and (type = 'assigned' or type = 'volunteer');
    IF NOT FOUND THEN
        RAISE 'Participant % is not assigned to or volunteer for role of type % at time %', part_name, role_type, occ_time;
    END IF;
    INSERT INTO attendances (type, role, participant) VALUES ('confirmed', roleId, partId);
END    
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decline_role_for_person (IN part_name TEXT, IN role_type TEXT, IN occ_time TIMESTAMP) RETURNS void AS $$ 
    DECLARE roleId integer;
    DECLARE partId integer;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    SELECT id FROM participants WHERE short_name = part_name INTO partId;
    IF NOT FOUND THEN
        RAISE 'Participant % is not found', part_name;
    END IF;
    SELECT id FROM attendances WHERE role = roleId and participant = partId and (type = 'assigned' or type = 'volunteer');
    IF NOT FOUND THEN
        RAISE 'Participant % is not assigned to or volunteer for role of type % at time %', part_name, role_type, occ_time;
    END IF;
    INSERT INTO attendances (type, role, participant) VALUES ('declined', roleId, partId);
END    
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION substitute_in_role_for_person (IN part_name TEXT, IN role_type TEXT, IN occ_time TIMESTAMP, IN orig_name TEXT) RETURNS void AS $$ 
    DECLARE roleId integer;
    DECLARE partId integer;
    DECLARE currId integer;
    DECLARE subId integer;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    SELECT id FROM participants where short_name = orig_name INTO subId;
    IF NOT FOUND THEN
        RAISE 'Participant % seeking substitution wasn''t found', orig_name;
    END IF;
    SELECT id FROM participants WHERE short_name = part_name INTO partId;
    IF NOT FOUND THEN
        RAISE 'Participant % volunteering as substitute wasn''t found', part_name;
    END IF;
    SELECT id FROM attendances WHERE role = roleId and participant = partId and (type = 'volunteered') INTO currId;
    IF NOT FOUND THEN -- Fresh substitution
        INSERT INTO attendances (type, role, participant, substitute_for) VALUES ('volunteered', roleId, partId, subId);
    ELSE
        UPDATE attendances SET substitute_for=subId WHERE id=currId;
    END IF;
END    
$$ LANGUAGE plpgsql;

-- Cache validation functions

CREATE OR REPLACE FUNCTION latest_participant_date () RETURNS TIMESTAMP AS $$ 
    DECLARE result TIMESTAMP;
BEGIN
    SELECT max(updated) FROM participants INTO result;
    return result;
END    
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION latest_occasion_date () RETURNS TIMESTAMP AS $$ 
    DECLARE result TIMESTAMP;
BEGIN
    SELECT MAX(updated) FROM occasions INTO result;
    return result;
END    
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION latest_role_date () RETURNS TIMESTAMP AS $$ 
    DECLARE result TIMESTAMP;
BEGIN
    SELECT MAX(updated) FROM roles INTO result;
    return result;
END    
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION latest_role_attendance_date (IN role_type TEXT, IN occ_time TIMESTAMP) RETURNS TIMESTAMP AS $$ 
    DECLARE roleId INTEGER;
    DECLARE result TIMESTAMP;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    SELECT max(updated) FROM attendances WHERE role = roleId INTO result;
    return result;
END    
$$ LANGUAGE plpgsql;