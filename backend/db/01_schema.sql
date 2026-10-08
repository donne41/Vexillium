

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
                              icon VARCHAR(100),
                              image VARCHAR(100)

);

CREATE TABLE game_results (
                              id INT AUTO_INCREMENT PRIMARY KEY,
                              user_id INT NOT NULL,
                              category VARCHAR(50) NOT NULL,
                              score INT NOT NULL,
                              max_score INT NOT NULL,
                              completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              INDEX idx_game_results_user_id (user_id),

                              FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       login_count INT NOT NULL DEFAULT 0,
                       last_login_at DATETIME NULL,
                       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE achievements
    ADD COLUMN trigger_type VARCHAR(50) NOT NULL,
    ADD COLUMN threshold INT NOT NULL,
    ADD COLUMN category VARCHAR(50) NULL;