import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const MSG_FILE = path.join(process.cwd(), "public", "messages.json")

export async function GET() {
  try {
    if (!fs.existsSync(MSG_FILE)) return NextResponse.json([])
    const data = JSON.parse(fs.readFileSync(MSG_FILE, "utf-8"))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE() {
  try { if (fs.existsSync(MSG_FILE)) fs.writeFileSync(MSG_FILE, "[]") } catch {}
  return NextResponse.json({ ok: true })
}