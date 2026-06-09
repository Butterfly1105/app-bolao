-- =============================================
-- BOLÃO DA COPA - Schema Inicial
-- =============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES (extensão da tabela auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfis públicos visíveis por todos"
  ON public.profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Usuário edita próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Perfil criado no cadastro"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- TEAMS (Seleções)
-- =============================================
CREATE TABLE public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  flag_emoji TEXT NOT NULL DEFAULT '🏳️',
  group_letter CHAR(1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Times visíveis por todos"
  ON public.teams FOR SELECT
  USING (TRUE);

CREATE POLICY "Apenas admin gerencia times"
  ON public.teams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- =============================================
-- GROUPS (Grupos da fase de grupos)
-- =============================================
CREATE TABLE public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  letter CHAR(1) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Grupos visíveis por todos"
  ON public.groups FOR SELECT
  USING (TRUE);

CREATE POLICY "Apenas admin gerencia grupos"
  ON public.groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- =============================================
-- MATCHES (Partidas)
-- =============================================
CREATE TYPE match_stage AS ENUM (
  'group',
  'round_of_16',
  'quarter_final',
  'semi_final',
  'third_place',
  'final'
);

CREATE TYPE match_status AS ENUM (
  'scheduled',
  'live',
  'finished',
  'cancelled'
);

CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  home_team_id UUID REFERENCES public.teams(id),
  away_team_id UUID REFERENCES public.teams(id),
  home_team_placeholder TEXT,
  away_team_placeholder TEXT,
  group_id UUID REFERENCES public.groups(id),
  stage match_stage NOT NULL DEFAULT 'group',
  match_date TIMESTAMPTZ,
  venue TEXT,
  city TEXT,
  round_number INTEGER DEFAULT 1,
  bracket_position INTEGER,
  status match_status DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partidas visíveis por todos"
  ON public.matches FOR SELECT
  USING (TRUE);

CREATE POLICY "Apenas admin gerencia partidas"
  ON public.matches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- =============================================
-- PREDICTIONS (Palpites)
-- =============================================
CREATE TABLE public.predictions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuário vê próprios palpites"
  ON public.predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin vê todos os palpites"
  ON public.predictions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Usuário cria próprios palpites"
  ON public.predictions FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id AND status = 'scheduled'
    )
  );

CREATE POLICY "Usuário edita próprios palpites antes do jogo"
  ON public.predictions FOR UPDATE
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id AND status = 'scheduled'
    )
  );

-- =============================================
-- RANKINGS (Classificação)
-- =============================================
CREATE TABLE public.rankings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_points INTEGER DEFAULT 0,
  exact_scores INTEGER DEFAULT 0,
  correct_results INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  position INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rankings visíveis por todos"
  ON public.rankings FOR SELECT
  USING (TRUE);

CREATE POLICY "Sistema gerencia rankings"
  ON public.rankings FOR ALL
  USING (TRUE);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Função para criar perfil automaticamente ao cadastrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );

  INSERT INTO public.rankings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para calcular pontuação de um palpite
CREATE OR REPLACE FUNCTION public.calculate_prediction_points(
  pred_home INTEGER,
  pred_away INTEGER,
  result_home INTEGER,
  result_away INTEGER
)
RETURNS INTEGER AS $$
BEGIN
  -- Placar exato
  IF pred_home = result_home AND pred_away = result_away THEN
    RETURN 10;
  END IF;

  -- Acertou empate
  IF pred_home = pred_away AND result_home = result_away THEN
    RETURN 5;
  END IF;

  -- Acertou vencedor (casa)
  IF pred_home > pred_away AND result_home > result_away THEN
    RETURN 5;
  END IF;

  -- Acertou vencedor (visitante)
  IF pred_home < pred_away AND result_home < result_away THEN
    RETURN 5;
  END IF;

  RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar ranking após resultado
CREATE OR REPLACE FUNCTION public.update_rankings_after_result(match_uuid UUID)
RETURNS VOID AS $$
DECLARE
  match_record RECORD;
  pred_record RECORD;
  pts INTEGER;
BEGIN
  SELECT home_score, away_score INTO match_record
  FROM public.matches
  WHERE id = match_uuid AND status = 'finished';

  IF NOT FOUND THEN RETURN; END IF;

  FOR pred_record IN
    SELECT id, user_id, home_score, away_score
    FROM public.predictions
    WHERE match_id = match_uuid
  LOOP
    pts := public.calculate_prediction_points(
      pred_record.home_score,
      pred_record.away_score,
      match_record.home_score,
      match_record.away_score
    );

    UPDATE public.predictions
    SET points_earned = pts, updated_at = NOW()
    WHERE id = pred_record.id;

    INSERT INTO public.rankings (user_id, total_points, exact_scores, correct_results, total_predictions)
    VALUES (pred_record.user_id, pts,
      CASE WHEN pts = 10 THEN 1 ELSE 0 END,
      CASE WHEN pts = 5 THEN 1 ELSE 0 END,
      1)
    ON CONFLICT (user_id) DO UPDATE SET
      total_points = rankings.total_points + pts,
      exact_scores = rankings.exact_scores + CASE WHEN pts = 10 THEN 1 ELSE 0 END,
      correct_results = rankings.correct_results + CASE WHEN pts = 5 THEN 1 ELSE 0 END,
      total_predictions = rankings.total_predictions + 1,
      updated_at = NOW();
  END LOOP;

  -- Recalcula posições
  WITH ranked AS (
    SELECT user_id, ROW_NUMBER() OVER (
      ORDER BY total_points DESC, exact_scores DESC, correct_results DESC
    ) AS pos
    FROM public.rankings
  )
  UPDATE public.rankings r
  SET position = ranked.pos
  FROM ranked
  WHERE r.user_id = ranked.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_matches_updated_at
  BEFORE UPDATE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_predictions_updated_at
  BEFORE UPDATE ON public.predictions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Índices para performance
CREATE INDEX idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX idx_predictions_match_id ON public.predictions(match_id);
CREATE INDEX idx_matches_stage ON public.matches(stage);
CREATE INDEX idx_matches_group_id ON public.matches(group_id);
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_rankings_total_points ON public.rankings(total_points DESC);
