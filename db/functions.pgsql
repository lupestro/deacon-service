
-- Attendance management functions
DROP FUNCTION assign_role_to_person (TEXT, TEXT, TIMESTAMP without time zone);
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

DROP FUNCTION assign_role_to_team (integer, TEXT, TIMESTAMP without time zone);
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

DROP FUNCTION confirm_role_for_person (TEXT, TEXT, TIMESTAMP without time zone);
CREATE OR REPLACE FUNCTION confirm_role_for_person (IN part_name TEXT, IN role_type TEXT, IN occ_time TIMESTAMP) RETURNS void AS $$ 
    DECLARE roleId integer;
    DECLARE partId integer;
    DECLARE attendanceId integer;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    SELECT id FROM participants WHERE short_name = part_name INTO partId;
    IF NOT FOUND THEN 
        RAISE 'Participant % not found', part_name;
    END IF;
    SELECT id FROM attendances WHERE role = roleId and participant = partId INTO attendanceId;
    IF NOT FOUND THEN
        RAISE 'Participant % is not assigned to role of type % at time %', part_name, role_type, occ_time;
    END IF;
    UPDATE attendances SET type='confirmed' WHERE id=attendanceId;
END    
$$ LANGUAGE plpgsql;

DROP FUNCTION decline_role_for_person (TEXT, TEXT, TIMESTAMP without time zone);
CREATE OR REPLACE FUNCTION decline_role_for_person (IN part_name TEXT, IN role_type TEXT, IN occ_time TIMESTAMP) RETURNS void AS $$ 
    DECLARE roleId integer;
    DECLARE partId integer;
    DECLARE attendanceId integer;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    SELECT id FROM participants WHERE short_name = part_name INTO partId;
    IF NOT FOUND THEN
        RAISE 'Participant % is not found', part_name;
    END IF;
    SELECT id FROM attendances WHERE role = roleId and participant = partId INTO attendanceId;
    IF NOT FOUND THEN
        RAISE 'Participant % is not assigned to role of type % at time %', part_name, role_type, occ_time;
    END IF;
    UPDATE attendances SET type='declined' WHERE id=attendanceId;
END    
$$ LANGUAGE plpgsql;

DROP FUNCTION substitute_in_role_for_person (TEXT, TEXT, TIMESTAMP without time zone, TEXT);
CREATE OR REPLACE FUNCTION substitute_in_role_for_person (IN part_name TEXT, IN role_type TEXT, IN occ_time TIMESTAMP, IN orig_name TEXT) RETURNS void AS $$ 
    DECLARE roleId integer;
    DECLARE partId integer;
    DECLARE origId integer;
    DECLARE attId integer;
BEGIN
    SELECT r.id FROM roles r, occasions o WHERE o.id = r.occasion AND r.type = role_type AND o.type = 'service' and o.time = occ_time INTO roleId;
    IF NOT FOUND THEN 
        RAISE 'Role of type % not found at time %', role_type, occ_time;
    END IF;
    SELECT id FROM participants where short_name = orig_name INTO origId;
    IF NOT FOUND THEN
        RAISE 'Participant % seeking substitution wasn''t found', orig_name;
    END IF;
    SELECT id FROM participants WHERE short_name = part_name INTO partId;
    IF NOT FOUND THEN
        RAISE 'Participant % volunteering as substitute wasn''t found', part_name;
    END IF;
    SELECT id FROM attendances WHERE role = roleId and participant = origId INTO attId;
    IF NOT FOUND THEN
        RAISE 'Attendance for participant % seeking substitution wasn''t found', orig_name;
    END IF;
    UPDATE attendances SET substitute=partId WHERE id=attId and role=roleId;
END 
$$ LANGUAGE plpgsql;

-- Assignment change functions
DROP FUNCTION add_person_to_team(text,integer,timestamp without time zone);
CREATE OR REPLACE FUNCTION add_person_to_team(IN part_name TEXT, IN teamId INTEGER, IN from_date TIMESTAMP) RETURNS void AS $$
    DECLARE partId INTEGER;
    DECLARE roleId INTEGER;
BEGIN
    SELECT id FROM participants p WHERE p.short_name = part_name AND p.team = 0 INTO partId;
    IF NOT FOUND THEN 
        RAISE 'Participant % either not found or already on a team', part_name;
    END IF;
    UPDATE participants SET team=team WHERE id=partId;
    FOR roleId IN (SELECT DISTINCT a.role FROM attendances a, roles r, occasions o 
        WHERE a.role=r.id AND r.occasion = o.id AND a.team = teamId AND o.time > from_date) LOOP 
            INSERT INTO attendances (type, role, participant, team) VALUES ('assigned', roleId, partId, teamId);
    END LOOP;    
END
$$ LANGUAGE plpgsql;

DROP FUNCTION remove_person_from_team(text,integer,timestamp without time zone);
CREATE OR REPLACE FUNCTION remove_person_from_team(IN part_name TEXT, IN teamId INTEGER, IN from_date TIMESTAMP)  RETURNS void AS $$
    DECLARE partId INTEGER;
    DECLARE accId INTEGER;
BEGIN
    SELECT id FROM participants p WHERE p.short_name = part_name AND p.team = teamId INTO partId;
    IF NOT FOUND THEN 
        RAISE 'Participant %  not found on team %', part_name, teamId;
    END IF;
    FOR accId in (SELECT DISTINCT a.id FROM attendances a, roles r, occasions o 
        WHERE a.role=r.id AND r.occasion = o.id AND a.team = teamId AND a.participant = partId AND o.time > from_date) LOOP 
        DELETE FROM attendances WHERE id=accId;
    END LOOP;
    UPDATE participants SET team=0 WHERE ID=partId;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION replace_person_in_nonteam_role(IN new_name TEXT, IN old_name TEXT, IN role_type TEXT, IN occ_time TIMESTAMP)  RETURNS void AS $$
    DECLARE partId INTEGER;
    DECLARE oldId INTEGER;
    DECLARE accId INTEGER;
BEGIN
    SELECT id FROM participants WHERE short_name = new_name INTO partId;
    IF NOT FOUND THEN 
        RAISE 'New participant % not found', part_name;
    END IF;
    SELECT id FROM participants WHERE short_name = old_name INTO oldId;
    IF NOT FOUND THEN 
        RAISE 'Old participant % not found', part_name;
    END IF;
    SELECT a.id FROM attendances a, roles r, occasions o 
        WHERE a.role=r.id AND r.occasion = o.id AND a.team=0 AND a.participant = oldId AND r.type = role_type AND o.time = occ_time INTO accId;
    IF NOT FOUND THEN
        RAISE 'No role found of type %s for participant %s at %s', role_type, old_name, occ_time;
    END IF;
    UPDATE attendances SET participant=partId WHERE id=accId;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_person_from_nonteam_roles(IN part_name TEXT, IN from_date TIMESTAMP)  RETURNS void AS $$
    DECLARE partId INTEGER;
    DECLARE accId INTEGER;
BEGIN
    SELECT id FROM participants WHERE short_name = part_name INTO partId;
    IF NOT FOUND THEN 
        RAISE 'Participant % not found', part_name;
    END IF;
    FOR accId in (SELECT DISTINCT a.id FROM attendances a, roles r, occasions o 
        WHERE a.role=r.id AND r.occasion = o.id AND a.team = 0 AND a.participant = partId AND o.time > from_date) LOOP 
        DELETE FROM attendances WHERE id=accId;
    END LOOP;
    FOR accId in (SELECT DISTINCT a.id FROM attendances a, roles r, occasions o 
        WHERE a.role=r.id AND r.occasion = o.id AND a.team = 0 AND a.substitute = partId AND o.time > from_date) LOOP 
        UPDATE attendances SET substitute=null WHERE id=accId;
    END LOOP;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION change_person_status(IN part_name TEXT, IN type_name TEXT)  RETURNS void AS $$
    DECLARE partId INTEGER;
BEGIN
    SELECT id FROM participants WHERE short_name = part_name AND team = team INTO partId;
    IF NOT FOUND THEN 
        RAISE 'Participant %  not found', part_name;
    END IF;
    UPDATE participants SET type=type_name WHERE id=partId;
    IF type_name = 'historical' AND 0 = (SELECT COUNT(id) FROM attendances WHERE participant=partId) THEN
        DELETE FROM participants WHERE id=partId;
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
