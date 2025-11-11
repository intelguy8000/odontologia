import { NextResponse } from "next/server";
import { getInventoryItems } from "@/lib/services/inventario.service";

export async function GET() {
  try {
    const items = await getInventoryItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Error fetching inventory" },
      { status: 500 }
    );
  }
}
