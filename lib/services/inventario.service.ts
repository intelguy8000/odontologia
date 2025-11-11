import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type InventoryStatus = "ok" | "low" | "critical";

export interface InventoryItemWithStatus {
  id: string;
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  avgCost: number;
  status: InventoryStatus;
  totalValue: number;
}

function getInventoryStatus(
  currentStock: number,
  minStock: number
): InventoryStatus {
  if (currentStock === 0 || currentStock < minStock * 0.5) {
    return "critical";
  } else if (currentStock < minStock) {
    return "low";
  }
  return "ok";
}

export async function getInventoryItems(): Promise<InventoryItemWithStatus[]> {
  const items = await prisma.inventoryItem.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return items.map((item) => ({
    ...item,
    status: getInventoryStatus(item.currentStock, item.minStock),
    totalValue: item.currentStock * item.avgCost,
  }));
}

export async function getInventoryAlerts() {
  const items = await prisma.inventoryItem.findMany({
    where: {
      currentStock: {
        lt: prisma.inventoryItem.fields.minStock,
      },
    },
    orderBy: {
      currentStock: "asc",
    },
  });

  return items.map((item) => ({
    ...item,
    status: getInventoryStatus(item.currentStock, item.minStock),
    deficit: item.minStock - item.currentStock,
  }));
}

export async function getInventoryItemById(id: string) {
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
    include: {
      movements: {
        orderBy: {
          date: "desc",
        },
        take: 10,
      },
    },
  });

  if (!item) return null;

  return {
    ...item,
    status: getInventoryStatus(item.currentStock, item.minStock),
    totalValue: item.currentStock * item.avgCost,
  };
}

export async function getInventoryStats() {
  const items = await prisma.inventoryItem.findMany();

  const totalValue = items.reduce(
    (sum, item) => sum + item.currentStock * item.avgCost,
    0
  );

  const lowStockCount = items.filter(
    (item) => item.currentStock < item.minStock
  ).length;

  const criticalStockCount = items.filter(
    (item) => item.currentStock < item.minStock * 0.5 || item.currentStock === 0
  ).length;

  return {
    totalItems: items.length,
    totalValue,
    lowStockCount,
    criticalStockCount,
  };
}
