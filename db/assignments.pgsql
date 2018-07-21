
DELETE FROM attendances where type='assigned';
SELECT assign_role_to_person('Jim', 'dod', '2018-06-03 8:30');
SELECT assign_role_to_team(6,'dom','2018-06-03 8:30');
SELECT assign_role_to_team(5,'downstairs','2018-06-03 8:30');
SELECT assign_role_to_team(4,'downstairs','2018-06-03 8:30');
SELECT assign_role_to_team(6,'dom','2018-06-03 10:00');
SELEcT assign_role_to_team(5,'upstairs','2018-06-03 10:00');
SELEcT assign_role_to_team(4,'upstairs','2018-06-03 10:00');
SELECT assign_role_to_team(1,'downstairs','2018-06-03 8:30');
SELECT assign_role_to_team(7,'downstairs','2018-06-03 8:30');
SELECT assign_role_to_team(9,'downstairs','2018-06-03 8:30');
SELECT assign_role_to_person('Ralph', 'dod', '2018-06-17 9:00');
SELECT assign_role_to_person('Charles', 'dod', '2018-06-24 9:00');
SELECT assign_role_to_team(3, 'baptism', '2018-06-24 9:00');
SELECT assign_role_to_person('Mike', 'dod', '2018-07-01 9:00');
SELECT assign_role_to_team(7, 'dom', '2018-07-01 9:00');
SELECT assign_role_to_team(9, 'downstairs', '2018-07-01 9:00');
SELECT assign_role_to_team(2, 'downstairs', '2018-07-01 9:00');
SELECT assign_role_to_team(1, 'downstairs', '2018-07-01 9:00');
SELECT assign_role_to_person('Gary', 'dod', '2018-07-08 9:00');
SELECT assign_role_to_person('Dale', 'dod', '2018-07-15 9:00');
SELECT assign_role_to_person('Rich', 'dod', '2018-07-22 9:00');
SELECT assign_role_to_person('Ralph', 'dod', '2018-07-29 9:00');
SELECT assign_role_to_team(9, 'baptism', '2018-07-29 9:00');
SELECT assign_role_to_person('Charles', 'dod', '2018-08-05 9:00');
SELECT assign_role_to_team(8, 'dom', '2018-08-05 9:00');
SELECT assign_role_to_team(6, 'downstairs', '2018-08-05 9:00');
SELECT assign_role_to_team(4, 'downstairs', '2018-08-05 9:00');
SELECT assign_role_to_team(3, 'downstairs', '2018-08-05 9:00');
SELECT assign_role_to_person('Mike', 'dod', '2018-08-12 9:00');
SELECT assign_role_to_person('Gary', 'dod', '2018-08-19 9:00');
SELECT assign_role_to_person('Dale', 'dod', '2018-08-26 9:00');
SELECT assign_role_to_team(6, 'baptism', '2018-08-26 9:00');


