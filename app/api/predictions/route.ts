export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const matchId = searchParams.get('match_id')

  let query = supabase
    .from('predictions')
    .select('*, match:matches(*, home_team:teams!home_team_id(*), away_team:teams!away_team_id(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (matchId) {
    query = query.eq('match_id', matchId) as any
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { match_id, home_score, away_score } = body

  if (!match_id || home_score === undefined || away_score === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { data: match } = await supabase
    .from('matches')
    .select('status')
    .eq('id', match_id)
    .single()

  if (match?.status !== 'scheduled') {
    return NextResponse.json({ error: 'Match is not accepting predictions' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('predictions')
    .upsert({
      user_id: user.id,
      match_id,
      home_score,
      away_score,
    }, { onConflict: 'user_id,match_id' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
