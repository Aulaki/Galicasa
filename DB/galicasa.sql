CREATE DATABASE galicasa;
USE galicasa;


CREATE TABLE real_estate (
	realestate_id smallint unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username varchar(50) NOT NULL,
    email varchar(320) UNIQUE NOT NULL,
    password varchar(100) NOT NULL,
    phone varchar(15) NOT NULL,
    biography tinytext,
    avatar varchar(100) DEFAULT NULL
);

CREATE TABLE province (
province_id tinyint unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
province varchar(20) NOT NULL
);

CREATE TABLE city (
city_id smallint unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
city varchar(50) NOT NULL,
province_id tinyint unsigned NOT NULL,
CONSTRAINT fk_province FOREIGN KEY (province_id) REFERENCES province (province_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE property (
	property_id smallint unsigned NOT NULL PRIMARY KEY AUTO_INCREMENT,
	city_id smallint unsigned NOT NULL,
    CONSTRAINT fk_city FOREIGN KEY (city_id) REFERENCES city (city_id) ON DELETE CASCADE ON UPDATE CASCADE,
    address varchar(100) NOT NULL,
    construction_year year(4) NOT NULL,
    area tinyint unsigned NOT NULL,
    description tinytext,
    photo varchar(100),
    realestate_id smallint unsigned NOT NULL,
    CONSTRAINT fk_realestate FOREIGN KEY (realestate_id) REFERENCES real_estate (realestate_id) ON DELETE CASCADE ON UPDATE CASCADE,
	is_deleted boolean NOT NULL DEFAULT false
);


ALTER TABLE property ADD COLUMN price MEDIUMINT UNSIGNED NOT NULL;
ALTER TABLE property ADD COLUMN discount TINYINT UNSIGNED DEFAULT 0;
ALTER TABLE property ADD COLUMN insertdata DATETIME DEFAULT CURRENT_TIMESTAMP();
ALTER TABLE property ADD COLUMN is_sold BOOLEAN NOT NULL DEFAULT false;