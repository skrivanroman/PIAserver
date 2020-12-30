USE pia;
CREATE TABLE users
(
    id_use int not null AUTO_INCREMENT,
    user_name varchar(50) UNIQUE not null,
    passwd varchar(100) not null,
    PRIMARY KEY (id_use) 
);
CREATE TABLE photo_sessions
(
    id_ses int not null AUTO_INCREMENT,
    vin varchar(20) not null,
    temp_path varchar(50) not null,
    session_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    photos json,
    id_use int not null,
    PRIMARY KEY (id_ses),
    FOREIGN KEY (id_use) REFERENCES users(id_use)
);