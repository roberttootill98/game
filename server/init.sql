drop database if exists gameDatabase;
create database gameDatabase;
use gameDatabase;

create table if not exists Users (
  User_id int primary key auto_increment,
  Username varchar(60) not null unique,
  Password varchar(60) not null
);
