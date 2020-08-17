drop database if exists game;
create database game;
use game;

create table if not exists Users (
  ID varchar(60) primary key unique /* goog id */
);

create table if not exists Companions (
  ID int primary key auto_increment,
  Name varchar(60) not null
);

/**
 * a user may have many loadouts
 */
create table if not exists Loadouts (
  ID int primary key auto_increment,
  User_ID varchar(60) not null,
  Name varchar(60) not null,
  constraint FK_User foreign key (User_ID) references Users (ID)
);

/**
 * joiner table between loadouts and Companions
 * a loadout is a set of 4 companions
 * a companion may be selected by used in more than one loadout
 */
create table if not exists Loadouts_Companions (
  Loadout_ID int not null,
  Companion_ID int not null,
  primary key (Loadout_ID, Companion_ID),
  constraint FK_Loadout foreign key (Loadout_ID) references Loadouts (ID),
  constraint FK_Companion foreign key (Companion_ID) references Companions (ID)
);
