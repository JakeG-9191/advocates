import { NextResponse } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema"; 

export async function GET() {
  try {
    const data = await db.select().from(advocates);
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch advocates" }, { status: 500 });
  }
}
