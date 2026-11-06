-- Testdata för profilsidan (endast för utveckling, ingår inte i installationen).
-- Byt användarnamnet nedan och kör skriptet i din lokala databas.
-- Kräver att achievements redan finns (02_seed.sql).

select * from users;

SET @user_id = (SELECT id FROM users WHERE username = 'anna');

-- Valfritt: rensa användarens tidigare resultat så att skriptet kan köras om.
-- DELETE FROM game_results WHERE user_id = @user_id;

INSERT INTO game_results (user_id, category, score, max_score, completed_at)
VALUES
    (@user_id, 'flags',      18, 20, NOW() - INTERVAL 2 HOUR),
    (@user_id, 'capitals',   12, 20, NOW() - INTERVAL 1 DAY),
    (@user_id, 'flags',      20, 20, NOW() - INTERVAL 2 DAY),
    (@user_id, 'population',  7, 10, NOW() - INTERVAL 3 DAY),
    (@user_id, 'neighbours',  5, 10, NOW() - INTERVAL 4 DAY),
    (@user_id, 'capitals',   15, 20, NOW() - INTERVAL 6 DAY),
    (@user_id, 'area',        8, 10, NOW() - INTERVAL 8 DAY),
    (@user_id, 'flags',      14, 20, NOW() - INTERVAL 10 DAY);

-- De sex första prestationerna, upplåsta med en dags mellanrum.
-- INSERT IGNORE hoppar över prestationer som användaren redan har.
INSERT IGNORE INTO user_achievements (user_id, achievement_id, unlocked_at)
SELECT @user_id, id, NOW() - INTERVAL id DAY
FROM achievements
ORDER BY id
LIMIT 6;