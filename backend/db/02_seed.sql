INSERT IGNORE INTO achievements
(code, name, description, icon, trigger_type, threshold, category)
VALUES
    (
        'FIRST_LOGIN',
        'Första inloggningen',
        'Logga in för första gången.',
        '👋',
        'login',
        1,
        NULL
    ),
    (
        'TEN_LOGINS',
        'Stamgäst',
        'Logga in 10 gånger.',
        '⭐',
        'login',
        10,
        NULL
    ),
    (
        'FIRST_GAME',
        'Första spelet',
        'Slutför ditt första spel.',
        '🌍',
        'game_completed',
        1,
        NULL
    ),
    (
        'TEN_GAMES',
        'Flitig',
        'Slutför 10 spel.',
        '🔥',
        'game_completed',
        10,
        NULL
    ),
    (
        'FIFTY_GAMES',
        'Veteran',
        'Slutför 50 spel.',
        '🏅',
        'game_completed',
        50,
        NULL
    ),
    (
        'GOOD_JOB',
        'Bra jobbat',
        'Få minst 80 procent på ett spel.',
        '👏',
        'high_score',
        80,
        NULL
    ),
    (
        'PERFECT_GAME',
        'Perfekt',
        'Få 100 procent på ett spel.',
        '🏆',
        'high_score',
        100,
        NULL
    ),
    (
        'FLAGS_EXPERT',
        'Flaggexpert',
        'Få 100 procent i kategorin flags.',
        '🚩',
        'high_score',
        100,
        'flags'
    );

INSERT IGNORE INTO achievements
(code, name, description, icon, image,
 trigger_type, threshold, category)
VALUES
    (
        'CAPITALS_EXPERT',
        'Huvudstadsexpert',
        'Få 100 % rätt på ett quiz om huvudstäder.',
        '🏛️',
        NULL,
        'high_score',
        100,
        'capitals'
    );


SELECT
    u.username,
    a.code,
    a.name,
    a.category,
    ua.unlocked_at
FROM user_achievements ua
         JOIN users u
              ON u.id = ua.user_id
         JOIN achievements a
              ON a.id = ua.achievement_id
WHERE ua.user_id = 4
ORDER BY ua.unlocked_at DESC;

SELECT
    code,
    trigger_type,
    threshold,
    category
FROM achievements
WHERE code IN (
               'GOOD_JOB',
               'PERFECT_GAME',
               'FLAGS_EXPERT',
               'CAPITALS_EXPERT'
    )
ORDER BY code;

SELECT
    user_id,
    achievement_id,
    COUNT(*) AS antal
FROM user_achievements
GROUP BY user_id, achievement_id
HAVING COUNT(*) > 1;