import { NextResponse } from "next/server";
import { getSales, createSale } from "@/lib/services/ventas.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      patientId: searchParams.get("patientId") || undefined,
      status: searchParams.get("status") || undefined,
      dateFrom: searchParams.get("dateFrom")
        ? new Date(searchParams.get("dateFrom")!)
        : undefined,
      dateTo: searchParams.get("dateTo")
        ? new Date(searchParams.get("dateTo")!)
        : undefined,
    };

    const sales = await getSales(filters);
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Error fetching sales" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validación básica
    if (!body.patientId || !body.treatment || !body.amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sale = await createSale({
      date: body.date ? new Date(body.date) : new Date(),
      patientId: body.patientId,
      treatment: body.treatment,
      amount: parseFloat(body.amount),
      paymentMethod: body.paymentMethod || "efectivo",
      status: body.status || "completada",
      itemsUsed: body.itemsUsed || [],
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Error creating sale" },
      { status: 500 }
    );
  }
}
