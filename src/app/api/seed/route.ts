import  db from "../../../db"; 
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  try {
    const records = await db.insert(advocates).values(advocateData).returning();
    return Response.json({ advocates: records });
  } catch (error) {
    return Response.json({ error: "Error inserting records" }, { status: 500 });
  }
}
