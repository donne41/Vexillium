ALTER TABLE Rooms
    ADD COLUMN OwnerUserID INT NULL,
    ADD CONSTRAINT fk_rooms_owner_user
        FOREIGN KEY (OwnerUserID)
        REFERENCES users(id)
        ON DELETE SET NULL;