import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data } = await supabase.from('kv_store').select('value').eq('key', 'kitchen').single()
    if (data && data.value) {
      return NextResponse.json(Array.isArray(data.value) ? data.value : [])
    }
    return NextResponse.json([])
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const order = await req.json()
    let orders: any[] = []
    const { data } = await supabase.from('kv_store').select('value').eq('key', 'kitchen').single()
    if (data && Array.isArray(data.value)) {
      orders = data.value
    }
    orders = [order, ...orders]
    await supabase.from('kv_store').upsert({ key: 'kitchen', value: orders })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    const { data } = await supabase.from('kv_store').select('value').eq('key', 'kitchen').single()
    if (!data || !Array.isArray(data.value)) return NextResponse.json({ ok: false })
    let orders = data.value
    orders = orders.map((o: any) => o.id === id ? { ...o, status } : o)
    await supabase.from('kv_store').upsert({ key: 'kitchen', value: orders })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
