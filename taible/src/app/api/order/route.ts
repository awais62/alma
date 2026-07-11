import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const ORDER_FILE = path.join(process.cwd(), "public", "order.json")
const MSG_FILE = path.join(process.cwd(), "public", "messages.json")

/** GET – return current backend order items */
export async function GET() {
  try {
    if (!fs.existsSync(ORDER_FILE)) return NextResponse.json([])
    const data = JSON.parse(fs.readFileSync(ORDER_FILE, "utf-8"))
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch {
    return NextResponse.json([])
  }
}

/** DELETE – clear both order and messages for a fresh session */
export async function DELETE() {
  try { if (fs.existsSync(ORDER_FILE)) fs.writeFileSync(ORDER_FILE, "[]") } catch {}
  try { if (fs.existsSync(MSG_FILE)) fs.writeFileSync(MSG_FILE, "[]") } catch {}
  return NextResponse.json({ ok: true })
}
/** POST – add item to backend order items */
export async function POST(req: Request) {
  try {
    const item = await req.json()
    let data: any[] = []
    if (fs.existsSync(ORDER_FILE)) {
      data = JSON.parse(fs.readFileSync(ORDER_FILE, "utf-8"))
      if (!Array.isArray(data)) data = []
    }
    data.push(item)
    fs.writeFileSync(ORDER_FILE, JSON.stringify(data))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
