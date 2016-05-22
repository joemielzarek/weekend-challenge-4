CREATE DATABASE muthree;

CREATE TABLE honey (
    id serial PRIMARY KEY,
    first_name varchar(100)
);

CREATE TABLE tasks (
    id serial PRIMARY KEY,
    name varchar(100),
   	description varchar (500),
    goal_date varchar(10),
    complete boolean DEFAULT false,
    honey_id integer
);
