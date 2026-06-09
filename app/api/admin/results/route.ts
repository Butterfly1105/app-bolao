export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { match_id, home_score, away_score } = body

  if (!match_id || home_score === undefined || away_score === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('matches')
    .update({ home_score, away_score, status: 'finished' })
    .eq('id', match_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const { error: rankError } = await supabase.rpc('update_rankings_after_result', {
    match_uuid: match_id,
  })

  if (rankError) {
    console.error('Rankings update error:', rankError)
  }

  return NextResponse.json({ success: true })
}
