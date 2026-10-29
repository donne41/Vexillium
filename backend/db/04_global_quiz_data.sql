CREATE TABLE IF NOT EXISTS CountryNeighbours (
    CountryID INT PRIMARY KEY,
    Neighbours JSON NOT NULL,

    FOREIGN KEY (CountryID)
        REFERENCES Countries(CountryID)
        ON DELETE CASCADE
    );

-- ID-numren = befintliga länder i databas.
-- [] = landet saknar landgrannar bland länderna.

START TRANSACTION;

INSERT INTO CountryNeighbours (CountryID, Neighbours)
VALUES
    -- Norden
    (1, '[44]'),                          -- Danmark
    (2, '[4,5,35]'),                      -- Finland
    (3, '[]'),                            -- Island
    (4, '[2,5,35]'),                      -- Norge
    (5, '[2,4]'),                         -- Sverige
    (6, '[]'),                            -- Åland
    (7, '[]'),                            -- Färöarna
    (8, '[105]'),                         -- Grönland

    -- Europa
    (9, '[29,17,31,20]'),                 -- Albanien
    (10, '[16,41]'),                      -- Andorra
    (11, '[43,44,46,19,23,39,40,37]'),     -- Österrike
    (12, '[22,24,32,35,45]'),              -- Belarus
    (13, '[16,44,25,30]'),                 -- Belgien
    (14, '[21,29,38]'),                    -- Bosnien och Hercegovina
    (15, '[17,31,34,38,181]'),             -- Bulgarien
    (16, '[10,13,44,19,25,28,41,37]'),     -- Frankrike
    (17, '[9,15,181,31]'),                -- Grekland
    (18, '[42]'),                         -- Irland
    (19, '[11,16,36,40,37,47]'),           -- Italien
    (20, '[9,31,29,38]'),                  -- Kosovo
    (21, '[14,46,29,38,40]'),              -- Kroatien
    (22, '[12,24,35]'),                    -- Lettland
    (23, '[11,37]'),                      -- Liechtenstein
    (24, '[12,22,32,35]'),                 -- Litauen
    (25, '[13,16,44]'),                    -- Luxemburg
    (26, '[]'),                           -- Malta
    (27, '[34,45]'),                      -- Moldavien
    (28, '[16]'),                         -- Monaco
    (29, '[9,14,21,20,38]'),               -- Montenegro
    (30, '[13,44]'),                      -- Nederländerna
    (31, '[9,15,17,20,38]'),               -- Nordmakedonien
    (32, '[12,43,44,24,35,39,45]'),        -- Polen
    (33, '[41]'),                         -- Portugal
    (34, '[15,46,27,38,45]'),              -- Rumänien
    (35, '[139,12,158,2,147,157,168,22,24,165,4,32,45]'), -- Ryssland
    (36, '[19]'),                         -- San Marino
    (37, '[11,16,19,23,44]'),              -- Schweiz
    (38, '[14,15,21,46,20,31,29,34]'),     -- Serbien
    (39, '[11,43,46,32,45]'),              -- Slovakien
    (40, '[11,21,19,46]'),                 -- Slovenien
    (41, '[10,16,33,79]'),                 -- Spanien
    (42, '[18]'),                         -- Storbritannien
    (43, '[11,44,32,39]'),                 -- Tjeckien
    (44, '[11,13,43,1,16,25,30,32,37]'),   -- Tyskland
    (45, '[12,46,27,32,34,35,39]'),        -- Ukraina
    (46, '[11,21,34,38,39,40,45]'),        -- Ungern
    (47, '[19]'),                         -- Vatikanstaten

    -- Afrika
    (48, '[98,75,84,80,78,79]'),           -- Algeriet
    (49, '[72,55,100,83]'),                -- Angola
    (50, '[52,84,85,97]'),                 -- Benin
    (51, '[83,93,100,101]'),               -- Botswana
    (52, '[50,59,65,78,84,97]'),           -- Burkina Faso
    (53, '[55,86,95]'),                    -- Burundi
    (54, '[68,96,55,72,94,92]'),           -- Centralafrikanska republiken
    (55, '[49,53,54,72,86,94,95,99,100]'), -- Demokratiska republiken Kongo
    (56, '[60,62,91]'),                    -- Djibouti
    (57, '[152,75,171,92]'),               -- Egypten
    (58, '[68,63]'),                      -- Ekvatorialguinea
    (59, '[52,65,66,74,78]'),              -- Elfenbenskusten
    (60, '[56,62,92]'),                    -- Eritrea
    (61, '[82,93]'),                      -- Eswatini
    (62, '[56,60,70,91,94,92]'),           -- Etiopien
    (63, '[68,72,58]'),                    -- Gabon
    (64, '[88]'),                         -- Gambia
    (65, '[52,59,97]'),                    -- Ghana
    (66, '[59,67,74,78,88,90]'),           -- Guinea
    (67, '[66,88]'),                      -- Guinea-Bissau
    (68, '[54,96,72,58,63,85]'),           -- Kamerun
    (69, '[]'),                           -- Kap Verde
    (70, '[62,91,94,95,99]'),              -- Kenya
    (71, '[]'),                           -- Komorerna
    (72, '[49,68,54,55,63]'),              -- Kongo-Brazzaville
    (73, '[93]'),                         -- Lesotho
    (74, '[66,59,90]'),                    -- Liberia
    (75, '[48,96,57,84,92,98]'),           -- Libyen
    (76, '[]'),                           -- Madagaskar
    (77, '[82,95,100]'),                   -- Malawi
    (78, '[48,52,66,59,80,84,88]'),        -- Mali
    (79, '[48,41]'),                      -- Marocko
    (80, '[48,78,88]'),                    -- Mauretanien
    (81, '[]'),                           -- Mauritius
    (82, '[77,93,61,95,100,101]'),         -- Moçambique
    (83, '[49,51,93,100]'),                -- Namibia
    (84, '[48,50,52,96,75,78,85]'),        -- Niger
    (85, '[50,68,96,84]'),                 -- Nigeria
    (86, '[53,55,95,99]'),                 -- Rwanda
    (87, '[]'),                           -- São Tomé och Príncipe
    (88, '[64,66,67,78,80]'),              -- Senegal
    (89, '[]'),                           -- Seychellerna
    (90, '[66,74]'),                      -- Sierra Leone
    (91, '[56,62,70]'),                    -- Somalia
    (92, '[54,96,57,60,62,75,94]'),        -- Sudan
    (93, '[51,73,82,83,61,101]'),          -- Sydafrika
    (94, '[54,55,62,70,92,99]'),           -- Sydsudan
    (95, '[53,55,70,77,82,86,99,100]'),    -- Tanzania
    (96, '[68,54,75,84,85,92]'),           -- Tchad
    (97, '[50,52,65]'),                    -- Togo
    (98, '[48,75]'),                      -- Tunisien
    (99, '[55,70,86,94,95]'),              -- Uganda
    (100, '[49,51,55,77,82,83,95,101]'),   -- Zambia
    (101, '[51,82,93,100]'),               -- Zimbabwe

    -- Nordamerika
    (102, '[]'),                          -- Antigua och Barbuda
    (103, '[]'),                          -- Bahamas
    (104, '[]'),                          -- Barbados
    (105, '[117,8]'),                     -- Kanada
    (106, '[]'),                          -- Kuba
    (107, '[]'),                          -- Dominica
    (108, '[110]'),                       -- Dominikanska republiken
    (109, '[]'),                          -- Grenada
    (110, '[108]'),                       -- Haiti
    (111, '[]'),                          -- Jamaica
    (112, '[118,121,117]'),               -- Mexiko
    (113, '[]'),                          -- Saint Kitts och Nevis
    (114, '[]'),                          -- Saint Lucia
    (115, '[]'),                          -- Saint Vincent och Grenadinerna
    (116, '[]'),                          -- Trinidad och Tobago
    (117, '[105,112]'),                   -- USA

    -- Centralamerika
    (118, '[121,112]'),                   -- Belize
    (119, '[123,124]'),                   -- Costa Rica
    (120, '[121,122]'),                   -- El Salvador
    (121, '[118,120,122,112]'),           -- Guatemala
    (122, '[121,120,123]'),               -- Honduras
    (123, '[119,122]'),                   -- Nicaragua
    (124, '[129,119]'),                   -- Panama

    -- Sydamerika
    (125, '[126,127,128,132,135]'),       -- Argentina
    (126, '[125,127,128,132,133]'),       -- Bolivia
    (127, '[125,126,129,131,132,133,134,135,136]'), -- Brasilien
    (128, '[125,126,133]'),               -- Chile
    (129, '[127,130,124,133,136]'),       -- Colombia
    (130, '[129,133]'),                   -- Ecuador
    (131, '[127,134,136]'),               -- Guyana
    (132, '[125,126,127]'),               -- Paraguay
    (133, '[126,127,128,129,130]'),       -- Peru
    (134, '[127,131]'),                   -- Surinam
    (135, '[125,127]'),                   -- Uruguay
    (136, '[127,129,131]'),               -- Venezuela

    -- Asien
    (137, '[151,170,180,182,178,158]'),   -- Afghanistan
    (138, '[139,147,151,181]'),           -- Armenien
    (139, '[138,147,151,35,181]'),        -- Azerbajdzjan
    (140, '[]'),                          -- Bahrain
    (141, '[166,148]'),                   -- Bangladesh
    (142, '[158,148]'),                   -- Bhutan
    (143, '[163]'),                       -- Brunei
    (144, '[]'),                          -- Cypern
    (145, '[]'),                          -- Filippinerna
    (146, '[169,173]'),                   -- Förenade Arabemiraten
    (147, '[138,139,35,181]'),            -- Georgien
    (148, '[141,142,166,158,167,170]'),   -- Indien
    (149, '[184,163,193]'),               -- Indonesien
    (150, '[151,155,160,173,177,181]'),   -- Irak
    (151, '[137,138,139,150,170,181,180]'), -- Iran
    (152, '[57,155,162,171,177]'),        -- Israel
    (153, '[]'),                          -- Japan
    (154, '[169,173]'),                   -- Jemen
    (155, '[150,152,171,173,177]'),       -- Jordanien
    (156, '[161,179,183]'),               -- Kambodja
    (157, '[158,159,35,180,182]'),        -- Kazakstan
    (158, '[137,142,166,148,157,167,168,159,161,165,170,35,178,183]'), -- Kina
    (159, '[158,157,178,182]'),           -- Kirgizistan
    (160, '[150,173]'),                   -- Kuwait
    (161, '[166,156,158,179,183]'),       -- Laos
    (162, '[152,177]'),                   -- Libanon
    (163, '[143,149,179]'),               -- Malaysia
    (164, '[]'),                          -- Maldiverna
    (165, '[158,35]'),                    -- Mongoliet
    (166, '[141,158,148,161,179]'),       -- Myanmar
    (167, '[158,148]'),                   -- Nepal
    (168, '[158,176,35]'),                -- Nordkorea
    (169, '[173,146,154]'),               -- Oman
    (170, '[137,158,148,151]'),           -- Pakistan
    (171, '[152,57,155]'),                -- Palestina
    (172, '[173]'),                       -- Qatar
    (173, '[150,155,160,169,172,146,154]'), -- Saudiarabien
    (174, '[]'),                          -- Singapore
    (175, '[]'),                          -- Sri Lanka
    (176, '[168]'),                       -- Sydkorea
    (177, '[150,152,155,162,181]'),       -- Syrien
    (178, '[137,158,159,182]'),           -- Tadzjikistan
    (179, '[166,156,161,163]'),           -- Thailand
    (180, '[137,151,157,182]'),           -- Turkmenistan
    (181, '[138,139,15,147,17,151,150,177]'), -- Turkiet
    (182, '[137,157,159,178,180]'),       -- Uzbekistan
    (183, '[156,158,161]'),               -- Vietnam
    (184, '[149]'),                       -- Östtimor

    -- Oceanien
    (185, '[]'),                          -- Australien
    (186, '[]'),                          -- Fiji
    (187, '[]'),                          -- Kiribati
    (188, '[]'),                          -- Marshallöarna
    (189, '[]'),                          -- Mikronesien
    (190, '[]'),                          -- Nauru
    (191, '[]'),                          -- Nya Zeeland
    (192, '[]'),                          -- Palau
    (193, '[149]'),                       -- Papua Nya Guinea
    (194, '[]'),                          -- Samoa
    (195, '[]'),                          -- Salomonöarna
    (196, '[]'),                          -- Tonga
    (197, '[]'),                          -- Tuvalu
    (198, '[]')                           -- Vanuatu

    AS newData
ON DUPLICATE KEY UPDATE
                     Neighbours = newData.Neighbours;

COMMIT;