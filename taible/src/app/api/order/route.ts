import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data } = await supabase.from('kv_store').select('value').eq('key', 'order').single()
    if (data && data.value) {
      return NextResponse.json(Array.isArray(data.value) ? data.value : [])
    }
    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE() {
  try { await supabase.from('kv_store').upsert({ key: 'order', value: [] }) } catch {}
  try { await supabase.from('kv_store').upsert({ key: 'messages', value: [] }) } catch {}
  return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
  try {
    const item = await req.json()
    let order: any[] = []
    const { data } = await supabase.from('kv_store').select('value').eq('key', 'order').single()
    if (data && Array.isArray(data.value)) {
      order = data.value
    }
    order.push(item)
    await supabase.from('kv_store').upsert({ key: 'order', value: order })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
