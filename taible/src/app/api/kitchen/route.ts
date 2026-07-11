import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const KITCHEN_FILE = path.join(process.cwd(), "public", "kitchen-orders.json")

/** GET – return all kitchen orders */
export async function GET() {
  try {
    if (!fs.existsSync(KITCHEN_FILE)) return NextResponse.json([])
    const data = JSON.parse(fs.readFileSync(KITCHEN_FILE, "utf-8"))
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch {
    return NextResponse.json([])
  }
}

/** POST – add a new confirmed order */
export async function POST(req: Request) {
  try {
    const order = await req.json()
    let orders: unknown[] = []
    if (fs.existsSync(KITCHEN_FILE)) {
      orders = JSON.parse(fs.readFileSync(KITCHEN_FILE, "utf-8"))
    }
    orders = [order, ...orders]
    fs.writeFileSync(KITCHEN_FILE, JSON.stringify(orders))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 })
  }
}

/** PATCH – update order status */
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    if (!fs.existsSync(KITCHEN_FILE)) return NextResponse.json({ ok: false })
    let orders: Array<{ id: string; status: string }> = JSON.parse(fs.readFileSync(KITCHEN_FILE, "utf-8"))
    orders = orders.map(o => o.id === id ? { ...o, status } : o)
    fs.writeFileSync(KITCHEN_FILE, JSON.stringify(orders))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
