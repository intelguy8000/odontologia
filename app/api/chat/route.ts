import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Funciones disponibles para el asistente
const functions = [
  {
    name: "get_sales_summary",
    description: "Obtiene un resumen de las ventas del mes actual o un período específico",
    parameters: {
      type: "object",
      properties: {
        month: {
          type: "string",
          description: "El mes en formato YYYY-MM. Si no se especifica, usa el mes actual",
        },
      },
    },
  },
  {
    name: "get_inventory_status",
    description: "Obtiene el estado del inventario, productos críticos o información específica",
    parameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["all", "critical", "low"],
          description: "Filtrar por estado del inventario",
        },
      },
    },
  },
  {
    name: "get_accounts_receivable",
    description: "Obtiene información sobre cuentas por cobrar y planes de pago",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_expenses_summary",
    description: "Obtiene un resumen de los gastos del mes",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_pyg_summary",
    description: "Obtiene el estado de pérdidas y ganancias del mes",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_top_treatments",
    description: "Obtiene los tratamientos más rentables o vendidos",
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

// Implementación de las funciones
async function get_sales_summary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sales = await prisma.sale.findMany({
    where: {
      date: {
        gte: startOfMonth,
      },
      status: "completada",
    },
    include: {
      patient: true,
    },
  });

  const total = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const count = sales.length;
  const avgTicket = count > 0 ? total / count : 0;

  return {
    total,
    count,
    avgTicket,
    period: `mes actual`,
  };
}

async function get_inventory_status(params: { status?: string }) {
  const items = await prisma.inventoryItem.findMany({
    orderBy: { currentStock: "asc" },
  });

  const itemsWithStatus = items.map((item) => {
    let status = "ok";
    if (item.currentStock === 0) status = "critical";
    else if (item.currentStock <= item.minStock) status = "low";

    return {
      ...item,
      status,
    };
  });

  let filtered = itemsWithStatus;
  if (params.status === "critical") {
    filtered = itemsWithStatus.filter((item) => item.status === "critical");
  } else if (params.status === "low") {
    filtered = itemsWithStatus.filter((item) => item.status === "low" || item.status === "critical");
  }

  return {
    total: items.length,
    critical: itemsWithStatus.filter((i) => i.status === "critical").length,
    low: itemsWithStatus.filter((i) => i.status === "low").length,
    items: filtered.slice(0, 5).map((i) => ({
      name: i.name,
      currentStock: i.currentStock,
      minStock: i.minStock,
      unit: i.unit,
      status: i.status,
    })),
  };
}

async function get_accounts_receivable() {
  const paymentPlans = await prisma.paymentPlan.findMany({
    where: {
      status: "active",
    },
    include: {
      patient: true,
      paymentInstallments: true,
    },
  });

  const totalReceivable = paymentPlans.reduce((sum, plan) => sum + plan.remainingAmount, 0);
  const overduePlans = paymentPlans.filter((plan) =>
    plan.paymentInstallments.some((i) => i.status === "overdue")
  );

  return {
    totalReceivable,
    activePlans: paymentPlans.length,
    overduePlans: overduePlans.length,
    totalOverdue: overduePlans.reduce((sum, plan) => sum + plan.remainingAmount, 0),
  };
}

async function get_expenses_summary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startOfMonth,
      },
    },
  });

  const byCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return {
    total,
    count: expenses.length,
    byCategory,
  };
}

async function get_pyg_summary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Ingresos
  const sales = await prisma.sale.findMany({
    where: {
      date: {
        gte: startOfMonth,
      },
      status: "completada",
    },
  });
  const revenue = sales.reduce((sum, sale) => sum + sale.amount, 0);

  // Costos directos
  const purchases = await prisma.purchase.findMany({
    where: {
      date: {
        gte: startOfMonth,
      },
    },
  });
  const directCosts = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  // Gastos
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: startOfMonth,
      },
    },
  });
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const grossProfit = revenue - directCosts;
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const operatingProfit = grossProfit - totalExpenses;
  const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
  const netProfit = operatingProfit;

  return {
    revenue,
    directCosts,
    expenses: totalExpenses,
    grossProfit,
    grossMargin,
    operatingProfit,
    operatingMargin,
    netProfit,
  };
}

async function get_top_treatments() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sales = await prisma.sale.findMany({
    where: {
      date: {
        gte: startOfMonth,
      },
      status: "completada",
    },
  });

  const treatmentStats = sales.reduce((acc, sale) => {
    if (!acc[sale.treatment]) {
      acc[sale.treatment] = { count: 0, revenue: 0 };
    }
    acc[sale.treatment].count++;
    acc[sale.treatment].revenue += sale.amount;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);

  const sorted = Object.entries(treatmentStats)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 5);

  return sorted.map(([treatment, stats]) => ({
    treatment,
    count: stats.count,
    revenue: stats.revenue,
    avgRevenue: stats.revenue / stats.count,
  }));
}

// Ejecutar función llamada por OpenAI
async function executeFunction(name: string, args: any) {
  switch (name) {
    case "get_sales_summary":
      return await get_sales_summary();
    case "get_inventory_status":
      return await get_inventory_status(args);
    case "get_accounts_receivable":
      return await get_accounts_receivable();
    case "get_expenses_summary":
      return await get_expenses_summary();
    case "get_pyg_summary":
      return await get_pyg_summary();
    case "get_top_treatments":
      return await get_top_treatments();
    default:
      return { error: "Función no encontrada" };
  }
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
    }

    // Crear chat con OpenAI
    const messages: any[] = [
      {
        role: "system",
        content: `Eres un asistente de CR Dental Studio, un consultorio dental en Colombia.
Responde de manera CONCISA y DIRECTA. Máximo 20 palabras por respuesta, a menos que el usuario pida más detalles.
Usa español colombiano, formato COP y separadores con puntos (ej: 7.480.000).
Sé profesional pero amigable. Ve directo al punto.`,
      },
      {
        role: "user",
        content: message,
      },
    ];

    let response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      functions,
      function_call: "auto",
    });

    let responseMessage = response.choices[0].message;

    // Si OpenAI quiere llamar a una función
    if (responseMessage.function_call) {
      const functionName = responseMessage.function_call.name;
      const functionArgs = JSON.parse(responseMessage.function_call.arguments || "{}");

      // Ejecutar la función
      const functionResult = await executeFunction(functionName, functionArgs);

      // Enviar el resultado de vuelta a OpenAI
      messages.push(responseMessage as any);
      messages.push({
        role: "function",
        name: functionName,
        content: JSON.stringify(functionResult),
      });

      // Obtener respuesta final
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });

      responseMessage = secondResponse.choices[0].message;
    }

    return NextResponse.json({
      response: responseMessage.content || "No pude procesar tu pregunta.",
    });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Error al procesar mensaje" },
      { status: 500 }
    );
  }
}
