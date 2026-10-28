SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS CountryStatistics
(
    CountryID
    INT
    PRIMARY
    KEY,
    Population
    BIGINT
    UNSIGNED
    NOT
    NULL,
    PopulationYear
    SMALLINT
    NOT
    NULL
    DEFAULT
    2025,
    PopulationSource
    VARCHAR
(
    100
) NOT NULL DEFAULT 'Världsbanken',
    AreaKm2 DECIMAL
(
    14,
    2
) NOT NULL,
    AreaSource VARCHAR
(
    100
) NOT NULL DEFAULT 'mledoze/countries',
    FOREIGN KEY
(
    CountryID
)
    REFERENCES Countries
(
    CountryID
)
    ON DELETE CASCADE
    );

-- Befolkning avser 2025.

START TRANSACTION;

INSERT INTO CountryStatistics (CountryID,
                               Population,
                               PopulationYear,
                               AreaKm2)
VALUES
    -- Norden
    (1, 6009169, 2025, 43094),        -- Danmark
    (2, 5646436, 2025, 338424),       -- Finland
    (3, 392404, 2025, 103000),        -- Island
    (4, 5610870, 2025, 323802),       -- Norge
    (5, 10596620, 2025, 450295),      -- Sverige
    (6, 30836, 2025, 1580),           -- Åland
    (7, 54900, 2025, 1393),           -- Färöarna
    (8, 56831, 2025, 2166086),        -- Grönland

    -- Europa
    (9, 2349580, 2025, 28748),        -- Albanien
    (10, 82904, 2025, 468),           -- Andorra
    (11, 9208163, 2025, 83871),       -- Österrike
    (12, 9085991, 2025, 207600),      -- Belarus
    (13, 11941781, 2025, 30528),      -- Belgien
    (14, 3140095, 2025, 51209),       -- Bosnien och Hercegovina
    (15, 6433302, 2025, 110879),      -- Bulgarien
    (16, 68720337, 2025, 551695),     -- Frankrike
    (17, 10413962, 2025, 131990),     -- Grekland
    (18, 5484367, 2025, 70273),       -- Irland
    (19, 58915656, 2025, 301336),     -- Italien
    (20, 1576876, 2025, 10908),       -- Kosovo
    (21, 3876200, 2025, 56594),       -- Kroatien
    (22, 1847785, 2025, 64559),       -- Lettland
    (23, 41024, 2025, 160),           -- Liechtenstein
    (24, 2888774, 2025, 65300),       -- Litauen
    (25, 686970, 2025, 2586),         -- Luxemburg
    (26, 579704, 2025, 316),          -- Malta
    (27, 2360527, 2025, 33846),       -- Moldavien
    (28, 38341, 2025, 2.02),          -- Monaco
    (29, 623129, 2025, 13812),        -- Montenegro
    (30, 18087633, 2025, 41850),      -- Nederländerna
    (31, 1820909, 2025, 25713),       -- Nordmakedonien
    (32, 36435861, 2025, 312679),     -- Polen
    (33, 10804871, 2025, 92090),      -- Portugal
    (34, 19020271, 2025, 238391),     -- Rumänien
    (35, 143513328, 2025, 17098242),  -- Ryssland
    (36, 34109, 2025, 61),            -- San Marino
    (37, 9092436, 2025, 41284),       -- Schweiz
    (38, 6549143, 2025, 88361),       -- Serbien
    (39, 5413813, 2025, 49037),       -- Slovakien
    (40, 2130986, 2025, 20273),       -- Slovenien
    (41, 49355143, 2025, 505992),     -- Spanien
    (42, 69487000, 2025, 242900),     -- Storbritannien
    (43, 10886878, 2025, 78865),      -- Tjeckien
    (44, 83491249, 2025, 357114),     -- Tyskland
    (45, 38980376, 2025, 603500),     -- Ukraina
    (46, 9514251, 2025, 93028),       -- Ungern
    (47, 501, 2025, 0.44),            -- Vatikanstaten

    -- Afrika
    (48, 47435312, 2025, 2381741),    -- Algeriet
    (49, 39040039, 2025, 1246700),    -- Angola
    (50, 14814460, 2025, 112622),     -- Benin
    (51, 2562122, 2025, 582000),      -- Botswana
    (52, 24074580, 2025, 272967),     -- Burkina Faso
    (53, 14390003, 2025, 27834),      -- Burundi
    (54, 5513282, 2025, 622984),      -- Centralafrikanska republiken
    (55, 112832473, 2025, 2344858),   -- Demokratiska republiken Kongo
    (56, 1184076, 2025, 23200),       -- Djibouti
    (57, 118365995, 2025, 1002450),   -- Egypten
    (58, 1938431, 2025, 28051),       -- Ekvatorialguinea
    (59, 32711547, 2025, 322463),     -- Elfenbenskusten
    (60, 3607003, 2025, 117600),      -- Eritrea
    (61, 1256174, 2025, 17364),       -- Eswatini
    (62, 135472051, 2025, 1104300),   -- Etiopien
    (63, 2593130, 2025, 267668),      -- Gabon
    (64, 2822093, 2025, 10689),       -- Gambia
    (65, 35064272, 2025, 238533),     -- Ghana
    (66, 15099727, 2025, 245857),     -- Guinea
    (67, 2249515, 2025, 36125),       -- Guinea-Bissau
    (68, 29879337, 2025, 475442),     -- Kamerun
    (69, 527326, 2025, 4033),         -- Kap Verde
    (70, 57532493, 2025, 580367),     -- Kenya
    (71, 882847, 2025, 1862),         -- Komorerna
    (72, 6484437, 2025, 342000),      -- Kongo-Brazzaville
    (73, 2363325, 2025, 30355),       -- Lesotho
    (74, 5731206, 2025, 111369),      -- Liberia
    (75, 7458555, 2025, 1759540),     -- Libyen
    (76, 32740678, 2025, 587041),     -- Madagaskar
    (77, 22216120, 2025, 118484),     -- Malawi
    (78, 25198821, 2025, 1240192),    -- Mali
    (79, 38430770, 2025, 446550),     -- Marocko
    (80, 5315065, 2025, 1030700),     -- Mauretanien
    (81, 1243741, 2025, 2040),        -- Mauritius
    (82, 35631653, 2025, 801590),     -- Moçambique
    (83, 3092816, 2025, 825615),      -- Namibia
    (84, 27917831, 2025, 1267000),    -- Niger
    (85, 237527782, 2025, 923768),    -- Nigeria
    (86, 14569341, 2025, 26338),      -- Rwanda
    (87, 240254, 2025, 964),          -- São Tomé och Príncipe
    (88, 18931966, 2025, 196722),     -- Senegal
    (89, 122730, 2025, 452),          -- Seychellerna
    (90, 8819794, 2025, 71740),       -- Sierra Leone
    (91, 19654739, 2025, 637657),     -- Somalia
    (92, 51662147, 2025, 1886068),    -- Sudan
    (93, 64747319, 2025, 1221037),    -- Sydafrika
    (94, 12188788, 2025, 619745),     -- Sydsudan
    (95, 70545865, 2025, 945087),     -- Tanzania
    (96, 21003705, 2025, 1284000),    -- Tchad
    (97, 8591626, 2025, 56785),       -- Togo
    (98, 12348573, 2025, 163610),     -- Tunisien
    (99, 51384894, 2025, 241550),     -- Uganda
    (100, 21913874, 2025, 752612),    -- Zambia
    (101, 16950795, 2025, 390757),    -- Zimbabwe

    -- Nordamerika
    (102, 94209, 2025, 442),          -- Antigua och Barbuda
    (103, 403033, 2025, 13943),       -- Bahamas
    (104, 282623, 2025, 430),         -- Barbados
    (105, 41651653, 2025, 9984670),   -- Kanada
    (106, 10937203, 2025, 109884),    -- Kuba
    (107, 65871, 2025, 751),          -- Dominica
    (108, 11520487, 2025, 48671),     -- Dominikanska republiken
    (109, 117303, 2025, 344),         -- Grenada
    (110, 11906095, 2025, 27750),     -- Haiti
    (111, 2837077, 2025, 10991),      -- Jamaica
    (112, 131946900, 2025, 1964375),  -- Mexiko
    (113, 46922, 2025, 261),          -- Saint Kitts och Nevis
    (114, 180149, 2025, 616),         -- Saint Lucia
    (115, 99924, 2025, 389),          -- Saint Vincent och Grenadinerna
    (116, 1367764, 2025, 5130),       -- Trinidad och Tobago
    (117, 341784857, 2025, 9372610),  -- USA

    -- Centralamerika
    (118, 422924, 2025, 22966),       -- Belize
    (119, 5152950, 2025, 51100),      -- Costa Rica
    (120, 6365503, 2025, 21041),      -- El Salvador
    (121, 18687881, 2025, 108889),    -- Guatemala
    (122, 11005850, 2025, 112492),    -- Honduras
    (123, 7007502, 2025, 130373),     -- Nicaragua
    (124, 4571189, 2025, 75417),      -- Panama

    -- Sydamerika
    (125, 45851378, 2025, 2780400),   -- Argentina
    (126, 12581843, 2025, 1098581),   -- Bolivia
    (127, 212812405, 2025, 8515767),  -- Brasilien
    (128, 19859921, 2025, 756102),    -- Chile
    (129, 53425635, 2025, 1141748),   -- Colombia
    (130, 18289896, 2025, 276841),    -- Ecuador
    (131, 835986, 2025, 214969),      -- Guyana
    (132, 7013078, 2025, 406752),     -- Paraguay
    (133, 34576665, 2025, 1285216),   -- Peru
    (134, 639850, 2025, 163820),      -- Surinam
    (135, 3384688, 2025, 181034),     -- Uruguay
    (136, 28516896, 2025, 916445),    -- Venezuela

    -- Asien
    (137, 43844111, 2025, 652230),    -- Afghanistan
    (138, 3086700, 2025, 29743),      -- Armenien
    (139, 10246996, 2025, 86600),     -- Azerbajdzjan
    (140, 1600366, 2025, 765),        -- Bahrain
    (141, 175686899, 2025, 147570),   -- Bangladesh
    (142, 796682, 2025, 38394),       -- Bhutan
    (143, 466330, 2025, 5765),        -- Brunei
    (144, 1370754, 2025, 9251),       -- Cypern
    (145, 116786962, 2025, 342353),   -- Filippinerna
    (146, 11513149, 2025, 83600),     -- Förenade Arabemiraten
    (147, 3935766, 2025, 69700),      -- Georgien
    (148, 1463865525, 2025, 3287590), -- Indien
    (149, 285721236, 2025, 1904569),  -- Indonesien
    (150, 47020774, 2025, 438317),    -- Irak
    (151, 92417681, 2025, 1648195),   -- Iran
    (152, 10122800, 2025, 20770),     -- Israel
    (153, 123366734, 2025, 377930),   -- Japan
    (154, 41773878, 2025, 527968),    -- Jemen
    (155, 11520684, 2025, 89342),     -- Jordanien
    (156, 17847982, 2025, 181035),    -- Kambodja
    (157, 20843754, 2025, 2724900),   -- Kazakstan
    (158, 1406585000, 2025, 9706961), -- Kina
    (159, 7343064, 2025, 199951),     -- Kirgizistan
    (160, 4865298, 2025, 17818),      -- Kuwait
    (161, 7873046, 2025, 236800),     -- Laos
    (162, 5849421, 2025, 10452),      -- Libanon
    (163, 35977838, 2025, 330803),    -- Malaysia
    (164, 529676, 2025, 300),         -- Maldiverna
    (165, 3568978, 2025, 1564110),    -- Mongoliet
    (166, 54850648, 2025, 676578),    -- Myanmar
    (167, 29618118, 2025, 147181),    -- Nepal
    (168, 26571036, 2025, 120538),    -- Nordkorea
    (169, 5494691, 2025, 309500),     -- Oman
    (170, 255219554, 2025, 881912),   -- Pakistan
    (171, 5413596, 2025, 6220),       -- Palestina
    (172, 2972215, 2025, 11586),      -- Qatar
    (173, 36973555, 2025, 2149690),   -- Saudiarabien
    (174, 6111175, 2025, 710),        -- Singapore
    (175, 21756000, 2025, 65610),     -- Sri Lanka
    (176, 51684564, 2025, 100210),    -- Sydkorea
    (177, 25620427, 2025, 185180),    -- Syrien
    (178, 10786734, 2025, 143100),    -- Tadzjikistan
    (179, 71619863, 2025, 513120),    -- Thailand
    (180, 7618847, 2025, 488100),     -- Turkmenistan
    (181, 85878556, 2025, 783562),    -- Turkiet
    (182, 37053428, 2025, 447400),    -- Uzbekistan
    (183, 101598527, 2025, 331212),   -- Vietnam
    (184, 1418517, 2025, 14874),      -- Östtimor

    -- Oceanien
    (185, 27614411, 2025, 7692024),   -- Australien
    (186, 933154, 2025, 18272),       -- Fiji
    (187, 136488, 2025, 811),         -- Kiribati
    (188, 36282, 2025, 181),          -- Marshallöarna
    (189, 113683, 2025, 702),         -- Mikronesien
    (190, 12025, 2025, 21),           -- Nauru
    (191, 5324700, 2025, 270467),     -- Nya Zeeland
    (192, 17663, 2025, 459),          -- Palau
    (193, 10762817, 2025, 462840),    -- Papua Nya Guinea
    (194, 219306, 2025, 2842),        -- Samoa
    (195, 838645, 2025, 28896),       -- Salomonöarna
    (196, 103742, 2025, 747),         -- Tonga
    (197, 9492, 2025, 26),            -- Tuvalu
    (198, 335169, 2025, 12189)        -- Vanuatu

    AS newData
ON DUPLICATE KEY
UPDATE
    Population = newData.Population,
    PopulationYear = newData.PopulationYear,
    AreaKm2 = newData.AreaKm2;

UPDATE CountryStatistics
SET PopulationSource = 'Världsbanken',
    AreaSource       = 'mledoze/countries'
WHERE CountryID BETWEEN 1 AND 198;

UPDATE CountryStatistics
SET PopulationSource = 'ÅSUB'
WHERE CountryID = 6;

UPDATE CountryStatistics
SET PopulationSource = 'FN WPP 2024, prognos för 2025'
WHERE CountryID = 47;

COMMIT;