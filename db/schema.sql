
### Schema
CREATE DATABASE food_db; 
USE food_db; 
 
 
CREATE TABLE foodtable 
( 
 	id int NOT NULL AUTO_INCREMENT, 
 	username varchar(45) NOT NULL,
	restaurant varchar(45) NOT NULL,
	description varchar(255) NOT NULL,
	whatmeal int NOT NULL,
	cost decimal(2) NOT NULL,
	date DATE NOT NULL,
 	PRIMARY KEY (id) 
 ); 
