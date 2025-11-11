import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface DashboardKPIs {
  salesMonth: number;
  salesCount: number;
  expenses: number;
  profit: number;
  activeClients: number;
}

export interface SalesDataPoint {
  date: string;
  amount: number;
}

export interface TopTreatment {
  treatment: string;
  count: number;
  total: number;
}

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Ventas del mes actual
  const salesThisMonth = await prisma.sale.aggregate({
    where: {
      date: {
        gte: firstDayOfMonth,
      },
      status: "completada",
    },
    _sum: {
      amount: true,
    },
    _count: true,
  });

  // Clientes activos (pacientes con ventas en los últimos 90 días)
  const activeClientsCount = await prisma.patient.count({
    where: {
      sales: {
        some: {
          date: {
            gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  });

  return {
    salesMonth: salesThisMonth._sum.amount || 0,
    salesCount: salesThisMonth._count || 0,
    expenses: 0, // Por ahora en 0, se implementará con módulo de compras
    profit: salesThisMonth._sum.amount || 0,
    activeClients: activeClientsCount,
  };
}

export async function getSalesLast7Days(): Promise<SalesDataPoint[]> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const sales = await prisma.sale.findMany({
    where: {
      date: {
        gte: sevenDaysAgo,
      },
      status: "completada",
    },
    select: {
      date: true,
      amount: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // Agrupar ventas por día
  const salesByDay: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    salesByDay[dateStr] = 0;
  }

  sales.forEach((sale) => {
    const dateStr = sale.date.toISOString().split("T")[0];
    salesByDay[dateStr] = (salesByDay[dateStr] || 0) + sale.amount;
  });

  return Object.entries(salesByDay)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getTopTreatments(limit = 5): Promise<TopTreatment[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const sales = await prisma.sale.findMany({
    where: {
      date: {
        gte: thirtyDaysAgo,
      },
      status: "completada",
    },
    select: {
      treatment: true,
      amount: true,
    },
  });

  // Agrupar por tratamiento
  const treatmentMap: Record<string, { count: number; total: number }> = {};

  sales.forEach((sale) => {
    if (!treatmentMap[sale.treatment]) {
      treatmentMap[sale.treatment] = { count: 0, total: 0 };
    }
    treatmentMap[sale.treatment].count++;
    treatmentMap[sale.treatment].total += sale.amount;
  });

  return Object.entries(treatmentMap)
    .map(([treatment, data]) => ({
      treatment,
      count: data.count,
      total: data.total,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
