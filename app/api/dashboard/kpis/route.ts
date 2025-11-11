import { NextResponse } from "next/server";
import { getDashboardKPIs } from "@/lib/services/dashboard.service";

export async function GET() {
  try {
    const kpis = await getDashboardKPIs();
    return NextResponse.json(kpis);
  } catch (error) {
    console.error("Error fetching dashboard KPIs:", error);
    return NextResponse.json(
      { error: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
