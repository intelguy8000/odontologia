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
    name: "get_profit",
    description: "Obtiene la utilidad del mes (ventas menos gastos)",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_pyg_summary",
    description: "Obtiene el estado completo de pérdidas y ganancias del mes con márgenes",
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

  const result = await prisma.sale.aggregate({
    where: {
      date: {
        gte: startOfMonth,
      },
      status: "completada",
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  const total = result._sum.amount || 0;
  const count = result._count || 0;

  return {
    total,
    count,
  };
}

async function get_inventory_status(params: { status?: string }) {
  const items = await prisma.inventoryItem.findMany({
    select: {
      name: true,
      currentStock: true,
      minStock: true,
      unit: true,
    },
    orderBy: { currentStock: "asc" },
    take: 10,
  });

  const itemsWithStatus = items.map((item) => {
    let status = "ok";
    if (item.currentStock === 0) status = "critical";
    else if (item.currentStock <= item.minStock) status = "low";
    return { ...item, status };
  });

  const critical = itemsWithStatus.filter((i) => i.status === "critical");
  const low = itemsWithStatus.filter((i) => i.status === "low");

  return {
    critical: critical.length,
    low: low.length,
    items: critical.length > 0 ? critical.slice(0, 3) : low.slice(0, 3),
  };
}

async function get_accounts_receivable() {
  const result = await prisma.paymentPlan.aggregate({
    where: {
      status: "active",
    },
    _sum: {
      remainingAmount: true,
    },
    _count: true,
  });

  const overdueCount = await prisma.paymentInstallment.count({
    where: {
      status: "overdue",
    },
  });

  return {
    totalReceivable: result._sum.remainingAmount || 0,
    activePlans: result._count || 0,
    overduePlans: overdueCount,
  };
}

async function get_expenses_summary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await prisma.expense.aggregate({
    where: {
      date: {
        gte: startOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  return {
    total: result._sum.amount || 0,
    count: result._count || 0,
  };
}

async function get_profit() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [salesResult, expensesResult] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        date: { gte: startOfMonth },
        status: "completada",
      },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: {
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
  ]);

  const revenue = salesResult._sum.amount || 0;
  const expenses = expensesResult._sum.amount || 0;
  const profit = revenue - expenses;

  return {
    profit,
    revenue,
    expenses,
  };
}

async function get_pyg_summary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [salesResult, purchasesResult, expensesResult] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        date: { gte: startOfMonth },
        status: "completada",
      },
      _sum: { amount: true },
    }),
    prisma.purchase.aggregate({
      where: {
        date: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    }),
    prisma.expense.aggregate({
      where: {
        date: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),
  ]);

  const revenue = salesResult._sum.amount || 0;
  const directCosts = purchasesResult._sum.totalAmount || 0;
  const totalExpenses = expensesResult._sum.amount || 0;
  const netProfit = revenue - directCosts - totalExpenses;
  const grossMargin = revenue > 0 ? ((revenue - directCosts) / revenue) * 100 : 0;

  return {
    revenue,
    directCosts,
    expenses: totalExpenses,
    netProfit,
    grossMargin,
  };
}

async function get_top_treatments() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sales = await prisma.sale.findMany({
    where: {
      date: { gte: startOfMonth },
      status: "completada",
    },
    select: {
      treatment: true,
      amount: true,
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

  return Object.entries(treatmentStats)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 3)
    .map(([treatment, stats]) => ({
      treatment,
      count: stats.count,
      revenue: stats.revenue,
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
    case "get_profit":
      return await get_profit();
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
        content: `Eres un asistente de CR Dental Studio en Colombia.
Responde SOLO lo que se pregunta. Sin información extra.
Si preguntan "ventas", solo di el monto. Si preguntan "inventario bajo", solo di los productos.
Máximo 10 palabras. Usa formato: $7.480.000 COP.
Profesional, directo, sin explicaciones adicionales.`,
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
