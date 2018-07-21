DELETE FROM participants;
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Alan','Alan Brown','alanbrown14@comcast.net', 5);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Ava','Ava Smigliani','smiglez123@gmail.com', 5);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Bill-M','Bill McIntyre','williammcintyre2@comcast.net', 6);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Bill-T','Bill Thorpe','photobillnh@gmail.com', 7);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Cayden','Cayden Plummer','caydenplummer@gmail.com', 8);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Charles','Charles Okorie','design_cbd@yahoo.com', 7);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Dale','Dale Neth','ynotdale@gmail.com', 1);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Eli','Eli Whitney','ew.whitney@comcast.net', 9);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Gary','Gary Lambert','lambert@lambertpatentlaw.com', 8);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Jim','Jim Stone','jstone17@comcast.net', 2);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Joe','Joe Hines','hoganhines@comcast.net', 9);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Kim','Kimberly Lynch','kimberlylynch4@gmail.com', 2);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Laurie','Laurie Kofstad','lkofstad@gmail.com', 6);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Mike','Mike Winton','michaelwinton@comcast.net', 3);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Ralph','Ralph Mack','ralphmack@comcast.net', 1);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Rich','Rich Smigliani','erichsmig@comcast.net', 3);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Roy','Roy Rumbaugh','royrumbaugh@me.com', 4);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Sandra','Sandra Rumbaugh','svrumbaugh@me.com', 4);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Erin','Erin Shannon','erin.shannon@yahoo.com', 0);
INSERT INTO participants (type, short_name, full_name, email, team ) 
    VALUES ('deacon','Tom','Tom Donovan','tadonovan27@hotmail.com', 0);
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Karen','Karen Menchion','kbmenchion@comcast.net');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Caryl','Caryl Sullivan','Caryl.Sullivan@dell.com');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Jan','Jan Hanks','grammyjan@comcast.net');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Walter','Walter Marquis','walterjmarquis@yahoo.com');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Mary','Mary Dopp','mtjoyce@aol.com');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','JoAnn','Jo Ann Anderson','joann1110@gmail.com');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Ray','Ray Baldwin','RCBal6494@aol.com');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Colleen','Colleen Hogan','hoganhines@comcast.net');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Maribeth','Maribeth Stone','maribethstone@gmail.com');
INSERT INTO participants (type, short_name, full_name, email) 
    VALUES ('substitute','Keanna','Keanna Smigliani','keannasmig@gmail.com');

UPDATE participants SET office='chair' WHERE short_name='Gary';
UPDATE participants SET office='treasurer' WHERE short_name='Mike';
UPDATE participants SET office='secretary' WHERE short_name='Sandra';
UPDATE participants SET office='co-chair' WHERE short_name='?';

UPDATE participants SET family=1 WHERE short_name IN ('Roy','Sandra');
UPDATE participants SET family=2 WHERE short_name in ('Ava','Rich','Keanna');
UPDATE participants SET family=3 WHERE short_name in ('Jim','Maribeth');
UPDATE participants SET family=4 WHERE short_name in ('Joe','Colleen');
