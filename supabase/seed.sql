-- =============================================
-- SEED: Copa do Mundo 2026 (placeholder data)
-- Atualize com os times oficiais do sorteio
-- =============================================

-- Grupos
INSERT INTO public.groups (letter, name) VALUES
  ('A', 'Grupo A'), ('B', 'Grupo B'), ('C', 'Grupo C'), ('D', 'Grupo D'),
  ('E', 'Grupo E'), ('F', 'Grupo F'), ('G', 'Grupo G'), ('H', 'Grupo H');

-- Seleções (Copa do Mundo 2022 como modelo)
INSERT INTO public.teams (name, short_name, flag_emoji, group_letter) VALUES
  -- Grupo A
  ('Catar', 'QAT', '🇶🇦', 'A'),
  ('Equador', 'ECU', '🇪🇨', 'A'),
  ('Senegal', 'SEN', '🇸🇳', 'A'),
  ('Holanda', 'NED', '🇳🇱', 'A'),
  -- Grupo B
  ('Inglaterra', 'ENG', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'B'),
  ('Irã', 'IRN', '🇮🇷', 'B'),
  ('EUA', 'USA', '🇺🇸', 'B'),
  ('País de Gales', 'WAL', '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'B'),
  -- Grupo C
  ('Argentina', 'ARG', '🇦🇷', 'C'),
  ('Arábia Saudita', 'KSA', '🇸🇦', 'C'),
  ('México', 'MEX', '🇲🇽', 'C'),
  ('Polônia', 'POL', '🇵🇱', 'C'),
  -- Grupo D
  ('França', 'FRA', '🇫🇷', 'D'),
  ('Austrália', 'AUS', '🇦🇺', 'D'),
  ('Dinamarca', 'DEN', '🇩🇰', 'D'),
  ('Tunísia', 'TUN', '🇹🇳', 'D'),
  -- Grupo E
  ('Espanha', 'ESP', '🇪🇸', 'E'),
  ('Costa Rica', 'CRC', '🇨🇷', 'E'),
  ('Alemanha', 'GER', '🇩🇪', 'E'),
  ('Japão', 'JPN', '🇯🇵', 'E'),
  -- Grupo F
  ('Bélgica', 'BEL', '🇧🇪', 'F'),
  ('Canadá', 'CAN', '🇨🇦', 'F'),
  ('Marrocos', 'MAR', '🇲🇦', 'F'),
  ('Croácia', 'CRO', '🇭🇷', 'F'),
  -- Grupo G
  ('Brasil', 'BRA', '🇧🇷', 'G'),
  ('Sérvia', 'SRB', '🇷🇸', 'G'),
  ('Suíça', 'SUI', '🇨🇭', 'G'),
  ('Camarões', 'CMR', '🇨🇲', 'G'),
  -- Grupo H
  ('Portugal', 'POR', '🇵🇹', 'H'),
  ('Gana', 'GHA', '🇬🇭', 'H'),
  ('Uruguai', 'URU', '🇺🇾', 'H'),
  ('Coreia do Sul', 'KOR', '🇰🇷', 'H');

-- Partidas da Fase de Grupos (usando IDs dinâmicos)
-- GRUPO A
INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'QAT'),
  (SELECT id FROM public.teams WHERE short_name = 'ECU'),
  (SELECT id FROM public.groups WHERE letter = 'A'),
  'group', '2026-06-11 16:00:00-03', 'Estádio Lusail', 'Nova York', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'SEN'),
  (SELECT id FROM public.teams WHERE short_name = 'NED'),
  (SELECT id FROM public.groups WHERE letter = 'A'),
  'group', '2026-06-11 19:00:00-03', 'MetLife Stadium', 'Nova York', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'QAT'),
  (SELECT id FROM public.teams WHERE short_name = 'SEN'),
  (SELECT id FROM public.groups WHERE letter = 'A'),
  'group', '2026-06-15 13:00:00-03', 'AT&T Stadium', 'Dallas', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'NED'),
  (SELECT id FROM public.teams WHERE short_name = 'ECU'),
  (SELECT id FROM public.groups WHERE letter = 'A'),
  'group', '2026-06-15 16:00:00-03', 'SoFi Stadium', 'Los Angeles', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'ECU'),
  (SELECT id FROM public.teams WHERE short_name = 'SEN'),
  (SELECT id FROM public.groups WHERE letter = 'A'),
  'group', '2026-06-20 16:00:00-03', 'Estadio Azteca', 'Cidade do México', 3;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'NED'),
  (SELECT id FROM public.teams WHERE short_name = 'QAT'),
  (SELECT id FROM public.groups WHERE letter = 'A'),
  'group', '2026-06-20 16:00:00-03', 'Estadio BBVA', 'Monterrey', 3;

-- GRUPO B
INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'ENG'),
  (SELECT id FROM public.teams WHERE short_name = 'IRN'),
  (SELECT id FROM public.groups WHERE letter = 'B'),
  'group', '2026-06-12 10:00:00-03', 'SoFi Stadium', 'Los Angeles', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'USA'),
  (SELECT id FROM public.teams WHERE short_name = 'WAL'),
  (SELECT id FROM public.groups WHERE letter = 'B'),
  'group', '2026-06-12 19:00:00-03', 'Ahmad Bin Ali', 'Chicago', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'WAL'),
  (SELECT id FROM public.teams WHERE short_name = 'IRN'),
  (SELECT id FROM public.groups WHERE letter = 'B'),
  'group', '2026-06-16 10:00:00-03', 'Estadio Akron', 'Guadalajara', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'ENG'),
  (SELECT id FROM public.teams WHERE short_name = 'USA'),
  (SELECT id FROM public.groups WHERE letter = 'B'),
  'group', '2026-06-16 16:00:00-03', 'MetLife Stadium', 'Nova York', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'IRN'),
  (SELECT id FROM public.teams WHERE short_name = 'USA'),
  (SELECT id FROM public.groups WHERE letter = 'B'),
  'group', '2026-06-21 16:00:00-03', 'Allegiant Stadium', 'Las Vegas', 3;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'WAL'),
  (SELECT id FROM public.teams WHERE short_name = 'ENG'),
  (SELECT id FROM public.groups WHERE letter = 'B'),
  'group', '2026-06-21 16:00:00-03', 'Levi''s Stadium', 'São Francisco', 3;

-- GRUPO C
INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'ARG'),
  (SELECT id FROM public.teams WHERE short_name = 'KSA'),
  (SELECT id FROM public.groups WHERE letter = 'C'),
  'group', '2026-06-12 13:00:00-03', 'Lusail Stadium', 'Miami', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'MEX'),
  (SELECT id FROM public.teams WHERE short_name = 'POL'),
  (SELECT id FROM public.groups WHERE letter = 'C'),
  'group', '2026-06-12 16:00:00-03', 'Hard Rock Stadium', 'Miami', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'POL'),
  (SELECT id FROM public.teams WHERE short_name = 'KSA'),
  (SELECT id FROM public.groups WHERE letter = 'C'),
  'group', '2026-06-17 10:00:00-03', 'AT&T Stadium', 'Dallas', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'ARG'),
  (SELECT id FROM public.teams WHERE short_name = 'MEX'),
  (SELECT id FROM public.groups WHERE letter = 'C'),
  'group', '2026-06-17 16:00:00-03', 'Estadio Azteca', 'Cidade do México', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'KSA'),
  (SELECT id FROM public.teams WHERE short_name = 'MEX'),
  (SELECT id FROM public.groups WHERE letter = 'C'),
  'group', '2026-06-22 16:00:00-03', 'Allegiant Stadium', 'Las Vegas', 3;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'POL'),
  (SELECT id FROM public.teams WHERE short_name = 'ARG'),
  (SELECT id FROM public.groups WHERE letter = 'C'),
  'group', '2026-06-22 16:00:00-03', 'Levi''s Stadium', 'São Francisco', 3;

-- GRUPO D
INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'FRA'),
  (SELECT id FROM public.teams WHERE short_name = 'AUS'),
  (SELECT id FROM public.groups WHERE letter = 'D'),
  'group', '2026-06-13 10:00:00-03', 'AT&T Stadium', 'Dallas', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'DEN'),
  (SELECT id FROM public.teams WHERE short_name = 'TUN'),
  (SELECT id FROM public.groups WHERE letter = 'D'),
  'group', '2026-06-13 16:00:00-03', 'MetLife Stadium', 'Nova York', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'TUN'),
  (SELECT id FROM public.teams WHERE short_name = 'AUS'),
  (SELECT id FROM public.groups WHERE letter = 'D'),
  'group', '2026-06-18 10:00:00-03', 'Estadio Akron', 'Guadalajara', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'FRA'),
  (SELECT id FROM public.teams WHERE short_name = 'DEN'),
  (SELECT id FROM public.groups WHERE letter = 'D'),
  'group', '2026-06-18 16:00:00-03', 'Hard Rock Stadium', 'Miami', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'AUS'),
  (SELECT id FROM public.teams WHERE short_name = 'DEN'),
  (SELECT id FROM public.groups WHERE letter = 'D'),
  'group', '2026-06-23 16:00:00-03', 'Estadio Azteca', 'Cidade do México', 3;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'TUN'),
  (SELECT id FROM public.teams WHERE short_name = 'FRA'),
  (SELECT id FROM public.groups WHERE letter = 'D'),
  'group', '2026-06-23 16:00:00-03', 'SoFi Stadium', 'Los Angeles', 3;

-- GRUPO E
INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'ESP'),
  (SELECT id FROM public.teams WHERE short_name = 'CRC'),
  (SELECT id FROM public.groups WHERE letter = 'E'),
  'group', '2026-06-14 10:00:00-03', 'SoFi Stadium', 'Los Angeles', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'GER'),
  (SELECT id FROM public.teams WHERE short_name = 'JPN'),
  (SELECT id FROM public.groups WHERE letter = 'E'),
  'group', '2026-06-14 13:00:00-03', 'Allegiant Stadium', 'Las Vegas', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'JPN'),
  (SELECT id FROM public.teams WHERE short_name = 'CRC'),
  (SELECT id FROM public.groups WHERE letter = 'E'),
  'group', '2026-06-18 13:00:00-03', 'Levi''s Stadium', 'São Francisco', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'ESP'),
  (SELECT id FROM public.teams WHERE short_name = 'GER'),
  (SELECT id FROM public.groups WHERE letter = 'E'),
  'group', '2026-06-19 16:00:00-03', 'MetLife Stadium', 'Nova York', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'CRC'),
  (SELECT id FROM public.teams WHERE short_name = 'GER'),
  (SELECT id FROM public.groups WHERE letter = 'E'),
  'group', '2026-06-24 16:00:00-03', 'AT&T Stadium', 'Dallas', 3;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'JPN'),
  (SELECT id FROM public.teams WHERE short_name = 'ESP'),
  (SELECT id FROM public.groups WHERE letter = 'E'),
  'group', '2026-06-24 16:00:00-03', 'Estadio BBVA', 'Monterrey', 3;

-- GRUPO F
INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'BEL'),
  (SELECT id FROM public.teams WHERE short_name = 'CAN'),
  (SELECT id FROM public.groups WHERE letter = 'F'),
  'group', '2026-06-14 16:00:00-03', 'Estadio Azteca', 'Cidade do México', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'MAR'),
  (SELECT id FROM public.teams WHERE short_name = 'CRO'),
  (SELECT id FROM public.groups WHERE letter = 'F'),
  'group', '2026-06-14 19:00:00-03', 'Hard Rock Stadium', 'Miami', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'CRO'),
  (SELECT id FROM public.teams WHERE short_name = 'CAN'),
  (SELECT id FROM public.groups WHERE letter = 'F'),
  'group', '2026-06-19 10:00:00-03', 'Estadio Akron', 'Guadalajara', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'BEL'),
  (SELECT id FROM public.teams WHERE short_name = 'MAR'),
  (SELECT id FROM public.groups WHERE letter = 'F'),
  'group', '2026-06-19 13:00:00-03', 'SoFi Stadium', 'Los Angeles', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'CAN'),
  (SELECT id FROM public.teams WHERE short_name = 'MAR'),
  (SELECT id FROM public.groups WHERE letter = 'F'),
  'group', '2026-06-25 16:00:00-03', 'Estadio BBVA', 'Monterrey', 3;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'CRO'),
  (SELECT id FROM public.teams WHERE short_name = 'BEL'),
  (SELECT id FROM public.groups WHERE letter = 'F'),
  'group', '2026-06-25 16:00:00-03', 'MetLife Stadium', 'Nova York', 3;

-- GRUPO G
INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'BRA'),
  (SELECT id FROM public.teams WHERE short_name = 'SRB'),
  (SELECT id FROM public.groups WHERE letter = 'G'),
  'group', '2026-06-15 10:00:00-03', 'Levi''s Stadium', 'São Francisco', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'SUI'),
  (SELECT id FROM public.teams WHERE short_name = 'CMR'),
  (SELECT id FROM public.groups WHERE letter = 'G'),
  'group', '2026-06-15 13:00:00-03', 'Allegiant Stadium', 'Las Vegas', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'CMR'),
  (SELECT id FROM public.teams WHERE short_name = 'SRB'),
  (SELECT id FROM public.groups WHERE letter = 'G'),
  'group', '2026-06-20 10:00:00-03', 'Estadio Azteca', 'Cidade do México', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'BRA'),
  (SELECT id FROM public.teams WHERE short_name = 'SUI'),
  (SELECT id FROM public.groups WHERE letter = 'G'),
  'group', '2026-06-20 13:00:00-03', 'AT&T Stadium', 'Dallas', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'SRB'),
  (SELECT id FROM public.teams WHERE short_name = 'SUI'),
  (SELECT id FROM public.groups WHERE letter = 'G'),
  'group', '2026-06-25 16:00:00-03', 'Hard Rock Stadium', 'Miami', 3;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'CMR'),
  (SELECT id FROM public.teams WHERE short_name = 'BRA'),
  (SELECT id FROM public.groups WHERE letter = 'G'),
  'group', '2026-06-25 16:00:00-03', 'SoFi Stadium', 'Los Angeles', 3;

-- GRUPO H
INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'POR'),
  (SELECT id FROM public.teams WHERE short_name = 'GHA'),
  (SELECT id FROM public.groups WHERE letter = 'H'),
  'group', '2026-06-15 19:00:00-03', 'Estadio BBVA', 'Monterrey', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'URU'),
  (SELECT id FROM public.teams WHERE short_name = 'KOR'),
  (SELECT id FROM public.groups WHERE letter = 'H'),
  'group', '2026-06-16 13:00:00-03', 'Estadio Akron', 'Guadalajara', 1;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'KOR'),
  (SELECT id FROM public.teams WHERE short_name = 'GHA'),
  (SELECT id FROM public.groups WHERE letter = 'H'),
  'group', '2026-06-21 10:00:00-03', 'AT&T Stadium', 'Dallas', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'POR'),
  (SELECT id FROM public.teams WHERE short_name = 'URU'),
  (SELECT id FROM public.groups WHERE letter = 'H'),
  'group', '2026-06-21 13:00:00-03', 'Levi''s Stadium', 'São Francisco', 2;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'GHA'),
  (SELECT id FROM public.teams WHERE short_name = 'URU'),
  (SELECT id FROM public.groups WHERE letter = 'H'),
  'group', '2026-06-26 16:00:00-03', 'MetLife Stadium', 'Nova York', 3;

INSERT INTO public.matches (home_team_id, away_team_id, group_id, stage, match_date, venue, city, round_number)
SELECT
  (SELECT id FROM public.teams WHERE short_name = 'KOR'),
  (SELECT id FROM public.teams WHERE short_name = 'POR'),
  (SELECT id FROM public.groups WHERE letter = 'H'),
  'group', '2026-06-26 16:00:00-03', 'Allegiant Stadium', 'Las Vegas', 3;

-- MATA-MATA (times TBD - a definir após fase de grupos)
-- Oitavas de Final
INSERT INTO public.matches (home_team_placeholder, away_team_placeholder, stage, match_date, venue, city, round_number, bracket_position)
VALUES
  ('1A', '2B', 'round_of_16', '2026-07-01 16:00:00-03', 'MetLife Stadium', 'Nova York', 1, 1),
  ('1C', '2D', 'round_of_16', '2026-07-02 12:00:00-03', 'SoFi Stadium', 'Los Angeles', 1, 2),
  ('1E', '2F', 'round_of_16', '2026-07-02 16:00:00-03', 'AT&T Stadium', 'Dallas', 1, 3),
  ('1G', '2H', 'round_of_16', '2026-07-03 12:00:00-03', 'Estadio Azteca', 'Cidade do México', 1, 4),
  ('1B', '2A', 'round_of_16', '2026-07-03 16:00:00-03', 'Hard Rock Stadium', 'Miami', 1, 5),
  ('1D', '2C', 'round_of_16', '2026-07-04 12:00:00-03', 'Allegiant Stadium', 'Las Vegas', 1, 6),
  ('1F', '2E', 'round_of_16', '2026-07-04 16:00:00-03', 'Levi''s Stadium', 'São Francisco', 1, 7),
  ('1H', '2G', 'round_of_16', '2026-07-05 16:00:00-03', 'Estadio BBVA', 'Monterrey', 1, 8);

-- Quartas de Final
INSERT INTO public.matches (home_team_placeholder, away_team_placeholder, stage, match_date, venue, city, round_number, bracket_position)
VALUES
  ('Vencedor Oitavas 1', 'Vencedor Oitavas 2', 'quarter_final', '2026-07-09 16:00:00-03', 'MetLife Stadium', 'Nova York', 1, 1),
  ('Vencedor Oitavas 3', 'Vencedor Oitavas 4', 'quarter_final', '2026-07-10 16:00:00-03', 'AT&T Stadium', 'Dallas', 1, 2),
  ('Vencedor Oitavas 5', 'Vencedor Oitavas 6', 'quarter_final', '2026-07-11 16:00:00-03', 'SoFi Stadium', 'Los Angeles', 1, 3),
  ('Vencedor Oitavas 7', 'Vencedor Oitavas 8', 'quarter_final', '2026-07-12 16:00:00-03', 'Estadio Azteca', 'Cidade do México', 1, 4);

-- Semifinais
INSERT INTO public.matches (home_team_placeholder, away_team_placeholder, stage, match_date, venue, city, round_number, bracket_position)
VALUES
  ('Vencedor QF 1', 'Vencedor QF 2', 'semi_final', '2026-07-15 16:00:00-03', 'MetLife Stadium', 'Nova York', 1, 1),
  ('Vencedor QF 3', 'Vencedor QF 4', 'semi_final', '2026-07-16 16:00:00-03', 'AT&T Stadium', 'Dallas', 1, 2);

-- Terceiro Lugar
INSERT INTO public.matches (home_team_placeholder, away_team_placeholder, stage, match_date, venue, city, round_number, bracket_position)
VALUES
  ('Perdedor SF 1', 'Perdedor SF 2', 'third_place', '2026-07-19 12:00:00-03', 'Hard Rock Stadium', 'Miami', 1, 1);

-- Final
INSERT INTO public.matches (home_team_placeholder, away_team_placeholder, stage, match_date, venue, city, round_number, bracket_position)
VALUES
  ('Vencedor SF 1', 'Vencedor SF 2', 'final', '2026-07-19 16:00:00-03', 'MetLife Stadium', 'Nova York', 1, 1);
