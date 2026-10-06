use vexilliumDB;

## fix utf-8

insert into Regions(Regionname, RegionsID)
values ('Norden', 1),
       ('Europa', 2),
       ('Afrika', 3),
       ('Nord Amerika', 4),
       ('Central Amerika',5),
       ('Syd Amerika', 6),
       ('Asien', 7),
       ('Ocianien', 8);

## Nordic
insert into Countries(Countryname, Capital, Flag, RegionID)
values ('Danmark', 'Köpenhamn', 'https://flagpedia.net/data/flags/w1160/dk.webp', 1),
       ('Finland', 'Helsinki', 'https://flagpedia.net/data/flags/w1160/fi.webp', 1),
       ('Island', 'Reykjavik', 'https://flagpedia.net/data/flags/w1160/is.webp', 1),
       ('Norge', 'Oslo', 'https://flagpedia.net/data/flags/w1160/no.webp', 1),
       ('Sverige', 'Stockholm', 'https://flagpedia.net/data/flags/w1160/se.webp', 1),
       ('Åland', 'Mariehamn', 'https://flagpedia.net/data/flags/w1160/ax.webp', 1),
       ('Färöarna', 'Tórshavn', 'https://flagpedia.net/data/flags/w1160/fo.webp', 1),
       ('Grönland', 'Nuuk', 'https://flagpedia.net/data/flags/w1160/gl.webp', 1);

## Europe
INSERT INTO Countries(Countryname, Capital, Flag, RegionID)
VALUES
    ('Albanien', 'Tirana', 'https://flagpedia.net/data/flags/w1160/al.webp', 2),
    ('Andorra', 'Andorra la Vella', 'https://flagpedia.net/data/flags/w1160/ad.webp', 2),
    ('Österrike', 'Wien', 'https://flagpedia.net/data/flags/w1160/at.webp', 2),
    ('Belarus', 'Minsk', 'https://flagpedia.net/data/flags/w1160/by.webp', 2),
    ('Belgien', 'Bryssel', 'https://flagpedia.net/data/flags/w1160/be.webp', 2),
    ('Bosnien och Hercegovina', 'Sarajevo', 'https://flagpedia.net/data/flags/w1160/ba.webp', 2),
    ('Bulgarien', 'Sofia', 'https://flagpedia.net/data/flags/w1160/bg.webp', 2),
    ('Cypern', 'Nicosia', 'https://flagpedia.net/data/flags/w1160/cy.webp', 2),
    ('Frankrike', 'Paris', 'https://flagpedia.net/data/flags/w1160/fr.webp', 2),
    ('Grekland', 'Aten', 'https://flagpedia.net/data/flags/w1160/gr.webp', 2),
    ('Irland', 'Dublin', 'https://flagpedia.net/data/flags/w1160/ie.webp', 2),
    ('Italien', 'Rom', 'https://flagpedia.net/data/flags/w1160/it.webp', 2),
    ('Kosovo', 'Pristina', 'https://flagpedia.net/data/flags/w1160/xk.webp', 2),
    ('Kroatien', 'Zagreb', 'https://flagpedia.net/data/flags/w1160/hr.webp', 2),
    ('Lettland', 'Riga', 'https://flagpedia.net/data/flags/w1160/lv.webp', 2),
    ('Liechtenstein', 'Vaduz', 'https://flagpedia.net/data/flags/w1160/li.webp', 2),
    ('Litauen', 'Vilnius', 'https://flagpedia.net/data/flags/w1160/lt.webp', 2),
    ('Luxemburg', 'Luxemburg', 'https://flagpedia.net/data/flags/w1160/lu.webp', 2),
    ('Malta', 'Valletta', 'https://flagpedia.net/data/flags/w1160/mt.webp', 2),
    ('Moldavien', 'Chișinău', 'https://flagpedia.net/data/flags/w1160/md.webp', 2),
    ('Monaco', 'Monaco', 'https://flagpedia.net/data/flags/w1160/mc.webp', 2),
    ('Montenegro', 'Podgorica', 'https://flagpedia.net/data/flags/w1160/me.webp', 2),
    ('Nederländerna', 'Amsterdam', 'https://flagpedia.net/data/flags/w1160/nl.webp', 2),
    ('Nordmakedonien', 'Skopje', 'https://flagpedia.net/data/flags/w1160/mk.webp', 2),
    ('Polen', 'Warszawa', 'https://flagpedia.net/data/flags/w1160/pl.webp', 2),
    ('Portugal', 'Lissabon', 'https://flagpedia.net/data/flags/w1160/pt.webp', 2),
    ('Rumänien', 'Bukarest', 'https://flagpedia.net/data/flags/w1160/ro.webp', 2),
    ('Ryssland', 'Moskva', 'https://flagpedia.net/data/flags/w1160/ru.webp', 2),
    ('San Marino', 'San Marino', 'https://flagpedia.net/data/flags/w1160/sm.webp', 2),
    ('Schweiz', 'Bern', 'https://flagpedia.net/data/flags/w1160/ch.webp', 2),
    ('Serbien', 'Belgrad', 'https://flagpedia.net/data/flags/w1160/rs.webp', 2),
    ('Slovakien', 'Bratislava', 'https://flagpedia.net/data/flags/w1160/sk.webp', 2),
    ('Slovenien', 'Ljubljana', 'https://flagpedia.net/data/flags/w1160/si.webp', 2),
    ('Spanien', 'Madrid', 'https://flagpedia.net/data/flags/w1160/es.webp', 2),
    ('Storbritannien', 'London', 'https://flagpedia.net/data/flags/w1160/gb.webp', 2),
    ('Tjeckien', 'Prag', 'https://flagpedia.net/data/flags/w1160/cz.webp', 2),
    ('Turkiet', 'Ankara', 'https://flagpedia.net/data/flags/w1160/tr.webp', 2),
    ('Tyskland', 'Berlin', 'https://flagpedia.net/data/flags/w1160/de.webp', 2),
    ('Ukraina', 'Kyiv', 'https://flagpedia.net/data/flags/w1160/ua.webp', 2),
    ('Ungern', 'Budapest', 'https://flagpedia.net/data/flags/w1160/hu.webp', 2),
    ('Vatikanstaten', 'Vatikanstaten', 'https://flagpedia.net/data/flags/w1160/va.webp', 2);

## Afrika
INSERT INTO Countries(Countryname, Capital, Flag, RegionID)
VALUES
    ('Algeriet', 'Alger', 'https://flagpedia.net/data/flags/w1160/dz.webp', 3),
    ('Angola', 'Luanda', 'https://flagpedia.net/data/flags/w1160/ao.webp', 3),
    ('Benin', 'Porto-Novo', 'https://flagpedia.net/data/flags/w1160/bj.webp', 3),
    ('Botswana', 'Gaborone', 'https://flagpedia.net/data/flags/w1160/bw.webp', 3),
    ('Burkina Faso', 'Ouagadougou', 'https://flagpedia.net/data/flags/w1160/bf.webp', 3),
    ('Burundi', 'Gitega', 'https://flagpedia.net/data/flags/w1160/bi.webp', 3),
    ('Centralafrikanska republiken', 'Bangui', 'https://flagpedia.net/data/flags/w1160/cf.webp', 3),
    ('Demokratiska republiken Kongo', 'Kinshasa', 'https://flagpedia.net/data/flags/w1160/cd.webp', 3),
    ('Djibouti', 'Djibouti', 'https://flagpedia.net/data/flags/w1160/dj.webp', 3),
    ('Egypten', 'Kairo', 'https://flagpedia.net/data/flags/w1160/eg.webp', 3),
    ('Ekvatorialguinea', 'Ciudad de la Paz', 'https://flagpedia.net/data/flags/w1160/gq.webp', 3),
    ('Elfenbenskusten', 'Yamoussoukro', 'https://flagpedia.net/data/flags/w1160/ci.webp', 3),
    ('Eritrea', 'Asmara', 'https://flagpedia.net/data/flags/w1160/er.webp', 3),
    ('Eswatini', 'Mbabane', 'https://flagpedia.net/data/flags/w1160/sz.webp', 3),
    ('Etiopien', 'Addis Abeba', 'https://flagpedia.net/data/flags/w1160/et.webp', 3),
    ('Gabon', 'Libreville', 'https://flagpedia.net/data/flags/w1160/ga.webp', 3),
    ('Gambia', 'Banjul', 'https://flagpedia.net/data/flags/w1160/gm.webp', 3),
    ('Ghana', 'Accra', 'https://flagpedia.net/data/flags/w1160/gh.webp', 3),
    ('Guinea', 'Conakry', 'https://flagpedia.net/data/flags/w1160/gn.webp', 3),
    ('Guinea-Bissau', 'Bissau', 'https://flagpedia.net/data/flags/w1160/gw.webp', 3),
    ('Kamerun', 'Yaoundé', 'https://flagpedia.net/data/flags/w1160/cm.webp', 3),
    ('Kap Verde', 'Praia', 'https://flagpedia.net/data/flags/w1160/cv.webp', 3),
    ('Kenya', 'Nairobi', 'https://flagpedia.net/data/flags/w1160/ke.webp', 3),
    ('Komorerna', 'Moroni', 'https://flagpedia.net/data/flags/w1160/km.webp', 3),
    ('Kongo-Brazzaville', 'Brazzaville', 'https://flagpedia.net/data/flags/w1160/cg.webp', 3),
    ('Lesotho', 'Maseru', 'https://flagpedia.net/data/flags/w1160/ls.webp', 3),
    ('Liberia', 'Monrovia', 'https://flagpedia.net/data/flags/w1160/lr.webp', 3),
    ('Libyen', 'Tripoli', 'https://flagpedia.net/data/flags/w1160/ly.webp', 3),
    ('Madagaskar', 'Antananarivo', 'https://flagpedia.net/data/flags/w1160/mg.webp', 3),
    ('Malawi', 'Lilongwe', 'https://flagpedia.net/data/flags/w1160/mw.webp', 3),
    ('Mali', 'Bamako', 'https://flagpedia.net/data/flags/w1160/ml.webp', 3),
    ('Marocko', 'Rabat', 'https://flagpedia.net/data/flags/w1160/ma.webp', 3),
    ('Mauretanien', 'Nouakchott', 'https://flagpedia.net/data/flags/w1160/mr.webp', 3),
    ('Mauritius', 'Port Louis', 'https://flagpedia.net/data/flags/w1160/mu.webp', 3),
    ('Moçambique', 'Maputo', 'https://flagpedia.net/data/flags/w1160/mz.webp', 3),
    ('Namibia', 'Windhoek', 'https://flagpedia.net/data/flags/w1160/na.webp', 3),
    ('Niger', 'Niamey', 'https://flagpedia.net/data/flags/w1160/ne.webp', 3),
    ('Nigeria', 'Abuja', 'https://flagpedia.net/data/flags/w1160/ng.webp', 3),
    ('Rwanda', 'Kigali', 'https://flagpedia.net/data/flags/w1160/rw.webp', 3),
    ('São Tomé och Príncipe', 'São Tomé', 'https://flagpedia.net/data/flags/w1160/st.webp', 3),
    ('Senegal', 'Dakar', 'https://flagpedia.net/data/flags/w1160/sn.webp', 3),
    ('Seychellerna', 'Victoria', 'https://flagpedia.net/data/flags/w1160/sc.webp', 3),
    ('Sierra Leone', 'Freetown', 'https://flagpedia.net/data/flags/w1160/sl.webp', 3),
    ('Somalia', 'Mogadishu', 'https://flagpedia.net/data/flags/w1160/so.webp', 3),
    ('Sudan', 'Khartoum', 'https://flagpedia.net/data/flags/w1160/sd.webp', 3),
    ('Sydafrika', 'Pretoria', 'https://flagpedia.net/data/flags/w1160/za.webp', 3),
    ('Sydsudan', 'Juba', 'https://flagpedia.net/data/flags/w1160/ss.webp', 3),
    ('Tanzania', 'Dodoma', 'https://flagpedia.net/data/flags/w1160/tz.webp', 3),
    ('Tchad', 'N’Djamena', 'https://flagpedia.net/data/flags/w1160/td.webp', 3),
    ('Togo', 'Lomé', 'https://flagpedia.net/data/flags/w1160/tg.webp', 3),
    ('Tunisien', 'Tunis', 'https://flagpedia.net/data/flags/w1160/tn.webp', 3),
    ('Uganda', 'Kampala', 'https://flagpedia.net/data/flags/w1160/ug.webp', 3),
    ('Zambia', 'Lusaka', 'https://flagpedia.net/data/flags/w1160/zm.webp', 3),
    ('Zimbabwe', 'Harare', 'https://flagpedia.net/data/flags/w1160/zw.webp', 3)
;

# North America
INSERT INTO Countries(Countryname, Capital, Flag, RegionID)
VALUES
    ('Antigua och Barbuda', 'Saint John’s', 'https://flagpedia.net/data/flags/w1160/ag.webp', 4),
    ('Bahamas', 'Nassau', 'https://flagpedia.net/data/flags/w1160/bs.webp', 4),
    ('Barbados', 'Bridgetown', 'https://flagpedia.net/data/flags/w1160/bb.webp', 4),
    ('Canada', 'Ottawa', 'https://flagpedia.net/data/flags/w1160/ca.webp', 4),
    ('Cuba', 'Havanna', 'https://flagpedia.net/data/flags/w1160/cu.webp', 4),
    ('Dominica', 'Roseau', 'https://flagpedia.net/data/flags/w1160/dm.webp', 4),
    ('Dominikanska republiken', 'Santo Domingo', 'https://flagpedia.net/data/flags/w1160/do.webp', 4),
    ('Grenada', 'Saint George’s', 'https://flagpedia.net/data/flags/w1160/gd.webp', 4),
    ('Haiti', 'Port-au-Prince', 'https://flagpedia.net/data/flags/w1160/ht.webp', 4),
    ('Jamaica', 'Kingston', 'https://flagpedia.net/data/flags/w1160/jm.webp', 4),
    ('Mexiko', 'Mexico City', 'https://flagpedia.net/data/flags/w1160/mx.webp', 4),
    ('Saint Kitts och Nevis', 'Basseterre', 'https://flagpedia.net/data/flags/w1160/kn.webp', 4),
    ('Saint Lucia', 'Castries', 'https://flagpedia.net/data/flags/w1160/lc.webp', 4),
    ('Saint Vincent och Grenadinerna', 'Kingstown', 'https://flagpedia.net/data/flags/w1160/vc.webp', 4),
    ('Trinidad och Tobago', 'Port of Spain', 'https://flagpedia.net/data/flags/w1160/tt.webp', 4),
    ('USA', 'Washington D.C.', 'https://flagpedia.net/data/flags/w1160/us.webp', 4)
;

# Central America
INSERT INTO Countries(Countryname, Capital, Flag, RegionID)
VALUES
    ('Belize', 'Belmopan', 'https://flagpedia.net/data/flags/w1160/bz.webp', 5),
    ('Costa Rica', 'San José', 'https://flagpedia.net/data/flags/w1160/cr.webp', 5),
    ('El Salvador', 'San Salvador', 'https://flagpedia.net/data/flags/w1160/sv.webp', 5),
    ('Guatemala', 'Guatemala City', 'https://flagpedia.net/data/flags/w1160/gt.webp', 5),
    ('Honduras', 'Tegucigalpa', 'https://flagpedia.net/data/flags/w1160/hn.webp', 5),
    ('Nicaragua', 'Managua', 'https://flagpedia.net/data/flags/w1160/ni.webp', 5),
    ('Panama', 'Panama City', 'https://flagpedia.net/data/flags/w1160/pa.webp', 5);

# South America

INSERT INTO Countries(Countryname, Capital, Flag, RegionID)
VALUES
    ('Argentina', 'Buenos Aires', 'https://flagpedia.net/data/flags/w1160/ar.webp', 6),
    ('Bolivia', 'Sucre', 'https://flagpedia.net/data/flags/w1160/bo.webp', 6),
    ('Brasilien', 'Brasília', 'https://flagpedia.net/data/flags/w1160/br.webp', 6),
    ('Chile', 'Santiago', 'https://flagpedia.net/data/flags/w1160/cl.webp', 6),
    ('Colombia', 'Bogotá', 'https://flagpedia.net/data/flags/w1160/co.webp', 6),
    ('Ecuador', 'Quito', 'https://flagpedia.net/data/flags/w1160/ec.webp', 6),
    ('Guyana', 'Georgetown', 'https://flagpedia.net/data/flags/w1160/gy.webp', 6),
    ('Paraguay', 'Asunción', 'https://flagpedia.net/data/flags/w1160/py.webp', 6),
    ('Peru', 'Lima', 'https://flagpedia.net/data/flags/w1160/pe.webp', 6),
    ('Surinam', 'Paramaribo', 'https://flagpedia.net/data/flags/w1160/sr.webp', 6),
    ('Uruguay', 'Montevideo', 'https://flagpedia.net/data/flags/w1160/uy.webp', 6),
    ('Venezuela', 'Caracas', 'https://flagpedia.net/data/flags/w1160/ve.webp', 6);


# Asia

INSERT INTO Countries(Countryname, Capital, Flag, RegionID)
VALUES
    ('Afghanistan', 'Kabul', 'https://flagpedia.net/data/flags/w1160/af.webp', 7),
    ('Armenien', 'Jerevan', 'https://flagpedia.net/data/flags/w1160/am.webp', 7),
    ('Azerbajdzjan', 'Baku', 'https://flagpedia.net/data/flags/w1160/az.webp', 7),
    ('Bahrain', 'Manama', 'https://flagpedia.net/data/flags/w1160/bh.webp', 7),
    ('Bangladesh', 'Dhaka', 'https://flagpedia.net/data/flags/w1160/bd.webp', 7),
    ('Bhutan', 'Thimphu', 'https://flagpedia.net/data/flags/w1160/bt.webp', 7),
    ('Brunei', 'Bandar Seri Begawan', 'https://flagpedia.net/data/flags/w1160/bn.webp', 7),
    ('Cypern', 'Nicosia', 'https://flagpedia.net/data/flags/w1160/cy.webp', 7),
    ('Filippinerna', 'Manila', 'https://flagpedia.net/data/flags/w1160/ph.webp', 7),
    ('Förenade Arabemiraten', 'Abu Dhabi', 'https://flagpedia.net/data/flags/w1160/ae.webp', 7),
    ('Georgien', 'Tbilisi', 'https://flagpedia.net/data/flags/w1160/ge.webp', 7),
    ('Indien', 'New Delhi', 'https://flagpedia.net/data/flags/w1160/in.webp', 7),
    ('Indonesien', 'Jakarta', 'https://flagpedia.net/data/flags/w1160/id.webp', 7),
    ('Irak', 'Bagdad', 'https://flagpedia.net/data/flags/w1160/iq.webp', 7),
    ('Iran', 'Teheran', 'https://flagpedia.net/data/flags/w1160/ir.webp', 7),
    ('Israel', 'Jerusalem', 'https://flagpedia.net/data/flags/w1160/il.webp', 7),
    ('Japan', 'Tokyo', 'https://flagpedia.net/data/flags/w1160/jp.webp', 7),
    ('Jemen', 'Sana’a', 'https://flagpedia.net/data/flags/w1160/ye.webp', 7),
    ('Jordanien', 'Amman', 'https://flagpedia.net/data/flags/w1160/jo.webp', 7),
    ('Kambodja', 'Phnom Penh', 'https://flagpedia.net/data/flags/w1160/kh.webp', 7),
    ('Kazakstan', 'Astana', 'https://flagpedia.net/data/flags/w1160/kz.webp', 7),
    ('Kina', 'Peking', 'https://flagpedia.net/data/flags/w1160/cn.webp', 7),
    ('Kirgizistan', 'Bisjkek', 'https://flagpedia.net/data/flags/w1160/kg.webp', 7),
    ('Kuwait', 'Kuwait City', 'https://flagpedia.net/data/flags/w1160/kw.webp', 7),
    ('Laos', 'Vientiane', 'https://flagpedia.net/data/flags/w1160/la.webp', 7),
    ('Libanon', 'Beirut', 'https://flagpedia.net/data/flags/w1160/lb.webp', 7),
    ('Malaysia', 'Kuala Lumpur', 'https://flagpedia.net/data/flags/w1160/my.webp', 7),
    ('Maldiverna', 'Malé', 'https://flagpedia.net/data/flags/w1160/mv.webp', 7),
    ('Mongoliet', 'Ulan Bator', 'https://flagpedia.net/data/flags/w1160/mn.webp', 7),
    ('Myanmar', 'Naypyidaw', 'https://flagpedia.net/data/flags/w1160/mm.webp', 7),
    ('Nepal', 'Kathmandu', 'https://flagpedia.net/data/flags/w1160/np.webp', 7),
    ('Nordkorea', 'Pyongyang', 'https://flagpedia.net/data/flags/w1160/kp.webp', 7),
    ('Oman', 'Muskat', 'https://flagpedia.net/data/flags/w1160/om.webp', 7),
    ('Pakistan', 'Islamabad', 'https://flagpedia.net/data/flags/w1160/pk.webp', 7),
    ('Palestina', 'Ramallah', 'https://flagpedia.net/data/flags/w1160/ps.webp', 7),
    ('Qatar', 'Doha', 'https://flagpedia.net/data/flags/w1160/qa.webp', 7),
    ('Saudiarabien', 'Riyadh', 'https://flagpedia.net/data/flags/w1160/sa.webp', 7),
    ('Singapore', 'Singapore', 'https://flagpedia.net/data/flags/w1160/sg.webp', 7),
    ('Sri Lanka', 'Sri Jayawardenepura Kotte', 'https://flagpedia.net/data/flags/w1160/lk.webp', 7),
    ('Sydkorea', 'Seoul', 'https://flagpedia.net/data/flags/w1160/kr.webp', 7),
    ('Syrien', 'Damaskus', 'https://flagpedia.net/data/flags/w1160/sy.webp', 7),
    ('Tadzjikistan', 'Dusjanbe', 'https://flagpedia.net/data/flags/w1160/tj.webp', 7),
    ('Thailand', 'Bangkok', 'https://flagpedia.net/data/flags/w1160/th.webp', 7),
    ('Turkmenistan', 'Asjchabad', 'https://flagpedia.net/data/flags/w1160/tm.webp', 7),
    ('Turkiet', 'Ankara', 'https://flagpedia.net/data/flags/w1160/tr.webp', 7),
    ('Uzbekistan', 'Tasjkent', 'https://flagpedia.net/data/flags/w1160/uz.webp', 7),
    ('Vietnam', 'Hanoi', 'https://flagpedia.net/data/flags/w1160/vn.webp', 7),
    ('Östtimor', 'Dili', 'https://flagpedia.net/data/flags/w1160/tl.webp', 7);

# Oceanien

INSERT INTO Countries(Countryname, Capital, Flag, RegionID)
VALUES
    ('Australien', 'Canberra', 'https://flagpedia.net/data/flags/w1160/au.webp', 8),
    ('Fiji', 'Suva', 'https://flagpedia.net/data/flags/w1160/fj.webp', 8),
    ('Kiribati', 'South Tarawa', 'https://flagpedia.net/data/flags/w1160/ki.webp', 8),
    ('Marshallöarna', 'Majuro', 'https://flagpedia.net/data/flags/w1160/mh.webp', 8),
    ('Mikronesien', 'Palikir', 'https://flagpedia.net/data/flags/w1160/fm.webp', 8),
    ('Nauru', 'Yaren', 'https://flagpedia.net/data/flags/w1160/nr.webp', 8),
    ('Nya Zeeland', 'Wellington', 'https://flagpedia.net/data/flags/w1160/nz.webp', 8),
    ('Palau', 'Ngerulmud', 'https://flagpedia.net/data/flags/w1160/pw.webp', 8),
    ('Papua Nya Guinea', 'Port Moresby', 'https://flagpedia.net/data/flags/w1160/pg.webp', 8),
    ('Samoa', 'Apia', 'https://flagpedia.net/data/flags/w1160/ws.webp', 8),
    ('Salomonöarna', 'Honiara', 'https://flagpedia.net/data/flags/w1160/sb.webp', 8),
    ('Tonga', 'Nuku''alofa', 'https://flagpedia.net/data/flags/w1160/to.webp', 8),
    ('Tuvalu', 'Funafuti', 'https://flagpedia.net/data/flags/w1160/tv.webp', 8),
    ('Vanuatu', 'Port Vila', 'https://flagpedia.net/data/flags/w1160/vu.webp', 8);

