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