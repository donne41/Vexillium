create database if not exists vexilliumDB;
use vexilliumDB;

create table Countries
(
    CountryID   int auto_increment primary key,
    Countryname VARCHAR(250),
    Flag        varchar(100),
    Capital     varchar(250),
    Region    varchar(100)
);

create table Questions
(
    QuestionID int auto_increment primary key,
    Question   varchar(250),
    AnswerID   int,
    FOREIGN KEY (AnswerID) REFERENCES Countries (countryID)
);

create table Accounts
(
    AccountID int auto_increment primary key,
    Username  varchar(250),
    Password  varchar(250),
    Score     int
);

create table Rooms
(
    RoomID      int auto_increment primary key,
    RoomAdminID int,
    QuestionsID int,
    FOREIGN KEY (RoomAdminID) references Accounts (AccountID),
    FOREIGN KEY (QuestionsID) references Questions (QuestionID)
);

create table AccountsRooms
(
    AccRoomsID int auto_increment primary key,
    AccountID  int,
    RoomID     int,
    foreign key (AccountID) references Accounts (AccountID)
);
