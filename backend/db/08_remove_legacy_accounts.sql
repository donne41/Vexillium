DROP TABLE AccountsRooms;

ALTER TABLE Rooms
DROP FOREIGN KEY Rooms_ibfk_1,
    DROP COLUMN RoomAdminID;

DROP TABLE Accounts;