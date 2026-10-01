

CREATE TABLE user_achievements (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            user_id INT NOT NULL,
                            achievement_id INT NOT NULL,
                            unlocked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                            FOREIGN KEY (user_id) REFERENCES users(id),
                            FOREIGN KEY (achievement_id) REFERENCES achievements(id),

                            UNIQUE (user_id, achievement_id)
);

CREATE TABLE achievements (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              code VARCHAR(50) NOT NULL UNIQUE,
                              name VARCHAR(255) NOT NULL,
                              description TEXT NOT NULL,
                              icon VARCHAR(100)
);