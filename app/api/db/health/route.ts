import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ status: "error", message: "DATABASE_URL not configured" }, { status: 500 })
  }

  try {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT NOW() as time, current_database() as database, version() as version`
    return NextResponse.json({
      status: "connected",
      database: result[0].database,
      serverTime: result[0].time,
      version: result[0].version,
    })
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 })
  }
}
