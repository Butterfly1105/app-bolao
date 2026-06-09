export type MatchStage =
  | 'group'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'third_place'
  | 'final'

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'

export interface Profile {
  id: string
  email: string
  name: string
  username: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  name: string
  short_name: string
  flag_emoji: string
  group_letter: string | null
  created_at: string
}

export interface Group {
  id: string
  letter: string
  name: string
  created_at: string
}

export interface Match {
  id: string
  home_team_id: string | null
  away_team_id: string | null
  home_team_placeholder: string | null
  away_team_placeholder: string | null
  group_id: string | null
  stage: MatchStage
  match_date: string | null
  venue: string | null
  city: string | null
  round_number: number
  bracket_position: number | null
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  created_at: string
  updated_at: string
  home_team?: Team
  away_team?: Team
  group?: Group
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  home_score: number
  away_score: number
  points_earned: number
  created_at: string
  updated_at: string
  match?: Match
  profile?: Profile
}

export interface Ranking {
  id: string
  user_id: string
  total_points: number
  exact_scores: number
  correct_results: number
  total_predictions: number
  position: number | null
  updated_at: string
  profile?: Profile
}

export interface MatchWithPrediction extends Match {
  prediction?: Prediction | null
}

export const STAGE_LABELS: Record<MatchStage, string> = {
  group: 'Fase de Grupos',
  round_of_16: 'Oitavas de Final',
  quarter_final: 'Quartas de Final',
  semi_final: 'Semifinais',
  third_place: 'Disputa de 3º Lugar',
  final: 'Final',
}

export const STAGE_ORDER: Record<MatchStage, number> = {
  group: 1,
  round_of_16: 2,
  quarter_final: 3,
  semi_final: 4,
  third_place: 5,
  final: 6,
}
