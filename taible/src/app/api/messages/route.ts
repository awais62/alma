import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data } = await supabase.from('kv_store').select('value').eq('key', 'messages').single()
    if (data && data.value) {
      return NextResponse.json(data.value)
    }
    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE() {
  try {
    await supabase.from('kv_store').upsert({ key: 'messages', value: [] })
  } catch {}
  return NextResponse.json({ ok: true })
}