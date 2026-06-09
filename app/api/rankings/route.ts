export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('rankings')
    .select('*, profile:profiles(id, name, username, avatar_url)')
    .order('total_points', { ascending: false })
    .order('exact_scores', { ascending: false })
    .order('correct_results', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
