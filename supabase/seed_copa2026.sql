-- =====================================================================
-- BOLÃO DA COPA 2026 - Seed completo com calendário oficial
-- Execute no SQL Editor do Supabase
-- ⚠️  ATENÇÃO: apaga todas as partidas e previsões existentes
-- =====================================================================

-- 1. Limpar dados existentes
DELETE FROM predictions;
DELETE FROM matches;
DELETE FROM teams;
DELETE FROM groups;

-- 2. Grupos A-L
INSERT INTO groups (letter, name) VALUES
  ('A','Grupo A'),('B','Grupo B'),('C','Grupo C'),('D','Grupo D'),
  ('E','Grupo E'),('F','Grupo F'),('G','Grupo G'),('H','Grupo H'),
  ('I','Grupo I'),('J','Grupo J'),('K','Grupo K'),('L','Grupo L');

-- 3. Times (48 seleções)
INSERT INTO teams (name, short_name, flag_emoji, group_letter) VALUES
  -- Grupo A
  ('México','México','🇲🇽','A'),
  ('África do Sul','África do Sul','🇿🇦','A'),
  ('Coreia do Sul','Coreia do Sul','🇰🇷','A'),
  ('Tchéquia','Tchéquia','🇨🇿','A'),
  -- Grupo B
  ('Canadá','Canadá','🇨🇦','B'),
  ('Bósnia e Herzegovina','Bósnia','🇧🇦','B'),
  ('Catar','Catar','🇶🇦','B'),
  ('Suíça','Suíça','🇨🇭','B'),
  -- Grupo C
  ('Brasil','Brasil','🇧🇷','C'),
  ('Marrocos','Marrocos','🇲🇦','C'),
  ('Haiti','Haiti','🇭🇹','C'),
  ('Escócia','Escócia','🏴󠁧󠁢󠁳󠁣󠁴󠁿','C'),
  -- Grupo D
  ('EUA','EUA','🇺🇸','D'),
  ('Paraguai','Paraguai','🇵🇾','D'),
  ('Austrália','Austrália','🇦🇺','D'),
  ('Turquia','Turquia','🇹🇷','D'),
  -- Grupo E
  ('Alemanha','Alemanha','🇩🇪','E'),
  ('Curaçao','Curaçao','🇨🇼','E'),
  ('Costa do Marfim','Costa do Marfim','🇨🇮','E'),
  ('Equador','Equador','🇪🇨','E'),
  -- Grupo F
  ('Holanda','Holanda','🇳🇱','F'),
  ('Japão','Japão','🇯🇵','F'),
  ('Suécia','Suécia','🇸🇪','F'),
  ('Tunísia','Tunísia','🇹🇳','F'),
  -- Grupo G
  ('Bélgica','Bélgica','🇧🇪','G'),
  ('Egito','Egito','🇪🇬','G'),
  ('Irã','Irã','🇮🇷','G'),
  ('Nova Zelândia','Nova Zelândia','🇳🇿','G'),
  -- Grupo H
  ('Espanha','Espanha','🇪🇸','H'),
  ('Cabo Verde','Cabo Verde','🇨🇻','H'),
  ('Arábia Saudita','Arábia Saudita','🇸🇦','H'),
  ('Uruguai','Uruguai','🇺🇾','H'),
  -- Grupo I
  ('França','França','🇫🇷','I'),
  ('Senegal','Senegal','🇸🇳','I'),
  ('Iraque','Iraque','🇮🇶','I'),
  ('Noruega','Noruega','🇳🇴','I'),
  -- Grupo J
  ('Argentina','Argentina','🇦🇷','J'),
  ('Argélia','Argélia','🇩🇿','J'),
  ('Áustria','Áustria','🇦🇹','J'),
  ('Jordânia','Jordânia','🇯🇴','J'),
  -- Grupo K
  ('Portugal','Portugal','🇵🇹','K'),
  ('RD Congo','RD Congo','🇨🇩','K'),
  ('Uzbequistão','Uzbequistão','🇺🇿','K'),
  ('Colômbia','Colômbia','🇨🇴','K'),
  -- Grupo L
  ('Inglaterra','Inglaterra','🏴󠁧󠁢󠁥󠁮󠁧󠁿','L'),
  ('Croácia','Croácia','🇭🇷','L'),
  ('Gana','Gana','🇬🇭','L'),
  ('Panamá','Panamá','🇵🇦','L');

-- 4. Partidas da Fase de Grupos
-- Horários armazenados em UTC (BRT = UTC-3)
-- =====================================================================

-- ── RODADA 1 (11 a 17 de junho) ──────────────────────────────────────
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number, status) VALUES

-- 11 jun ─ Grupo A
((SELECT id FROM teams WHERE name='México'),
 (SELECT id FROM teams WHERE name='África do Sul'),
 (SELECT id FROM groups WHERE letter='A'),
 'group','2026-06-11T19:00:00Z','Estádio Azteca','Cidade do México',1,'scheduled'),

-- 12 jun ─ Grupo A
((SELECT id FROM teams WHERE name='Coreia do Sul'),
 (SELECT id FROM teams WHERE name='Tchéquia'),
 (SELECT id FROM groups WHERE letter='A'),
 'group','2026-06-12T17:00:00Z','Estadio Akron','Guadalajara',1,'scheduled'),

-- 12 jun ─ Grupo B
((SELECT id FROM teams WHERE name='Canadá'),
 (SELECT id FROM teams WHERE name='Bósnia e Herzegovina'),
 (SELECT id FROM groups WHERE letter='B'),
 'group','2026-06-12T20:00:00Z','BMO Field','Toronto',1,'scheduled'),

-- 12 jun ─ Grupo D
((SELECT id FROM teams WHERE name='EUA'),
 (SELECT id FROM teams WHERE name='Paraguai'),
 (SELECT id FROM groups WHERE letter='D'),
 'group','2026-06-12T23:00:00Z','SoFi Stadium','Los Angeles',1,'scheduled'),

-- 13 jun ─ Grupo B
((SELECT id FROM teams WHERE name='Catar'),
 (SELECT id FROM teams WHERE name='Suíça'),
 (SELECT id FROM groups WHERE letter='B'),
 'group','2026-06-13T16:00:00Z','BC Place','Vancouver',1,'scheduled'),

-- 13 jun ─ Grupo C
((SELECT id FROM teams WHERE name='Brasil'),
 (SELECT id FROM teams WHERE name='Marrocos'),
 (SELECT id FROM groups WHERE letter='C'),
 'group','2026-06-13T19:00:00Z','MetLife Stadium','Nova Jersey',1,'scheduled'),

-- 13 jun ─ Grupo C
((SELECT id FROM teams WHERE name='Haiti'),
 (SELECT id FROM teams WHERE name='Escócia'),
 (SELECT id FROM groups WHERE letter='C'),
 'group','2026-06-13T22:00:00Z','NRG Stadium','Houston',1,'scheduled'),

-- 13 jun ─ Grupo D
((SELECT id FROM teams WHERE name='Austrália'),
 (SELECT id FROM teams WHERE name='Turquia'),
 (SELECT id FROM groups WHERE letter='D'),
 'group','2026-06-13T23:00:00Z','Levi''s Stadium','São Francisco',1,'scheduled'),

-- 14 jun ─ Grupo E
((SELECT id FROM teams WHERE name='Alemanha'),
 (SELECT id FROM teams WHERE name='Curaçao'),
 (SELECT id FROM groups WHERE letter='E'),
 'group','2026-06-14T16:00:00Z','Gillette Stadium','Boston',1,'scheduled'),

-- 14 jun ─ Grupo E
((SELECT id FROM teams WHERE name='Costa do Marfim'),
 (SELECT id FROM teams WHERE name='Equador'),
 (SELECT id FROM groups WHERE letter='E'),
 'group','2026-06-14T19:00:00Z','Lincoln Financial Field','Filadélfia',1,'scheduled'),

-- 14 jun ─ Grupo F
((SELECT id FROM teams WHERE name='Holanda'),
 (SELECT id FROM teams WHERE name='Japão'),
 (SELECT id FROM groups WHERE letter='F'),
 'group','2026-06-14T22:00:00Z','Lumen Field','Seattle',1,'scheduled'),

-- 14 jun ─ Grupo F
((SELECT id FROM teams WHERE name='Suécia'),
 (SELECT id FROM teams WHERE name='Tunísia'),
 (SELECT id FROM groups WHERE letter='F'),
 'group','2026-06-14T23:00:00Z','Hard Rock Stadium','Miami',1,'scheduled'),

-- 15 jun ─ Grupo G
((SELECT id FROM teams WHERE name='Bélgica'),
 (SELECT id FROM teams WHERE name='Egito'),
 (SELECT id FROM groups WHERE letter='G'),
 'group','2026-06-15T16:00:00Z','Mercedes-Benz Stadium','Atlanta',1,'scheduled'),

-- 15 jun ─ Grupo G
((SELECT id FROM teams WHERE name='Irã'),
 (SELECT id FROM teams WHERE name='Nova Zelândia'),
 (SELECT id FROM groups WHERE letter='G'),
 'group','2026-06-15T19:00:00Z','GEHA Field at Arrowhead','Kansas City',1,'scheduled'),

-- 15 jun ─ Grupo H
((SELECT id FROM teams WHERE name='Espanha'),
 (SELECT id FROM teams WHERE name='Cabo Verde'),
 (SELECT id FROM groups WHERE letter='H'),
 'group','2026-06-15T22:00:00Z','AT&T Stadium','Dallas',1,'scheduled'),

-- 15 jun ─ Grupo H
((SELECT id FROM teams WHERE name='Arábia Saudita'),
 (SELECT id FROM teams WHERE name='Uruguai'),
 (SELECT id FROM groups WHERE letter='H'),
 'group','2026-06-15T23:00:00Z','SoFi Stadium','Los Angeles',1,'scheduled'),

-- 16 jun ─ Grupo I
((SELECT id FROM teams WHERE name='França'),
 (SELECT id FROM teams WHERE name='Senegal'),
 (SELECT id FROM groups WHERE letter='I'),
 'group','2026-06-16T16:00:00Z','MetLife Stadium','Nova Jersey',1,'scheduled'),

-- 16 jun ─ Grupo I
((SELECT id FROM teams WHERE name='Iraque'),
 (SELECT id FROM teams WHERE name='Noruega'),
 (SELECT id FROM groups WHERE letter='I'),
 'group','2026-06-16T19:00:00Z','NRG Stadium','Houston',1,'scheduled'),

-- 16 jun ─ Grupo J
((SELECT id FROM teams WHERE name='Argentina'),
 (SELECT id FROM teams WHERE name='Argélia'),
 (SELECT id FROM groups WHERE letter='J'),
 'group','2026-06-16T22:00:00Z','Hard Rock Stadium','Miami',1,'scheduled'),

-- 16 jun ─ Grupo J
((SELECT id FROM teams WHERE name='Áustria'),
 (SELECT id FROM teams WHERE name='Jordânia'),
 (SELECT id FROM groups WHERE letter='J'),
 'group','2026-06-16T23:00:00Z','Levi''s Stadium','São Francisco',1,'scheduled'),

-- 17 jun ─ Grupo K
((SELECT id FROM teams WHERE name='Portugal'),
 (SELECT id FROM teams WHERE name='RD Congo'),
 (SELECT id FROM groups WHERE letter='K'),
 'group','2026-06-17T16:00:00Z','Mercedes-Benz Stadium','Atlanta',1,'scheduled'),

-- 17 jun ─ Grupo K
((SELECT id FROM teams WHERE name='Uzbequistão'),
 (SELECT id FROM teams WHERE name='Colômbia'),
 (SELECT id FROM groups WHERE letter='K'),
 'group','2026-06-17T19:00:00Z','GEHA Field at Arrowhead','Kansas City',1,'scheduled'),

-- 17 jun ─ Grupo L
((SELECT id FROM teams WHERE name='Inglaterra'),
 (SELECT id FROM teams WHERE name='Croácia'),
 (SELECT id FROM groups WHERE letter='L'),
 'group','2026-06-17T22:00:00Z','Gillette Stadium','Boston',1,'scheduled'),

-- 17 jun ─ Grupo L
((SELECT id FROM teams WHERE name='Gana'),
 (SELECT id FROM teams WHERE name='Panamá'),
 (SELECT id FROM groups WHERE letter='L'),
 'group','2026-06-17T23:00:00Z','Lumen Field','Seattle',1,'scheduled');

-- ── RODADA 2 (18 a 23 de junho) ──────────────────────────────────────
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number, status) VALUES

-- 18 jun ─ Grupo A
((SELECT id FROM teams WHERE name='Tchéquia'),
 (SELECT id FROM teams WHERE name='África do Sul'),
 (SELECT id FROM groups WHERE letter='A'),
 'group','2026-06-18T17:00:00Z','Estadio Akron','Guadalajara',2,'scheduled'),

-- 18 jun ─ Grupo A
((SELECT id FROM teams WHERE name='México'),
 (SELECT id FROM teams WHERE name='Coreia do Sul'),
 (SELECT id FROM groups WHERE letter='A'),
 'group','2026-06-18T19:00:00Z','Estádio Azteca','Cidade do México',2,'scheduled'),

-- 18 jun ─ Grupo B
((SELECT id FROM teams WHERE name='Canadá'),
 (SELECT id FROM teams WHERE name='Catar'),
 (SELECT id FROM groups WHERE letter='B'),
 'group','2026-06-18T20:00:00Z','BMO Field','Toronto',2,'scheduled'),

-- 18 jun ─ Grupo B
((SELECT id FROM teams WHERE name='Suíça'),
 (SELECT id FROM teams WHERE name='Bósnia e Herzegovina'),
 (SELECT id FROM groups WHERE letter='B'),
 'group','2026-06-18T22:00:00Z','Estadio BBVA','Monterrey',2,'scheduled'),

-- 19 jun ─ Grupo C
((SELECT id FROM teams WHERE name='Escócia'),
 (SELECT id FROM teams WHERE name='Marrocos'),
 (SELECT id FROM groups WHERE letter='C'),
 'group','2026-06-19T16:00:00Z','Lincoln Financial Field','Filadélfia',2,'scheduled'),

-- 19 jun ─ Grupo C
((SELECT id FROM teams WHERE name='Brasil'),
 (SELECT id FROM teams WHERE name='Haiti'),
 (SELECT id FROM groups WHERE letter='C'),
 'group','2026-06-19T19:00:00Z','MetLife Stadium','Nova Jersey',2,'scheduled'),

-- 19 jun ─ Grupo D
((SELECT id FROM teams WHERE name='Turquia'),
 (SELECT id FROM teams WHERE name='Paraguai'),
 (SELECT id FROM groups WHERE letter='D'),
 'group','2026-06-19T22:00:00Z','SoFi Stadium','Los Angeles',2,'scheduled'),

-- 19 jun ─ Grupo D
((SELECT id FROM teams WHERE name='EUA'),
 (SELECT id FROM teams WHERE name='Austrália'),
 (SELECT id FROM groups WHERE letter='D'),
 'group','2026-06-19T23:00:00Z','Levi''s Stadium','São Francisco',2,'scheduled'),

-- 20 jun ─ Grupo E
((SELECT id FROM teams WHERE name='Alemanha'),
 (SELECT id FROM teams WHERE name='Costa do Marfim'),
 (SELECT id FROM groups WHERE letter='E'),
 'group','2026-06-20T16:00:00Z','Gillette Stadium','Boston',2,'scheduled'),

-- 20 jun ─ Grupo E
((SELECT id FROM teams WHERE name='Equador'),
 (SELECT id FROM teams WHERE name='Curaçao'),
 (SELECT id FROM groups WHERE letter='E'),
 'group','2026-06-20T19:00:00Z','Lincoln Financial Field','Filadélfia',2,'scheduled'),

-- 20 jun ─ Grupo F
((SELECT id FROM teams WHERE name='Tunísia'),
 (SELECT id FROM teams WHERE name='Japão'),
 (SELECT id FROM groups WHERE letter='F'),
 'group','2026-06-20T22:00:00Z','Hard Rock Stadium','Miami',2,'scheduled'),

-- 20 jun ─ Grupo F
((SELECT id FROM teams WHERE name='Holanda'),
 (SELECT id FROM teams WHERE name='Suécia'),
 (SELECT id FROM groups WHERE letter='F'),
 'group','2026-06-20T23:00:00Z','Lumen Field','Seattle',2,'scheduled'),

-- 21 jun ─ Grupo G
((SELECT id FROM teams WHERE name='Bélgica'),
 (SELECT id FROM teams WHERE name='Irã'),
 (SELECT id FROM groups WHERE letter='G'),
 'group','2026-06-21T16:00:00Z','Mercedes-Benz Stadium','Atlanta',2,'scheduled'),

-- 21 jun ─ Grupo G
((SELECT id FROM teams WHERE name='Nova Zelândia'),
 (SELECT id FROM teams WHERE name='Egito'),
 (SELECT id FROM groups WHERE letter='G'),
 'group','2026-06-21T19:00:00Z','GEHA Field at Arrowhead','Kansas City',2,'scheduled'),

-- 21 jun ─ Grupo H
((SELECT id FROM teams WHERE name='Espanha'),
 (SELECT id FROM teams WHERE name='Arábia Saudita'),
 (SELECT id FROM groups WHERE letter='H'),
 'group','2026-06-21T22:00:00Z','AT&T Stadium','Dallas',2,'scheduled'),

-- 21 jun ─ Grupo H
((SELECT id FROM teams WHERE name='Uruguai'),
 (SELECT id FROM teams WHERE name='Cabo Verde'),
 (SELECT id FROM groups WHERE letter='H'),
 'group','2026-06-21T23:00:00Z','SoFi Stadium','Los Angeles',2,'scheduled'),

-- 22 jun ─ Grupo I
((SELECT id FROM teams WHERE name='França'),
 (SELECT id FROM teams WHERE name='Iraque'),
 (SELECT id FROM groups WHERE letter='I'),
 'group','2026-06-22T16:00:00Z','MetLife Stadium','Nova Jersey',2,'scheduled'),

-- 22 jun ─ Grupo I
((SELECT id FROM teams WHERE name='Noruega'),
 (SELECT id FROM teams WHERE name='Senegal'),
 (SELECT id FROM groups WHERE letter='I'),
 'group','2026-06-22T19:00:00Z','NRG Stadium','Houston',2,'scheduled'),

-- 22 jun ─ Grupo J
((SELECT id FROM teams WHERE name='Argentina'),
 (SELECT id FROM teams WHERE name='Áustria'),
 (SELECT id FROM groups WHERE letter='J'),
 'group','2026-06-22T22:00:00Z','Hard Rock Stadium','Miami',2,'scheduled'),

-- 22 jun ─ Grupo J
((SELECT id FROM teams WHERE name='Jordânia'),
 (SELECT id FROM teams WHERE name='Argélia'),
 (SELECT id FROM groups WHERE letter='J'),
 'group','2026-06-22T23:00:00Z','Levi''s Stadium','São Francisco',2,'scheduled'),

-- 23 jun ─ Grupo K
((SELECT id FROM teams WHERE name='Portugal'),
 (SELECT id FROM teams WHERE name='Uzbequistão'),
 (SELECT id FROM groups WHERE letter='K'),
 'group','2026-06-23T16:00:00Z','Mercedes-Benz Stadium','Atlanta',2,'scheduled'),

-- 23 jun ─ Grupo K
((SELECT id FROM teams WHERE name='Colômbia'),
 (SELECT id FROM teams WHERE name='RD Congo'),
 (SELECT id FROM groups WHERE letter='K'),
 'group','2026-06-23T19:00:00Z','GEHA Field at Arrowhead','Kansas City',2,'scheduled'),

-- 23 jun ─ Grupo L
((SELECT id FROM teams WHERE name='Inglaterra'),
 (SELECT id FROM teams WHERE name='Gana'),
 (SELECT id FROM groups WHERE letter='L'),
 'group','2026-06-23T22:00:00Z','Gillette Stadium','Boston',2,'scheduled'),

-- 23 jun ─ Grupo L
((SELECT id FROM teams WHERE name='Panamá'),
 (SELECT id FROM teams WHERE name='Croácia'),
 (SELECT id FROM groups WHERE letter='L'),
 'group','2026-06-23T23:00:00Z','Lumen Field','Seattle',2,'scheduled');

-- ── RODADA 3 (24 a 27 de junho) ──────────────────────────────────────
INSERT INTO matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number, status) VALUES

-- 24 jun ─ Grupo A (simultâneos)
((SELECT id FROM teams WHERE name='Tchéquia'),
 (SELECT id FROM teams WHERE name='México'),
 (SELECT id FROM groups WHERE letter='A'),
 'group','2026-06-24T20:00:00Z','Estadio BBVA','Monterrey',3,'scheduled'),

((SELECT id FROM teams WHERE name='África do Sul'),
 (SELECT id FROM teams WHERE name='Coreia do Sul'),
 (SELECT id FROM groups WHERE letter='A'),
 'group','2026-06-24T20:00:00Z','Estadio Akron','Guadalajara',3,'scheduled'),

-- 24 jun ─ Grupo B (simultâneos)
((SELECT id FROM teams WHERE name='Suíça'),
 (SELECT id FROM teams WHERE name='Canadá'),
 (SELECT id FROM groups WHERE letter='B'),
 'group','2026-06-24T23:00:00Z','BMO Field','Toronto',3,'scheduled'),

((SELECT id FROM teams WHERE name='Bósnia e Herzegovina'),
 (SELECT id FROM teams WHERE name='Catar'),
 (SELECT id FROM groups WHERE letter='B'),
 'group','2026-06-24T23:00:00Z','BC Place','Vancouver',3,'scheduled'),

-- 25 jun ─ Grupo C (simultâneos)
((SELECT id FROM teams WHERE name='Marrocos'),
 (SELECT id FROM teams WHERE name='Haiti'),
 (SELECT id FROM groups WHERE letter='C'),
 'group','2026-06-25T20:00:00Z','NRG Stadium','Houston',3,'scheduled'),

((SELECT id FROM teams WHERE name='Escócia'),
 (SELECT id FROM teams WHERE name='Brasil'),
 (SELECT id FROM groups WHERE letter='C'),
 'group','2026-06-25T20:00:00Z','MetLife Stadium','Nova Jersey',3,'scheduled'),

-- 25 jun ─ Grupo D (simultâneos)
((SELECT id FROM teams WHERE name='Turquia'),
 (SELECT id FROM teams WHERE name='EUA'),
 (SELECT id FROM groups WHERE letter='D'),
 'group','2026-06-25T23:00:00Z','SoFi Stadium','Los Angeles',3,'scheduled'),

((SELECT id FROM teams WHERE name='Paraguai'),
 (SELECT id FROM teams WHERE name='Austrália'),
 (SELECT id FROM groups WHERE letter='D'),
 'group','2026-06-25T23:00:00Z','Levi''s Stadium','São Francisco',3,'scheduled'),

-- 26 jun ─ Grupo E (simultâneos)
((SELECT id FROM teams WHERE name='Equador'),
 (SELECT id FROM teams WHERE name='Alemanha'),
 (SELECT id FROM groups WHERE letter='E'),
 'group','2026-06-26T18:00:00Z','Gillette Stadium','Boston',3,'scheduled'),

((SELECT id FROM teams WHERE name='Curaçao'),
 (SELECT id FROM teams WHERE name='Costa do Marfim'),
 (SELECT id FROM groups WHERE letter='E'),
 'group','2026-06-26T18:00:00Z','Lincoln Financial Field','Filadélfia',3,'scheduled'),

-- 26 jun ─ Grupo F (simultâneos)
((SELECT id FROM teams WHERE name='Tunísia'),
 (SELECT id FROM teams WHERE name='Holanda'),
 (SELECT id FROM groups WHERE letter='F'),
 'group','2026-06-26T20:00:00Z','Hard Rock Stadium','Miami',3,'scheduled'),

((SELECT id FROM teams WHERE name='Japão'),
 (SELECT id FROM teams WHERE name='Suécia'),
 (SELECT id FROM groups WHERE letter='F'),
 'group','2026-06-26T20:00:00Z','Lumen Field','Seattle',3,'scheduled'),

-- 26 jun ─ Grupo G (simultâneos)
((SELECT id FROM teams WHERE name='Nova Zelândia'),
 (SELECT id FROM teams WHERE name='Bélgica'),
 (SELECT id FROM groups WHERE letter='G'),
 'group','2026-06-26T22:00:00Z','Mercedes-Benz Stadium','Atlanta',3,'scheduled'),

((SELECT id FROM teams WHERE name='Egito'),
 (SELECT id FROM teams WHERE name='Irã'),
 (SELECT id FROM groups WHERE letter='G'),
 'group','2026-06-26T22:00:00Z','GEHA Field at Arrowhead','Kansas City',3,'scheduled'),

-- 26 jun ─ Grupo H (simultâneos)
((SELECT id FROM teams WHERE name='Uruguai'),
 (SELECT id FROM teams WHERE name='Espanha'),
 (SELECT id FROM groups WHERE letter='H'),
 'group','2026-06-26T23:30:00Z','AT&T Stadium','Dallas',3,'scheduled'),

((SELECT id FROM teams WHERE name='Cabo Verde'),
 (SELECT id FROM teams WHERE name='Arábia Saudita'),
 (SELECT id FROM groups WHERE letter='H'),
 'group','2026-06-26T23:30:00Z','SoFi Stadium','Los Angeles',3,'scheduled'),

-- 27 jun ─ Grupo I (simultâneos)
((SELECT id FROM teams WHERE name='Noruega'),
 (SELECT id FROM teams WHERE name='França'),
 (SELECT id FROM groups WHERE letter='I'),
 'group','2026-06-27T18:00:00Z','MetLife Stadium','Nova Jersey',3,'scheduled'),

((SELECT id FROM teams WHERE name='Senegal'),
 (SELECT id FROM teams WHERE name='Iraque'),
 (SELECT id FROM groups WHERE letter='I'),
 'group','2026-06-27T18:00:00Z','NRG Stadium','Houston',3,'scheduled'),

-- 27 jun ─ Grupo J (simultâneos)
((SELECT id FROM teams WHERE name='Jordânia'),
 (SELECT id FROM teams WHERE name='Argentina'),
 (SELECT id FROM groups WHERE letter='J'),
 'group','2026-06-27T20:00:00Z','Hard Rock Stadium','Miami',3,'scheduled'),

((SELECT id FROM teams WHERE name='Argélia'),
 (SELECT id FROM teams WHERE name='Áustria'),
 (SELECT id FROM groups WHERE letter='J'),
 'group','2026-06-27T20:00:00Z','Levi''s Stadium','São Francisco',3,'scheduled'),

-- 27 jun ─ Grupo K (simultâneos)
((SELECT id FROM teams WHERE name='Colômbia'),
 (SELECT id FROM teams WHERE name='Portugal'),
 (SELECT id FROM groups WHERE letter='K'),
 'group','2026-06-27T22:00:00Z','Mercedes-Benz Stadium','Atlanta',3,'scheduled'),

((SELECT id FROM teams WHERE name='RD Congo'),
 (SELECT id FROM teams WHERE name='Uzbequistão'),
 (SELECT id FROM groups WHERE letter='K'),
 'group','2026-06-27T22:00:00Z','GEHA Field at Arrowhead','Kansas City',3,'scheduled'),

-- 27 jun ─ Grupo L (simultâneos)
((SELECT id FROM teams WHERE name='Panamá'),
 (SELECT id FROM teams WHERE name='Inglaterra'),
 (SELECT id FROM groups WHERE letter='L'),
 'group','2026-06-27T23:30:00Z','Gillette Stadium','Boston',3,'scheduled'),

((SELECT id FROM teams WHERE name='Croácia'),
 (SELECT id FROM teams WHERE name='Gana'),
 (SELECT id FROM groups WHERE letter='L'),
 'group','2026-06-27T23:30:00Z','Lumen Field','Seattle',3,'scheduled');

-- =====================================================================
-- Verifica contagem esperada: 72 partidas, 12 grupos, 48 times
SELECT
  (SELECT COUNT(*) FROM groups)   AS grupos,
  (SELECT COUNT(*) FROM teams)    AS times,
  (SELECT COUNT(*) FROM matches WHERE stage = 'group') AS partidas_grupo;
-- Esperado: 12 grupos | 48 times | 72 partidas
-- =====================================================================
