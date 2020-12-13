USE pia;
CREATE TABLE users
(
    id_use int not null AUTO_INCREMENT,
    user_name varchar(50) not null,
    passwd varchar(100) not null,
    PRIMARY KEY (id_use) 
);
CREATE TABLE photo_sessions
(
    id_ses int not null AUTO_INCREMENT,
    vin varchar(20) not null,
    session_date date DEFAULT GETDATE(),
    id_use int,
    PRIMARY KEY (id_ses),
    FOREIGN KEY (id_use) REFERENCES (users)
);
CREATE TABLE car_templates
(
    id_tem int not null AUTO_INCREMENT,
    PRIMARY KEY (id_tem)
);